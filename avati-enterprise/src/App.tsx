import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import PortalLayout from './layouts/PortalLayout';

// Public Pages
import Home from './pages/public/Home';
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

// Portal Pages
import ClientDashboard from './pages/portal/ClientDashboard';
import ClientInventory from './pages/portal/ClientInventory';
import ClientPayments from './pages/portal/ClientPayments';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
          </Route>

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'warehouse_supervisor', 'staff']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard"    element={<AdminDashboard />} />
            <Route path="leads"        element={<LeadManagement />} />
            <Route path="onboarding"   element={<OnboardingWizard />} />
            <Route path="customers"    element={<CustomerManagement />} />
            <Route path="pickups"      element={<PickupManagement />} />
            <Route path="storage-list" element={<StorageList />} />
            <Route path="storage-setup" element={<StorageSetup />} />
            <Route path="inventory"    element={<InventoryManagement />} />
            <Route path="warehouse"    element={<WarehouseMap />} />
          </Route>

          {/* Client Portal */}
          <Route
            path="/portal"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <PortalLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/portal/dashboard" replace />} />
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="items"     element={<ClientInventory />} />
            <Route path="payments"  element={<ClientPayments />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
