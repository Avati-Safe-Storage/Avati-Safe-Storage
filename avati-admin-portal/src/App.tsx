import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Login from './pages/public/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import LeadManagement from './pages/admin/LeadManagement';
import OnboardingWizard from './pages/admin/OnboardingWizard';
import CustomerManagement from './pages/admin/CustomerManagement';
import PickupManagement from './pages/admin/PickupManagement';
import StorageList from './pages/admin/StorageList';
import StorageSetup from './pages/admin/StorageSetup';
import InventoryManagement from './pages/admin/InventoryManagement';
import WarehouseMap from './pages/admin/WarehouseMap';
import BlogManagement from './pages/admin/BlogManagement';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Login Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="login" element={<Login />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'warehouse_supervisor', 'staff']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard"    element={<AdminDashboard />} />
            <Route path="leads"        element={<LeadManagement />} />
            <Route path="onboarding"   element={<OnboardingWizard />} />
            <Route path="customers"    element={<CustomerManagement />} />
            <Route path="pickups"      element={<PickupManagement />} />
            <Route path="storage-list" element={<StorageList />} />
            <Route path="storage-setup" element={<StorageSetup />} />
            <Route path="inventory"    element={<InventoryManagement />} />
            <Route path="warehouse"    element={<WarehouseMap />} />
            <Route path="blog"         element={<BlogManagement />} />
          </Route>

          {/* Catch-All Redirection */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
