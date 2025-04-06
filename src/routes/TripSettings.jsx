import React, { useEffect, useState } from "react";
import axios from "axios";

const TripSettings = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    baseFare: "",
    costPerMile: "",
    costPerMinute: "",
    currency: "USD",
    updatedBy: "admin",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(process.env.REACT_APP_GET_SETTINGS);
      setSettings(res.data);
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && editingId) {
        await axios.put(
          `${process.env.REACT_APP_EDIT_SETTINGS}${editingId}`,
          formData
        );
        alert("Settings updated");
      } else {
        await axios.post(process.env.REACT_APP_SETTINGS, formData);
        alert("Settings created");
      }

      fetchSettings();
      setIsEditing(false);
      setFormData({
        baseFare: "",
        costPerMile: "",
        costPerMinute: "",
        currency: "USD",
        updatedBy: "admin",
      });
    } catch (err) {
      console.error("Settings save error:", err);
      alert("Failed to save settings");
    }
  };

  const handleEdit = () => {
    if (!settings) return;
    setFormData({
      baseFare: settings.baseFare,
      costPerMile: settings.costPerMile,
      costPerMinute: settings.costPerMinute,
      currency: settings.currency,
      updatedBy: settings.updatedBy || "admin",
    });
    setEditingId(settings._id);
    setIsEditing(true);
  };

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-3">Trip Settings</h4>

      <form className="card p-4 shadow-sm mb-4" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Base Fare ($)</label>
            <input
              type="number"
              name="baseFare"
              className="form-control"
              value={formData.baseFare}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Cost Per Mile ($)</label>
            <input
              type="number"
              name="costPerMile"
              className="form-control"
              value={formData.costPerMile}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Cost Per Minute ($)</label>
            <input
              type="number"
              name="costPerMinute"
              className="form-control"
              value={formData.costPerMinute}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Currency</label>
            <input
              type="text"
              name="currency"
              className="form-control"
              value={formData.currency}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 text-end mt-3">
            <button type="submit" className="btn btn-dark px-4">
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </form>

      {settings && (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-dark">
              <tr>
                <th>Base Fare</th>
                <th>Per Mile</th>
                <th>Per Minute</th>
                <th>Currency</th>
                <th>Updated By</th>
                <th>Last Updated</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${settings.baseFare}</td>
                <td>${settings.costPerMile}</td>
                <td>${settings.costPerMinute}</td>
                <td>{settings.currency}</td>
                <td>{settings.updatedBy}</td>
                <td>{new Date(settings.lastUpdated).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TripSettings;
