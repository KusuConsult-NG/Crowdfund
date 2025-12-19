import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
    showCreateButton?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showCreateButton = true }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
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
            <Link to="/" style={{ textDecoration: 'none' }}>
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
                {showCreateButton && (
                    <Link to="/create-project">
                        <button className="btn btn-primary" style={{ minWidth: '160px' }}>
                            + Create New Project
                        </button>
                    </Link>
                )}

                {user ? (
                    <div style={{ position: 'relative' }}>
                        <div
                            onClick={() => setShowDropdown(!showDropdown)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                cursor: 'pointer',
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-lg)',
                                transition: 'background-color 0.2s',
                                backgroundColor: showDropdown ? 'var(--color-bg-light)' : 'transparent'
                            }}
                        >
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
                                {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                                    {user.name || 'User'}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        {showDropdown && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '0.5rem',
                                backgroundColor: 'white',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                minWidth: '200px',
                                zIndex: 1000
                            }}>
                                <Link
                                    to="/user/dashboard"
                                    onClick={() => setShowDropdown(false)}
                                    style={{
                                        display: 'block',
                                        padding: '0.75rem 1rem',
                                        color: 'var(--color-text-primary)',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        borderBottom: '1px solid var(--color-border)'
                                    }}
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        border: 'none',
                                        background: 'none',
                                        color: 'var(--color-error)',
                                        textAlign: 'left',
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
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
