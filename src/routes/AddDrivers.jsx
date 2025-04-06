import React, { useState } from "react";
import axios from "axios";
import Logo from "../images/logo.png";

const AddDrivers = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dob: "",
    dot_expiry: "",
    cbi_expiry: "",
    puc_expiry: "",
    dl_number: "",
    dl_expiry: "",
    signedContract: "no",
    ein_number: "",
    llc_name: "",
    llc_expiry: "",
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
      const endpoint = process.env.REACT_APP_ADD_DRIVERS;
      const res = await axios.post(endpoint, formData);
      setSuccessMessage("Driver added successfully!");
      setErrorMessage("");
      setFormData({
        ...formData,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        dob: "",
        dot_expiry: "",
        cbi_expiry: "",
        puc_expiry: "",
        dl_number: "",
        dl_expiry: "",
        signedContract: "no",
        ein_number: "",
        llc_name: "",
        llc_expiry: "",
      });
    } catch (error) {
      console.error("Error adding driver:", error);
      setErrorMessage("Failed to add driver.");
      setSuccessMessage("");
    }
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <img src={Logo} alt="logo" style={{ height: "80px" }} />
        <h4 className="mt-3 fw-bold">Add New Driver</h4>
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
          {[
            { label: "First Name", name: "firstName" },
            { label: "Last Name", name: "lastName" },
            { label: "Email", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
            { label: "Date of Birth", name: "dob", type: "date" },
            { label: "DOT Expiry", name: "dot_expiry", type: "date" },
            { label: "CBI Expiry", name: "cbi_expiry", type: "date" },
            { label: "PUC Expiry", name: "puc_expiry", type: "date" },
            { label: "DL Number", name: "dl_number" },
            { label: "DL Expiry", name: "dl_expiry", type: "date" },
            { label: "EIN Number", name: "ein_number" },
            { label: "LLC Name", name: "llc_name" },
            { label: "LLC Expiry", name: "llc_expiry", type: "date" },
          ].map(({ label, name, type = "text" }) => (
            <div className="col-md-6" key={name}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                name={name}
                className="form-control"
                value={formData[name]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <div className="col-md-6">
            <label className="form-label">Signed Contract</label>
            <select
              name="signedContract"
              className="form-select"
              value={formData.signedContract}
              onChange={handleChange}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="col-12 text-end mt-4">
            <button type="submit" className="btn btn-dark px-4">
              Save Driver
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDrivers;
