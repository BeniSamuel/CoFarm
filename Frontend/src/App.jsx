import Signup from "./Pages/Signup/Signup";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Chat from "./Pages/Chat/Chat";
import { Toaster } from "react-hot-toast";
import UploadProfile from "./Pages/UploadProfile/UploadProfile";
import Farm from "./Pages/Farms/Farm";
import Profile from "./Pages/Profile/Profile";

// Protected Route Component
// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  return token ? children : <Navigate to="/" replace />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/upload-profile"
          element={
            <ProtectedRoute>
              <UploadProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farms"
          element={
            <ProtectedRoute>
              <Farm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster
        toastOptions={{
          style: {
            color: "black",
            fontSize: "14px",
            fontFamily: "poppins",
          },
        }}
      />
    </Router>
  );
};

export default App;
