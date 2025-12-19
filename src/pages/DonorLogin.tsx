import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const DonorLogin: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        setLoading(true);

        try {
            await login(email, password);
            // Redirect to user dashboard after successful login
            navigate('/user/dashboard');
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-white)' }}>
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
                        Welcome Back
                    </h2>

                    <p style={{
                        fontSize: '1rem',
                        padding: '0.25rem 1rem 0.75rem',
                        textAlign: 'center',
                        color: 'var(--color-text-secondary)'
                    }}>
                        Sign in to continue supporting church projects
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
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                            </label>
                        </div>

                        <div style={{ maxWidth: '480px', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    style={{ width: '1rem', height: '1rem' }}
                                />
                                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>Remember me</span>
                            </label>
                            <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: '500' }}>
                                Forgot password?
                            </Link>
                        </div>

                        <div style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'center' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ width: '100%', maxWidth: '480px' }}
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-secondary)',
                        padding: '0.25rem 1rem 0.75rem',
                        textAlign: 'center'
                    }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                            Create Account
                        </Link>
                    </p>

                    <div style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ position: 'relative', marginBottom: '1rem' }}>
                            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
                            <span style={{
                                position: 'relative',
                                backgroundColor: 'white',
                                padding: '0 1rem',
                                fontSize: '0.875rem',
                                color: 'var(--color-text-secondary)'
                            }}>
                                Or continue with
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }}>
                                Google
                            </button>
                            <button className="btn btn-secondary" style={{ flex: 1 }}>
                                Facebook
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DonorLogin;
