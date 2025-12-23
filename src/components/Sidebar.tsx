import React, { useState, useEffect } from 'react';
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
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setIsOpen(false); // Close mobile menu on desktop
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isActive = (path: string) => location.pathname === path;

    const toggleSidebar = () => setIsOpen(!isOpen);

    const closeSidebar = () => {
        if (isMobile) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Mobile/Tablet Toggle Button */}
            {isMobile && (
                <button
                    onClick={toggleSidebar}
                    style={{
                        position: 'fixed',
                        bottom: '1.5rem',
                        right: '1.5rem',
                        width: '3.5rem',
                        height: '3.5rem',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        boxShadow: 'var(--shadow-lg)',
                        cursor: 'pointer',
                        zIndex: 999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    aria-label="Toggle sidebar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
                    </svg>
                </button>
            )}

            {/* Overlay for mobile */}
            {isMobile && isOpen && (
                <div
                    onClick={closeSidebar}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1001
                    }}
                />
            )}

            {/* Sidebar */}
            <div style={{
                position: isMobile ? 'fixed' : 'relative',
                left: isMobile ? (isOpen ? 0 : '-20rem') : 0,
                top: isMobile ? 0 : 'auto',
                width: '20rem',
                backgroundColor: 'var(--color-bg-sidebar)',
                minHeight: isMobile ? '100vh' : 'calc(100vh - 60px)',
                padding: '1rem',
                borderRight: '1px solid var(--color-border)',
                transition: 'left 0.3s ease',
                zIndex: isMobile ? 1002 : 'auto',
                overflowY: 'auto'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '700px',
                    height: '100%'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1.5rem' }}>
                        {/* Close button for mobile */}
                        {isMobile && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <h1 style={{
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        color: 'var(--color-text-primary)',
                                        margin: 0
                                    }}>ChurchFlow</h1>
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: 'var(--color-text-secondary)',
                                        margin: 0
                                    }}>{userRole}</p>
                                </div>
                                <button
                                    onClick={closeSidebar}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '0.25rem',
                                        color: 'var(--color-text-primary)'
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Desktop header */}
                        {!isMobile && (
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
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {menuItems.map((item, index) => (
                                <Link
                                    key={index}
                                    to={item.path}
                                    onClick={closeSidebar}
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
                            onClick={closeSidebar}
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
        </>
    );
};

export default Sidebar;
