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
import ViewAdminForm from "./components/dashboard/ViewAdminForm";
import AdminSummary from "./components/dashboard/AdminSummary"
import ArtistSummary from "./components/dashboard/artistPages/ArtistSummary"
import ManagerSummary from "./components/dashboard/managerPages/ManagerSummary"
import SongListPage from "./components/dashboard/artistPages/SongListPage";
import AddSongForm from "./components/dashboard/artistPages/AddSongForm";
import ResetPassword from "./pages/ResetPassword"; 
import UpdateArtistProfileForm from "./components/dashboard/artistPages/updateArtistProfileForm"
import UpdateManagerProfileForm from "./components/dashboard/managerPages/UpdateManagerProfileForm"
import ManagerNotifications from "./components/dashboard/managerPages/ManagerNotifications.jsx"
import DeleteSong from "./components/dashboard/artistPages/DeleteSong"
import ManagerArtists from "./components/dashboard/managerPages/ManagerArtists.jsx";
import RequestManagerList from "./components/dashboard/artistPages/RequestManagerList.jsx";
import CollaborationRequests from "./components/dashboard/managerPages/CollaborationRequests.jsx";
import ViewMyManager from "./components/dashboard/artistPages/ViewMyManager.jsx";

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
            <RoleBaseRoutes requiredRole={["Admin"]}>
              <AdminDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        }>
          {/* Nested Routes for admin dashboard */}
          <Route path="" element={<AdminSummary />} /> {/* default */}
          <Route path="create-user-account" element={<CreateUserForm />} /> {/* User creation */}
          <Route path="delete-users" element={<DeleteUserForm />} /> {/* User deletion */}
          <Route path="view-profile" element={<ViewAdminForm />} />{/* Admin Data Updation */}
        </Route>

        <Route path="/artist-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["Artist"]}>
              <ArtistDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        } >
          {/* Nested Routes for artist dashboard */}
          <Route path="" element={<ArtistSummary />} /> {/* default */}
          <Route path="my-songs" element={<SongListPage />} /> {/* display Songs */}
          <Route path="add-songs" element={<AddSongForm />} /> {/* add songs */}
          <Route path="delete-songs" element={<DeleteSong />} /> {/* delete sngs */}
          <Route path="collabration" element={<RequestManagerList />} /> {/* collabration */}
          <Route path="view-manager" element={<ViewMyManager />} /> {/* collabration */}
          <Route path="royalty-transactions" element={<DeleteUserForm />} /> {/* transactions */}
          <Route path="notifications" element={<DeleteUserForm />} /> {/* notifications */}
          <Route path="update-profile" element={<UpdateArtistProfileForm />} />{/* Artist Data Updation */}
        </Route>

        <Route path="/manager-dashboard" element={
          <PrivateRoutes>
            <RoleBaseRoutes requiredRole={["Manager"]}>
              <ManagerDashboard />
            </RoleBaseRoutes>
          </PrivateRoutes>
        } >
          {/* Nested Routes for artist dashboard */}
          <Route path="" element={<ManagerSummary />} /> {/* default */}
          <Route path="view-artists" element={<ManagerArtists />} /> {/* display Songs */}
          <Route path="collaboration-requests" element={<CollaborationRequests />} /> {/* add songs */}
          <Route path="royalty-transactions" element={<DeleteSong />} /> {/* delete sngs */}
          <Route path="notifications" element={<ManagerNotifications />} /> {/* collabration */}
          <Route path="update-profile" element={<UpdateManagerProfileForm />} /> {/* collabration */}
        </Route>
        

    </Routes>
    </BrowserRouter>
  )
}

export default App
