import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { projectService } from '../services/projectService';
import { Project } from '../types';

const ProjectDiscovery: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [sortBy, setSortBy] = useState<'newest' | 'goal_high' | 'goal_low' | 'raised'>('newest');
    const [projects, setProjects] = useState<(Project & { $id: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);
            try {
                const response = await projectService.getProjects(20, 0, categoryFilter, debouncedSearch, sortBy);
                setProjects(response.documents);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching projects:', err);
                setError('Failed to load projects. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [categoryFilter, debouncedSearch, sortBy]);

    const calculateDaysLeft = (endDate: string) => {
        const diff = new Date(endDate).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days > 0 ? days : 0;
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-white)' }}>
            <Navbar />

            {/* Main Content */}
            <main style={{ padding: '2rem 10rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', padding: '1rem 0' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', minWidth: '18rem' }}>
                            Discover Projects
                        </p>
                    </div>

                    {/* Search and Filter */}
                    <div style={{ display: 'flex', gap: '1rem', padding: '1rem 0', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ flex: 1, minWidth: '250px' }}>
                            <div style={{
                                display: 'flex',
                                width: '100%',
                                height: '3rem',
                                borderRadius: 'var(--radius-lg)',
                                border: '1px solid var(--color-border)',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0 1rem',
                                    backgroundColor: 'var(--color-bg-light)',
                                    color: 'var(--color-text-secondary)'
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                                        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search projects by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        flex: 1,
                                        border: 'none',
                                        outline: 'none',
                                        padding: '0 1rem',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Category:</span>
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                style={{ width: '180px', height: '3rem' }}
                            >
                                <option value="all">All Categories</option>
                                <option value="building">Building Projects</option>
                                <option value="outreach">Community Outreach</option>
                                <option value="mission">Mission Trips</option>
                                <option value="equipment">Equipment Upgrade</option>
                                <option value="education">Education & Training</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-secondary)' }}>Sort By:</span>
                            <select
                                value={sortBy}
                                // @ts-ignore
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{ width: '180px', height: '3rem' }}
                            >
                                <option value="newest">Newest First</option>
                                <option value="goal_high">Highest Goal</option>
                                <option value="goal_low">Lowest Goal</option>
                                <option value="raised">Most Funded</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '5rem' }}>
                            <p style={{ color: 'var(--color-text-secondary)' }}>Loading projects...</p>
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '5rem' }}>
                            <p style={{ color: 'var(--color-error)' }}>{error}</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '5rem' }}>
                            <p style={{ color: 'var(--color-text-secondary)' }}>No projects found matching your criteria.</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1.5rem',
                            padding: '1rem 0'
                        }}>
                            {projects.map((project: Project & { $id: string }) => {
                                const percentage = Math.round((project.raised / project.fundingGoal) * 100);
                                const daysLeft = calculateDaysLeft(project.endDate);

                                return (
                                    <Link to={`/project/${project.$id}`} key={project.$id} style={{ textDecoration: 'none' }}>
                                        <div className="card project-card" style={{
                                            padding: 0,
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                        }}>
                                            <div style={{
                                                width: '100%',
                                                height: '200px',
                                                backgroundImage: `url(${project.imageUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600'})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundColor: 'var(--color-bg-light)'
                                            }}></div>

                                            <div style={{ padding: '1.5rem' }}>
                                                <span className="badge badge-primary" style={{ marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                                                    {project.category}
                                                </span>

                                                <h3 style={{
                                                    fontSize: '1.125rem',
                                                    fontWeight: '700',
                                                    color: 'var(--color-text-primary)',
                                                    marginBottom: '0.5rem',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {project.name}
                                                </h3>

                                                <p style={{
                                                    fontSize: '0.875rem',
                                                    color: 'var(--color-text-secondary)',
                                                    marginBottom: '1rem',
                                                    lineHeight: '1.5',
                                                    height: '2.625rem',
                                                    overflow: 'hidden',
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical'
                                                }}>
                                                    {project.description}
                                                </p>

                                                <div className="progress" style={{ marginBottom: '0.75rem' }}>
                                                    <div className="progress-bar" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <div>
                                                        <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                                                            ${project.raised.toLocaleString()}
                                                        </p>
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                                            raised of ${project.fundingGoal.toLocaleString()}
                                                        </p>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <p style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>
                                                            {percentage}%
                                                        </p>
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                                            {daysLeft} days left
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ProjectDiscovery;
