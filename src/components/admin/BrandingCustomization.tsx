import React, { useState, useRef } from 'react';
import { SaveIcon, UploadIcon, LinkIcon, PaletteIcon } from 'lucide-react';
import mockStaff from '../../data/mockStaff.json';

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
type DayHours = { open: string; close: string; isOpen: boolean };

const defaultHours: Record<DayKey, DayHours> = {
  monday:    { open: '09:00', close: '17:00', isOpen: true  },
  tuesday:   { open: '09:00', close: '17:00', isOpen: true  },
  wednesday: { open: '09:00', close: '17:00', isOpen: true  },
  thursday:  { open: '09:00', close: '17:00', isOpen: true  },
  friday:    { open: '09:00', close: '17:00', isOpen: true  },
  saturday:  { open: '10:00', close: '15:00', isOpen: true  },
  sunday:    { open: '10:00', close: '15:00', isOpen: false },
};

const VENUS_PRESETS = ['#5F6F2E', '#7A8E3B', '#B5944A', '#DDCA8F', '#06B6D4', '#EF4444'];

export const BrandingCustomization: React.FC = () => {
  const [previewColor, setPreviewColor]       = useState('#5F6F2E');
  const [savedColor, setSavedColor]           = useState('#5F6F2E');
  const [previewLogo, setPreviewLogo]         = useState('');
  const [logoUrlInput, setLogoUrlInput]       = useState('');
  const [businessHours, setBusinessHours]     = useState(defaultHours);
  const [selectedStaffPreview, setSelectedStaffPreview] = useState<string | null>(null);
  const [saved, setSaved]                     = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewLogo(URL.createObjectURL(file));
  };

  const handleSave = () => {
    setSavedColor(previewColor);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const setHours = (day: DayKey, field: keyof DayHours, value: string | boolean) =>
    setBusinessHours((p) => ({ ...p, [day]: { ...p[day], [field]: value } }));

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">Branding</h1>
        <p className="text-venus-400 text-sm">Customise colours, logo, and business hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Settings column ── */}
        <div className="space-y-5">
          {/* Colour */}
          <div className="section-dark">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
              <PaletteIcon className="w-4 h-4 text-venus-400" />
              Primary Colour
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <input type="color" value={previewColor} onChange={(e) => setPreviewColor(e.target.value)}
                className="w-12 h-10 rounded-lg border-0 cursor-pointer bg-transparent" />
              <input type="text" value={previewColor} onChange={(e) => setPreviewColor(e.target.value)}
                className="input-dark flex-1 font-mono" placeholder="#5F6F2E" />
            </div>
            <div className="flex gap-2">
              {VENUS_PRESETS.map((c) => (
                <button key={c} onClick={() => setPreviewColor(c)}
                  className="w-8 h-8 rounded-lg transition-transform hover:scale-110 ring-2 ring-offset-1 ring-offset-night-600"
                  style={{ background: c, ringColor: previewColor === c ? c : 'transparent' }} />
              ))}
            </div>
            <p className="text-xs text-venus-500 mt-3">Used for buttons, highlights, and accent elements.</p>
          </div>

          {/* Logo */}
          <div className="section-dark">
            <h2 className="font-bold text-white mb-4">Logo</h2>
            {previewLogo && (
              <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <img src={previewLogo} alt="Logo preview" className="h-10 object-contain"
                  onError={(e) => (e.currentTarget.src = '')} />
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="btn-outline-venus text-xs py-2.5" style={{ color: '#9BAD55', borderColor: 'rgba(154,173,85,0.40)', background: 'transparent' }}>
                <UploadIcon className="w-3.5 h-3.5" />
                Upload File
              </button>
              <input ref={fileInputRef} type="file" onChange={handleFileUpload} accept="image/*" className="hidden" />
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-venus-500 shrink-0" />
                <input type="text" value={logoUrlInput}
                  onChange={(e) => { setLogoUrlInput(e.target.value); setPreviewLogo(e.target.value); }}
                  placeholder="Or paste URL…"
                  className="input-dark flex-1 text-xs" />
              </div>
            </div>
            <p className="text-xs text-venus-500 mt-3">Recommended: 150 × 50 px, PNG or SVG.</p>
          </div>

          {/* Business hours */}
          <div className="section-dark">
            <h2 className="font-bold text-white mb-4">Business Hours</h2>
            <div className="space-y-3">
              {(Object.entries(businessHours) as [DayKey, DayHours][]).map(([day, h]) => (
                <div key={day} className="flex items-center gap-3">
                  <span className="w-20 text-xs font-semibold text-venus-300 capitalize">{day}</span>

                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => setHours(day, 'isOpen', !h.isOpen)}
                    className="toggle-venus relative w-11 h-6 rounded-full transition-colors duration-200"
                    style={{ background: h.isOpen ? '#5F6F2E' : 'rgba(37,43,14,0.80)' }}
                  >
                    <span className="toggle-venus-thumb absolute top-0.5 transition-transform duration-200"
                      style={{ transform: h.isOpen ? 'translateX(20px)' : 'translateX(2px)' }} />
                  </button>
                  <span className="text-xs text-venus-500 w-10">{h.isOpen ? 'Open' : 'Closed'}</span>

                  {h.isOpen && (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input type="time" value={h.open} onChange={(e) => setHours(day, 'open', e.target.value)}
                        className="input-dark text-xs py-1.5 px-2 flex-1" />
                      <span className="text-venus-500 text-xs">–</span>
                      <input type="time" value={h.close} onChange={(e) => setHours(day, 'close', e.target.value)}
                        className="input-dark text-xs py-1.5 px-2 flex-1" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} className="btn-venus text-sm"
              style={saved ? { background: 'linear-gradient(135deg, #059669, #047857)' } : {}}>
              <SaveIcon className="w-4 h-4" />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* ── Preview column ── */}
        <div>
          <h2 className="font-bold text-white mb-4">Live Preview</h2>

          {/* Booking preview */}
          <div className="rounded-2xl overflow-hidden mb-5" style={{ border: '1px solid rgba(95,111,46,0.25)' }}>
            <div className="px-5 py-4 bg-white flex items-center justify-between">
              {previewLogo
                ? <img src={previewLogo} alt="logo" className="h-8 object-contain" onError={(e) => (e.currentTarget.src = '')} />
                : <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg" style={{ background: previewColor }} />
                    <span className="font-black text-gray-900 text-sm">AlphaBooking</span>
                  </div>
              }
              <button className="px-4 py-2 rounded-lg text-white text-xs font-bold" style={{ background: previewColor }}>
                Book Now
              </button>
            </div>
            <div className="p-5 bg-gray-50 space-y-3">
              {['Select a Service', 'Pick a Date', 'Choose a Time'].map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: i === 0 ? previewColor : '#D1D5DB' }}>
                    {i + 1}
                  </div>
                  <span className={`text-sm font-medium ${i === 0 ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
                </div>
              ))}
              <div className="space-y-2 pt-1">
                <div className="p-3 bg-white rounded-xl border-2 text-sm font-medium text-gray-800"
                  style={{ borderColor: previewColor }}>
                  ✓ Premium Styling — $135.00
                </div>
                {mockStaff.slice(0, 2).map((s) => (
                  <button key={s.id} onClick={() => setSelectedStaffPreview(s.id)}
                    className="w-full p-3 bg-white rounded-xl border-2 flex items-center gap-3 transition-all"
                    style={{ borderColor: selectedStaffPreview === s.id ? previewColor : '#E5E7EB' }}>
                    <img src={s.photo} alt={s.name} className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-sm font-medium text-gray-800">{s.name}</span>
                  </button>
                ))}
              </div>
              <button className="w-full py-3 rounded-xl text-white text-sm font-bold" style={{ background: previewColor }}>
                Continue →
              </button>
            </div>
          </div>

          {/* Hours preview */}
          <div className="section-dark">
            <h3 className="font-bold text-white mb-3 text-sm">Business Hours Preview</h3>
            <div className="space-y-2">
              {(Object.entries(businessHours) as [DayKey, DayHours][]).map(([day, h]) => (
                <div key={day} className="flex justify-between text-xs">
                  <span className="capitalize text-venus-300 font-semibold">{day}</span>
                  <span className={h.isOpen ? 'text-white' : 'text-venus-500'}>
                    {h.isOpen ? `${h.open} – ${h.close}` : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
