import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { donationService } from '../services/donationService';
import { projectService } from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';
import { Donation, Project } from '../types';

const MyDonations: React.FC = () => {
    const { user } = useAuth();
    const [donations, setDonations] = useState<(Donation & { $id: string; project?: Project })[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchDonations = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const donationsResponse = await donationService.getUserDonations(user.$id);

                // Fetch project details for each donation
                const donationsWithProjects = await Promise.all(
                    donationsResponse.documents.map(async (donation: Donation & { $id: string }) => {
                        try {
                            const project = await projectService.getProject(donation.projectId);
                            return { ...donation, project };
                        } catch {
                            return donation;
                        }
                    })
                );

                setDonations(donationsWithProjects);
            } catch (err) {
                console.error('Error fetching donations:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();
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
            path: '/user/donations'
        }
    ];

    const filteredDonations = donations.filter(donation =>
        donation.project?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.amount.toString().includes(searchTerm)
    );

    const totalContributed = donations.reduce((sum, d) => sum + d.amount, 0);
    const projectsSupported = new Set(donations.map(d => d.projectId)).size;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-light)' }}>
            <Navbar />

            <div style={{ display: 'flex', width: '100%', marginTop: '60px' }}>
                <Sidebar menuItems={sidebarItems} userRole="Donor" />

                <main style={{ flex: 1, padding: '1.25rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <div style={{ padding: '1rem' }}>
                            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                My Contributions
                            </p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                Track all your donations and support
                            </p>
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
                                <p className="stat-value primary">₦{totalContributed.toLocaleString()}</p>
                            </div>
                            <div className="stat-card">
                                <p className="stat-label">Projects Supported</p>
                                <p className="stat-value">{projectsSupported}</p>
                            </div>
                            <div className="stat-card">
                                <p className="stat-label">Total Donations</p>
                                <p className="stat-value success">{donations.length}</p>
                            </div>
                        </div>

                        <h2 style={{ fontSize: '1.375rem', fontWeight: '700', padding: '1.25rem 1rem 0.75rem', color: 'var(--color-text-primary)' }}>
                            Donation History
                        </h2>

                        <div style={{ padding: '0.75rem 1rem' }}>
                            <input
                                type="text"
                                placeholder="Search by project name or amount"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ height: '3rem' }}
                            />
                        </div>

                        <div style={{ padding: '0.75rem 1rem' }}>
                            <div className="table-container">
                                {loading ? (
                                    <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Loading donations...</p>
                                ) : filteredDonations.length === 0 ? (
                                    <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                                        {searchTerm ? 'No matching donations found.' : 'You haven\'t made any donations yet.'}
                                    </p>
                                ) : (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Project</th>
                                                <th>Amount</th>
                                                <th>Date</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredDonations.map((donation) => (
                                                <tr key={donation.$id}>
                                                    <td style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>
                                                        {donation.project?.name || `Project ${donation.projectId.substring(0, 8)}...`}
                                                    </td>
                                                    <td style={{ fontWeight: '600' }}>₦{donation.amount.toLocaleString()}</td>
                                                    <td>{donation.$createdAt ? new Date(donation.$createdAt).toLocaleDateString() : 'N/A'}</td>
                                                    <td>
                                                        <span className="badge badge-success">
                                                            {donation.status || 'Completed'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Link to={`/project/${donation.projectId}`} style={{ color: 'var(--color-primary)', fontWeight: '600', fontSize: '0.875rem' }}>
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
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MyDonations;
