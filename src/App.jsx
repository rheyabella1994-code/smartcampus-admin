import { useState } from "react";
import "./App.css";

import AdminDashboard from "./AdminDashboard";
import ScheduleUpload from "./ScheduleUpload";
import GradesUpload from "./GradesUpload";
import StudentsUpload from "./StudentsUpload";

export default function App() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [adminUser, setAdminUser] = useState(null);

  const API_BASE_URL = "https://smartcampus-backend-a0vc.onrender.com";

  const handleLogin = async () => {
    if (!studentId.trim() || !password.trim()) {
      alert("Please enter Admin ID and Password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: studentId.trim(),
          password: password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || "Login failed.");
        return;
      }

      if (result.data.role !== "admin") {
        alert("Access denied. Admin account only.");
        return;
      }

      setAdminUser(result.data);
      setIsLoggedIn(true);
    } catch (error) {
      alert("Cannot connect to server.");
      console.log("Admin login error:", error);
    }
  };

  const handleLogout = () => {
    setAdminUser(null);
    setIsLoggedIn(false);
    setPage("dashboard");
    setStudentId("");
    setPassword("");
  };

  if (isLoggedIn && page === "scheduleUpload") {
    return <ScheduleUpload onBack={() => setPage("dashboard")} />;
  }

  if (isLoggedIn && page === "gradesUpload") {
    return <GradesUpload onBack={() => setPage("dashboard")} />;
  }

  if (isLoggedIn && page === "studentsUpload") {
    return <StudentsUpload onBack={() => setPage("dashboard")} />;
  }

  if (isLoggedIn) {
    return (
      <AdminDashboard
        adminUser={adminUser}
        onScheduleUpload={() => setPage("scheduleUpload")}
        onGradesUpload={() => setPage("gradesUpload")}
        onStudentsUpload={() => setPage("studentsUpload")}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="logo">🎓</div>

        <h1>SmartCampus</h1>
        <h2>Admin</h2>

        <p className="subtitle">Login using administrator account</p>

        <input
          type="text"
          placeholder="Admin ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>LOGIN</button>

        <p className="secure">🔒 Secure Access</p>
      </div>
    </div>
  );
}