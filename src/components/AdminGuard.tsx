import React from 'react';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  // TODO: Implement actual admin check logic
  const isAdmin = true; 

  if (!isAdmin) {
    return <p>Access Denied. You must be an admin to view this page.</p>;
  }

  return <>{children}</>;
};

export default AdminGuard;
export { AdminGuard };