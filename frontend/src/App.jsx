import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import AddEvent from "./pages/AddEvent";
import UpdateEvent from "./pages/UpdateEvent";
import BookingDetails from "./pages/BookingDetails.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/ownerdashboard" element={<OwnerDashboard />} />
        <Route path="/addevent" element={<AddEvent />} />
        <Route path="/updateevent/:id" element={<UpdateEvent />} />
        <Route path="/bookingdetails/:eventId/:userId" element={<BookingDetails />} />
      </Routes>
    </Router>
  );
}
