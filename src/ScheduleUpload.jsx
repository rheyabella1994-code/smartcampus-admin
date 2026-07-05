import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

export default function ScheduleUpload({ onBack }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target.result;

      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
      });

      setRows(jsonData);
      alert(`${jsonData.length} schedule rows loaded.`);
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
        student_type: String(row.student_type || "").trim().toUpperCase(),
        course: String(row.course || "").trim().toUpperCase(),
        batch: String(row.batch || "").trim(),
        year_level: String(row.year_level || "").trim(),
        section: String(row.section || "").trim().toUpperCase(),
        subject: String(row.subject || "").trim(),
        professor: String(row.professor || "").trim(),
        room: String(row.room || "").trim(),
        day: String(row.day || "").trim(),
        time: String(row.time || "").trim(),
      }));

      await axios.post(
  "https://smartcampus-backend-a0vc.onrender.com/api/schedules",
  formattedRows
);

      alert("Schedules uploaded successfully to MongoDB.");
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
          <h1>Schedule Upload</h1>
          <p>Upload schedule XLSX file</p>
        </div>

        <button className="logoutBtn" onClick={onBack}>
          Back
        </button>
      </div>

      <div className="uploadCard">
        <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} />

        <p className="helperText">
          Required columns: student_type, course, batch, year_level, section,
          subject, professor, room, day, time
        </p>

        {rows.length > 0 && (
          <>
            <h3>Preview: {rows.length} rows</h3>

            <table border="1" cellPadding="5">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Course</th>
                  <th>Batch</th>
                  <th>Year</th>
                  <th>Section</th>
                  <th>Subject</th>
                  <th>Professor</th>
                  <th>Room</th>
                  <th>Day</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {rows.slice(0, 10).map((row, index) => (
                  <tr key={index}>
                    <td>{row.student_type}</td>
                    <td>{row.course}</td>
                    <td>{row.batch}</td>
                    <td>{row.year_level}</td>
                    <td>{row.section}</td>
                    <td>{row.subject}</td>
                    <td>{row.professor}</td>
                    <td>{row.room}</td>
                    <td>{row.day}</td>
                    <td>{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button onClick={uploadToMongoDB} disabled={loading}>
              {loading ? "Uploading..." : "Save Schedule to MongoDB"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}