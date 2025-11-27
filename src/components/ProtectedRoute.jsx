import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Outlet, useNavigate } from 'react-router-dom';

function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await base44.auth.isAuthenticated();
        setIsAuthenticated(authStatus);
        if (!authStatus) {
          base44.auth.login(window.location.pathname);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        // Handle error, maybe redirect to an error page or show a message
        setIsAuthenticated(false);
        // Potentially redirect to login here as well, depending on desired UX
        base44.auth.login(window.location.pathname);
      }
    };
    checkAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    // You can render a loading spinner here
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : null;
}

export default ProtectedRoute;



