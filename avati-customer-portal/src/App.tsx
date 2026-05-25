import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import PortalLayout from './layouts/PortalLayout';

// Public Pages
import Login from './pages/public/Login';

// Portal Pages
import ClientDashboard from './pages/portal/ClientDashboard';
import ClientInventory from './pages/portal/ClientInventory';
import ClientPayments from './pages/portal/ClientPayments';

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

          {/* Protected Client Portal Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <PortalLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="items"     element={<ClientInventory />} />
            <Route path="payments"  element={<ClientPayments />} />
          </Route>

          {/* Catch-All Redirection */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
