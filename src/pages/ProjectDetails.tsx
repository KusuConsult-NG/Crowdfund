import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { projectService } from '../services/projectService';
import { updateService } from '../services/updateService';
import { donationService } from '../services/donationService';
import { Project, Update, Donation } from '../types';

const ProjectDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<'story' | 'updates' | 'backers'>('story');
    const [project, setProject] = useState<(Project & { $id: string }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [liveUpdates, setLiveUpdates] = useState<(Update & { $id: string })[]>([]);
    const [liveDonations, setLiveDonations] = useState<(Donation & { $id: string })[]>([]);

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

    useEffect(() => {
        const fetchUpdates = async () => {
            if (!id || activeTab !== 'updates') return;
            try {
                const response = await updateService.getProjectUpdates(id);
                setLiveUpdates(response.documents);
            } catch (err) {
                console.error('Error fetching updates:', err);
            }
        };

        const fetchDonations = async () => {
            if (!id || activeTab !== 'backers') return;
            try {
                const response = await donationService.getProjectDonations(id);
                setLiveDonations(response.documents);
            } catch (err) {
                console.error('Error fetching donations:', err);
            }
        };

        fetchUpdates();
        fetchDonations();
    }, [id, activeTab]);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-white)' }}>
                <Navbar />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Loading project details...</p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-white)' }}>
                <Navbar />
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <p style={{ color: 'var(--color-error)', marginBottom: '1.5rem' }}>{error || 'Project not found'}</p>
                    <Link to="/discover">
                        <button className="btn btn-primary">Back to Discovery</button>
                    </Link>
                </div>
            </div>
        );
    }

    const percentage = Math.round((project.raised / project.fundingGoal) * 100);
    const daysLeft = Math.ceil((new Date(project.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));


    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-white)' }}>
            <Navbar />

            {/* Main Content */}
            <main style={{ padding: '2rem 0', marginTop: '60px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        {/* Left Column */}
                        <div>
                            {/* Hero Image */}
                            <div style={{
                                width: '100%',
                                height: '400px',
                                borderRadius: 'var(--radius-xl)',
                                backgroundImage: `url(${project.imageUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800'})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundColor: 'var(--color-bg-light)',
                                marginBottom: '1.5rem'
                            }}></div>

                            {/* Tabs */}
                            <div style={{ borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    {['story', 'updates', 'backers'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab as typeof activeTab)}
                                            style={{
                                                padding: '1rem 0',
                                                border: 'none',
                                                background: 'none',
                                                fontSize: '0.875rem',
                                                fontWeight: '700',
                                                color: activeTab === tab ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                                                borderBottom: `3px solid ${activeTab === tab ? 'var(--color-primary)' : 'transparent'}`,
                                                cursor: 'pointer',
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'story' && (
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
                                        About This Project
                                    </h3>
                                    <p style={{ fontSize: '1rem', lineHeight: '1.75', color: 'var(--color-text-secondary)', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                                        {project.description}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'updates' && (
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>
                                        Project Updates
                                    </h3>
                                    {liveUpdates.length > 0 ? liveUpdates.map((update, index) => (
                                        <div key={index} className="card" style={{ marginBottom: '1rem' }}>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                                                {new Date(update.$createdAt).toLocaleDateString()}
                                            </p>
                                            <h4 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                                {update.title}
                                            </h4>
                                            <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
                                                {update.content}
                                            </p>
                                        </div>
                                    )) : (
                                        <p style={{ color: 'var(--color-text-secondary)' }}>No updates yet.</p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'backers' && (
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>
                                        Recent Backers
                                    </h3>
                                    {liveDonations.length > 0 ? liveDonations.map((donation) => (
                                        <div key={donation.$id} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '1rem',
                                            borderBottom: '1px solid var(--color-border)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'var(--color-primary)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: '600'
                                                }}>
                                                    {donation.anonymous ? 'A' : (donation.userId.charAt(0).toUpperCase())}
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
                                                        {donation.anonymous ? 'Anonymous Donor' : `Donor ${donation.userId.substring(0, 6)}...`}
                                                    </p>
                                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                                        {new Date(donation.$createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <p style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                                                ₦{donation.amount.toLocaleString()}
                                            </p>
                                        </div>
                                    )) : (
                                        <p style={{ color: 'var(--color-text-secondary)' }}>Be the first to support this project!</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Right Column - Pledge Card */}
                        <div>
                            <div className="card" style={{ position: 'sticky', top: '80px' }}>
                                <span className="badge badge-primary" style={{ marginBottom: '1rem', textTransform: 'capitalize' }}>
                                    {project.category}
                                </span>

                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--color-text-primary)' }}>
                                    {project.name}
                                </h2>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
                                        ₦{project.raised.toLocaleString()}
                                    </p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
                                        raised of ₦{project.fundingGoal.toLocaleString()} goal
                                    </p>

                                    <div className="progress" style={{ marginBottom: '1rem' }}>
                                        <div className="progress-bar" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                        <div>
                                            <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                                {liveDonations.length}
                                            </p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>backers</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                                {daysLeft > 0 ? daysLeft : 0}
                                            </p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>days left</p>
                                        </div>
                                    </div>
                                </div>

                                <Link to={`/project/${project.$id}/pledge`}>
                                    <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
                                        Support This Project
                                    </button>
                                </Link>

                                <button className="btn btn-secondary" style={{ width: '100%', marginBottom: '1.5rem' }}>
                                    Share Project
                                </button>

                                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem' }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                        Organized by
                                    </p>
                                    <p style={{ fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: '1rem' }}>
                                        User {project.organizerId.substring(0, 8)}...
                                    </p>

                                    <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                        Location
                                    </p>
                                    <p style={{ fontSize: '1rem', color: 'var(--color-text-primary)' }}>
                                        {project.location || 'Not specified'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProjectDetails;
