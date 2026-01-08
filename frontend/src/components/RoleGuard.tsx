import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/auth.context';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
    children?: React.ReactNode;
    requiredLevel?: number;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, requiredLevel = 999 }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Checking if there's a role or checking role level (in a real app, role level should be in user data or separate fetch)
    // For now, assuming Level 0 is required for 'management' routes if not specified.
    // We'd ideally have currentRoleLevel helper.

    // Simple level check placeholder (0 is superadmin)
    // In our backend implementation, Superadmin has ID '00000000-0000-0000-0000-000000000000'
    const isSuperadmin = user.role_id === '00000000-0000-0000-0000-000000000000';

    if (requiredLevel === 0 && !isSuperadmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};
