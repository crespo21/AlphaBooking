import React, { useState } from 'react';
import { SaveIcon } from 'lucide-react';
export const SystemSettings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [reminderTime, setReminderTime] = useState('24');
  const [paymentGateway, setPaymentGateway] = useState('stripe');
  const [cancellationPolicy, setCancellationPolicy] = useState('24');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('America/New_York');
  const handleSaveSettings = () => {
    // In a real app, this would make an API call
    alert('Settings saved successfully!');
  };
  return <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">System Settings</h1>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <input type="checkbox" id="emailNotifications" checked={emailNotifications} onChange={e => setEmailNotifications(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="emailNotifications" className="ml-2 text-gray-700">
              Enable email notifications
            </label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" id="smsNotifications" checked={smsNotifications} onChange={e => setSmsNotifications(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="smsNotifications" className="ml-2 text-gray-700">
              Enable SMS notifications (additional charges may apply)
            </label>
          </div>
          <div>
            <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700 mb-1">
              Send appointment reminders
            </label>
            <select id="reminderTime" value={reminderTime} onChange={e => setReminderTime(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="1">1 hour before</option>
              <option value="2">2 hours before</option>
              <option value="24">24 hours before</option>
              <option value="48">48 hours before</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Payment Settings</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="paymentGateway" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Gateway
            </label>
            <select id="paymentGateway" value={paymentGateway} onChange={e => setPaymentGateway(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
              <option value="square">Square</option>
            </select>
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select id="currency" value={currency} onChange={e => setCurrency(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
            </select>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Booking Settings</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="cancellationPolicy" className="block text-sm font-medium text-gray-700 mb-1">
              Cancellation Policy
            </label>
            <select id="cancellationPolicy" value={cancellationPolicy} onChange={e => setCancellationPolicy(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="0">No cancellation allowed</option>
              <option value="1">Up to 1 hour before</option>
              <option value="4">Up to 4 hours before</option>
              <option value="24">Up to 24 hours before</option>
              <option value="48">Up to 48 hours before</option>
            </select>
          </div>
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
              Business Timezone
            </label>
            <select id="timezone" value={timezone} onChange={e => setTimezone(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button onClick={handleSaveSettings} className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          <SaveIcon className="w-4 h-4 mr-1" />
          Save Settings
        </button>
      </div>
    </div>;
};