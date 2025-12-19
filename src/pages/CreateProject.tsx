import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { projectService } from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';

const CreateProject: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [fundingGoal, setFundingGoal] = useState('');
    const [duration, setDuration] = useState('');
    const [location, setLocation] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePublish = async () => {
        if (!user) {
            setError('You must be logged in to create a project');
            return;
        }

        if (!projectName || !description || !category || !fundingGoal || !duration) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + parseInt(duration));

            await projectService.createProject({
                name: projectName,
                description,
                category,
                fundingGoal: parseInt(fundingGoal),
                organizerId: user.$id,
                location,
                endDate: endDate.toISOString(),
                status: 'pending'
            }, imageFile || undefined);

            navigate('/admin/dashboard');
        } catch (err: any) {
            console.error('Error creating project:', err);
            setError(err.message || 'Failed to create project. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-white)' }}>
            <Navbar showCreateButton={false} />

            <main style={{ paddingTop: '80px', padding: '5rem 10rem 1.25rem' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {error && (
                        <div style={{
                            padding: '1rem',
                            backgroundColor: 'var(--color-error-light)',
                            color: 'var(--color-error)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: '1rem',
                            fontSize: '0.875rem'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Progress Indicator */}
                    <div style={{ padding: '1rem 0 2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            {[1, 2].map((s) => (
                                <div key={s} style={{
                                    flex: 1,
                                    height: '4px',
                                    backgroundColor: s <= step ? 'var(--color-primary)' : 'var(--color-border)',
                                    marginRight: s < 2 ? '0.5rem' : 0,
                                    borderRadius: 'var(--radius-full)',
                                    transition: 'background-color 0.3s ease'
                                }}></div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: step >= 1 ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                            }}>Basic Info</span>
                            <span style={{
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: step >= 2 ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                            }}>Details</span>
                        </div>
                    </div>

                    <h2 style={{ fontSize: '2rem', fontWeight: '700', padding: '1rem 0', color: 'var(--color-text-primary)' }}>
                        {step === 1 && 'Create Your Project'}
                        {step === 2 && 'Project Details'}
                    </h2>

                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                        <div>
                            <div style={{ padding: '0.75rem 0' }}>
                                <label>
                                    <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                        Project Name *
                                    </p>
                                    <input
                                        type="text"
                                        placeholder="Give your project a clear, memorable name"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        disabled={loading}
                                    />
                                </label>
                            </div>

                            <div style={{ padding: '0.75rem 0' }}>
                                <label>
                                    <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                        Project Description *
                                    </p>
                                    <textarea
                                        placeholder="Describe your project, its goals, and why it matters..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        style={{ minHeight: '150px' }}
                                        disabled={loading}
                                    />
                                </label>
                            </div>

                            <div style={{ padding: '0.75rem 0' }}>
                                <label>
                                    <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                        Category *
                                    </p>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        disabled={loading}
                                    >
                                        <option value="">Select a category</option>
                                        <option value="building">Building Projects</option>
                                        <option value="outreach">Community Outreach</option>
                                        <option value="mission">Mission Trips</option>
                                        <option value="equipment">Equipment Upgrade</option>
                                        <option value="education">Education & Training</option>
                                        <option value="other">Other</option>
                                    </select>
                                </label>
                            </div>

                            <div style={{ padding: '0.75rem 0' }}>
                                <label>
                                    <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                        Funding Goal (USD) *
                                    </p>
                                    <input
                                        type="number"
                                        placeholder="10000"
                                        value={fundingGoal}
                                        onChange={(e) => setFundingGoal(e.target.value)}
                                        disabled={loading}
                                    />
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Details */}
                    {step === 2 && (
                        <div>
                            <div style={{ padding: '0.75rem 0' }}>
                                <label>
                                    <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                        Campaign Duration *
                                    </p>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        disabled={loading}
                                    >
                                        <option value="">Select duration</option>
                                        <option value="30">30 days</option>
                                        <option value="45">45 days</option>
                                        <option value="60">60 days</option>
                                        <option value="90">90 days</option>
                                    </select>
                                </label>
                            </div>

                            <div style={{ padding: '0.75rem 0' }}>
                                <label>
                                    <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                        Project Location
                                    </p>
                                    <input
                                        type="text"
                                        placeholder="City, State"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        disabled={loading}
                                    />
                                </label>
                            </div>

                            <div style={{ padding: '0.75rem 0' }}>
                                <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                    Project Image
                                </p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                />
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: '2px dashed var(--color-border)',
                                        borderRadius: 'var(--radius-lg)',
                                        padding: '1.5rem',
                                        textAlign: 'center',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s ease',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        minHeight: '200px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseEnter={(e) => !loading && (e.currentTarget.style.borderColor = 'var(--color-primary)')}
                                    onMouseLeave={(e) => !loading && (e.currentTarget.style.borderColor = 'var(--color-border)')}
                                >
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                zIndex: 1
                                            }}
                                        />
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="var(--color-text-secondary)" viewBox="0 0 256 256" style={{ marginBottom: '1rem' }}>
                                                <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V158.75l-26.07-26.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L40,149.37V56ZM40,172l52-52,80,80H40Zm176,28H194.63l-36-36,20-20L216,181.38V200ZM144,100a12,12,0,1,1,12,12A12,12,0,0,1,144,100Z" />
                                            </svg>
                                            <p style={{ color: 'var(--color-text-primary)', fontWeight: '500', marginBottom: '0.5rem' }}>
                                                Click to upload project image
                                            </p>
                                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                                                PNG, JPG up to 10MB
                                            </p>
                                        </>
                                    )}
                                    {imagePreview && !loading && (
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            right: '10px',
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            zIndex: 2
                                        }}>
                                            Change Image
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', gap: '1rem', padding: '2rem 0', justifyContent: 'space-between' }}>
                        {step > 1 && (
                            <button
                                className="btn btn-secondary"
                                onClick={() => setStep(step - 1)}
                                style={{ minWidth: '120px' }}
                                disabled={loading}
                            >
                                Previous
                            </button>
                        )}
                        <div style={{ flex: 1 }}></div>
                        {step < 2 ? (
                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    if (!projectName || !description || !category || !fundingGoal) {
                                        setError('Please fill in all required fields');
                                        return;
                                    }
                                    setError(null);
                                    setStep(step + 1);
                                }}
                                style={{ minWidth: '120px' }}
                                disabled={loading}
                            >
                                Next
                            </button>
                        ) : (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Link to="/admin/dashboard">
                                    <button
                                        className="btn btn-secondary"
                                        style={{ minWidth: '120px' }}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </Link>
                                <button
                                    className="btn btn-primary"
                                    onClick={handlePublish}
                                    style={{ minWidth: '120px' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Publishing...' : 'Publish Project'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreateProject;
