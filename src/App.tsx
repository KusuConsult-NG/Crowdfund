import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import EditProject from './pages/EditProject';
import DonorContributions from './pages/DonorContributions';
import ForgotPassword from './pages/ForgotPassword';
import SetNewPassword from './pages/SetNewPassword';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import UserManagement from './pages/UserManagement';
import ContentModeration from './pages/ContentModeration';
import GlobalSettings from './pages/GlobalSettings';
import DonorSignup from './pages/DonorSignup';
import AdminSignup from './pages/AdminSignup';
import DonorLogin from './pages/DonorLogin';
import ProjectDiscovery from './pages/ProjectDiscovery';
import CreateProject from './pages/CreateProject';
import UserDashboard from './pages/UserDashboard';
import MyDonations from './pages/MyDonations';
import ProjectDetails from './pages/ProjectDetails';
import PledgeProject from './pages/PledgeProject';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default route */}
          <Route path="/" element={<LandingPage />} />

          {/* Public routes */}
          <Route path="/discover" element={<ProjectDiscovery />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/project/:id/pledge" element={<PledgeProject />} />
          <Route path="/signup" element={<Navigate to="/signup/donor" replace />} />
          <Route path="/signup/donor" element={<DonorSignup />} />
          <Route path="/signup/admin" element={<AdminSignup />} />
          <Route path="/login" element={<DonorLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<SetNewPassword />} />

          {/* Protected User routes */}
          <Route path="/user/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/donations" element={<ProtectedRoute><MyDonations /></ProtectedRoute>} />

          {/* Protected Admin routes */}
          <Route path="/create-project" element={<ProtectedRoute requireAdmin><CreateProject /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/projects/edit/:id" element={<ProtectedRoute><EditProject /></ProtectedRoute>} />
          <Route path="/admin/projects/:id/contributions" element={<ProtectedRoute><DonorContributions /></ProtectedRoute>} />

          {/* Protected Super Admin routes */}
          <Route path="/superadmin/dashboard" element={<ProtectedRoute><SuperAdminDashboard /></ProtectedRoute>} />
          <Route path="/superadmin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/superadmin/moderation" element={<ProtectedRoute><ContentModeration /></ProtectedRoute>} />
          <Route path="/superadmin/settings" element={<ProtectedRoute><GlobalSettings /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
