import React, { useState } from "react";
import axios from "axios";
import Logo from "../images/logo.png";

const AddVehicles = () => {
  const [formData, setFormData] = useState({
    cabNumber: "",
    vinNumber: "",
    regis_expriry: "",
    lic_plate: "",
    color: "",
    make: "",
    model: "",
    year: "",
    status: "active",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = process.env.REACT_APP_ADD_VEHICLES;
      const res = await axios.post(endpoint, formData);
      setSuccessMessage("Vehicle added successfully!");
      setErrorMessage("");
      setFormData({
        cabNumber: "",
        vinNumber: "",
        regis_expriry: "",
        lic_plate: "",
        color: "",
        make: "",
        model: "",
        year: "",
        status: "active",
      });
    } catch (error) {
      console.error("Error adding vehicle:", error);
      setErrorMessage("Failed to add vehicle.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <img src={Logo} alt="logo" style={{ height: "80px" }} />
        <h4 className="mt-3 fw-bold">Add New Vehicle</h4>
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
      </div>

      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Cab Number</label>
            <input
              type="text"
              name="cabNumber"
              className="form-control"
              maxLength={4}
              value={formData.cabNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">VIN Number</label>
            <input
              type="text"
              name="vinNumber"
              className="form-control"
              value={formData.vinNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Registration Expiry</label>
            <input
              type="date"
              name="regis_expriry"
              className="form-control"
              value={formData.regis_expriry}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">License Plate</label>
            <input
              type="text"
              name="lic_plate"
              className="form-control"
              value={formData.lic_plate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Color</label>
            <input
              type="text"
              name="color"
              className="form-control"
              value={formData.color}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Make</label>
            <input
              type="text"
              name="make"
              className="form-control"
              value={formData.make}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Model</label>
            <input
              type="text"
              name="model"
              className="form-control"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Year</label>
            <input
              type="number"
              name="year"
              className="form-control"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="col-12 text-end mt-4">
            <button type="submit" className="btn btn-dark px-4">
              Save Vehicle
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddVehicles;
