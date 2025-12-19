import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { projectService } from '../services/projectService';
import { updateService } from '../services/updateService';
import { Project, Update } from '../types';

const ContentModeration: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'projects' | 'updates'>('projects');
    const [projects, setProjects] = useState<(Project & { $id: string })[]>([]);
    const [updates, setUpdates] = useState<(Update & { $id: string })[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'projects') {
                const response = await projectService.getProjects(50);
                setProjects(response.documents);
            } else {
                const response = await updateService.getAllUpdates(50);
                setUpdates(response.documents);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleProjectStatus = async (projectId: string, status: Project['status']) => {
        try {
            await projectService.updateProject(projectId, { status });
            setProjects(projects.map(p => p.$id === projectId ? { ...p, status } : p));
        } catch (err) {
            console.error('Error updating project status:', err);
            alert('Failed to update status.');
        }
    };

    const handleDeleteUpdate = async (updateId: string) => {
        if (!window.confirm('Are you sure you want to delete this update? This action cannot be undone.')) return;
        try {
            await updateService.deleteUpdate(updateId);
            setUpdates(updates.filter(u => u.$id !== updateId));
        } catch (err) {
            console.error('Error deleting update:', err);
            alert('Failed to delete update.');
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
                    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                        <div style={{ padding: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                    Content Moderation
                                </p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                    Review and moderate content across the platform.
                                </p>
                            </div>
                        </div>

                        <div style={{ paddingBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', borderBottom: `1px solid var(--color-border-light)`, padding: '0 1rem', gap: '2rem' }}>
                                <button
                                    onClick={() => setActiveTab('projects')}
                                    style={{
                                        borderBottom: `3px solid ${activeTab === 'projects' ? 'var(--color-primary)' : 'transparent'}`,
                                        color: activeTab === 'projects' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                        padding: '1rem 0 0.8125rem',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '700'
                                    }}
                                >
                                    Projects
                                </button>
                                <button
                                    onClick={() => setActiveTab('updates')}
                                    style={{
                                        borderBottom: `3px solid ${activeTab === 'updates' ? 'var(--color-primary)' : 'transparent'}`,
                                        color: activeTab === 'updates' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                        padding: '1rem 0 0.8125rem',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '700'
                                    }}
                                >
                                    Project Updates
                                </button>
                            </div>
                        </div>

                        <div style={{ padding: '0.75rem 1rem' }}>
                            <div className="table-container">
                                {loading ? (
                                    <p style={{ padding: '2rem', textAlign: 'center' }}>Loading content...</p>
                                ) : activeTab === 'projects' ? (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Project Name</th>
                                                <th>Category</th>
                                                <th style={{ width: '10rem' }}>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projects.map((project) => (
                                                <tr key={project.$id}>
                                                    <td style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{project.name}</td>
                                                    <td style={{ fontSize: '0.875rem' }}>{project.category}</td>
                                                    <td>
                                                        <span className={`badge badge-${project.status === 'active' ? 'success' : project.status === 'pending' ? 'warning' : 'error'}`}>
                                                            {project.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ fontSize: '0.875rem' }}>
                                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                            {project.status !== 'active' && (
                                                                <button onClick={() => handleProjectStatus(project.$id, 'active')} style={{ color: 'var(--color-success)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Approve</button>
                                                            )}
                                                            {project.status !== 'rejected' && (
                                                                <button onClick={() => handleProjectStatus(project.$id, 'rejected')} style={{ color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Reject</button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Update Title</th>
                                                <th>Content Preview</th>
                                                <th>Posted On</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {updates.map((update) => (
                                                <tr key={update.$id}>
                                                    <td style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{update.title}</td>
                                                    <td style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', maxWidth: '200px' }}>
                                                        {update.content.length > 50 ? update.content.substring(0, 50) + '...' : update.content}
                                                    </td>
                                                    <td style={{ fontSize: '0.75rem' }}>{new Date(update.$createdAt).toLocaleDateString()}</td>
                                                    <td>
                                                        <button onClick={() => handleDeleteUpdate(update.$id)} style={{ color: 'var(--color-error)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
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

export default ContentModeration;
