import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import Navbar from '../components/Navbar';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Reset any previous messages
        setError('');
        setSuccess(false);

        // Basic email validation
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        // Check if email format is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);

        try {
            await authService.sendPasswordRecovery(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send password recovery email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-white)' }}>
            <Navbar />

            <main style={{ paddingTop: '5rem', paddingBottom: '1.25rem', display: 'flex', justifyContent: 'center' }} className="px-responsive">
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

                    {!success ? (
                        <>
                            <p style={{
                                fontSize: '1rem',
                                padding: '0.25rem 1rem 0.75rem',
                                textAlign: 'center',
                                color: 'var(--color-text-primary)'
                            }}>
                                Enter your registered email address to receive a password reset link.
                            </p>

                            {error && (
                                <div style={{
                                    padding: '0.75rem 1rem',
                                    marginBottom: '0.5rem',
                                    backgroundColor: '#FEE2E2',
                                    border: '1px solid var(--color-error)',
                                    borderRadius: 'var(--radius-lg)',
                                    color: 'var(--color-error)',
                                    fontSize: '0.875rem',
                                    maxWidth: '480px',
                                    margin: '0 auto 0.5rem'
                                }}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div style={{ maxWidth: '480px', padding: '0.75rem 1rem' }}>
                                    <label style={{ display: 'flex', flexDirection: 'column', minWidth: '10rem', flex: 1 }}>
                                        <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                            Email Address
                                        </p>
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={loading}
                                        />
                                    </label>
                                </div>

                                <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'center' }}>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{ width: '100%', maxWidth: '480px' }}
                                        disabled={loading}
                                    >
                                        {loading ? 'Sending...' : 'Send Reset Link'}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div style={{
                            padding: '1.5rem 1rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                padding: '0.75rem 1rem',
                                marginBottom: '1rem',
                                backgroundColor: '#D1FAE5',
                                border: '1px solid #10B981',
                                borderRadius: 'var(--radius-lg)',
                                color: '#065F46',
                                fontSize: '0.875rem',
                                maxWidth: '480px',
                                margin: '0 auto 1rem'
                            }}>
                                <strong>Email Sent Successfully!</strong>
                                <p style={{ marginTop: '0.5rem' }}>
                                    We've sent a password reset link to <strong>{email}</strong>.
                                    Please check your inbox and follow the instructions to reset your password.
                                </p>
                            </div>

                            <p style={{
                                fontSize: '0.875rem',
                                color: 'var(--color-text-secondary)',
                                marginTop: '1rem'
                            }}>
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                        </div>
                    )}

                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        padding: '0.25rem 1rem 0.75rem',
                        textAlign: 'center'
                    }}>
                        <Link to="/login" style={{ textDecoration: 'underline' }}>
                            Remember your password? Go back to Login
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ForgotPassword;
