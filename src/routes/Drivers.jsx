import React, { useEffect, useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import Papa from "papaparse";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState(null);
  const [showExpiringOnly, setShowExpiringOnly] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_GET_DRIVERS}`);
        setDrivers(res.data.drivers || []);
      } catch (error) {
        console.error("Failed to fetch drivers:", error);
      }
    };
    fetchDrivers();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleExportCSV = () => {
    const csv = Papa.unparse(filteredDrivers);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "drivers_full.csv");
  };

  const formatDate = (dateStr) => dateStr?.slice(0, 10);

  const isAboutToExpire = (dateStr, days = 30) => {
    if (!dateStr) return false;
    const now = new Date();
    const expiry = new Date(dateStr);
    const diffTime = expiry - now;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= days;
  };

  const isDriverExpiring = (driver) =>
    ["dot_expiry", "cbi_expiry", "puc_expiry", "dl_expiry", "llc_expiry"].some(
      (key) => isAboutToExpire(driver[key])
    );

  const filteredDrivers = drivers
    .filter(
      (d) =>
        d.firstName.toLowerCase().includes(search.toLowerCase()) ||
        d.lastName.toLowerCase().includes(search.toLowerCase())
    )
    .filter((d) => (showExpiringOnly ? isDriverExpiring(d) : true));

  const handleEditClick = (driver) => {
    setEditData({ ...driver });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const id = editData.driver_id;
      await axios.put(`${process.env.REACT_APP_EDIT_DRIVERS}/${id}`, editData);
      alert("Driver updated");
      setEditData(null);
    } catch (err) {
      console.error("Edit failed:", err);
      alert("Update failed");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Drivers</h4>
        <button className="btn btn-outline-dark" onClick={handleExportCSV}>
          Export CSV
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div className="form-check mb-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="expiringToggle"
          checked={showExpiringOnly}
          onChange={() => setShowExpiringOnly(!showExpiringOnly)}
        />
        <label className="form-check-label" htmlFor="expiringToggle">
          Show only drivers with upcoming expiry (30 days)
        </label>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>First</th>
              <th>Last</th>
              <th>Email</th>
              <th>DOB</th>
              <th>DOT Expiry</th>
              <th>CBI Expiry</th>
              <th>PUC Expiry</th>
              <th>DL #</th>
              <th>DL Expiry</th>
              <th>Contract</th>
              <th>EIN</th>
              <th>LLC</th>
              <th>LLC Expiry</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((d) => (
              <tr key={d.driver_id}>
                <td>{d.driver_id}</td>
                <td>{d.firstName}</td>
                <td>{d.lastName}</td>
                <td>{d.email}</td>
                <td>{formatDate(d.dob)}</td>
                <td
                  className={isAboutToExpire(d.dot_expiry) ? "bg-warning" : ""}
                >
                  {formatDate(d.dot_expiry)}
                </td>
                <td
                  className={isAboutToExpire(d.cbi_expiry) ? "bg-warning" : ""}
                >
                  {formatDate(d.cbi_expiry)}
                </td>
                <td
                  className={isAboutToExpire(d.puc_expiry) ? "bg-warning" : ""}
                >
                  {formatDate(d.puc_expiry)}
                </td>
                <td>{d.dl_number}</td>
                <td
                  className={isAboutToExpire(d.dl_expiry) ? "bg-warning" : ""}
                >
                  {formatDate(d.dl_expiry)}
                </td>
                <td>{d.signedContract}</td>
                <td>{d.ein_number}</td>
                <td>{d.llc_name}</td>
                <td
                  className={isAboutToExpire(d.llc_expiry) ? "bg-warning" : ""}
                >
                  {formatDate(d.llc_expiry)}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleEditClick(d)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredDrivers.length === 0 && (
          <p className="text-muted">No matching drivers found.</p>
        )}
      </div>

      {/* Edit Modal */}
      {editData && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "#00000099" }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">Edit Driver</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditData(null)}
                ></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body row g-3">
                  {[
                    { label: "First Name", name: "firstName" },
                    { label: "Last Name", name: "lastName" },
                    { label: "Email", name: "email" },
                    { label: "DL Number", name: "dl_number" },
                    { label: "EIN Number", name: "ein_number" },
                    { label: "LLC Name", name: "llc_name" },
                  ].map(({ label, name }) => (
                    <div className="col-md-6" key={name}>
                      <label className="form-label">{label}</label>
                      <input
                        type="text"
                        name={name}
                        className="form-control"
                        value={editData[name]}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  ))}

                  {[
                    { label: "DOB", name: "dob" },
                    { label: "DOT Expiry", name: "dot_expiry" },
                    { label: "CBI Expiry", name: "cbi_expiry" },
                    { label: "PUC Expiry", name: "puc_expiry" },
                    { label: "DL Expiry", name: "dl_expiry" },
                    { label: "LLC Expiry", name: "llc_expiry" },
                  ].map(({ label, name }) => (
                    <div className="col-md-6" key={name}>
                      <label className="form-label">{label}</label>
                      <input
                        type="date"
                        name={name}
                        className="form-control"
                        value={editData[name]?.slice(0, 10)}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  ))}

                  <div className="col-md-6">
                    <label className="form-label">Signed Contract</label>
                    <select
                      name="signedContract"
                      className="form-select"
                      value={editData.signedContract}
                      onChange={handleEditChange}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
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

export default Drivers;
