import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapView = ({ drivers }) => {
  if (drivers.length === 0) return <p>No live drivers online.</p>;

  const center = [drivers[0].lat, drivers[0].lng]; // Initial map center

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {drivers.map((driver, idx) => (
        <Marker key={idx} position={[driver.lat, driver.lng]}>
          <Popup>Cab: {driver.cabNumber}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
