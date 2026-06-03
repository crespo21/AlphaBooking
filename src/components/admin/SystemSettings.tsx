import React, { useState } from 'react';
import { SaveIcon, BellIcon, CreditCardIcon, CalendarIcon, GlobeIcon } from 'lucide-react';

export const SystemSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications]     = useState(false);
  const [reminderTime, setReminderTime]             = useState('24');
  const [paymentGateway, setPaymentGateway]         = useState('stripe');
  const [cancellationPolicy, setCancellationPolicy] = useState('24');
  const [currency, setCurrency]                     = useState('USD');
  const [timezone, setTimezone]                     = useState('America/New_York');
  const [saved, setSaved]                           = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const Toggle = ({ id, checked, onChange, label, sub }: { id: string; checked: boolean; onChange: (v: boolean) => void; label: string; sub?: string }) => (
    <div className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        {sub && <p className="text-xs text-violet-500 mt-0.5">{sub}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
        style={{ background: checked ? '#7C3AED' : 'rgba(45,32,96,0.80)' }}
      >
        <span className="absolute top-0.5 inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200"
          style={{ transform: checked ? 'translateX(20px)' : 'translateX(2px)' }} />
      </button>
    </div>
  );

  const SelectField = ({ label, value, onChange, options }: {
    label: string; value: string; onChange: (v: string) => void;
    options: { value: string; label: string }[];
  }) => (
    <div>
      <label className="label-dark">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="input-dark">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <div className="animate-fadeIn max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-1">System Settings</h1>
        <p className="text-violet-400 text-sm">Configure notifications, payments, and booking rules.</p>
      </div>

      {/* Notifications */}
      <div className="section-dark mb-5">
        <div className="flex items-center gap-2 mb-4">
          <BellIcon className="w-4 h-4 text-venus-400" />
          <h2 className="font-bold text-white">Notifications</h2>
        </div>
        <Toggle id="email" checked={emailNotifications} onChange={setEmailNotifications}
          label="Email notifications" sub="Send booking confirmations and reminders by email" />
        <Toggle id="sms" checked={smsNotifications} onChange={setSmsNotifications}
          label="SMS notifications" sub="Additional charges may apply from your SMS provider" />
        <div className="pt-4">
          <SelectField label="Reminder timing" value={reminderTime} onChange={setReminderTime} options={[
            { value: '1',  label: '1 hour before'  },
            { value: '2',  label: '2 hours before' },
            { value: '24', label: '24 hours before' },
            { value: '48', label: '48 hours before' },
          ]} />
        </div>
      </div>

      {/* Payment */}
      <div className="section-dark mb-5">
        <div className="flex items-center gap-2 mb-4">
          <CreditCardIcon className="w-4 h-4 text-venus-400" />
          <h2 className="font-bold text-white">Payment</h2>
        </div>
        <div className="space-y-4">
          <SelectField label="Payment gateway" value={paymentGateway} onChange={setPaymentGateway} options={[
            { value: 'stripe',  label: 'Stripe'  },
            { value: 'paypal',  label: 'PayPal'  },
            { value: 'square',  label: 'Square'  },
          ]} />
          <SelectField label="Currency" value={currency} onChange={setCurrency} options={[
            { value: 'USD', label: 'USD — US Dollar'        },
            { value: 'EUR', label: 'EUR — Euro'             },
            { value: 'GBP', label: 'GBP — British Pound'    },
            { value: 'CAD', label: 'CAD — Canadian Dollar'  },
            { value: 'AUD', label: 'AUD — Australian Dollar' },
          ]} />
        </div>
      </div>

      {/* Booking rules */}
      <div className="section-dark mb-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-4 h-4 text-venus-400" />
          <h2 className="font-bold text-white">Booking Rules</h2>
        </div>
        <div className="space-y-4">
          <SelectField label="Cancellation policy" value={cancellationPolicy} onChange={setCancellationPolicy} options={[
            { value: '0',  label: 'No cancellation allowed'  },
            { value: '1',  label: 'Up to 1 hour before'      },
            { value: '4',  label: 'Up to 4 hours before'     },
            { value: '24', label: 'Up to 24 hours before'    },
            { value: '48', label: 'Up to 48 hours before'    },
          ]} />
          <SelectField label="Business timezone" value={timezone} onChange={setTimezone} options={[
            { value: 'America/New_York',    label: 'Eastern Time (ET)'   },
            { value: 'America/Chicago',     label: 'Central Time (CT)'   },
            { value: 'America/Denver',      label: 'Mountain Time (MT)'  },
            { value: 'America/Los_Angeles', label: 'Pacific Time (PT)'   },
            { value: 'Europe/London',       label: 'London (GMT)'        },
          ]} />
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-venus text-sm"
          style={saved ? { background: 'linear-gradient(135deg, #059669, #047857)' } : {}}>
          <SaveIcon className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};
