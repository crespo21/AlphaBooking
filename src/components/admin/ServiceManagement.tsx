import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ScissorsIcon, XIcon } from 'lucide-react';
import mockServices from '../../data/mockServices.json';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

const blank = { name: '', description: '', price: '', duration: '' };

export const ServiceManagement: React.FC = () => {
  const [services, setServices]         = useState<Service[]>(mockServices);
  const [isEditing, setIsEditing]       = useState(false);
  const [current, setCurrent]           = useState<Service | null>(null);
  const [form, setForm]                 = useState(blank);
  const [showForm, setShowForm]         = useState(false);

  const openAdd = () => { setIsEditing(false); setCurrent(null); setForm(blank); setShowForm(true); };
  const openEdit = (s: Service) => {
    setIsEditing(true); setCurrent(s);
    setForm({ name: s.name, description: s.description, price: String(s.price), duration: String(s.duration) });
    setShowForm(true);
  };
  const cancel = () => { setShowForm(false); setForm(blank); setCurrent(null); setIsEditing(false); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const s: Service = {
      id: current?.id ?? `service-${Date.now()}`,
      name: form.name, description: form.description,
      price: parseFloat(form.price), duration: parseInt(form.duration),
    };
    setServices(isEditing ? services.map((x) => (x.id === s.id ? s : x)) : [...services, s]);
    cancel();
  };

  const inp = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Services</h1>
          <p className="text-venus-400 text-sm">Manage the treatments you offer.</p>
        </div>
        <button onClick={openAdd} className="btn-venus text-sm">
          <PlusIcon className="w-4 h-4" />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Table ── */}
        <div className="lg:col-span-2 card-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Service', 'Duration', 'Price', ''].map((h) => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-venus-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr
                    key={s.id}
                    className="transition-colors hover:bg-white/[0.03]"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: 'rgba(95,111,46,0.20)' }}>
                          <ScissorsIcon className="w-4 h-4 text-venus-400" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{s.name}</p>
                          <p className="text-xs text-venus-400 mt-0.5">{s.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-venus-300 text-sm">{s.duration} min</td>
                    <td className="px-5 py-4">
                      <span className="font-black text-base" style={{ color: '#C9AF6B' }}>
                        ${s.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 rounded-lg text-venus-400 hover:text-venus-300 hover:bg-venus-500/10 transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setServices(services.filter((x) => x.id !== s.id))}
                          className="p-1.5 rounded-lg text-venus-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-venus-500 text-sm">No services yet. Add one!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Form ── */}
        <div className="lg:col-span-1">
          {showForm ? (
            <div className="card-dark p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-white">{isEditing ? 'Edit Service' : 'New Service'}</h2>
                <button onClick={cancel} className="text-venus-500 hover:text-venus-300 transition-colors">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label-dark">Name</label>
                  <input name="name" value={form.name} onChange={inp} required placeholder="e.g. Premium Cut" className="input-dark" />
                </div>
                <div>
                  <label className="label-dark">Description</label>
                  <textarea name="description" value={form.description} onChange={inp} required rows={3}
                    placeholder="Brief description…"
                    className="input-dark resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label-dark">Price ($)</label>
                    <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={inp} required placeholder="0.00" className="input-dark" />
                  </div>
                  <div>
                    <label className="label-dark">Duration (min)</label>
                    <input name="duration" type="number" min="5" step="5" value={form.duration} onChange={inp} required placeholder="30" className="input-dark" />
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
            <div
              onClick={openAdd}
              className="card-dark p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-venus-500/50 transition-all"
              style={{ minHeight: '200px', borderStyle: 'dashed' }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(95,111,46,0.15)' }}>
                <PlusIcon className="w-6 h-6 text-venus-400" />
              </div>
              <p className="font-bold text-venus-300 text-sm">Add New Service</p>
              <p className="text-xs text-venus-500 mt-1">Click to open form</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
