import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export default function AdminDashboard({
  onScheduleUpload,
  onGradesUpload,
  onStudentsUpload,
  onLogout,
}) {
  return (
    <div className="dashboard">
      <div className="topbar">

  <div className="dashboardHeader">
    <h1>SmartCampus Admin</h1>
    <p>Manage academic uploads</p>
  </div>

  <button
    className="logoutBtn"
    onClick={async () => {
      await signOut(auth);
      onLogout();
    }}
  >
    Logout
  </button>

</div>

      <div className="cards">
        <div className="dashboardCard">
          <div className="cardIcon">📅</div>
          <h2>Schedule Upload</h2>
          <p>Upload class schedules using XLSX file.</p>
          <button onClick={onScheduleUpload}>Upload Schedule</button>
        </div>

        <div className="dashboardCard">
          <div className="cardIcon">📖</div>
          <h2>Grades Upload</h2>
          <p>Upload student grades using XLSX file.</p>
          <button onClick={onGradesUpload}>
  Upload Grades
</button>
        </div>

        <div className="dashboardCard">
          <div className="cardIcon">👨‍🎓</div>
          <h2>Students Upload</h2>
          <p>Upload student information using XLSX file.</p>
          <button onClick={onStudentsUpload}>
  Upload Students
</button>
        </div>
      </div>
    </div>
  );
}