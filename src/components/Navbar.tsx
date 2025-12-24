import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
    showCreateButton?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showCreateButton = true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAdmin, isSuperAdmin, isDonor, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            setMobileMenuOpen(false);
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

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--color-border)',
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--color-bg-white)',
                zIndex: 1000
            }}>
                {/* Desktop Navigation - Now on LEFT */}
                <div className="desktop-only" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
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

                {/* Mobile Hamburger Button - Now on LEFT */}
                <button
                    className="mobile-only tablet-only"
                    onClick={toggleMobileMenu}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2.5rem',
                        height: '2.5rem',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-text-primary)'
                    }}
                    aria-label="Toggle menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
                    </svg>
                </button>

                {/* Logo/Brand - Now on RIGHT */}
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
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`mobile-menu-overlay ${mobileMenuOpen ? 'open' : ''}`}
                onClick={toggleMobileMenu}
            />

            {/* Mobile Menu */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <div style={{ padding: '1rem' }}>
                    {/* Close Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)', margin: 0 }}>
                            Menu
                        </h3>
                        <button
                            onClick={toggleMobileMenu}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '2rem',
                                height: '2rem',
                                border: 'none',
                                background: 'none',
                                cursor: 'pointer',
                                color: 'var(--color-text-primary)'
                            }}
                            aria-label="Close menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                            </svg>
                        </button>
                    </div>

                    {user ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {/* User Info */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '1rem',
                                borderRadius: 'var(--radius-lg)',
                                backgroundColor: 'var(--color-bg-light)',
                                marginBottom: '0.5rem'
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
                                <div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0 }}>
                                        {user.name || user.email}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                                        {isSuperAdmin() ? 'Super Admin' : isAdmin() ? 'Admin' : 'Donor'}
                                    </p>
                                </div>
                            </div>

                            {canCreateProject && (
                                <Link to="/create-project" onClick={toggleMobileMenu}>
                                    <button className="btn btn-primary" style={{ width: '100%' }}>
                                        + Create New Project
                                    </button>
                                </Link>
                            )}

                            {!isOnDashboard && (
                                <Link to={isSuperAdmin() ? '/superadmin/dashboard' : isAdmin() ? '/admin/dashboard' : '/user/dashboard'} onClick={toggleMobileMenu}>
                                    <button className="btn btn-secondary" style={{ width: '100%' }}>
                                        Dashboard
                                    </button>
                                </Link>
                            )}

                            <button
                                onClick={handleLogout}
                                className="btn btn-secondary"
                                style={{
                                    width: '100%',
                                    color: 'var(--color-error)',
                                    borderColor: 'var(--color-error)'
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <Link to="/login" onClick={toggleMobileMenu}>
                                <button className="btn btn-secondary" style={{ width: '100%' }}>
                                    Login
                                </button>
                            </Link>
                            <Link to="/signup" onClick={toggleMobileMenu}>
                                <button className="btn btn-primary" style={{ width: '100%' }}>
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Navbar;
