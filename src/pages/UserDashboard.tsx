import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { donationService } from '../services/donationService';
import { projectService } from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';
import { Donation, Project } from '../types';

const UserDashboard: React.FC = () => {
    const { user } = useAuth();
    const [contributions, setContributions] = useState<(Donation & { $id: string })[]>([]);
    const [recommendedProjects, setRecommendedProjects] = useState<(Project & { $id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalContributed: 0,
        projectsSupported: 0,
        impactScore: 0
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            setLoading(true);
            try {
                // Fetch user donations
                const donationsResponse = await donationService.getUserDonations(user.$id);
                setContributions(donationsResponse.documents);

                // Calculate stats
                const total = donationsResponse.documents.reduce((sum: number, d: Donation) => sum + d.amount, 0);
                const uniqueProjects = new Set(donationsResponse.documents.map((d: Donation) => d.projectId)).size;
                setStats({
                    totalContributed: total,
                    projectsSupported: uniqueProjects,
                    impactScore: Math.min(100, uniqueProjects * 10 + Math.floor(total / 100))
                });

                // Fetch recommended projects (just the latest ones for now)
                const projectsResponse = await projectService.getProjects(3);
                setRecommendedProjects(projectsResponse.documents);

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    const sidebarItems = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" /></svg>,
            label: 'Dashboard',
            path: '/user/dashboard'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M178.16,176H177a52,52,0,0,0-43-40,44,44,0,1,0-12,0,52,52,0,0,0-43,40h-1.17A19.16,19.16,0,0,0,58.64,194a4,4,0,0,0,4.85,3.89l73.65-15.34,73.65,15.34A4,4,0,0,0,216,194,19.16,19.16,0,0,0,178.16,176ZM88,112a32,32,0,1,1,32,32A32,32,0,0,1,88,112Zm92.61,64.62-52.61-11-52.61,11a36,36,0,0,1,62.1-32.33A36,36,0,0,1,180.61,176.62Z" /></svg>,
            label: 'My Contributions',
            path: '#'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm40-68a28,28,0,0,1-28,28h-4v8a8,8,0,0,1-16,0v-8H104a8,8,0,0,1,0-16h36a12,12,0,0,0,0-24H116a28,28,0,0,1,0-56h4V72a8,8,0,0,1,16,0v8h16a8,8,0,0,1,0,16H116a12,12,0,0,0,0,24h24A28,28,0,0,1,168,148Z" /></svg>,
            label: 'Saved Projects',
            path: '#'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M216,64H176V56a24,24,0,0,0-24-24H104A24,24,0,0,0,80,56v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V80h8a8,8,0,0,0,0-16ZM96,56a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,152H64V80H192Z" /></svg>,
            label: 'Transaction History',
            path: '#'
        }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-light)' }}>
            <Navbar />

            <div style={{ display: 'flex', width: '100%', marginTop: '60px' }}>
                <Sidebar menuItems={sidebarItems} userRole="Donor" />

                <main style={{ flex: 1, padding: '1.25rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ padding: '1rem' }}>
                            <div style={{ minWidth: '18rem' }}>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                    Welcome, {user?.name || 'Donor'}
                                </p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                    Track your contributions and impact
                                </p>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '1rem',
                            padding: '1rem'
                        }}>
                            <div className="stat-card">
                                <p className="stat-label">Total Contributed</p>
                                <p className="stat-value primary">${stats.totalContributed.toLocaleString()}</p>
                            </div>
                            <div className="stat-card">
                                <p className="stat-label">Projects Supported</p>
                                <p className="stat-value">{stats.projectsSupported}</p>
                            </div>
                            <div className="stat-card">
                                <p className="stat-label">Impact Score</p>
                                <p className="stat-value success">{stats.impactScore}</p>
                            </div>
                        </div>

                        <h2 style={{ fontSize: '1.375rem', fontWeight: '700', padding: '1.25rem 1rem 0.75rem', color: 'var(--color-text-primary)' }}>
                            Recent Contributions
                        </h2>

                        <div style={{ padding: '0.75rem 1rem' }}>
                            <div className="table-container">
                                {loading ? (
                                    <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading contributions...</p>
                                ) : contributions.length === 0 ? (
                                    <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>You haven't made any contributions yet.</p>
                                ) : (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Project ID</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contributions.map((contribution) => (
                                                <tr key={contribution.$id}>
                                                    <td style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>
                                                        {contribution.projectId.substring(0, 12)}...
                                                    </td>
                                                    <td>${contribution.amount.toLocaleString()}</td>
                                                    <td>{contribution.$createdAt ? new Date(contribution.$createdAt).toLocaleDateString() : 'N/A'}</td>
                                                    <td>
                                                        <span className={`badge badge-success`}>
                                                            {contribution.status || 'Completed'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Link to={`/project/${contribution.projectId}`} style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.875rem' }}>
                                                            View Project
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        <h2 style={{ fontSize: '1.375rem', fontWeight: '700', padding: '1.25rem 1rem 0.75rem', color: 'var(--color-text-primary)' }}>
                            Recommended Projects
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.5rem',
                            padding: '1rem'
                        }}>
                            {loading ? (
                                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading recommendations...</p>
                            ) : recommendedProjects.length === 0 ? (
                                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--color-text-secondary)' }}>No recommended projects at this time.</p>
                            ) : (
                                recommendedProjects.map((project) => {
                                    const percentage = Math.round((project.raised / project.fundingGoal) * 100);
                                    return (
                                        <Link to={`/project/${project.$id}`} key={project.$id} style={{ textDecoration: 'none' }}>
                                            <div className="card">
                                                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {project.name}
                                                </h3>
                                                <div className="progress" style={{ marginBottom: '0.75rem' }}>
                                                    <div className="progress-bar" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <p style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                                                            ${project.raised.toLocaleString()}
                                                        </p>
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                                            of ${project.fundingGoal.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <p style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                                            {percentage}%
                                                        </p>
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                                            funded
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserDashboard;
