import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { userService } from '../services/userService';
import { UserProfile } from '../types';

const UserManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState<(UserProfile & { $id: string })[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.listUsers();
            setUsers(response.documents);
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateRole = async (profileId: string, currentRole: UserProfile['role']) => {
        const roles: UserProfile['role'][] = ['Donor', 'Organizer', 'SuperAdmin'];
        const nextIndex = (roles.indexOf(currentRole) + 1) % roles.length;
        const newRole = roles[nextIndex];

        try {
            await userService.updateUser(profileId, { role: newRole });
            setUsers(users.map(u => u.$id === profileId ? { ...u, role: newRole } : u));
        } catch (err) {
            console.error('Error updating role:', err);
            alert('Failed to update role.');
        }
    };

    const handleUpdateStatus = async (profileId: string, currentStatus: UserProfile['status']) => {
        const newStatus: UserProfile['status'] = currentStatus === 'Active' ? 'Inactive' : 'Active';

        try {
            await userService.updateUser(profileId, { status: newStatus });
            setUsers(users.map(u => u.$id === profileId ? { ...u, status: newStatus } : u));
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status.');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                    User Management
                                </p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                    Manage all user profiles and roles on the platform.
                                </p>
                            </div>
                        </div>

                        <div style={{ padding: '0.75rem 1rem' }}>
                            <input
                                type="text"
                                placeholder="Search users by name or email"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ height: '3rem' }}
                            />
                        </div>

                        <div style={{ padding: '0.75rem 1rem' }}>
                            <div className="table-container">
                                {loading ? (
                                    <p style={{ padding: '2rem', textAlign: 'center' }}>Loading users...</p>
                                ) : filteredUsers.length === 0 ? (
                                    <p style={{ padding: '2rem', textAlign: 'center' }}>No users found.</p>
                                ) : (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th style={{ width: '12rem' }}>Role</th>
                                                <th style={{ width: '10rem' }}>Status</th>
                                                <th>Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map((user) => (
                                                <tr key={user.$id}>
                                                    <td style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{user.name}</td>
                                                    <td style={{ fontSize: '0.875rem' }}>{user.email}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-secondary"
                                                            onClick={() => handleUpdateRole(user.$id, user.role)}
                                                            style={{ width: '100%', height: '2rem', fontSize: '0.75rem', padding: '0' }}
                                                        >
                                                            {user.role}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-secondary"
                                                            onClick={() => handleUpdateStatus(user.$id, user.status)}
                                                            style={{
                                                                width: '100%', height: '2rem', fontSize: '0.75rem', padding: '0',
                                                                color: user.status === 'Active' ? 'var(--color-success)' : 'var(--color-error)'
                                                            }}
                                                        >
                                                            {user.status}
                                                        </button>
                                                    </td>
                                                    <td style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                                        {new Date(user.$createdAt).toLocaleDateString()}
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

export default UserManagement;
