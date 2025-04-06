import React, { useState } from "react";
import axios from "axios";
import Logo from "../images/logo.png";

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = process.env.REACT_APP_SIGNUP;
      const res = await axios.post(endpoint, formData);
      alert("Admin account created successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error signing up admin:", error);
      alert("Failed to create admin. Please try again.");
    }
  };

  return (
    <div className="container py-4">
      <div className="text-center mb-4">
        <img src={Logo} alt="logo" style={{ height: "80px" }} />
        <h4 className="mt-3 fw-bold">Create Admin Account</h4>
      </div>

      <form className="card p-4 shadow-sm" onSubmit={handleSubmit}>
        <div className="row g-3">
          {[
            { label: "First Name", name: "firstName" },
            { label: "Last Name", name: "lastName" },
            { label: "Email", name: "email", type: "email" },
            { label: "Password", name: "password", type: "password" },
            {
              label: "Confirm Password",
              name: "confirmPassword",
              type: "password",
            },
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

          <div className="col-12 text-end mt-3">
            <button type="submit" className="btn btn-dark px-4">
              Create Admin
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAdmin;
