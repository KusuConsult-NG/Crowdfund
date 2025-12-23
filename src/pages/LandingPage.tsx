import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-white)', display: 'flex', flexDirection: 'column' }}>
            {/* Navbar */}
            <nav style={{
                borderBottom: '1px solid var(--color-border)',
                backgroundColor: 'white',
                padding: '1rem'
            }} className="px-responsive">
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                        ChurchFlow
                    </h1>
                    <Link to="/login">
                        <button className="btn btn-secondary">Login</button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="p-responsive">
                <div style={{ maxWidth: '900px', textAlign: 'center', width: '100%' }}>
                    <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
                        Empower Your Church Community
                    </h1>
                    <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'var(--color-text-secondary)', marginBottom: 'clamp(2rem, 5vw, 3rem)', lineHeight: '1.8' }}>
                        Connect with meaningful projects, support your church's mission, and make a lasting impact in your community.
                    </p>

                    {/* CTA Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(1rem, 3vw, 2rem)', marginTop: 'clamp(2rem, 5vw, 3rem)' }}>
                        {/* Donor Card */}
                        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: 'var(--color-primary-light)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="var(--color-primary)" viewBox="0 0 256 256">
                                    <path d="M192,124a8,8,0,0,1-8,8H136v16h48a8,8,0,0,1,0,16H136v20a8,8,0,0,1-16,0V164H72a8,8,0,0,1,0-16h48V132H72a8,8,0,0,1,0-16h48V96a8,8,0,0,1,16,0v20h48A8,8,0,0,1,192,124Zm40,4A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
                                I Want to Donate
                            </h3>
                            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                                Support church projects and make a difference in your community
                            </p>
                            <Link to="/signup/donor">
                                <button className="btn btn-primary" style={{ width: '100%' }}>
                                    Sign Up as Donor
                                </button>
                            </Link>
                        </div>

                        {/* Admin Card */}
                        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                backgroundColor: 'var(--color-secondary-light)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="var(--color-secondary)" viewBox="0 0 256 256">
                                    <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
                                </svg>
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
                                I'm a Church Admin
                            </h3>
                            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
                                Create and manage church projects, track donations, and engage donors
                            </p>
                            <Link to="/signup/admin">
                                <button className="btn btn-secondary" style={{ width: '100%' }}>
                                    Sign Up as Admin
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Browse Projects Link */}
                    <div style={{ marginTop: '3rem' }}>
                        <Link to="/discover" style={{ color: 'var(--color-primary)', fontSize: '1rem', fontWeight: '600', textDecoration: 'underline' }}>
                            Browse Projects Without Signing Up →
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--color-border)', padding: '1.5rem 1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                    © 2024 ChurchFlow. All rights reserved.
                </p>
            </footer>
        </div>
    );
};

export default LandingPage;
