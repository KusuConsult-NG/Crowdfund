import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import Navbar from '../components/Navbar';

const SetNewPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [userId, setUserId] = useState('');
    const [secret, setSecret] = useState('');

    useEffect(() => {
        // Extract userId and secret from URL parameters
        const userIdParam = searchParams.get('userId');
        const secretParam = searchParams.get('secret');

        if (!userIdParam || !secretParam) {
            setError('Invalid password reset link. Please request a new one.');
        } else {
            setUserId(userIdParam);
            setSecret(secretParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!newPassword || !confirmPassword) {
            setError('Please enter and confirm your new password');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!userId || !secret) {
            setError('Invalid password reset link. Please request a new one.');
            return;
        }

        setLoading(true);

        try {
            await authService.completePasswordRecovery(userId, secret, newPassword);
            setSuccess(true);

            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

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

                    {!success ? (
                        <>
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
                                            New Password
                                        </p>
                                        <input
                                            type="password"
                                            placeholder="Enter your new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            disabled={loading || !userId || !secret}
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
                                            disabled={loading || !userId || !secret}
                                        />
                                    </label>
                                </div>

                                <p style={{
                                    fontSize: '0.875rem',
                                    color: 'var(--color-text-secondary)',
                                    padding: '0.25rem 1rem 0.75rem'
                                }}>
                                    Password must contain at least 8 characters.
                                </p>

                                <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'center' }}>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        style={{ width: '100%', maxWidth: '480px' }}
                                        disabled={loading || !userId || !secret}
                                    >
                                        {loading ? 'Resetting Password...' : 'Reset Password'}
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
                                <strong>Password Reset Successful!</strong>
                                <p style={{ marginTop: '0.5rem' }}>
                                    Your password has been updated successfully. Redirecting to login...
                                </p>
                            </div>
                        </div>
                    )}

                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        padding: '0.25rem 1rem 0.75rem',
                        textAlign: 'center'
                    }}>
                        <Link to="/login" style={{ textDecoration: 'underline' }}>
                            Remember your password? Go back to login
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default SetNewPassword;
