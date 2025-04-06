import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const FormGenerators = () => {
  const [formType, setFormType] = useState("insurance");
  const [cabNumber, setCabNumber] = useState("");
  const [driver, setDriver] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [effectiveDate, setEffectiveDate] = useState("");
  const [refundEntries, setRefundEntries] = useState([{ cab: "", vin: "" }]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dRes = await axios.get(process.env.REACT_APP_GET_DRIVERS);
        const vRes = await axios.get(process.env.REACT_APP_GET_VEHICLES);
        setDrivers(dRes.data.drivers);
        setVehicles(vRes.data.vehicles);
      } catch (err) {
        console.error("Failed to fetch drivers/vehicles:", err);
      }
    };
    fetchData();
  }, []);

  const getDriverByCab = () => {
    const v = vehicles.find((v) => v.cabNumber === cabNumber);
    const d = drivers.find((d) => d.driver_id === v?.vehicle_id);
    return d || {};
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("Times", "Normal");
    doc.setFontSize(12);
    const selectedDriver = getDriverByCab();

    switch (formType) {
      case "insurance":
        doc.text(`Dear Team,`, 10, 20);
        doc.text(
          `We kindly request that you add Cab #${cabNumber} to our insurance policy, effective ${effectiveDate}.`,
          10,
          30
        );
        doc.text(
          `Please send the updated Insurance Certificate and Vehicle Schedule to: gtinsurance@flydenver.com`,
          10,
          40
        );
        doc.text("Sincerely,", 10, 60);
        break;

      case "avi-request":
        doc.text(`To: AVI Sales Office`, 10, 20);
        doc.text(`Denver International Airport`, 10, 26);
        doc.text(`Phone: 303-342-4053`, 10, 32);
        doc.text(``, 10, 38);
        doc.text(`Dear AVI Staff,`, 10, 44);
        doc.text(`We kindly request a Credential and AVI Tag for:`, 10, 52);
        doc.text(
          `Driver Name: ${selectedDriver.firstName} ${selectedDriver.lastName}`,
          10,
          62
        );
        doc.text(`Cab #: ${cabNumber}`, 10, 68);
        doc.text(
          `VIN #: ${
            vehicles.find((v) => v.cabNumber === cabNumber)?.vinNumber
          }`,
          10,
          74
        );
        doc.text(
          `Make/Model: ${
            vehicles.find((v) => v.cabNumber === cabNumber)?.make
          } ${vehicles.find((v) => v.cabNumber === cabNumber)?.model}`,
          10,
          80
        );
        doc.text(
          `License Plate: ${
            vehicles.find((v) => v.cabNumber === cabNumber)?.lic_plate
          }`,
          10,
          86
        );
        doc.text(``, 10, 94);
        doc.text("Thank you,", 10, 100);
        break;

      case "avi-refund":
        doc.text(`Dear Team,`, 10, 20);
        doc.text(
          `We kindly request the AVI Tag refund for the following vehicles:`,
          10,
          30
        );
        refundEntries.forEach((entry, idx) => {
          doc.text(
            `• Cab #${entry.cab} – Last 6 digits of VIN: ${entry.vin}`,
            10,
            40 + idx * 8
          );
        });
        doc.text(``, 10, 50 + refundEntries.length * 8);
        doc.text(`Sincerely,`, 10, 60 + refundEntries.length * 8);
        break;

      case "insurance-remove":
        doc.text(`Dear Team,`, 10, 20);
        doc.text(
          `Please remove the following driver and vehicle from our policy effective ${effectiveDate}:`,
          10,
          30
        );
        doc.text(
          `Driver Name: ${selectedDriver.firstName} ${selectedDriver.lastName}`,
          10,
          40
        );
        doc.text(`Cab #: ${cabNumber}`, 10, 46);
        doc.text(
          `VIN #: ${
            vehicles.find((v) => v.cabNumber === cabNumber)?.vinNumber
          }`,
          10,
          52
        );
        doc.text(
          `Please send the updated Insurance Certificate to gtinsurance@flydenver.com`,
          10,
          62
        );
        doc.text(`Sincerely,`, 10, 72);
        break;

      default:
        doc.text("Invalid form selection", 10, 20);
    }

    doc.text("Trans Voyage Taxi", 10, 280);
    doc.text("1450 S. Havana St, Ste# 712", 10, 286);
    doc.text("Aurora, CO 80012", 10, 292);
    doc.text("Phone: (303) 353-4482", 10, 298);
    doc.text("Email: info@transvoyagetaxi.com", 10, 304);

    doc.save(`${formType}_form.pdf`);
  };

  return (
    <div className="container py-4">
      <h4 className="fw-bold mb-3">Form Generator</h4>

      <div className="mb-3">
        <label className="form-label">Select Form Type</label>
        <select
          className="form-select"
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
        >
          <option value="insurance">Add to Insurance</option>
          <option value="avi-request">DIA AVI Tag Request</option>
          <option value="avi-refund">AVI Tag Refund</option>
          <option value="insurance-remove">Remove from Insurance</option>
        </select>
      </div>

      {formType !== "avi-refund" && (
        <>
          <div className="mb-3">
            <label className="form-label">Cab Number</label>
            <select
              className="form-select"
              value={cabNumber}
              onChange={(e) => setCabNumber(e.target.value)}
            >
              <option value="">-- Select Cab --</option>
              {vehicles.map((v) => (
                <option key={v.vehicle_id} value={v.cabNumber}>
                  {v.cabNumber} - {v.make} {v.model}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Effective Date</label>
            <input
              type="date"
              className="form-control"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
            />
          </div>
        </>
      )}

      {formType === "avi-refund" && (
        <>
          <h6>Refunded Vehicles</h6>
          {refundEntries.map((entry, idx) => (
            <div key={idx} className="row g-2 mb-2">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cab #"
                  value={entry.cab}
                  onChange={(e) => {
                    const newData = [...refundEntries];
                    newData[idx].cab = e.target.value;
                    setRefundEntries(newData);
                  }}
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last 6 VIN"
                  value={entry.vin}
                  onChange={(e) => {
                    const newData = [...refundEntries];
                    newData[idx].vin = e.target.value;
                    setRefundEntries(newData);
                  }}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() =>
              setRefundEntries([...refundEntries, { cab: "", vin: "" }])
            }
          >
            + Add Another
          </button>
        </>
      )}

      <div className="text-end mt-4">
        <button className="btn btn-dark px-4" onClick={generatePDF}>
          Generate PDF
        </button>
      </div>
    </div>
  );
};

export default FormGenerators;
