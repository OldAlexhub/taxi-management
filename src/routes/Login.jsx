import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from "../images/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(process.env.REACT_APP_LOGIN, formData);
      const { name, userId, token } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("name", name);

      setMessage({ text: "Login successful. Redirecting...", type: "success" });

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Login failed:", error);
      setMessage({
        text: "Invalid credentials or server error.",
        type: "danger",
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-sm p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="text-center mb-4">
          <img src={Logo} alt="TaxiOps Logo" style={{ height: "80px" }} />
          <h4 className="mt-3 fw-bold">TaxiOps Login</h4>
        </div>

        {message.text && (
          <div
            className={`alert alert-${message.type} text-center`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email
            </label>
            <input
              type="text"
              name="email"
              className="form-control"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-dark w-100 fw-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
