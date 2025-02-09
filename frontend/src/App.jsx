import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import HomePage from "./pages/HomePage";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ArtistDashboard from "./pages/ArtistDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import CreateUserForm from "./components/dashboard/CreateUserForm";
import DeleteUserForm from "./components/dashboard/DeleteUserForm";
import UpdateAdminForm from "./components/dashboard/UpdateAdminForm";
import AdminSummary from "./components/dashboard/AdminSummary"
import ArtistSummary from "./components/dashboard/ArtistSummary"
import SongListPage from "./components/dashboard/artistPages/SongListPage";
import AddSongForm from "./components/dashboard/artistPages/AddSongForm";
import ResetPassword from "./pages/ResetPassword";

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to='/home-page'/>}></Route>
      <Route path="/home-page" element={<HomePage/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
      <Route path="/reset-password/:id/:token" element={<ResetPassword/>}></Route>
      <Route path="/admin-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["admin"]}>
              <AdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }>
          {/* Nested Routes for admin dashboard */}
          <Route path="" element={<AdminSummary />} /> {/* default */}
          <Route path="create-user-account" element={<CreateUserForm />} /> {/* User creation */}
          <Route path="delete-users" element={<DeleteUserForm />} /> {/* User deletion */}
          <Route path="update-profile" element={<UpdateAdminForm />} />{/* Admin Data Updation */}
        </Route>

        <Route path="/artist-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["artist"]}>
              <ArtistDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        } >
          {/* Nested Routes for artist dashboard */}
          <Route path="" element={<ArtistSummary />} /> {/* default */}
          <Route path="my-songs" element={<SongListPage />} /> {/* display Songs */}
          <Route path="add-songs" element={<AddSongForm />} /> {/* add songs */}
          <Route path="delete-songs" element={<DeleteUserForm />} /> {/* delete sngs */}
          <Route path="collabration" element={<DeleteUserForm />} /> {/* collabration */}
          <Route path="royalty-transactions" element={<DeleteUserForm />} /> {/* transactions */}
          <Route path="notifications" element={<DeleteUserForm />} /> {/* notifications */}
          <Route path="update-profile" element={<UpdateAdminForm />} />{/* Artist Data Updation */}
        </Route>
        

        <Route path="/manager-dashboard" element={
        <PrivateRoutes>
          <RoleBaseRoutes requiredRole = {["manager"]}>
            <ManagerDashboard/>
          </RoleBaseRoutes>
        </PrivateRoutes>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
