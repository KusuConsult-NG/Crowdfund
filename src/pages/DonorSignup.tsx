import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const DonorSignup: React.FC = () => {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!fullName || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            await signup(email, password, fullName);
            // Redirect to user dashboard after successful signup
            navigate('/user/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-light)' }}>
            <Navbar />

            {/* Main Content */}
            <main style={{ padding: '5rem 10rem 1.25rem', display: 'flex', justifyContent: 'center' }}>
                <div style={{ maxWidth: '512px', width: '100%', padding: '1.25rem 0' }}>
                    <h2 style={{
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        padding: '1rem',
                        textAlign: 'center',
                        color: 'var(--color-text-primary)'
                    }}>
                        Create Your Donor Account
                    </h2>

                    <p style={{
                        fontSize: '1rem',
                        padding: '0.25rem 1rem 0.75rem',
                        textAlign: 'center',
                        color: 'var(--color-text-primary)'
                    }}>
                        Join ChurchFlow to support meaningful church projects and make a difference in your community.
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
                            <label>
                                <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                    Full Name
                                </p>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    disabled={loading}
                                />
                            </label>
                        </div>

                        <div style={{ maxWidth: '480px', padding: '0.75rem 1rem' }}>
                            <label>
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

                        <div style={{ maxWidth: '480px', padding: '0.75rem 1rem' }}>
                            <label>
                                <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                    Password
                                </p>
                                <input
                                    type="password"
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </label>
                        </div>

                        <div style={{ maxWidth: '480px', padding: '0.75rem 1rem' }}>
                            <label>
                                <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                    Confirm Password
                                </p>
                                <input
                                    type="password"
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </label>
                        </div>

                        <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-text-secondary)',
                            padding: '0.25rem 1rem 0.75rem'
                        }}>
                            By creating an account, you agree to our Terms of Service and Privacy Policy.
                        </p>

                        <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'center' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', maxWidth: '480px' }}
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        padding: '0.25rem 1rem 0.75rem',
                        textAlign: 'center'
                    }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                            Sign In
                        </Link>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default DonorSignup;
