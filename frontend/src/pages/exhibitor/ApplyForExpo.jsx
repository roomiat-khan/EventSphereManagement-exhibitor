import { useState, useEffect } from 'react';
import { getExpos, applyForExpo } from '../../services/api';
import { toast } from 'react-toastify';

const ApplyForExpo = () => {
    const [expos, setExpos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExpo, setSelectedExpo] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        companyName : '',
        description : '',
        category    : 'technology',
        website     : '',
        address     : '',
        phone       : '',
        products    : '',
    });

    useEffect(() => { fetchExpos(); }, []);

    const fetchExpos = async () => {
        try {
            const res = await getExpos();
            setExpos(res.data.filter(e => e.status === 'published'));
        } catch (error) {
            toast.error('Failed to load expos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedExpo) return toast.error('Please select an expo');
        setSubmitting(true);
        try {
            await applyForExpo({
                expoId: selectedExpo._id,
                ...formData,
                products: formData.products.split(',').map(p => p.trim()).filter(Boolean),
            });
            toast.success('Application submitted successfully!');
            setSelectedExpo(null);
            setFormData({ companyName: '', description: '', category: 'technology', website: '', address: '', phone: '', products: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setSubmitting(false);
        }
    };

    const onChange = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

    if (loading) return <div className="afe-loading">⏳ Loading expos...</div>;

    return (
        <>
            <style>{`
                .afe-wrapper {
                    max-width: 860px;
                    margin: 0 auto;
                }

                .afe-loading {
                    text-align: center;
                    padding: 60px;
                    font-size: 14px;
                    color: #94a3b8;
                    font-weight: 500;
                }

                .afe-page-title {
                    font-size: 22px;
                    font-weight: 900;
                    color: #0f172a;
                    letter-spacing: -0.5px;
                    margin: 0 0 24px 0;
                }

                /* ── card ── */
                .afe-card {
                    background: white;
                    border-radius: 20px;
                    border: 1px solid #e2e8f0;
                    overflow: hidden;
                    margin-bottom: 20px;
                }
                .afe-card-head {
                    padding: 18px 24px;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                .afe-step-badge {
                    width: 26px; height: 26px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 12px; font-weight: 800; color: white;
                    flex-shrink: 0;
                }
                .afe-card-title {
                    font-size: 15px; font-weight: 800; color: #0f172a;
                }
                .afe-expo-highlight { color: #6366f1; }

                .afe-card-body { padding: 20px 24px; }

                /* ── expo grid ── */
                .afe-expo-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 14px;
                }
                .afe-expo-card {
                    border: 2px solid #e2e8f0;
                    background: white;
                    border-radius: 14px;
                    padding: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                    position: relative;
                }
                .afe-expo-card:hover {
                    border-color: #a5b4fc;
                    box-shadow: 0 4px 16px rgba(99,102,241,0.1);
                }
                .afe-expo-card.selected {
                    border-color: #6366f1;
                    background: rgba(99,102,241,0.04);
                }
                .afe-expo-card-title {
                    font-size: 14px; font-weight: 800;
                    color: #0f172a; margin: 0 0 6px 0;
                    padding-right: 28px;
                }
                .afe-expo-meta {
                    font-size: 12px; color: #94a3b8; margin: 0 0 2px 0;
                }
                .afe-expo-theme {
                    font-size: 12px; color: #6366f1;
                    font-weight: 600; margin: 6px 0 0 0;
                }
                .afe-checkmark {
                    position: absolute; top: 14px; right: 14px;
                    width: 22px; height: 22px; border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    display: flex; align-items: center; justify-content: center;
                    font-size: 11px; color: white; font-weight: 900;
                }
                .afe-no-expos {
                    text-align: center; padding: 32px;
                    font-size: 14px; color: #94a3b8;
                }

                /* ── form ── */
                .afe-grid2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-bottom: 16px;
                }
                .afe-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: 16px;
                }
                .afe-field-inline {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .afe-label {
                    font-size: 12px; font-weight: 700;
                    color: #475569;
                    text-transform: uppercase; letter-spacing: 0.05em;
                }
                .afe-label-note {
                    font-size: 11px; color: #94a3b8;
                    font-weight: 400; text-transform: none; letter-spacing: 0;
                }
                .afe-input, .afe-select, .afe-textarea {
                    width: 100%; padding: 10px 14px;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 10px;
                    font-size: 14px; font-weight: 500;
                    color: #0f172a; background: white;
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    box-sizing: border-box;
                    font-family: inherit;
                }
                .afe-input:focus, .afe-select:focus, .afe-textarea:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
                }
                .afe-input::placeholder, .afe-textarea::placeholder {
                    color: #94a3b8; font-weight: 400;
                }
                .afe-textarea { resize: vertical; }
                .afe-select { cursor: pointer; }

                .afe-submit-btn {
                    width: 100%; padding: 13px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border: none; border-radius: 12px;
                    color: white; font-size: 14px; font-weight: 700;
                    cursor: pointer; margin-top: 8px;
                    transition: all 0.2s;
                    box-shadow: 0 4px 16px rgba(99,102,241,0.3);
                    font-family: inherit;
                }
                .afe-submit-btn:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 8px 24px rgba(99,102,241,0.4);
                }
                .afe-submit-btn:disabled {
                    background: rgba(99,102,241,0.4);
                    cursor: not-allowed;
                    box-shadow: none;
                }

                /* ── RESPONSIVE ── */
                @media (max-width: 640px) {
                    .afe-page-title { font-size: 18px; margin-bottom: 16px; }

                    .afe-card { border-radius: 16px; margin-bottom: 14px; }
                    .afe-card-head { padding: 14px 16px; }
                    .afe-card-body { padding: 14px 16px; }
                    .afe-card-title { font-size: 13px; }

                    /* expo cards single column */
                    .afe-expo-grid { grid-template-columns: 1fr; gap: 10px; }

                    /* form 2-col → 1-col */
                    .afe-grid2 { grid-template-columns: 1fr; gap: 0; margin-bottom: 0; }
                    .afe-field-inline { margin-bottom: 14px; }
                }

                @media (max-width: 400px) {
                    .afe-card-head { padding: 12px 14px; }
                    .afe-card-body { padding: 12px 14px; }
                }
            `}</style>

            <div className="afe-wrapper">
                <h2 className="afe-page-title">Apply for Expo</h2>

                {/* ── Step 1: Select Expo ── */}
                <div className="afe-card">
                    <div className="afe-card-head">
                        <div className="afe-step-badge">1</div>
                        <span className="afe-card-title">Select an Expo</span>
                    </div>
                    <div className="afe-card-body">
                        {expos.length === 0 ? (
                            <div className="afe-no-expos">No published expos available at the moment.</div>
                        ) : (
                            <div className="afe-expo-grid">
                                {expos.map(expo => {
                                    const selected = selectedExpo?._id === expo._id;
                                    return (
                                        <div
                                            key={expo._id}
                                            className={`afe-expo-card${selected ? ' selected' : ''}`}
                                            onClick={() => setSelectedExpo(expo)}
                                        >
                                            {selected && <div className="afe-checkmark">✓</div>}
                                            <h4 className="afe-expo-card-title">{expo.title}</h4>
                                            <p className="afe-expo-meta">📍 {expo.location}</p>
                                            <p className="afe-expo-meta">
                                                📅 {new Date(expo.startDate).toLocaleDateString()} — {new Date(expo.endDate).toLocaleDateString()}
                                            </p>
                                            {expo.theme && <p className="afe-expo-theme">🎯 {expo.theme}</p>}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Step 2: Application Form ── */}
                {selectedExpo && (
                    <div className="afe-card">
                        <div className="afe-card-head">
                            <div className="afe-step-badge">2</div>
                            <span className="afe-card-title">
                                Fill Application for&nbsp;
                                <span className="afe-expo-highlight">{selectedExpo.title}</span>
                            </span>
                        </div>
                        <div className="afe-card-body">
                            <form onSubmit={handleSubmit}>

                                {/* Company Name + Category */}
                                <div className="afe-grid2">
                                    <div className="afe-field-inline">
                                        <label className="afe-label">Company Name</label>
                                        <input
                                            type="text" required
                                            value={formData.companyName}
                                            placeholder="Your company name"
                                            onChange={onChange('companyName')}
                                            className="afe-input"
                                        />
                                    </div>
                                    <div className="afe-field-inline">
                                        <label className="afe-label">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={onChange('category')}
                                            className="afe-select"
                                        >
                                            <option value="technology">Technology</option>
                                            <option value="healthcare">Healthcare</option>
                                            <option value="education">Education</option>
                                            <option value="finance">Finance</option>
                                            <option value="retail">Retail</option>
                                            <option value="food">Food</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="afe-field">
                                    <label className="afe-label">Company Description</label>
                                    <textarea
                                        required rows={3}
                                        value={formData.description}
                                        placeholder="Describe your company and what you offer"
                                        onChange={onChange('description')}
                                        className="afe-textarea"
                                    />
                                </div>

                                {/* Website + Phone */}
                                <div className="afe-grid2">
                                    <div className="afe-field-inline">
                                        <label className="afe-label">Website</label>
                                        <input
                                            type="url"
                                            value={formData.website}
                                            placeholder="https://yourcompany.com"
                                            onChange={onChange('website')}
                                            className="afe-input"
                                        />
                                    </div>
                                    <div className="afe-field-inline">
                                        <label className="afe-label">Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            placeholder="03001234567"
                                            onChange={onChange('phone')}
                                            className="afe-input"
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="afe-field">
                                    <label className="afe-label">Address</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        placeholder="Company address"
                                        onChange={onChange('address')}
                                        className="afe-input"
                                    />
                                </div>

                                {/* Products */}
                                <div className="afe-field">
                                    <label className="afe-label">
                                        Products / Services&nbsp;
                                        <span className="afe-label-note">(comma separated)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.products}
                                        placeholder="e.g. AI Software, Cloud Solutions, Consulting"
                                        onChange={onChange('products')}
                                        className="afe-input"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="afe-submit-btn"
                                >
                                    {submitting ? '⏳ Submitting...' : 'Submit Application'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ApplyForExpo;