import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { projectService } from '../services/projectService';

const EditProject: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [fundingGoal, setFundingGoal] = useState('');
    const [category, setCategory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                const project = await projectService.getProject(id);
                setProjectName(project.name);
                setDescription(project.description);
                setFundingGoal(project.fundingGoal.toString());
                setCategory(project.category);
                setImageUrl(project.imageUrl || '');
                setImagePreview(project.imageUrl || null);
            } catch (err) {
                console.error('Error fetching project for edit:', err);
                setError('Failed to load project details.');
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSave = async () => {
        if (!id) return;
        setSaving(true);
        setError(null);

        try {
            let finalImageUrl = imageUrl;

            if (imageFile) {
                const uploadedFile = await projectService.uploadImage(imageFile);
                finalImageUrl = projectService.getFilePreview(uploadedFile.$id).toString();
            }

            await projectService.updateProject(id, {
                name: projectName,
                description,
                fundingGoal: parseInt(fundingGoal),
                category,
                imageUrl: finalImageUrl
            });

            navigate('/admin/dashboard');
        } catch (err: any) {
            console.error('Error updating project:', err);
            setError(err.message || 'Failed to update project. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading project...</div>;
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg-light)' }}>
            <Navbar />

            <main style={{ paddingTop: '80px', display: 'flex', justifyContent: 'center', padding: '5rem 2.5rem 1.25rem' }}>
                <div style={{ maxWidth: '512px', width: '100%' }}>
                    <div style={{ padding: '1rem' }}>
                        <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)', minWidth: '18rem' }}>
                            Edit Project Details
                        </p>
                    </div>

                    {error && (
                        <div style={{ padding: '1rem', color: 'var(--color-error)', backgroundColor: '#fee2e2', borderRadius: 'var(--radius-md)', margin: '1rem' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ padding: '0.75rem 1rem' }}>
                        <label style={{ display: 'flex', flexDirection: 'column', minWidth: '10rem', flex: 1 }}>
                            <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                Project Name
                            </p>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="Enter project name"
                                disabled={saving}
                            />
                        </label>
                    </div>

                    <div style={{ padding: '0.75rem 1rem' }}>
                        <label style={{ display: 'flex', flexDirection: 'column', minWidth: '10rem', flex: 1 }}>
                            <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                Project Description
                            </p>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your project"
                                disabled={saving}
                                style={{ minHeight: '150px' }}
                            />
                        </label>
                    </div>

                    <div style={{ padding: '0.75rem 1rem' }}>
                        <label style={{ display: 'flex', flexDirection: 'column', minWidth: '10rem', flex: 1 }}>
                            <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                Funding Goal (₦)
                            </p>
                            <input
                                type="number"
                                value={fundingGoal}
                                onChange={(e) => setFundingGoal(e.target.value)}
                                placeholder="Enter funding goal amount"
                                disabled={saving}
                            />
                        </label>
                    </div>

                    <div style={{ padding: '0.75rem 1rem' }}>
                        <label style={{ display: 'flex', flexDirection: 'column', minWidth: '10rem', flex: 1 }}>
                            <p style={{ fontSize: '1rem', fontWeight: '500', paddingBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                                Category
                            </p>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={saving}>
                                <option value="">Select category</option>
                                <option value="education">Education</option>
                                <option value="outreach">Community Outreach</option>
                                <option value="building">Building Projects</option>
                                <option value="equipment">Equipment Upgrade</option>
                                <option value="mission">Mission Trips</option>
                                <option value="other">Other</option>
                            </select>
                        </label>
                    </div>

                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', padding: '1rem 1rem 0.5rem', color: 'var(--color-text-primary)' }}>
                        Project Media
                    </h3>

                    <div style={{ padding: '1rem', width: '100%' }}>
                        {imagePreview ? (
                            <div style={{
                                width: '100%',
                                aspectRatio: '3/2',
                                borderRadius: 'var(--radius-lg)',
                                backgroundColor: 'var(--color-bg-light)',
                                backgroundImage: `url("${imagePreview}")`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}></div>
                        ) : (
                            <div style={{
                                width: '100%',
                                aspectRatio: '3/2',
                                borderRadius: 'var(--radius-lg)',
                                backgroundColor: 'var(--color-bg-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-text-secondary)',
                                border: '2px dashed var(--color-border)'
                            }}>No image selected</div>
                        )}
                    </div>

                    <div style={{ padding: '0.75rem 1rem' }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="edit-image-upload"
                            disabled={saving}
                        />
                        <label htmlFor="edit-image-upload" className="btn btn-secondary" style={{ cursor: 'pointer', textAlign: 'center' }}>
                            Change Image
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem 1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <Link to="/admin/dashboard">
                            <button className="btn btn-secondary" disabled={saving}>
                                Cancel
                            </button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditProject;
