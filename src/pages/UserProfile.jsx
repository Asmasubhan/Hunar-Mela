import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import Loading from '../components/Loading';

const UserProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'United States'
  });

  const [billingDetails, setBillingDetails] = useState({
    cardholder_name: '',
    card_number: '',
    expiry_month: '',
    expiry_year: '',
    cvv: '',
    billing_address_same: true,
    billing_address_line_1: '',
    billing_address_line_2: '',
    billing_city: '',
    billing_state: '',
    billing_postal_code: '',
    billing_country: 'United States'
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          phone: data.phone || '',
          address_line_1: data.address_line_1 || '',
          address_line_2: data.address_line_2 || '',
          city: data.city || '',
          state: data.state || '',
          postal_code: data.postal_code || '',
          country: data.country || 'United States'
        });

        if (data.billing_details) {
          setBillingDetails(data.billing_details);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          ...profile,
          billing_details: billingDetails,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleBillingSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          billing_details: billingDetails,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      alert('Billing details updated successfully!');
    } catch (error) {
      console.error('Error updating billing details:', error);
      alert('Failed to update billing details');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div>Please log in to view your profile.</div>;
  if (loading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input
                  type="text"
                  value={profile.first_name}
                  onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input
                  type="text"
                  value={profile.last_name}
                  onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address Line 1</label>
              <input
                type="text"
                value={profile.address_line_1}
                onChange={(e) => setProfile({...profile, address_line_1: e.target.value})}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address Line 2</label>
              <input
                type="text"
                value={profile.address_line_2}
                onChange={(e) => setProfile({...profile, address_line_2: e.target.value})}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({...profile, city: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({...profile, state: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <input
                  type="text"
                  value={profile.postal_code}
                  onChange={(e) => setProfile({...profile, postal_code: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <select
                  value={profile.country}
                  onChange={(e) => setProfile({...profile, country: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Pakistan</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Personal Information'}
            </button>
          </form>
        </div>

        {/* Billing Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
          <form onSubmit={handleBillingSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Cardholder Name</label>
              <input
                type="text"
                value={billingDetails.cardholder_name}
                onChange={(e) => setBillingDetails({...billingDetails, cardholder_name: e.target.value})}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Card Number</label>
              <input
                type="text"
                value={billingDetails.card_number}
                onChange={(e) => setBillingDetails({...billingDetails, card_number: e.target.value.replace(/\D/g, '').slice(0, 16)})}
                className="w-full border rounded px-3 py-2"
                placeholder="1234 5678 9012 3456"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Month</label>
                <select
                  value={billingDetails.expiry_month}
                  onChange={(e) => setBillingDetails({...billingDetails, expiry_month: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">MM</option>
                  {Array.from({length: 12}, (_, i) => (
                    <option key={i+1} value={String(i+1).padStart(2, '0')}>
                      {String(i+1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <select
                  value={billingDetails.expiry_year}
                  onChange={(e) => setBillingDetails({...billingDetails, expiry_year: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value="">YYYY</option>
                  {Array.from({length: 10}, (_, i) => (
                    <option key={i} value={String(new Date().getFullYear() + i)}>
                      {new Date().getFullYear() + i}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                  type="text"
                  value={billingDetails.cvv}
                  onChange={(e) => setBillingDetails({...billingDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="billing_same"
                checked={billingDetails.billing_address_same}
                onChange={(e) => setBillingDetails({...billingDetails, billing_address_same: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="billing_same" className="text-sm">
                Billing address same as shipping address
              </label>
            </div>

            {!billingDetails.billing_address_same && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Billing Address Line 1</label>
                  <input
                    type="text"
                    value={billingDetails.billing_address_line_1}
                    onChange={(e) => setBillingDetails({...billingDetails, billing_address_line_1: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Billing Address Line 2</label>
                  <input
                    type="text"
                    value={billingDetails.billing_address_line_2}
                    onChange={(e) => setBillingDetails({...billingDetails, billing_address_line_2: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Billing City</label>
                    <input
                      type="text"
                      value={billingDetails.billing_city}
                      onChange={(e) => setBillingDetails({...billingDetails, billing_city: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Billing State</label>
                    <input
                      type="text"
                      value={billingDetails.billing_state}
                      onChange={(e) => setBillingDetails({...billingDetails, billing_state: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Billing Postal Code</label>
                    <input
                      type="text"
                      value={billingDetails.billing_postal_code}
                      onChange={(e) => setBillingDetails({...billingDetails, billing_postal_code: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Billing Country</label>
                    <select
                      value={billingDetails.billing_country}
                      onChange={(e) => setBillingDetails({...billingDetails, billing_country: e.target.value})}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Billing Details'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;