import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

export default function GradesUpload({ onBack }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });

      setRows(jsonData);
      alert(`${jsonData.length} grade rows loaded.`);
    };

    reader.readAsArrayBuffer(file);
  };

  const uploadToMongoDB = async () => {
    if (rows.length === 0) {
      alert("Please upload an XLSX file first.");
      return;
    }

    setLoading(true);

    try {
      const formattedRows = rows.map((row) => ({
        student_id: String(row.student_id || "").trim(),
        student_type: String(row.student_type || "").trim().toUpperCase(),
        subject: String(row.subject || "").trim(),
        grade: String(row.grade || "").trim(),
        semester: String(row.semester || "").trim(),
        school_year: String(row.school_year || "").trim(),
        remarks: String(row.remarks || "").trim(),
      }));

      await axios.post(
  "https://smartcampus-backend-a0vc.onrender.com/api/grades",
  formattedRows
);

      alert("Grades uploaded successfully to MongoDB.");
      setRows([]);
    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="topbar">
        <div>
          <h1>Grades Upload</h1>
          <p>Upload student grades XLSX file</p>
        </div>

        <button className="logoutBtn" onClick={onBack}>
          Back
        </button>
      </div>

      <div className="uploadCard">
        <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />

        <p className="helperText">
          Required columns: student_id, student_type, subject, grade, semester,
          school_year, remarks
        </p>

        {rows.length > 0 && (
          <>
            <h3>Preview: {rows.length} rows</h3>

            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Type</th>
                  <th>Subject</th>
                  <th>Grade</th>
                  <th>Semester</th>
                  <th>School Year</th>
                  <th>Remarks</th>
                </tr>
              </thead>

              <tbody>
                {rows.slice(0, 10).map((row, index) => (
                  <tr key={index}>
                    <td>{row.student_id}</td>
                    <td>{row.student_type}</td>
                    <td>{row.subject}</td>
                    <td>{row.grade}</td>
                    <td>{row.semester}</td>
                    <td>{row.school_year}</td>
                    <td>{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={uploadToMongoDB} disabled={loading}>
              {loading ? "Uploading..." : "Save Grades to MongoDB"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}