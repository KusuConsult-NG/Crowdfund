import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { projectService } from '../services/projectService';
import { donationService } from '../services/donationService';
import { useAuth } from '../contexts/AuthContext';
import { Project } from '../types';
import { usePaystackPayment } from 'react-paystack';
import { emailService } from '../services/emailService';

const PledgeProject: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [project, setProject] = useState<(Project & { $id: string }) | null>(null);
    const [pledgeAmount, setPledgeAmount] = useState('');
    const [message, setMessage] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: user?.email || '',
        amount: parseFloat(pledgeAmount) * 100, // Paystack uses kobo/cents
        publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '',
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
        metadata: {
            custom_fields: [
                {
                    display_name: "Project",
                    variable_name: "project_id",
                    value: id || ''
                },
                {
                    display_name: "Donor",
                    variable_name: "user_id",
                    value: user?.$id || ''
                },
                {
                    display_name: "Project Name",
                    variable_name: "project_name",
                    value: project?.name || ''
                }
            ]
        }
    };

    const initializePayment = usePaystackPayment(paystackConfig);

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data = await projectService.getProject(id);
                setProject(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching project:', err);
                setError('Project not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleSuccess = async (reference: any) => {
        setSubmitting(true);
        try {
            if (!id || !user) return;

            // Step 1: Record the donation in our database
            // This creates a permanent record of the contribution
            await donationService.createDonation({
                projectId: id,
                userId: user.$id,
                userName: user.name,
                amount: parseFloat(pledgeAmount),
                message: message || undefined,
                anonymous
            });

            // Step 2: Update the project's raised amount
            // This helps track progress towards the funding goal
            await projectService.incrementRaisedAmount(id, parseFloat(pledgeAmount));

            // Step 3: Send a thank you email with receipt
            // We do this async so it doesn't block the user experience
            try {
                emailService.sendDonationReceipt({
                    to: user.email,
                    donorName: user.name,
                    projectName: project?.name || 'the project',
                    amount: parseFloat(pledgeAmount),
                    currency: '₦'
                });
            } catch (emailErr) {
                // Email sending failed, but that's ok - log it and continue
                console.warn('Failed to send receipt email:', emailErr);
            }

            // Success! Redirect user to their dashboard
            navigate('/user/dashboard');
        } catch (err: any) {
            console.error('Error after payment success:', err);
            setError('Payment successful but failed to update records. Please contact support with reference: ' + reference.reference);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setSubmitting(false);
        console.log('Payment closed');
    };

    const handlePledge = () => {
        if (!user) {
            setError('You must be logged in to support a project.');
            return;
        }

        if (!id || !pledgeAmount || parseFloat(pledgeAmount) <= 0) {
            setError('Please enter a valid amount.');
            return;
        }

        setSubmitting(true);
        setError(null);

        // @ts-ignore
        initializePayment({ onSuccess: handleSuccess, onClose: handleClose });
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-light)' }}>
                <Navbar />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Loading project details...</p>
                </div>
            </div>
        );
    }

    if (error && !project) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-light)' }}>
                <Navbar />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <p style={{ color: 'var(--color-error)', marginBottom: '1.5rem' }}>{error}</p>
                    <Link to="/discover">
                        <button className="btn btn-primary">Back to Discovery</button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-light)' }}>
            <Navbar />

            {/* Main Content */}
            <main style={{ padding: '3rem 2rem', marginTop: '60px' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    {error && (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: 'var(--color-error-light)',
                            color: 'var(--color-error)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1.5rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        {/* Left Column - Pledge Form */}
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                Support This Project
                            </h2>
                            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                                Your support makes a difference. Choose your contribution amount below.
                            </p>

                            {/* Quick Amount Buttons */}
                            <div style={{ marginBottom: '2rem' }}>
                                <p style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
                                    Quick Select Amount
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                                    {[25, 50, 100, 250].map((amount) => (
                                        <button
                                            key={amount}
                                            onClick={() => setPledgeAmount(amount.toString())}
                                            className="btn btn-secondary"
                                            style={{
                                                backgroundColor: pledgeAmount === amount.toString() ? 'var(--color-primary)' : undefined,
                                                color: pledgeAmount === amount.toString() ? 'white' : undefined
                                            }}
                                            disabled={submitting}
                                        >
                                            ₦{amount}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom Amount */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label>
                                    <p style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                        Or Enter Custom Amount
                                    </p>
                                    <input
                                        type="number"
                                        placeholder="Enter amount in Naira"
                                        value={pledgeAmount}
                                        onChange={(e) => setPledgeAmount(e.target.value)}
                                        style={{ fontSize: '1.25rem', fontWeight: '600' }}
                                        disabled={submitting}
                                    />
                                </label>
                            </div>

                            {/* Personal Message */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label>
                                    <p style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                        Leave a Message (Optional)
                                    </p>
                                    <textarea
                                        placeholder="Share why you're supporting this project..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        style={{ minHeight: '100px' }}
                                        disabled={submitting}
                                    />
                                </label>
                            </div>

                            {/* Anonymous Option */}
                            <div style={{ marginBottom: '2rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                    <input
                                        type="checkbox"
                                        checked={anonymous}
                                        onChange={(e) => setAnonymous(e.target.checked)}
                                        style={{ width: '1.25rem', height: '1.25rem' }}
                                        disabled={submitting}
                                    />
                                    <span style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                                        Make my contribution anonymous
                                    </span>
                                </label>
                            </div>

                            {/* Supported Payment Methods */}
                            <div style={{
                                marginBottom: '1.5rem',
                                padding: '1rem',
                                backgroundColor: 'var(--color-bg-white)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--color-border)'
                            }}>
                                <p style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    marginBottom: '0.75rem',
                                    color: 'var(--color-text-primary)'
                                }}>
                                    We Accept:
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {['Card', 'Bank Transfer', 'USSD', 'Opay', 'Mobile Money', 'QR Code'].map((method) => (
                                        <span
                                            key={method}
                                            style={{
                                                padding: '0.375rem 0.75rem',
                                                backgroundColor: 'var(--color-primary-light)',
                                                color: 'var(--color-primary)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.75rem',
                                                fontWeight: '600'
                                            }}
                                        >
                                            {method}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                className="btn btn-primary"
                                onClick={handlePledge}
                                disabled={submitting || !pledgeAmount || parseFloat(pledgeAmount) <= 0}
                                style={{
                                    width: '100%',
                                    fontSize: '1.125rem',
                                    padding: '1rem',
                                    opacity: (submitting || !pledgeAmount || parseFloat(pledgeAmount) <= 0) ? 0.5 : 1,
                                    cursor: (submitting || !pledgeAmount || parseFloat(pledgeAmount) <= 0) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {submitting ? 'Processing...' : 'Complete Contribution'}
                            </button>

                            <p style={{
                                fontSize: '0.875rem',
                                color: 'var(--color-text-secondary)',
                                textAlign: 'center',
                                marginTop: '1rem'
                            }}>
                                Secure payment processing. Your donation is tax-deductible.
                            </p>
                        </div>

                        {/* Right Column - Project Summary */}
                        {project && (
                            <div>
                                <div className="card" style={{ position: 'sticky', top: '80px' }}>
                                    <div style={{
                                        width: '100%',
                                        height: '150px',
                                        borderRadius: 'var(--radius-lg)',
                                        backgroundImage: `url(${project.imageUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400'})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundColor: 'var(--color-bg-light)',
                                        marginBottom: '1rem'
                                    }}></div>

                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>
                                        {project.name}
                                    </h3>

                                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Your pledge:</span>
                                            <span style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                                                ₦{pledgeAmount || '0'}
                                            </span>
                                        </div>

                                    </div>

                                    <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(34, 139, 34, 0.1)', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="var(--color-success)" viewBox="0 0 256 256">
                                                <path d="M208,40H48A16,16,0,0,0,32,56v58.77c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm-34.34,69.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32Z" />
                                            </svg>
                                            <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-success)' }}>
                                                Secure & Protected
                                            </p>
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                            All donations are processed securely and your information is protected.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PledgeProject;
