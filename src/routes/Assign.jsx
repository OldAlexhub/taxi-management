import React, { useEffect, useState } from "react";
import axios from "axios";
import ActiveFleet from "./ActiveFleet";

const Assign = () => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formData, setFormData] = useState({
    added_to_insurance: "",
    weekly_balance: 0,
    status: "active",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const driversRes = await axios.get(process.env.REACT_APP_GET_DRIVERS);
        setDrivers(driversRes.data.drivers || []);

        const vehiclesRes = await axios.get(process.env.REACT_APP_GET_VEHICLES);
        setVehicles(vehiclesRes.data.vehicles || []);
      } catch (err) {
        console.error("Failed to fetch drivers or vehicles:", err);
      }
    };
    fetchData();
  }, []);

  const handleDriverChange = (e) => {
    const driver = drivers.find(
      (d) => d.driver_id.toString() === e.target.value
    );
    setSelectedDriver(driver);
  };

  const handleVehicleChange = (e) => {
    const vehicle = vehicles.find(
      (v) => v.vehicle_id.toString() === e.target.value
    );
    setSelectedVehicle(vehicle);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDriver || !selectedVehicle) {
      setErrorMessage("Please select both driver and vehicle.");
      setSuccessMessage("");
      return;
    }

    const payload = {
      driver_id: selectedDriver.driver_id,
      vehicle_id: selectedVehicle.vehicle_id,
      cabNumber: selectedVehicle.cabNumber,
      make: selectedVehicle.make,
      model: selectedVehicle.model,
      lic_plate: selectedVehicle.lic_plate,
      email: selectedDriver.email,
      firstName: selectedDriver.firstName,
      lastName: selectedDriver.lastName,
      added_to_insurance: formData.added_to_insurance,
      weekly_balance: Number(formData.weekly_balance),
      status: formData.status,
    };

    try {
      await axios.post(process.env.REACT_APP_ASSIGN, payload);
      setSuccessMessage("Assignment successful.");
      setErrorMessage("");
      setSelectedDriver(null);
      setSelectedVehicle(null);
      setFormData({
        added_to_insurance: "",
        weekly_balance: 0,
        status: "active",
      });
    } catch (err) {
      console.error("Assignment failed:", err);
      setErrorMessage("Assignment failed.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-3">Assign Driver to Vehicle</h4>
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="row g-3">
          {/* Driver Dropdown */}
          <div className="col-md-6">
            <label className="form-label">Select Driver</label>
            <select
              className="form-select"
              onChange={handleDriverChange}
              value={selectedDriver?.driver_id || ""}
            >
              <option value="">-- Choose Driver --</option>
              {drivers.map((d) => (
                <option key={d.driver_id} value={d.driver_id}>
                  {d.driver_id} - {d.firstName} {d.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Dropdown */}
          <div className="col-md-6">
            <label className="form-label">Select Vehicle</label>
            <select
              className="form-select"
              onChange={handleVehicleChange}
              value={selectedVehicle?.vehicle_id || ""}
            >
              <option value="">-- Choose Vehicle --</option>
              {vehicles.map((v) => (
                <option key={v.vehicle_id} value={v.vehicle_id}>
                  {v.vehicle_id} - {v.cabNumber} ({v.make} {v.model})
                </option>
              ))}
            </select>
          </div>

          {/* Added to Insurance */}
          <div className="col-md-6">
            <label className="form-label">Added to Insurance</label>
            <input
              type="date"
              name="added_to_insurance"
              className="form-control"
              value={formData.added_to_insurance}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Weekly Balance */}
          <div className="col-md-3">
            <label className="form-label">Weekly Balance</label>
            <input
              type="number"
              name="weekly_balance"
              className="form-control"
              value={formData.weekly_balance}
              onChange={handleInputChange}
            />
          </div>

          {/* Status */}
          <div className="col-md-3">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="col-12 text-end">
            <button type="submit" className="btn btn-dark px-4">
              Assign
            </button>
          </div>
        </div>
      </form>
      <hr />
      <ActiveFleet />
    </div>
  );
};

export default Assign;
