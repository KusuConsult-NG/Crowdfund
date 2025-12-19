import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
    icon: React.ReactNode;
    label: string;
    path: string;
}

interface SidebarProps {
    menuItems: MenuItem[];
    userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, userRole = 'Admin' }) => {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div style={{
            width: '20rem',
            backgroundColor: 'var(--color-bg-sidebar)',
            minHeight: '100vh',
            padding: '1rem',
            borderRight: '1px solid var(--color-border)'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '700px',
                height: '100%'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{
                            fontSize: '1rem',
                            fontWeight: '500',
                            color: 'var(--color-text-primary)'
                        }}>ChurchFlow</h1>
                        <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-text-secondary)'
                        }}>{userRole}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {menuItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: 'var(--radius-lg)',
                                    backgroundColor: isActive(item.path) ? 'var(--color-bg-light)' : 'transparent',
                                    color: 'var(--color-text-primary)',
                                    textDecoration: 'none',
                                    transition: 'background-color 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive(item.path)) {
                                        e.currentTarget.style.backgroundColor = 'rgba(0, 102, 204, 0.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive(item.path)) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                <div style={{ width: '24px', height: '24px', color: isActive(item.path) ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                                    {item.icon}
                                </div>
                                <p style={{
                                    fontSize: '0.875rem',
                                    fontWeight: isActive(item.path) ? '600' : '500',
                                    color: isActive(item.path) ? 'var(--color-primary)' : 'var(--color-text-primary)'
                                }}>
                                    {item.label}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <Link
                        to="/help"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.5rem 0.75rem',
                            color: 'var(--color-text-primary)',
                            textDecoration: 'none',
                            borderRadius: 'var(--radius-lg)',
                            transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 102, 204, 0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                        </svg>
                        <p style={{ fontSize: '0.875rem', fontWeight: '500' }}>Help and Docs</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
