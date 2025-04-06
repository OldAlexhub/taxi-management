import React, { useEffect, useState } from "react";
import axios from "axios";
import Papa from "papaparse";
import { saveAs } from "file-saver";

const ActiveFleet = () => {
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(process.env.REACT_APP_GET_ASSIGNED);
        const activeOnly =
          res.data.assignments?.filter((a) => a.status === "active") || [];
        setAssignments(activeOnly);
      } catch (err) {
        console.error("Failed to fetch active fleet:", err);
      }
    };
    fetchAssignments();
  }, []);

  const handleSearch = (e) => setSearch(e.target.value);

  const handleExport = () => {
    const csv = Papa.unparse(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "active_fleet.csv");
  };

  const formatDate = (dateStr) => dateStr?.slice(0, 10);

  const handleEditClick = (assignment) => {
    setEditData({ ...assignment });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { driver_id, vehicle_id, ...payload } = editData;

    try {
      await axios.put(
        `${process.env.REACT_APP_EDIT_ASSIGNING}/${driver_id}/${vehicle_id}`,
        payload
      );
      alert("Assignment updated!");
      setEditData(null);
    } catch (err) {
      console.error("Failed to update assignment:", err);
      alert("Update failed");
    }
  };

  const filtered = assignments.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.firstName.toLowerCase().includes(q) ||
      a.lastName.toLowerCase().includes(q) ||
      a.make.toLowerCase().includes(q) ||
      a.model.toLowerCase().includes(q) ||
      a.lic_plate.toLowerCase().includes(q) ||
      a.cabNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Active Fleet</h4>
        <button className="btn btn-outline-dark" onClick={handleExport}>
          Export CSV
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by driver, make, plate, or cab..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Driver</th>
              <th>Email</th>
              <th>Cab #</th>
              <th>Plate</th>
              <th>Make</th>
              <th>Model</th>
              <th>Insurance Date</th>
              <th>Weekly Balance</th>
              <th>Status</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, idx) => (
              <tr key={idx}>
                <td>
                  {a.firstName} {a.lastName}
                </td>
                <td>{a.email}</td>
                <td>{a.cabNumber}</td>
                <td>{a.lic_plate}</td>
                <td>{a.make}</td>
                <td>{a.model}</td>
                <td>{formatDate(a.added_to_insurance)}</td>
                <td>${a.weekly_balance?.toFixed(2)}</td>
                <td>
                  <span
                    className={`badge bg-${
                      a.status === "active" ? "success" : "secondary"
                    }`}
                  >
                    {a.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEditClick(a)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-muted">No matching active fleet found.</p>
        )}
      </div>

      {/* Edit Modal */}
      {editData && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "#00000099" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Edit Assignment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditData(null)}
                ></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Added to Insurance</label>
                    <input
                      type="date"
                      name="added_to_insurance"
                      className="form-control"
                      value={formatDate(editData.added_to_insurance)}
                      onChange={handleEditChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Weekly Balance</label>
                    <input
                      type="number"
                      name="weekly_balance"
                      className="form-control"
                      value={editData.weekly_balance}
                      onChange={handleEditChange}
                    />
                  </div>
                  <div className="mb-3">
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

export default ActiveFleet;
