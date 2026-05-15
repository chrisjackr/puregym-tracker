// src/components/GetAttendance.tsx

import React, { useState } from "react";
import api from "../api";

const GetAttendance: React.FC = () => {
  const [attendance, setAttendance] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/attendance");

      setAttendance(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchAttendance} disabled={loading}>
        {loading ? "Loading..." : "Get Attendance"}
      </button>

      {error && <p>{error}</p>}

      {attendance && (
        <pre
          style={{
            textAlign: "left",
            marginTop: "20px",
            background: "#222",
            padding: "16px",
            borderRadius: "8px",
            overflowX: "auto",
          }}
        >
          {JSON.stringify(attendance, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default GetAttendance;