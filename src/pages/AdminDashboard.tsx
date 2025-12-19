import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { projectService } from '../services/projectService';
import { donationService } from '../services/donationService';
import { useAuth } from '../contexts/AuthContext';
import { Project, Donation } from '../types';
import { updateService } from '../services/updateService';

const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState<(Project & { $id: string })[]>([]);
    const [recentDonations, setRecentDonations] = useState<(Donation & { $id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [stats, setStats] = useState({
        totalRaised: 0,
        totalProjects: 0,
        activeProjects: 0,
        totalBackers: 0
    });
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedProjectForUpdate, setSelectedProjectForUpdate] = useState<string | null>(null);
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateContent, setUpdateContent] = useState('');
    const [postingUpdate, setPostingUpdate] = useState(false);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const projectRes = await projectService.getProjectsByOrganizer(user.$id);
            const myProjects = projectRes.documents;
            setProjects(myProjects);

            const projectIds = myProjects.map(p => p.$id);
            const donationRes = await donationService.getDonationsByProjects(projectIds, 10);
            setRecentDonations(donationRes.documents);

            // Calculate stats
            const totalRaised = myProjects.reduce((sum: number, p: Project) => sum + p.raised, 0);
            const active = myProjects.filter((p: Project) => p.status === 'active').length;

            // For total backers, we'd ideally need all donations, but for now we use unique userIds from recent if we don't have a better way
            // In a real app, we might have a counter or a more complex query. 
            // Let's just mock total backers for now or use the donationRes total if it matches.
            // Actually, let's just use a set of userIds if we fetch more, but listDocuments is limited.
            // For MVP, we'll show the donation total as "Backers" (though one person can back multiple times)
            const totalBackers = donationRes.total;

            setStats({
                totalRaised,
                totalProjects: projectRes.total,
                activeProjects: active,
                totalBackers
            });
        } catch (err) {
            console.error('Error fetching admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleDelete = async (projectId: string) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            await projectService.deleteProject(projectId);
            setProjects(projects.filter(p => p.$id !== projectId));
            fetchData();
        } catch (err) {
            console.error('Error deleting project:', err);
            alert('Failed to delete project. Please try again.');
        }
    };

    const handlePostUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProjectForUpdate || !updateTitle || !updateContent) return;

        setPostingUpdate(true);
        try {
            await updateService.createUpdate({
                projectId: selectedProjectForUpdate,
                title: updateTitle,
                content: updateContent
            });
            alert('Update posted successfully!');
            setIsUpdateModalOpen(false);
            setUpdateTitle('');
            setUpdateContent('');
        } catch (err) {
            console.error('Error posting update:', err);
            alert('Failed to post update.');
        } finally {
            setPostingUpdate(false);
        }
    };

    const openUpdateModal = (projectId: string) => {
        setSelectedProjectForUpdate(projectId);
        setIsUpdateModalOpen(true);
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const sidebarItems = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" /></svg>,
            label: 'Dashboard',
            path: '/admin/dashboard'
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" /></svg>,
            label: 'Create Project',
            path: '/projects/create'
        }
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-light)' }}>
            <Navbar showCreateButton={true} />

            <div style={{ display: 'flex', width: '100%', marginTop: '60px' }}>
                <Sidebar menuItems={sidebarItems} userRole="Organizer" />

                <main style={{ flex: 1, padding: '1.25rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '1.875rem', fontWeight: '700', padding: '1rem', color: 'var(--color-text-primary)' }}>
                            Welcome back, {user?.name || 'Organizer'}
                        </h2>

                        {/* Stats Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                            gap: '1rem',
                            padding: '1rem'
                        }}>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Total Raised</p>
                                <p style={{ fontSize: '1.875rem', fontWeight: '700', margin: '0.5rem 0', color: 'var(--color-primary)' }}>
                                    ${stats.totalRaised.toLocaleString()}
                                </p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Across all campaigns</p>
                            </div>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Total Projects</p>
                                <p style={{ fontSize: '1.875rem', fontWeight: '700', margin: '0.5rem 0' }}>{stats.totalProjects}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: '600' }}>{stats.activeProjects} Active</p>
                            </div>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>Total Backers</p>
                                <p style={{ fontSize: '1.875rem', fontWeight: '700', margin: '0.5rem 0' }}>{stats.totalBackers}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Unique contributions</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.375rem', fontWeight: '700', padding: '1rem 1rem 0.75rem', color: 'var(--color-text-primary)' }}>
                                    Your Projects
                                </h2>

                                {/* Search and Filter */}
                                <div style={{ display: 'flex', gap: '1rem', padding: '0.75rem 1rem', flexWrap: 'wrap' }}>
                                    <input
                                        type="text"
                                        placeholder="Search by name"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ height: '2.5rem', flex: 1 }}
                                    />
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        style={{ width: '10rem', height: '2.5rem' }}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                    </select>
                                </div>

                                <div style={{ padding: '0.75rem 1rem' }}>
                                    <div className="table-container">
                                        {loading ? (
                                            <p style={{ padding: '2rem', textAlign: 'center' }}>Loading projects...</p>
                                        ) : filteredProjects.length === 0 ? (
                                            <p style={{ padding: '2rem', textAlign: 'center' }}>No projects found.</p>
                                        ) : (
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Status</th>
                                                        <th>Goal</th>
                                                        <th style={{ textAlign: 'center' }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {filteredProjects.map((project) => (
                                                        <tr key={project.$id}>
                                                            <td style={{ fontWeight: '500' }}>{project.name}</td>
                                                            <td>
                                                                <span className={`badge badge-${project.status === 'active' ? 'success' :
                                                                    project.status === 'completed' ? 'info' : 'warning'
                                                                    }`}>
                                                                    {project.status.toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td>${project.fundingGoal.toLocaleString()}</td>
                                                            <td>
                                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                                                    <button onClick={() => openUpdateModal(project.$id)} title="Post Update" className="btn btn-secondary" style={{ padding: '0.4rem' }}>
                                                                        📝
                                                                    </button>
                                                                    <Link to={`/admin/projects/${project.$id}/contributions`} title="View Donors" className="btn btn-secondary" style={{ padding: '0.4rem' }}>
                                                                        👥
                                                                    </Link>
                                                                    <Link to={`/admin/projects/edit/${project.$id}`} title="Edit" className="btn btn-secondary" style={{ padding: '0.4rem' }}>
                                                                        ✏️
                                                                    </Link>
                                                                    <button onClick={() => handleDelete(project.$id)} title="Delete" className="btn btn-secondary" style={{ padding: '0.4rem', color: 'var(--color-error)' }}>
                                                                        🗑️
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 style={{ fontSize: '1.375rem', fontWeight: '700', padding: '1rem 1rem 0.75rem', color: 'var(--color-text-primary)' }}>
                                    Recent Contributions
                                </h2>
                                <div style={{ padding: '0.75rem 1rem' }}>
                                    <div className="card" style={{ padding: '1rem' }}>
                                        {recentDonations.length === 0 ? (
                                            <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>No recent donations.</p>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {recentDonations.map(donation => (
                                                    <div key={donation.$id} style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.75rem' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <p style={{ fontWeight: '600' }}>${donation.amount.toLocaleString()}</p>
                                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                                                {new Date(donation.$createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                                                            {donation.userName || 'Anonymous'}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Update Modal */}
            {isUpdateModalOpen && (
                <div className="modal-overlay">
                    <div className="card modal-content" style={{ maxWidth: '500px', width: '90%' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Post Project Update</h3>
                        <form onSubmit={handlePostUpdate}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={updateTitle}
                                    onChange={(e) => setUpdateTitle(e.target.value)}
                                    placeholder="e.g. Groundbreaking Ceremony"
                                />
                            </div>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label className="form-label">Content</label>
                                <textarea
                                    required
                                    value={updateContent}
                                    onChange={(e) => setUpdateContent(e.target.value)}
                                    placeholder="Share the good news..."
                                    style={{ minHeight: '150px' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setIsUpdateModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={postingUpdate}>
                                    {postingUpdate ? 'Posting...' : 'Post Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
