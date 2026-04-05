import { useState, useEffect, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StaffMember {
    _id: string;
    name: string;
    username: string;
    role: 'nurse' | 'receptionist' | 'pharmacist';
    department: string;
    phone: string;
    email: string;
    isActive: boolean;
}

type FilterTab = 'all' | 'nurse' | 'receptionist' | 'pharmacist';

interface AddStaffForm {
    name: string;
    username: string;
    password: string;
    role: 'nurse' | 'receptionist' | 'pharmacist';
    department: string;
    phone: string;
    email: string;
}

interface EditStaffForm {
    name: string;
    department: string;
    phone: string;
    email: string;
    isActive: boolean;
}

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error';
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const roleBadge: Record<string, string> = {
    nurse: 'bg-blue-100 text-blue-700',
    receptionist: 'bg-green-100 text-green-700',
    pharmacist: 'bg-purple-100 text-purple-700',
};

const avatarColor: Record<string, string> = {
    nurse: 'bg-blue-500',
    receptionist: 'bg-green-500',
    pharmacist: 'bg-purple-500',
};

const roleLabel: Record<string, string> = {
    nurse: 'Nurse',
    receptionist: 'Receptionist',
    pharmacist: 'Pharmacist',
};

const emptyAdd: AddStaffForm = {
    name: '', username: '', password: '',
    role: 'nurse', department: '', phone: '', email: '',
};

// ─── Toast Component ──────────────────────────────────────────────────────────

function ToastContainer({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map((t) => (
                <div
                    key={t.id}
                    onClick={() => dismiss(t.id)}
                    className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white cursor-pointer transition-all animate-fade-in ${t.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                >
                    <span>{t.type === 'success' ? '✅' : '❌'}</span>
                    {t.message}
                </div>
            ))}
        </div>
    );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ color = 'text-blue-600' }: { color?: string }) {
    return (
        <svg className={`animate-spin h-6 w-6 ${color}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminStaffPage() {
    const token = localStorage.getItem('token') || '';

    // Data
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<FilterTab>('all');

    // Modals
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
    const [showDeleteName, setShowDeleteName] = useState('');

    // Forms
    const [addForm, setAddForm] = useState<AddStaffForm>(emptyAdd);
    const [editId, setEditId] = useState('');
    const [editForm, setEditForm] = useState<EditStaffForm>({ name: '', department: '', phone: '', email: '', isActive: true });

    // UI state
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);
    let toastCounter = 0;

    // ─── Helpers ──────────────────────────────────────────────────────────────

    const addToast = useCallback((message: string, type: 'success' | 'error') => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    }, []);

    const dismissToast = (id: number) =>
        setToasts((prev) => prev.filter((t) => t.id !== id));

    const fetchStaff = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/users/staff/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setStaff(Array.isArray(data) ? data : []);
        } catch {
            addToast('Failed to load staff list.', 'error');
        } finally {
            setLoading(false);
        }
    }, [token, addToast]);

    useEffect(() => { fetchStaff(); }, [fetchStaff]);

    // ─── Filtered staff ────────────────────────────────────────────────────────

    const filtered = activeTab === 'all' ? staff : staff.filter((s) => s.role === activeTab);

    const tabs: { key: FilterTab; label: string; count: number }[] = [
        { key: 'all', label: 'All', count: staff.length },
        { key: 'nurse', label: 'Nurses', count: staff.filter((s) => s.role === 'nurse').length },
        { key: 'receptionist', label: 'Receptionists', count: staff.filter((s) => s.role === 'receptionist').length },
        { key: 'pharmacist', label: 'Pharmacists', count: staff.filter((s) => s.role === 'pharmacist').length },
    ];

    // ─── Add Staff ─────────────────────────────────────────────────────────────

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!addForm.name || !addForm.username || !addForm.password) {
            setFormError('Name, username, and password are required.');
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(`${API}/users/staff/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(addForm),
            });
            const data = await res.json();
            if (!res.ok) {
                setFormError(data.message || 'Failed to add staff member.');
                return;
            }
            addToast('Staff member added successfully', 'success');
            setShowAdd(false);
            setAddForm(emptyAdd);
            fetchStaff();
        } catch {
            setFormError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Edit Staff ────────────────────────────────────────────────────────────

    const openEdit = (s: StaffMember) => {
        setEditId(s._id);
        setEditForm({ name: s.name, department: s.department, phone: s.phone, email: s.email, isActive: s.isActive });
        setFormError('');
        setShowEdit(true);
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        if (!editForm.name) { setFormError('Name is required.'); return; }
        setSubmitting(true);
        try {
            const res = await fetch(`${API}/users/staff/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(editForm),
            });
            const data = await res.json();
            if (!res.ok) { setFormError(data.message || 'Update failed.'); return; }
            addToast('Staff member updated successfully', 'success');
            setShowEdit(false);
            fetchStaff();
        } catch {
            setFormError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Delete Staff ──────────────────────────────────────────────────────────

    const confirmDeleteOpen = (s: StaffMember) => {
        setShowDeleteId(s._id);
        setShowDeleteName(s.name);
    };

    const handleDelete = async () => {
        if (!showDeleteId) return;
        try {
            const res = await fetch(`${API}/users/staff/${showDeleteId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                addToast('Staff member removed successfully', 'success');
                setStaff((prev) => prev.filter((s) => s._id !== showDeleteId));
            } else {
                addToast('Failed to remove staff member.', 'error');
            }
        } catch {
            addToast('Network error.', 'error');
        } finally {
            setShowDeleteId(null);
        }
    };

    // ─── Input helper ──────────────────────────────────────────────────────────

    const inputClass =
        'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition';

    // ─── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="p-6 space-y-6 relative">
            <ToastContainer toasts={toasts} dismiss={dismissToast} />

            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
                    <p className="text-sm text-gray-500 mt-0.5">Manage nurses, receptionists, and pharmacists</p>
                </div>
                <button
                    onClick={() => { setShowAdd(true); setFormError(''); setAddForm(emptyAdd); }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
                >
                    <span className="text-lg leading-none">+</span> Add Staff
                </button>
            </div>

            {/* ── Filter Tabs ─────────────────────────────────────────────────── */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab.key
                                ? 'bg-white text-blue-700 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Staff Table ─────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Spinner />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <div className="text-5xl mb-3">👥</div>
                        <p className="font-medium text-gray-500">No staff members found</p>
                        <p className="text-sm mt-1">Add your first staff member using the button above.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['', 'Full Name', 'Username', 'Role', 'Department', 'Phone', 'Status', 'Actions'].map((h) => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((s) => (
                                    <tr key={s._id} className="hover:bg-gray-50 transition">
                                        {/* Avatar */}
                                        <td className="px-5 py-4">
                                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${avatarColor[s.role] || 'bg-gray-400'}`}>
                                                {s.name.charAt(0).toUpperCase()}
                                            </div>
                                        </td>
                                        {/* Name */}
                                        <td className="px-5 py-4 font-medium text-gray-800">{s.name}</td>
                                        {/* Username */}
                                        <td className="px-5 py-4 text-gray-500 font-mono text-xs">@{s.username}</td>
                                        {/* Role badge */}
                                        <td className="px-5 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge[s.role] || 'bg-gray-100 text-gray-600'}`}>
                                                {roleLabel[s.role] || s.role}
                                            </span>
                                        </td>
                                        {/* Department */}
                                        <td className="px-5 py-4 text-gray-600">{s.department || <span className="text-gray-300">—</span>}</td>
                                        {/* Phone */}
                                        <td className="px-5 py-4 text-gray-600">{s.phone || <span className="text-gray-300">—</span>}</td>
                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${s.isActive !== false ? 'bg-green-500' : 'bg-red-500'}`} />
                                                {s.isActive !== false ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => openEdit(s)}
                                                    className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition"
                                                >
                                                    ✏️ Edit
                                                </button>
                                                <button
                                                    onClick={() => confirmDeleteOpen(s)}
                                                    className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition"
                                                >
                                                    🗑️ Remove
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── ADD STAFF MODAL ─────────────────────────────────────────────── */}
            {showAdd && (
                <ModalOverlay onClose={() => setShowAdd(false)}>
                    <h3 className="text-lg font-bold text-gray-800 mb-5">Add New Staff Member</h3>
                    <form onSubmit={handleAdd} className="space-y-4">
                        {formError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
                                {formError}
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Full Name *">
                                <input className={inputClass} value={addForm.name}
                                    onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                                    placeholder="Jane Doe" />
                            </Field>
                            <Field label="Username *">
                                <input className={inputClass} value={addForm.username}
                                    onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                                    placeholder="janedoe" />
                            </Field>
                        </div>

                        <Field label="Password *">
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`${inputClass} pr-10`}
                                    value={addForm.password}
                                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                                    placeholder="Min. 6 characters"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm">
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </Field>

                        <Field label="Role">
                            <select className={inputClass} value={addForm.role}
                                onChange={(e) => setAddForm({ ...addForm, role: e.target.value as AddStaffForm['role'] })}>
                                <option value="nurse">Nurse</option>
                                <option value="receptionist">Receptionist</option>
                                <option value="pharmacist">Pharmacist</option>
                            </select>
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Department">
                                <input className={inputClass} value={addForm.department}
                                    onChange={(e) => setAddForm({ ...addForm, department: e.target.value })}
                                    placeholder="e.g. ICU" />
                            </Field>
                            <Field label="Phone">
                                <input className={inputClass} value={addForm.phone}
                                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                                    placeholder="+91 9876543210" />
                            </Field>
                        </div>

                        <Field label="Email">
                            <input type="email" className={inputClass} value={addForm.email}
                                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                                placeholder="jane@hospital.com" />
                        </Field>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowAdd(false)}
                                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                Cancel
                            </button>
                            <button type="submit" disabled={submitting}
                                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-60 flex items-center gap-2">
                                {submitting && <Spinner color="text-white" />}
                                {submitting ? 'Adding...' : 'Add Staff Member'}
                            </button>
                        </div>
                    </form>
                </ModalOverlay>
            )}

            {/* ── EDIT STAFF MODAL ─────────────────────────────────────────────── */}
            {showEdit && (
                <ModalOverlay onClose={() => setShowEdit(false)}>
                    <h3 className="text-lg font-bold text-gray-800 mb-5">Edit Staff Member</h3>
                    <form onSubmit={handleEdit} className="space-y-4">
                        {formError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
                                {formError}
                            </div>
                        )}
                        <Field label="Full Name *">
                            <input className={inputClass} value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Department">
                                <input className={inputClass} value={editForm.department}
                                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} />
                            </Field>
                            <Field label="Phone">
                                <input className={inputClass} value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                            </Field>
                        </div>
                        <Field label="Email">
                            <input type="email" className={inputClass} value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                        </Field>
                        <Field label="Status">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <div
                                    onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                                    className={`relative w-11 h-6 rounded-full transition-colors ${editForm.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editForm.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                                <span className={`text-sm font-medium ${editForm.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                                    {editForm.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </label>
                        </Field>
                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowEdit(false)}
                                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                Cancel
                            </button>
                            <button type="submit" disabled={submitting}
                                className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-60 flex items-center gap-2">
                                {submitting && <Spinner color="text-white" />}
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </ModalOverlay>
            )}

            {/* ── DELETE CONFIRMATION ──────────────────────────────────────────── */}
            {showDeleteId && (
                <ModalOverlay onClose={() => setShowDeleteId(null)} maxW="max-w-sm">
                    <div className="text-center">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Remove Staff Member</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Are you sure you want to remove <span className="font-semibold text-gray-700">{showDeleteName}</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button onClick={() => setShowDeleteId(null)}
                                className="px-5 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                Cancel
                            </button>
                            <button onClick={handleDelete}
                                className="px-5 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg transition">
                                Yes, Remove
                            </button>
                        </div>
                    </div>
                </ModalOverlay>
            )}
        </div>
    );
}

// ─── Helper Sub-components ────────────────────────────────────────────────────

function ModalOverlay({ children, onClose, maxW = 'max-w-lg' }: {
    children: React.ReactNode;
    onClose: () => void;
    maxW?: string;
}) {
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={`bg-white rounded-2xl shadow-2xl w-full ${maxW} p-6 relative`}>
                <button onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl leading-none">
                    ×
                </button>
                {children}
            </div>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
        </div>
    );
}
