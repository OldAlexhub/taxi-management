import React, { useEffect, useState } from "react";
import axios from "axios";
import MapView from "../components/MapView";

const Home = () => {
  const user_name = localStorage.getItem("name");

  const [weeklyBalance, setWeeklyBalance] = useState(0);
  const [activeDriversCount, setActiveDriversCount] = useState(0);
  const [liveDrivers, setLiveDrivers] = useState([]);
  const [inProgressTrips, setInProgressTrips] = useState(0);
  const [completedTrips, setCompletedTrips] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Assigned Weekly Balance
        const assignedRes = await axios.get(process.env.REACT_APP_GET_ASSIGNED);
        const assignments = assignedRes.data.assignments || [];
        const totalBalance = assignments.reduce(
          (sum, a) => sum + (a.weekly_balance || 0),
          0
        );
        setWeeklyBalance(totalBalance);

        // 2. Active Sessions
        const sessionsRes = await axios.get(process.env.REACT_APP_GET_SESSION);
        const activeCount = sessionsRes.data.filter(
          (s) => s.sessionStatus?.trim().toLowerCase() === "active"
        ).length;
        setActiveDriversCount(activeCount);

        // 3. Live Drivers
        const liveRes = await axios.get(process.env.REACT_APP_LIVE_DRIVERS);
        const onlineDrivers = liveRes.data.filter((d) => d.online);
        setLiveDrivers(onlineDrivers);

        // 4. Trip Statuses
        const tripsRes = await axios.get(process.env.REACT_APP_GET_ALL_TRIPS);
        //console.log("Trips Raw Response:", tripsRes.data);

        const raw = tripsRes.data;
        const allTrips = Array.isArray(raw)
          ? raw
          : raw.trips
          ? raw.trips
          : raw.data?.trips
          ? raw.data.trips
          : [];

        //console.log("Trip Count:", allTrips.length);
        //console.log(
        //  "Trip Statuses:",
        //  allTrips.map((t) => t.tripStatus)
        // );

        const inProgress = allTrips.filter(
          (t) => t.tripStatus?.trim().toLowerCase() === "in_progress"
        ).length;
        const completed = allTrips.filter(
          (t) => t.tripStatus?.trim().toLowerCase() === "completed"
        ).length;

        setInProgressTrips(inProgress);
        setCompletedTrips(completed);
      } catch (err) {
        console.error("Failed to load driver dashboard data", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000); // auto-refresh every 15s
    return () => clearInterval(interval);
  }, [user_name]);

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h2 className="fw-bold">Welcome, {user_name}</h2>
          <p className="text-muted">Here's your operational snapshot</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Expected Weekly Balance</h5>
              <p className="display-6 fw-semibold text-success">
                ${weeklyBalance}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Active Drivers</h5>
              <p className="display-6 fw-semibold text-primary">
                {activeDriversCount}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-12 col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Live Drivers (Map)</h5>
              <p className="text-muted mb-0">Showing real-time cab locations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Trips In Progress</h5>
              <p className="display-6 fw-semibold text-warning">
                {inProgressTrips}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">Completed Trips</h5>
              <p className="display-6 fw-semibold text-info">
                {completedTrips}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <MapView drivers={liveDrivers} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
