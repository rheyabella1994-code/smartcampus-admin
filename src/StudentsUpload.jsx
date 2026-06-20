import { useState } from "react";
import * as XLSX from "xlsx";

export default function StudentsUpload({ onBack }) {
  const [rows, setRows] = useState([]);

  const API_URL = "http://localhost:5000/api/students";

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setRows(jsonData);
      alert(`${jsonData.length} student rows loaded.`);
    };

    reader.readAsArrayBuffer(file);
  };

  const uploadToMongoDB = async () => {
    if (rows.length === 0) {
      alert("Please upload an XLSX file first.");
      return;
    }

    try {
      const students = rows.map((row) => ({
        student_id: String(row.student_id || "").trim(),
        full_name: String(row.full_name || "").trim(),
        email: String(row.email || "").trim(),

        role: String(row.role || "student").trim(),

        student_type: String(row.student_type || "")
          .trim()
          .toUpperCase(),

        course: String(row.course || "").trim(),
        batch: String(row.batch || "").trim(),
        year_level: String(row.year_level || "").trim(),
        section: String(row.section || "").trim(),

       password: String(row.password || "123456").trim(),

must_change_password:
  String(row.must_change_password || "TRUE")
    .toUpperCase() === "TRUE",
      }));

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(students),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Upload failed.");
        return;
      }

      alert("Students uploaded successfully to MongoDB.");
      setRows([]);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="dashboard">
      <div className="topbar">
        <div>
          <h1>Students Upload</h1>
          <p>Upload student records XLSX file</p>
        </div>

        <button className="logoutBtn" onClick={onBack}>
          Back
        </button>
      </div>

      <div className="uploadCard">
        <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />

        <p className="helperText">
          Required columns: student_id, full_name, email, role, student_type,
          course, batch, year_level, section, must_change_password
        </p>

        {rows.length > 0 && (
          <>
            <h3>Preview: {rows.length} rows</h3>

            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Type</th>
                  <th>Course</th>
                  <th>Batch</th>
                  <th>Year</th>
                  <th>Section</th>
                  <th>Change Password</th>
                </tr>
              </thead>

              <tbody>
                {rows.slice(0, 10).map((row, index) => (
                  <tr key={index}>
                    <td>{row.student_id}</td>
                    <td>{row.full_name}</td>
                    <td>{row.email}</td>
                    <td>{row.role}</td>
                    <td>{row.student_type}</td>
                    <td>{row.course}</td>
                    <td>{row.batch}</td>
                    <td>{row.year_level}</td>
                    <td>{row.section}</td>
                    <td>{row.must_change_password}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={uploadToMongoDB}>
              Save Students to MongoDB
            </button>
          </>
        )}
      </div>
    </div>
  );
}