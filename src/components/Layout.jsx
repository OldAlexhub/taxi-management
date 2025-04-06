import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">
            TaxiOps
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="mainNavbar">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/") ? "active" : ""}`}
                  to="/"
                >
                  Home
                </Link>
              </li>

              {/* Drivers Dropdown */}
              <li className="nav-item dropdown">
                <span
                  className={`nav-link dropdown-toggle ${
                    location.pathname.startsWith("/drivers") ||
                    location.pathname === "/add-drivers"
                      ? "active"
                      : ""
                  }`}
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Drivers
                </span>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/drivers">
                      All Drivers
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/add-drivers">
                      Add Driver
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Vehicles Dropdown */}
              <li className="nav-item dropdown">
                <span
                  className={`nav-link dropdown-toggle ${
                    location.pathname.startsWith("/vehicles") ||
                    location.pathname === "/add-vehicles"
                      ? "active"
                      : ""
                  }`}
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Vehicles
                </span>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/vehicles">
                      All Vehicles
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/add-vehicles">
                      Add Vehicle
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/assign") ? "active" : ""}`}
                  to="/assign"
                >
                  Assign
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${isActive("/forms") ? "active" : ""}`}
                  to="/forms"
                >
                  Forms
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    isActive("/addadmin") ? "active" : ""
                  }`}
                  to="/addadmin"
                >
                  Add Admin
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    isActive("/settings") ? "active" : ""
                  }`}
                  to="/settings"
                >
                  Settings
                </Link>
              </li>
              {/* Drivers Dropdown */}
              <li className="nav-item dropdown">
                <span
                  className={`nav-link dropdown-toggle ${
                    location.pathname.startsWith("/drivers") ||
                    location.pathname === "/add-drivers"
                      ? "active"
                      : ""
                  }`}
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Reports
                </span>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/trips">
                      Trips
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/sessions">
                      Sessions
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/avitag">
                      AVI Tag
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>

            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="nav-link btn btn-link text-white text-decoration-none"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main className="container mt-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
