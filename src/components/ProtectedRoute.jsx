import { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';


const publicRoutes = ['/login', '/psw_reset', '/about'];

const ProtectedRoute = ({ requiredAdmin, allowBothRoles }) => {
    const { token, isAdmin } = useContext(AuthContext);
    const location = useLocation();

    console.log("Token:", token);
    console.log("User is admin:", isAdmin);

    // Si la ruta actual está en la lista de rutas públicas, permite el acceso
    if (publicRoutes.includes(location.pathname)) {
        return <Outlet />;
    }

    // Si no hay token, redirige al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowBothRoles) {
        return <Outlet />;
      }

    // Si se requiere un admin y el usuario no es admin
    if (requiredAdmin && !isAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Si se requiere un no-admin y el usuario es admin
    if (!requiredAdmin && isAdmin) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />; // Renderiza las rutas hijas
};

export default ProtectedRoute;
