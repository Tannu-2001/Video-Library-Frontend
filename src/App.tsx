import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import UserProtectedRoute from "./components/admin/user/UserProtectedRoute";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import  AdminDashboard  from "./pages/admin-dashboard";
import AddVideo  from "./pages/add-video";
import  EditVideo from "./pages/edit-video";
import  DeleteVideo  from "./pages/delete-video";
import  UserDashBoard  from "./pages/user-dashboard";
import  UserLogin  from "./pages/user-login";
import  UserLoginError from "./pages/user-login-error";
import  UserRegister  from "./pages/user-register";
import  AdminLogin  from "./pages/admin-login";
import  VideoLibraryHome  from "./pages/video-library-home";
import Watch from "./pages/watch";
import SavedVideos from "./pages/saved-videos";

function App() {
  return (
    <div className="app-shell">
      <BrowserRouter>
        <Navbar/>
        <main className="app-main container-fluid px-0">
          <Routes>
            <Route path="/" element={<VideoLibraryHome/>}/>
            <Route path="/watch/:id" element={<Watch/>}/>
            <Route path="user-login" element={<UserLogin />} />
              <Route path="admin-login" element={<AdminLogin />} />
             <Route path="user-register" element={<UserRegister />} />
            <Route path="user-dashboard" element={<UserProtectedRoute><UserDashBoard /></UserProtectedRoute>} />
            <Route path="user-login-error" element={<UserLoginError />} />
            <Route path="admin-dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
            <Route path="add-video" element={<AdminProtectedRoute><AddVideo /></AdminProtectedRoute>} />
            <Route path="edit-video/:id" element={<EditVideo />} />
            <Route path="delete-video/:id" element={<DeleteVideo />} />
            <Route path="/saved-videos" element={<UserProtectedRoute><SavedVideos/></UserProtectedRoute>} />
          </Routes>
        </main>
        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;