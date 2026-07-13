import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/auth/Login";

import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import Onboarding from "./pages/superadmin/Onboarding";
import Approvals from "./pages/superadmin/Approvals";

import SchoolAdminDashboard from "./pages/schooladmin/Dashboard";
import ImportTeachers from "./pages/schooladmin/ImportTeachers";
import ImportStudents from "./pages/schooladmin/ImportStudents";
import FeeStructure from "./pages/schooladmin/FeeStructure";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Super Admin */}
          <Route
            path="/super-admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/onboarding"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/approvals"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <Approvals />
              </ProtectedRoute>
            }
          />

          {/* School Admin */}
          <Route
            path="/school-admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["schooladmin"]}>
                <SchoolAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-admin/teachers"
            element={
              <ProtectedRoute allowedRoles={["schooladmin"]}>
                <ImportTeachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-admin/students"
            element={
              <ProtectedRoute allowedRoles={["schooladmin"]}>
                <ImportStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-admin/fee-structure"
            element={
              <ProtectedRoute allowedRoles={["schooladmin"]}>
                <FeeStructure />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
