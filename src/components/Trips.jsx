import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await fetch(process.env.REACT_APP_GET_ALL_TRIPS);
      const data = await res.json();
      const allTrips = Array.isArray(data.trips) ? data.trips : data;
      setTrips(allTrips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const downloadCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent +=
      "driver_id,vehicle_id,cabNumber,startTime,endTime,durationMinutes,pickupLat,pickupLng,dropoffLat,dropoffLng,distanceMiles,fare,tripStatus,createdAt\n";
    trips.forEach((trip) => {
      const row = [
        trip.driver_id,
        trip.vehicle_id,
        trip.cabNumber,
        trip.startTime,
        trip.endTime || "",
        trip.durationMinutes || "",
        trip.pickupLocation?.lat || "",
        trip.pickupLocation?.lng || "",
        trip.dropoffLocation?.lat || "",
        trip.dropoffLocation?.lng || "",
        trip.distanceMiles || "",
        trip.fare || "",
        trip.tripStatus,
        trip.createdAt,
      ].join(",");
      csvContent += row + "\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "trips.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateReceipt = (trip) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Trip Receipt", 20, 20);

    const lines = [
      `Driver ID: ${trip.driver_id}`,
      `Vehicle ID: ${trip.vehicle_id}`,
      `Cab Number: ${trip.cabNumber}`,
      `Start Time: ${new Date(trip.startTime).toLocaleString()}`,
      `End Time: ${
        trip.endTime ? new Date(trip.endTime).toLocaleString() : "N/A"
      }`,
      `Duration: ${trip.durationMinutes || 0} minutes`,
      `Pickup Location: ${trip.pickupLocation?.lat}, ${trip.pickupLocation?.lng}`,
      `Dropoff Location: ${trip.dropoffLocation?.lat}, ${trip.dropoffLocation?.lng}`,
      `Distance: ${trip.distanceMiles || 0} mi`,
      `Fare: $${trip.fare || 0}`,
      `Status: ${trip.tripStatus}`,
      `Created At: ${new Date(trip.createdAt).toLocaleString()}`,
    ];

    lines.forEach((line, i) => {
      doc.text(line, 20, 35 + i * 10);
    });

    doc.save(`trip-receipt-${trip._id}.pdf`);
  };

  const filteredTrips = trips.filter((trip) => {
    if (!searchTerm) return true;
    const lowerSearch = searchTerm.toLowerCase();
    return (
      (trip.cabNumber && trip.cabNumber.toLowerCase().includes(lowerSearch)) ||
      (trip.driver_id && trip.driver_id.toString().includes(lowerSearch)) ||
      (trip.vehicle_id && trip.vehicle_id.toString().includes(lowerSearch)) ||
      (trip.tripStatus &&
        trip.tripStatus.toLowerCase().includes(lowerSearch)) ||
      (trip._id && trip._id.toLowerCase().includes(lowerSearch))
    );
  });

  return (
    <div className="container mt-5 d-flex flex-column align-items-center">
      <h1 className="mb-4 text-center">Trips</h1>
      <div className="w-100" style={{ maxWidth: "1000px" }}>
        <div className="d-flex justify-content-between mb-3">
          <button className="btn btn-primary" onClick={downloadCSV}>
            Download CSV
          </button>
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search trips..."
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
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Duration (min)</th>
                  <th>Pickup Location</th>
                  <th>Dropoff Location</th>
                  <th>Distance (mi)</th>
                  <th>Fare</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map((trip) => (
                  <tr key={trip._id}>
                    <td>{trip.driver_id}</td>
                    <td>{trip.cabNumber}</td>
                    <td>{new Date(trip.startTime).toLocaleString()}</td>
                    <td>
                      {trip.endTime
                        ? new Date(trip.endTime).toLocaleString()
                        : ""}
                    </td>
                    <td>{trip.durationMinutes || ""}</td>
                    <td>
                      {trip.pickupLocation
                        ? `${trip.pickupLocation.lat}, ${trip.pickupLocation.lng}`
                        : ""}
                    </td>
                    <td>
                      {trip.dropoffLocation
                        ? `${trip.dropoffLocation.lat}, ${trip.dropoffLocation.lng}`
                        : ""}
                    </td>
                    <td>{trip.distanceMiles || ""}</td>
                    <td>${trip.fare || 0}</td>
                    <td>{trip.tripStatus}</td>
                    <td>{new Date(trip.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => generateReceipt(trip)}
                      >
                        Generate Receipt
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTrips.length === 0 && (
              <p className="text-center">No trips found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trips;
