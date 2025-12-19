import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SetNewPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-white)' }}>
            <Navbar />

            <main style={{ paddingTop: '80px', padding: '5rem 10rem 1.25rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ maxWidth: '512px', width: '100%', padding: '1.25rem 0' }}>
                    <h2 style={{
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        padding: '1rem',
                        textAlign: 'center',
                        color: 'var(--color-text-primary)'
                    }}>
                        Set New Password
                    </h2>

                    <div style={{ maxWidth: '480px', padding: '0.75rem 1rem' }}>
                        <label style={{ display: 'flex', flexDirection: 'column', minWidth: '10rem', flex: 1 }}>
                            <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                New Password
                            </p>
                            <input
                                type="password"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </label>
                    </div>

                    <div style={{ maxWidth: '480px', padding: '0.75rem 1rem' }}>
                        <label style={{ display: 'flex', flexDirection: 'column', minWidth: '10rem', flex: 1 }}>
                            <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                Confirm New Password
                            </p>
                            <input
                                type="password"
                                placeholder="Confirm your new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </label>
                    </div>

                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        padding: '0.25rem 1rem 0.75rem'
                    }}>
                        Password must contain at least 8 characters, including one letter, one number, and one special character.
                    </p>

                    <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'center' }}>
                        <button className="btn btn-primary">
                            Reset Password
                        </button>
                    </div>

                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        padding: '0.25rem 1rem 0.75rem',
                        textAlign: 'center'
                    }}>
                        <Link to="/admin/dashboard" style={{ textDecoration: 'underline' }}>
                            Remember your password? Go back to login
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default SetNewPassword;
