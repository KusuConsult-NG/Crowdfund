import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { projectService } from '../services/projectService';
import { userService } from '../services/userService';
import { Project } from '../types';

const SuperAdminDashboard: React.FC = () => {
    const [projects, setProjects] = useState<(Project & { $id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalDonors: 0,
        totalFundsRaised: 0,
        activeProjects: 0,
        topProject: { name: 'N/A', raised: 0 }
    });

    const fetchPlatformStats = async () => {
        setLoading(true);
        try {
            // Fetch all projects
            const projectRes = await projectService.getProjects(100);
            const userRes = await userService.listUsers(1); // Just to get the total count

            const totalFunds = projectRes.documents.reduce((sum, p) => sum + p.raised, 0);
            const active = projectRes.documents.filter(p => p.status === 'active').length;

            let top = { name: 'N/A', raised: 0 };
            if (projectRes.documents.length > 0) {
                const sorted = [...projectRes.documents].sort((a, b) => b.raised - a.raised);
                top = { name: sorted[0].name, raised: sorted[0].raised };
            }

            setProjects(projectRes.documents);
            setStats({
                totalProjects: projectRes.total,
                totalDonors: userRes.total,
                totalFundsRaised: totalFunds,
                activeProjects: active,
                topProject: top
            });
        } catch (err) {
            console.error('Error fetching platform stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlatformStats();
    }, []);

    const handleUpdateStatus = async (projectId: string, newStatus: Project['status']) => {
        try {
            await projectService.updateProject(projectId, { status: newStatus });
            setProjects(projects.map(p => p.$id === projectId ? { ...p, status: newStatus } : p));
        } catch (err) {
            console.error('Error updating project status:', err);
            alert('Failed to update project status.');
        }
    };

    const sidebarItems = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" /></svg>,
            label: 'Dashboard',
            path: '/superadmin/dashboard'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M208,40H48A16,16,0,0,0,32,56v58.77c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm-34.34,69.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32Z" /></svg>,
            label: 'Content Moderation',
            path: '/superadmin/moderation'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z" /></svg>,
            label: 'Users',
            path: '/superadmin/users'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z" /></svg>,
            label: 'Settings',
            path: '/superadmin/settings'
        }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-light)' }}>
            <Navbar />

            <div style={{ display: 'flex', width: '100%', marginTop: '60px' }}>
                <Sidebar menuItems={sidebarItems} userRole="Super Admin" />

                <main style={{ flex: 1, padding: '1.25rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ padding: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                    Super Admin Dashboard
                                </p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                    Comprehensive overview of platform performance and activity
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', padding: '1rem' }}>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Total Projects</p>
                                <p style={{ fontSize: '1.875rem', fontWeight: '700', margin: '0.5rem 0' }}>{stats.totalProjects}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: '600' }}>{stats.activeProjects} Active</p>
                            </div>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Total Funds Raised</p>
                                <p style={{ fontSize: '1.875rem', fontWeight: '700', margin: '0.5rem 0', color: 'var(--color-primary)' }}>
                                    ₦{stats.totalFundsRaised.toLocaleString()}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Avg. ₦{(stats.totalFundsRaised / (stats.totalProjects || 1)).toFixed(0)} / project</p>
                            </div>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Total users</p>
                                <p style={{ fontSize: '1.875rem', fontWeight: '700', margin: '0.5rem 0' }}>{stats.totalDonors}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Registered members</p>
                            </div>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Top Project</p>
                                <p style={{ fontSize: '1.125rem', fontWeight: '700', margin: '0.5rem 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {stats.topProject.name}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: '600' }}>₦{stats.topProject.raised.toLocaleString()} raised</p>
                            </div>
                        </div>

                        <h2 style={{ fontSize: '1.375rem', fontWeight: '700', padding: '1.25rem 1rem 0.75rem', color: 'var(--color-text-primary)' }}>
                            Platform Moderation
                        </h2>

                        <div style={{ padding: '0.75rem 1rem' }}>
                            <div className="table-container">
                                {loading ? (
                                    <p style={{ padding: '2rem', textAlign: 'center' }}>Loading platform data...</p>
                                ) : projects.length === 0 ? (
                                    <p style={{ padding: '2rem', textAlign: 'center' }}>No projects found on the platform.</p>
                                ) : (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Project Name</th>
                                                <th>Status</th>
                                                <th>Raised / Goal</th>
                                                <th style={{ textAlign: 'center' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projects.map((project) => {
                                                const percentage = Math.round((project.raised / project.fundingGoal) * 100);
                                                return (
                                                    <tr key={project.$id}>
                                                        <td style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>
                                                            {project.name}
                                                        </td>
                                                        <td>
                                                            <span className={`badge badge-${project.status === 'active' ? 'success' :
                                                                project.status === 'completed' ? 'info' :
                                                                    project.status === 'rejected' ? 'error' : 'warning'
                                                                }`}>
                                                                {project.status.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                                <div className="progress" style={{ width: '100px' }}>
                                                                    <div className="progress-bar" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                                                                </div>
                                                                <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{percentage}%</span>
                                                            </div>
                                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                                                                ₦{project.raised.toLocaleString()} / ₦{project.fundingGoal.toLocaleString()}
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                                {project.status !== 'active' && project.status !== 'completed' && (
                                                                    <button
                                                                        onClick={() => handleUpdateStatus(project.$id, 'active')}
                                                                        className="btn btn-primary"
                                                                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', height: 'auto' }}
                                                                    >
                                                                        Approve
                                                                    </button>
                                                                )}
                                                                {project.status === 'pending' && (
                                                                    <button
                                                                        onClick={() => handleUpdateStatus(project.$id, 'rejected')}
                                                                        className="btn btn-secondary"
                                                                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', height: 'auto', border: '1px solid var(--color-error)', color: 'var(--color-error)' }}
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                )}
                                                                {project.status === 'active' && (
                                                                    <button
                                                                        onClick={() => handleUpdateStatus(project.$id, 'completed')}
                                                                        className="btn btn-secondary"
                                                                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem', height: 'auto' }}
                                                                    >
                                                                        Mark Complete
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
