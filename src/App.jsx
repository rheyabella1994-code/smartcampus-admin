import { useState } from "react";
import "./App.css";

import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";

import AdminDashboard from "./AdminDashboard";
import ScheduleUpload from "./ScheduleUpload";
import GradesUpload from "./GradesUpload";
import StudentsUpload from "./StudentsUpload";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");

  const API_URL = "http://localhost:5000/api/students";

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      const response = await fetch(API_URL);
      const result = await response.json();

      if (!response.ok) {
        await signOut(auth);
        alert(result.message || "Unable to verify admin account.");
        return;
      }

      const userRecord = result.data.find(
        (item) =>
          String(item.email).toLowerCase() ===
          String(user.email).toLowerCase()
      );

      if (!userRecord) {
        await signOut(auth);
        alert("Account record not found in MongoDB.");
        return;
      }

      if (userRecord.role !== "admin") {
        await signOut(auth);
        alert("Access denied. Admin account only.");
        return;
      }

      setIsLoggedIn(true);
    } catch (error) {
      alert(error.message);
    }
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
        onScheduleUpload={() => setPage("scheduleUpload")}
        onGradesUpload={() => setPage("gradesUpload")}
        onStudentsUpload={() => setPage("studentsUpload")}
        onLogout={() => setIsLoggedIn(false)}
      />
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div className="logo">🎓</div>

        <h1>SmartCampus</h1>
        <h2>Admin</h2>

        <p className="subtitle">
          Login using administrator account
        </p>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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