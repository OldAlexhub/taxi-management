import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";
import Home from "../routes/Home";
import Login from "../routes/Login";
import Drivers from "../routes/Drivers";
import AddDrivers from "../routes/AddDrivers";
import Vehicles from "../routes/Vehicles";
import AddVehicles from "../routes/AddVehicles";
import Assign from "../routes/Assign";
import AddAdmin from "../routes/AddAdmin";
import PrivateRoute from "../components/PrivateRoute";
import FormGenerators from "../routes/FormGenerators";
import TripSettings from "../routes/TripSettings";
import Reports from "../routes/Reports";
import Trips from "../components/Trips";
import Sessions from "../components/Sessions";
import AVITag from "../components/AVITag";

const RouteManager = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="add-drivers" element={<AddDrivers />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="add-vehicles" element={<AddVehicles />} />
          <Route path="assign" element={<Assign />} />
          <Route path="addadmin" element={<AddAdmin />} />
          <Route path="forms" element={<FormGenerators />} />
          <Route path="settings" element={<TripSettings />} />
          <Route path="reports" element={<Reports />} />
          <Route path="trips" element={<Trips />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="avitag" element={<AVITag />} />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouteManager;
