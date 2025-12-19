import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ForgotPassword: React.FC = () => {
    const [emailOrPhone, setEmailOrPhone] = useState('');

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
                        Forgot Password
                    </h2>

                    <p style={{
                        fontSize: '1rem',
                        padding: '0.25rem 1rem 0.75rem',
                        textAlign: 'center',
                        color: 'var(--color-text-primary)'
                    }}>
                        Enter your registered email address or phone number to receive a password reset link or code.
                    </p>

                    <div style={{ maxWidth: '480px', padding: '0.75rem 1rem' }}>
                        <label style={{ display: 'flex', flexDirection: 'column', minWidth: '10rem', flex: 1 }}>
                            <input
                                type="text"
                                placeholder="Email or Phone"
                                value={emailOrPhone}
                                onChange={(e) => setEmailOrPhone(e.target.value)}
                            />
                        </label>
                    </div>

                    <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'center' }}>
                        <button className="btn btn-primary">
                            Submit
                        </button>
                    </div>

                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        padding: '0.25rem 1rem 0.75rem',
                        textAlign: 'center'
                    }}>
                        <Link to="/admin/dashboard" style={{ textDecoration: 'underline' }}>
                            Remember your password? Go back to Login
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;
