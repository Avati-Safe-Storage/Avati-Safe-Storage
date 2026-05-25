import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-text">
      {/* We can add a simple public header here if needed, but for now it's just the outlet */}
      <Outlet />
    </div>
  );
}
