import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
    showCreateButton?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showCreateButton = true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAdmin, isSuperAdmin, isDonor, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // Show Create Project button only for admins and super admins
    const canCreateProject = (isAdmin() || isSuperAdmin()) && showCreateButton;

    // Check if we're currently on a dashboard page
    const isOnDashboard = location.pathname.includes('/dashboard');

    // Get user initials from first 2 names
    const getUserInitials = () => {
        if (!user) return '';

        if (user.name) {
            const names = user.name.trim().split(' ');
            if (names.length >= 2) {
                // Get first letter of first two names
                return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
            }
            // If only one name, use first letter
            return names[0].charAt(0).toUpperCase();
        }

        // Fallback to email first letter
        return user.email.charAt(0).toUpperCase();
    };

    // Determine the home route based on user authentication and role
    const getHomeRoute = () => {
        if (!user) return '/';
        if (isSuperAdmin()) return '/superadmin/dashboard';
        if (isAdmin()) return '/admin/dashboard';
        // Donors should see the project discovery page
        if (isDonor()) return '/discover';
        return '/user/dashboard';
    };

    return (
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--color-border)',
            padding: '0.75rem 2.5rem',
            backgroundColor: 'var(--color-bg-white)',
            zIndex: 1000
        }}>
            <Link to={getHomeRoute()} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '1.5rem', height: '1.5rem' }}>
                        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="var(--color-primary)" />
                        </svg>
                    </div>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                        ChurchFlow
                    </h2>
                </div>
            </Link>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                {canCreateProject && (
                    <Link to="/create-project">
                        <button className="btn btn-primary" style={{ minWidth: '160px' }}>
                            + Create New Project
                        </button>
                    </Link>
                )}

                {user ? (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {/* Dashboard Button - Hidden when already on dashboard */}
                        {!isOnDashboard && (
                            <Link to={isSuperAdmin() ? '/superadmin/dashboard' : isAdmin() ? '/admin/dashboard' : '/user/dashboard'}>
                                <button className="btn btn-secondary">
                                    Dashboard
                                </button>
                            </Link>
                        )}

                        {/* User Avatar with Initials Only */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-lg)',
                            backgroundColor: 'var(--color-bg-light)'
                        }}>
                            <div style={{
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '1rem'
                            }}>
                                {getUserInitials()}
                            </div>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0 }}>
                                {getUserInitials()}
                            </p>
                        </div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary"
                            style={{
                                color: 'var(--color-error)',
                                borderColor: 'var(--color-error)'
                            }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login">
                            <button className="btn btn-secondary">
                                Login
                            </button>
                        </Link>
                        <Link to="/signup">
                            <button className="btn btn-primary">
                                Sign Up
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;
