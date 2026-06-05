import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, UserIcon, XIcon } from 'lucide-react';
import mockStaff    from '../../data/mockStaff.json';
import mockServices from '../../data/mockServices.json';

interface Staff { id: string; name: string; photo: string; bio: string; services: string[]; priceSurcharge: number }
interface Service { id: string; name: string }

const blank = { name: '', photo: '', bio: '', services: [] as string[], priceSurcharge: '0' };

export const StaffManagement: React.FC = () => {
  const [staff, setStaff]         = useState<Staff[]>(mockStaff);
  const [isEditing, setIsEditing] = useState(false);
  const [current, setCurrent]     = useState<Staff | null>(null);
  const [form, setForm]           = useState(blank);
  const [showForm, setShowForm]   = useState(false);

  const services: Service[] = mockServices;

  const openAdd = () => { setIsEditing(false); setCurrent(null); setForm(blank); setShowForm(true); };
  const openEdit = (s: Staff) => {
    setIsEditing(true); setCurrent(s);
    setForm({ name: s.name, photo: s.photo, bio: s.bio, services: s.services, priceSurcharge: String(s.priceSurcharge) });
    setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setForm(blank); setCurrent(null); setIsEditing(false); };

  const toggleService = (id: string) =>
    setForm((p) => ({ ...p, services: p.services.includes(id) ? p.services.filter((x) => x !== id) : [...p.services, id] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const s: Staff = {
      id: current?.id ?? `staff-${Date.now()}`,
      name: form.name, photo: form.photo || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
      bio: form.bio, services: form.services, priceSurcharge: parseFloat(form.priceSurcharge),
    };
    setStaff(isEditing ? staff.map((x) => (x.id === s.id ? s : x)) : [...staff, s]);
    cancel();
  };

  const inp = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const serviceName = (id: string) => services.find((s) => s.id === id)?.name ?? id;

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Staff</h1>
          <p className="text-venus-400 text-sm">Manage your team and their service capabilities.</p>
        </div>
        <button onClick={openAdd} className="btn-venus text-sm">
          <PlusIcon className="w-4 h-4" />
          Add Staff
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Staff cards ── */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {staff.map((s) => (
            <div key={s.id} className="card-dark p-5">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={s.photo} alt={s.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-venus-500/40"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{s.name}</p>
                  {s.priceSurcharge > 0 && (
                    <p className="text-xs font-semibold" style={{ color: '#C9AF6B' }}>
                      +${s.priceSurcharge.toFixed(2)} surcharge
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEdit(s)}
                    className="p-1.5 rounded-lg text-venus-400 hover:text-venus-300 hover:bg-venus-500/10 transition-colors">
                    <PencilIcon className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setStaff(staff.filter((x) => x.id !== s.id))}
                    className="p-1.5 rounded-lg text-venus-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-venus-400 mb-3 line-clamp-2 leading-relaxed">{s.bio}</p>
              <div className="flex flex-wrap gap-1.5">
                {s.services.map((id) => (
                  <span key={id} className="px-2 py-0.5 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(95,111,46,0.18)', color: '#BAC876', border: '1px solid rgba(95,111,46,0.30)' }}>
                    {serviceName(id)}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {staff.length === 0 && (
            <div className="card-dark p-10 col-span-2 text-center text-venus-500 text-sm">
              No staff members yet.
            </div>
          )}
        </div>

        {/* ── Form ── */}
        <div className="lg:col-span-1">
          {showForm ? (
            <div className="card-dark p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-white">{isEditing ? 'Edit Staff' : 'New Staff Member'}</h2>
                <button onClick={cancel} className="text-venus-500 hover:text-venus-300 transition-colors">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label-dark">Full Name</label>
                  <input name="name" value={form.name} onChange={inp} required placeholder="Alex Johnson" className="input-dark" />
                </div>
                <div>
                  <label className="label-dark">Photo URL <span className="normal-case font-normal text-venus-500">(optional)</span></label>
                  <input name="photo" value={form.photo} onChange={inp} placeholder="https://…" className="input-dark" />
                </div>
                <div>
                  <label className="label-dark">Bio</label>
                  <textarea name="bio" value={form.bio} onChange={inp} required rows={3} placeholder="Short bio…" className="input-dark resize-none" />
                </div>
                <div>
                  <label className="label-dark">Surcharge ($)</label>
                  <input name="priceSurcharge" type="number" min="0" step="0.01" value={form.priceSurcharge} onChange={inp} required className="input-dark" />
                </div>
                <div>
                  <label className="label-dark">Services</label>
                  <div className="space-y-2 max-h-36 overflow-y-auto rounded-xl p-3"
                    style={{ background: 'rgba(28,31,10,0.80)', border: '1px solid rgba(95,111,46,0.35)' }}>
                    {services.map((svc) => (
                      <label key={svc.id} className="flex items-center gap-2.5 cursor-pointer group">
                        <input type="checkbox" checked={form.services.includes(svc.id)}
                          onChange={() => toggleService(svc.id)}
                          className="w-4 h-4 rounded accent-venus-600" />
                        <span className="text-sm text-venus-300 group-hover:text-white transition-colors">{svc.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={cancel}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-venus-400 border transition-colors"
                    style={{ borderColor: 'rgba(95,111,46,0.30)', background: 'transparent' }}>
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-venus text-sm">
                    {isEditing ? 'Save' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div onClick={openAdd}
              className="card-dark p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-venus-500/50 transition-all"
              style={{ minHeight: '200px', borderStyle: 'dashed' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(95,111,46,0.15)' }}>
                <UserIcon className="w-6 h-6 text-venus-400" />
              </div>
              <p className="font-bold text-venus-300 text-sm">Add New Staff Member</p>
              <p className="text-xs text-venus-500 mt-1">Click to open form</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
