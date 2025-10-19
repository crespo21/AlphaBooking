import React, { useState, useRef, useEffect } from 'react';
import { SaveIcon, UploadIcon, LinkIcon } from 'lucide-react';
import { getStaff } from '../../lib/database';
import { Staff } from '../../lib/supabase';

export const BrandingCustomization: React.FC = () => {
  const [primaryColor, setPrimaryColor] = useState('#3B82F6'); // Default blue color
  const [logoUrl, setLogoUrl] = useState('https://via.placeholder.com/150x50?text=Your+Logo');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const data = await getStaff();
      setStaff(data);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };
  // Business hours state
  const [businessHours, setBusinessHours] = useState({
    monday: {
      open: '09:00',
      close: '17:00',
      isOpen: true
    },
    tuesday: {
      open: '09:00',
      close: '17:00',
      isOpen: true
    },
    wednesday: {
      open: '09:00',
      close: '17:00',
      isOpen: true
    },
    thursday: {
      open: '09:00',
      close: '17:00',
      isOpen: true
    },
    friday: {
      open: '09:00',
      close: '17:00',
      isOpen: true
    },
    saturday: {
      open: '10:00',
      close: '15:00',
      isOpen: true
    },
    sunday: {
      open: '10:00',
      close: '15:00',
      isOpen: false
    }
  });
  // Preview states
  const [previewColor, setPreviewColor] = useState(primaryColor);
  const [previewLogo, setPreviewLogo] = useState(logoUrl);
  const [selectedStaffPreview, setSelectedStaffPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreviewColor(e.target.value);
  };
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setPreviewLogo(e.target.value);
    }
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a server and get a URL back
      // For this demo, we'll create a temporary URL
      const tempUrl = URL.createObjectURL(file);
      setPreviewLogo(tempUrl);
    }
  };
  const handleBusinessHoursChange = (day: keyof typeof businessHours, field: 'open' | 'close' | 'isOpen', value: string | boolean) => {
    setBusinessHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };
  const handleSaveChanges = () => {
    // In a real app, this would make an API call
    setPrimaryColor(previewColor);
    setLogoUrl(previewLogo);
    alert('Branding settings saved!');
  };
  return <div className="w-full">
      <h1 className="text-3xl font-bold mb-6">Branding Customization</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Brand Settings</h2>
          <div className="mb-6">
            <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">
              Primary Color
            </label>
            <div className="flex items-center">
              <input type="color" id="primaryColor" value={previewColor} onChange={handleColorChange} className="w-10 h-10 rounded border border-gray-300 p-0 mr-2" />
              <input type="text" value={previewColor} onChange={e => setPreviewColor(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              This color will be used for buttons, links, and highlights
              throughout your booking interface.
            </p>
          </div>
          <div className="mb-6">
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
              Logo
            </label>
            <div className="mt-1 flex items-center">
              <img src={previewLogo} alt="Logo Preview" className="h-12 w-auto object-contain border border-gray-200 rounded-md p-2 mr-4" onError={e => {
              ;
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x50?text=Invalid+URL';
            }} />
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload from device
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
              </div>
              <div className="flex items-center">
                <LinkIcon className="h-4 w-4 mr-2 text-gray-500" />
                <input type="text" id="logoUrl" value={previewLogo} onChange={handleLogoChange} placeholder="Or enter image URL" className="w-full p-2 border border-gray-300 rounded-md text-sm" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Upload your logo or provide a URL. Recommended size: 150x50
              pixels.
            </p>
          </div>
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">
              Business Hours
            </h3>
            <div className="space-y-3">
              {Object.entries(businessHours).map(([day, hours]) => <div key={day} className="flex items-center space-x-4">
                  <div className="w-24">
                    <label className="text-sm font-medium text-gray-700 capitalize">
                      {day}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" checked={hours.isOpen} onChange={e => handleBusinessHoursChange(day as keyof typeof businessHours, 'isOpen', e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-600">Open</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="time" value={hours.open} onChange={e => handleBusinessHoursChange(day as keyof typeof businessHours, 'open', e.target.value)} disabled={!hours.isOpen} className="p-1 border border-gray-300 rounded-md text-sm" />
                    <span className="text-gray-500">to</span>
                    <input type="time" value={hours.close} onChange={e => handleBusinessHoursChange(day as keyof typeof businessHours, 'close', e.target.value)} disabled={!hours.isOpen} className="p-1 border border-gray-300 rounded-md text-sm" />
                  </div>
                </div>)}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Set your business hours to let customers know when they can book
              appointments.
            </p>
          </div>
          <div className="flex justify-end">
            <button onClick={handleSaveChanges} className="flex items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" style={{
            backgroundColor: previewColor
          }}>
              <SaveIcon className="w-4 h-4 mr-1" />
              Save Changes
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Live Preview</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-white p-4 border-b border-gray-200">
              <img src={previewLogo} alt="Company Logo" className="h-10 object-contain" onError={e => {
              ;
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150x50?text=Invalid+URL';
            }} />
            </div>
            <div className="p-6 bg-gray-50">
              <h3 className="text-lg font-semibold mb-3">
                Book Your Appointment
              </h3>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full mr-2" style={{
                  backgroundColor: previewColor
                }}></div>
                  <span className="text-sm font-medium">Select a Service</span>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-white mb-2">
                  <div className="flex justify-between items-center">
                    <span>Haircut & Styling</span>
                    <span className="font-medium">R250.00</span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
                  <span className="text-sm">Select a Date</span>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-white mb-2">
                  <div className="text-center">
                    <span>November 24, 2023</span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full mr-2 bg-gray-300"></div>
                  <span className="text-sm">Select a Time</span>
                </div>
                <div className="border border-gray-200 rounded p-3 bg-white mb-2">
                  <div className="text-center">
                    <span>10:00 AM</span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full mr-2" style={{
                  backgroundColor: previewColor
                }}></div>
                  <span className="text-sm font-medium">
                    Choose Your Stylist (Optional)
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div className={`border rounded-md p-3 bg-white cursor-pointer ${selectedStaffPreview === null ? 'border-blue-500' : 'border-gray-200'}`} onClick={() => setSelectedStaffPreview(null)}>
                    <div className="flex items-center">
                      <div className="ml-2">
                        <p className="text-sm font-medium">
                          Any Available Stylist
                        </p>
                        <p className="text-xs text-gray-500">No preference</p>
                      </div>
                    </div>
                  </div>
                  {loading ? (
                    <div className="text-center text-sm text-gray-500 py-4">
                      Loading staff...
                    </div>
                  ) : staff.map(staffMember => <div key={staffMember.id} className={`border rounded-md p-3 bg-white cursor-pointer ${selectedStaffPreview === staffMember.id ? 'border-blue-500' : 'border-gray-200'}`} onClick={() => setSelectedStaffPreview(staffMember.id)}>
                      <div className="flex items-center">
                        <img src={staffMember.photo} alt={staffMember.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="ml-2">
                          <p className="text-sm font-medium">{staffMember.name}</p>
                          <p className="text-xs text-gray-500">
                          {staffMember.price_surcharge > 0 ? `+R${staffMember.price_surcharge.toFixed(2)}` : 'No additional charge'}
                          </p>
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
              <button className="w-full py-2 px-4 rounded text-white font-medium" style={{
              backgroundColor: previewColor
            }}>
                Continue
              </button>
            </div>
          </div>
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">
              Business Hours Preview
            </h3>
            <div className="space-y-2">
              {Object.entries(businessHours).map(([day, hours]) => <div key={day} className="flex justify-between">
                  <span className="capitalize font-medium">{day}</span>
                  <span>
                    {hours.isOpen ? `${hours.open} - ${hours.close}` : 'Closed'}
                  </span>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </div>;
};