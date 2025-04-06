import React, { useEffect, useState } from "react";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [groupedSessions, setGroupedSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch sessions from API
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await fetch(process.env.REACT_APP_GET_SESSION);
      const data = await res.json();
      setSessions(data);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Group sessions by driver_id, cabNumber, and day (based on loginTime), and calculate total duration (in minutes)
  useEffect(() => {
    const groups = {};
    sessions.forEach((session) => {
      const loginDate = new Date(session.loginTime);
      const dayKey = loginDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      const cabNumber = session.cabNumber || "N/A";
      const groupKey = `${session.driver_id}-${cabNumber}-${dayKey}`;

      // Calculate session duration in minutes
      let duration = 0;
      if (session.logoutTime) {
        duration = Math.floor(
          (new Date(session.logoutTime) - loginDate) / 60000
        );
      } else {
        // For active sessions, calculate duration until now
        duration = Math.floor((Date.now() - loginDate.getTime()) / 60000);
      }

      if (groups[groupKey]) {
        groups[groupKey].totalMinutes += duration;
        groups[groupKey].sessionCount += 1;
      } else {
        groups[groupKey] = {
          driver_id: session.driver_id,
          cabNumber: cabNumber,
          day: dayKey,
          totalMinutes: duration,
          sessionCount: 1,
        };
      }
    });
    setGroupedSessions(Object.values(groups));
  }, [sessions]);

  // Save CSV to disk using Blob API
  const downloadCSV = () => {
    let csvContent = "driver_id,cabNumber,day,totalMinutes,sessionCount\n";
    groupedSessions.forEach((group) => {
      const row = [
        group.driver_id,
        group.cabNumber,
        group.day,
        group.totalMinutes,
        group.sessionCount,
      ].join(",");
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sessions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter groups based on search term (driver_id, cabNumber, or day)
  const filteredGroups = groupedSessions.filter((group) => {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (
      group.driver_id.toString().includes(lowerSearch) ||
      group.cabNumber.toLowerCase().includes(lowerSearch) ||
      group.day.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="container mt-5 d-flex flex-column align-items-center">
      <h1 className="mb-4 text-center">Driver Sessions</h1>
      <div className="w-100" style={{ maxWidth: "800px" }}>
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-primary" onClick={downloadCSV}>
            Save CSV
          </button>
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search by driver ID, cab number, or day..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped text-center">
              <thead className="thead-dark">
                <tr>
                  <th>Driver ID</th>
                  <th>Cab Number</th>
                  <th>Day</th>
                  <th>Total Time (min)</th>
                  <th>Session Count</th>
                </tr>
              </thead>
              <tbody>
                {filteredGroups.map((group, index) => (
                  <tr key={index}>
                    <td>{group.driver_id}</td>
                    <td>{group.cabNumber}</td>
                    <td>{group.day}</td>
                    <td>{group.totalMinutes}</td>
                    <td>{group.sessionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredGroups.length === 0 && (
              <p className="text-center">No sessions found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;
