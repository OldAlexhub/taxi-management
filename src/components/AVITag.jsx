import React, { useState } from "react";
import axios from "axios";

const AVITag = () => {
  const [file, setFile] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [totalInvoice, setTotalInvoice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a CSV file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_ML}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setInvoices(res.data.invoices);
      setTotalInvoice(res.data.totalinvoice);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Upload AVI Trip Report</h3>

      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          accept=".csv"
          onChange={handleFileChange}
        />
      </div>

      <button
        className="btn btn-primary mb-4"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Processing..." : "Upload & Analyze"}
      </button>

      {error && <div className="alert alert-danger">{error}</div>}

      {invoices.length > 0 && (
        <>
          <h5>Invoice Summary</h5>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Cab Number</th>
                <th>Trips</th>
                <th>Total Invoice ($)</th>
                <th>Cost Per Trip ($)</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, index) => (
                <tr key={index}>
                  <td>{inv.cabNumber || "N/A"}</td>
                  <td>{inv.trips !== undefined ? inv.trips : "N/A"}</td>
                  <td>
                    {inv.invoice !== undefined ? inv.invoice.toFixed(2) : "N/A"}
                  </td>
                  <td>
                    {inv.cost_per_trip !== undefined
                      ? inv.cost_per_trip.toFixed(2)
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="alert alert-success">
            <strong>Total Invoice:</strong> $
            {totalInvoice !== null ? totalInvoice.toFixed(2) : "N/A"}
          </div>
        </>
      )}
    </div>
  );
};

export default AVITag;
