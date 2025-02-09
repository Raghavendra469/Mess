import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ArtistDashboard from "./pages/ArtistDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root (/) to /home-page */}
        <Route path="/" element={<Navigate to="/home-page" />} />

        {/* Define other routes */}
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin"]}>
              <AdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        } />

        {/* Manager Routes */}
        <Route path="/manager-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["manager"]}>
              <ManagerDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        } />

        {/* Artist Routes */}
        <Route path="/artist-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["artist"]}>
              <ArtistDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
