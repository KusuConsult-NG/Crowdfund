import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { donationService } from '../services/donationService';
import { projectService } from '../services/projectService';
import { Donation, Project } from '../types';

const DonorContributions: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchTerm, setSearchTerm] = useState('');
    const [donations, setDonations] = useState<(Donation & { $id: string })[]>([]);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const [projData, donData] = await Promise.all([
                    projectService.getProject(id),
                    donationService.getProjectDonations(id)
                ]);
                setProject(projData);
                setDonations(donData.documents);
            } catch (err) {
                console.error('Error fetching contribution data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const filteredDonations = donations.filter(don =>
        don.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        don.amount.toString().includes(searchTerm)
    );

    const totalRaised = donations.reduce((sum, don) => sum + don.amount, 0);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-white)' }}>
                <Navbar />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Loading contributions...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-white)' }}>
            <Navbar />

            <main style={{ paddingTop: '80px', padding: '1.25rem' }}>
                <div style={{ maxWidth: '960px', margin: '0 auto' }}>
                    <div style={{ padding: '1rem' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                            Donor Contributions {project ? `for ${project.name}` : ''}
                        </p>
                    </div>

                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', padding: '1rem 1rem 0.5rem', color: 'var(--color-text-primary)' }}>
                        Summary
                    </h3>

                    <div style={{ display: 'flex', gap: '1rem', padding: '1rem', flexWrap: 'wrap' }}>
                        <div className="stat-card" style={{ minWidth: '158px', flex: 1 }}>
                            <p className="stat-label">Total Contributions</p>
                            <p className="stat-value primary">₦{totalRaised.toLocaleString()}</p>
                        </div>
                        <div className="stat-card" style={{ minWidth: '158px', flex: 1 }}>
                            <p className="stat-label">Total Donors</p>
                            <p className="stat-value">{donations.length}</p>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', padding: '1rem 1rem 0.5rem', color: 'var(--color-text-primary)' }}>
                        Contributions
                    </h3>

                    <div style={{ padding: '0.75rem 1rem' }}>
                        <input
                            type="text"
                            placeholder="Search donors by ID or amount"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ height: '3rem' }}
                        />
                    </div>

                    <div style={{ padding: '0.75rem 1rem' }}>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Donor</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDonations.length > 0 ? filteredDonations.map((donation) => (
                                        <tr key={donation.$id}>
                                            <td style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>
                                                {donation.anonymous ? 'Anonymous' : `User ${donation.userId.substring(0, 8)}...`}
                                            </td>
                                            <td>₦{donation.amount.toLocaleString()}</td>
                                            <td>{new Date(donation.$createdAt).toLocaleDateString()}</td>
                                            <td style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                                {donation.message || '-'}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                                                {searchTerm ? 'No matching contributions found.' : 'No contributions yet.'}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DonorContributions;
