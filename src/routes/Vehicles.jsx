import React, { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(process.env.REACT_APP_GET_VEHICLES);
        setVehicles(res.data.vehicles || []);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      }
    };
    fetchVehicles();
  }, []);

  const handleExportCSV = () => {
    const csv = Papa.unparse(filteredVehicles);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "vehicles.csv");
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleEditClick = (vehicle) => {
    setEditData({ ...vehicle });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = editData.vehicle_id;
      await axios.put(`${process.env.REACT_APP_EDIT_VEHICLES}/${id}`, editData);
      alert("Vehicle updated");
      setEditData(null);
    } catch (err) {
      console.error("Edit failed:", err);
      alert("Update failed");
    }
  };

  const formatDate = (dateStr) => dateStr?.slice(0, 10);

  const filteredVehicles = vehicles.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.cabNumber?.toLowerCase().includes(q) ||
      v.make?.toLowerCase().includes(q) ||
      v.model?.toLowerCase().includes(q) ||
      v.lic_plate?.toLowerCase().includes(q) ||
      v.color?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Vehicles</h4>
        <button className="btn btn-outline-dark" onClick={handleExportCSV}>
          Export CSV
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by cab #, make, model, plate, or color..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Cab #</th>
              <th>VIN</th>
              <th>Reg. Expiry</th>
              <th>Plate</th>
              <th>Color</th>
              <th>Make</th>
              <th>Model</th>
              <th>Year</th>
              <th>Status</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((v) => (
              <tr key={v.vehicle_id}>
                <td>{v.vehicle_id}</td>
                <td>{v.cabNumber}</td>
                <td>{v.vinNumber}</td>
                <td>{formatDate(v.regis_expriry)}</td>
                <td>{v.lic_plate}</td>
                <td>{v.color}</td>
                <td>{v.make}</td>
                <td>{v.model}</td>
                <td>{v.year}</td>
                <td>
                  <span
                    className={`badge bg-${
                      v.status === "active" ? "success" : "secondary"
                    }`}
                  >
                    {v.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEditClick(v)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredVehicles.length === 0 && (
          <p className="text-muted">No matching vehicles found.</p>
        )}
      </div>

      {/* Edit Modal */}
      {editData && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "#00000099" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Edit Vehicle</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditData(null)}
                ></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body row g-3">
                  {[
                    { label: "Cab Number", name: "cabNumber" },
                    { label: "VIN Number", name: "vinNumber" },
                    { label: "License Plate", name: "lic_plate" },
                    { label: "Color", name: "color" },
                    { label: "Make", name: "make" },
                    { label: "Model", name: "model" },
                    { label: "Year", name: "year", type: "number" },
                  ].map(({ label, name, type = "text" }) => (
                    <div className="col-md-6" key={name}>
                      <label className="form-label">{label}</label>
                      <input
                        type={type}
                        name={name}
                        className="form-control"
                        value={editData[name]}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  ))}

                  <div className="col-md-6">
                    <label className="form-label">Registration Expiry</label>
                    <input
                      type="date"
                      name="regis_expriry"
                      className="form-control"
                      value={formatDate(editData.regis_expriry)}
                      onChange={handleEditChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={editData.status}
                      onChange={handleEditChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditData(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
