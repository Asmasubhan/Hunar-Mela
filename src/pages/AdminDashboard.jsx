import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import Loading from '../components/Loading';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [Products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sellerProfiles, setSellerProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [approvingSeller, setApprovingSeller] = useState(null);

  useEffect(() => {
    if (user && user.user_metadata?.role === 'admin') {
      fetchStats();
      fetchUsers();
      fetchProducts();
      fetchOrders();
      fetchSellerProfiles();
    }
  }, [user]);

  const fetchStats = async () => {
    const { data: userCount } = await supabase.from('users').select('id', { count: 'exact' });
    const { data: orderCount } = await supabase.from('orders').select('id', { count: 'exact' });
    const { data: revenue } = await supabase.from('orders').select('total_amount');
    const totalRevenue = revenue.reduce((sum, order) => sum + order.total_amount, 0);
    const { data: categories } = await supabase.from('products').select('category');

    setStats({
      users: userCount.length,
      orders: orderCount.length,
      revenue: totalRevenue,
      topCategories: categories.reduce((acc, prod) => {
        acc[prod.category] = (acc[prod.category] || 0) + 1;
        return acc;
      }, {})
    });
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) console.error(error);
    else setUsers(data || []);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) console.error(error);
    else setProducts(data || []);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*');
    if (error) console.error(error);
    else setOrders(data || []);
  };

const fetchSellerProfiles = async () => {
  const { data, error } = await supabase
    .from('seller_profiles')
    .select(`
      *,
      users!inner(email)
    `)
    .eq('approval_status', 'pending'); 

  if (error) console.error(error);
  else setSellerProfiles(data || []);
};

const approveSeller = async (sellerId, userId) => {
  setApprovingSeller(sellerId);
  try {
    const { error: profileError } = await supabase
      .from('seller_profiles')
      .update({
        approval_status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user.id
      })
      .eq('id', sellerId);

    if (profileError) throw profileError;

    const { error: userError } = await supabase
      .from('users')
      .update({ seller_approved: true })
      .eq('id', userId);

    if (userError) throw userError;

    setSellerProfiles(prev => prev.filter(profile => profile.id !== sellerId));
    
    fetchUsers();
    alert('Seller approved successfully!');
  } catch (error) {
    console.error('Error approving seller:', error);
    alert('Failed to approve seller');
  } finally {
    setApprovingSeller(null);
  }
};

const rejectSeller = async (sellerId, reason) => {
  try {
    const { error } = await supabase
      .from('seller_profiles')
      .update({
        approval_status: 'rejected',
        rejection_reason: reason
      })
      .eq('id', sellerId);

    if (error) throw error;

    setSellerProfiles(prev => prev.filter(profile => profile.id !== sellerId));

    alert('Seller application rejected');
  } catch (error) {
    console.error('Error rejecting seller:', error);
    alert('Failed to reject seller application');
  }
};

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  if (!user || user.user_metadata?.role !== 'admin') return <div>Access denied.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'overview'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('sellers')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'sellers'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Seller Approvals ({sellerProfiles.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'orders'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Orders
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-orange-100 p-4 rounded">
              <h3 className="font-semibold">Total Users</h3>
              <p className="text-2xl">{stats.users}</p>
            </div>
            <div className="bg-green-100 p-4 rounded">
              <h3 className="font-semibold">Total Orders</h3>
              <p className="text-2xl">{stats.orders}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded">
              <h3 className="font-semibold">Total Revenue</h3>
              <p className="text-2xl">${stats.revenue?.toFixed(2)}</p>
            </div>
            <div className="bg-purple-100 p-4 rounded">
              <h3 className="font-semibold">Top Category</h3>
              <p className="text-2xl">{Object.keys(stats.topCategories || {}).sort((a,b) => stats.topCategories[b] - stats.topCategories[a])[0]}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Role</th>
                    <th className="border px-4 py-2">Seller Approved</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td className="border px-4 py-2">{u.email}</td>
                      <td className="border px-4 py-2">{u.role}</td>
                      <td className="border px-4 py-2">
                        {u.role === 'seller' ? (u.seller_approved ? 'Yes' : 'No') : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Seller Approvals Tab */}
      {activeTab === 'sellers' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Seller Approval Requests</h2>
          {sellerProfiles.length === 0 ? (
            <p className="text-gray-500">No pending seller applications.</p>
          ) : (
            <div className="space-y-6">
              {sellerProfiles.map(profile => (
                <div key={profile.id} className="border rounded-lg p-6 bg-white shadow">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{profile.business_name}</h3>
                      <p className="text-gray-600 capitalize">{profile.business_type}</p>
                      <p className="text-sm text-gray-500">{profile.users.email}</p>
                    </div>
                    <div>
                      <p className="text-sm"><strong>Contact:</strong> {profile.contact_email}</p>
                      {profile.contact_phone && <p className="text-sm"><strong>Phone:</strong> {profile.contact_phone}</p>}
                      {profile.website && <p className="text-sm"><strong>Website:</strong> <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600">{profile.website}</a></p>}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-gray-700">{profile.description}</p>
                  </div>

                  {profile.address && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Address</h4>
                      <p className="text-gray-700">{profile.address}</p>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => approveSeller(profile.id, profile.user_id)}
                      disabled={approvingSeller === profile.id}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {approvingSeller === profile.id && <Loading size="sm" />}
                      {approvingSeller === profile.id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Reason for rejection:');
                        if (reason) rejectSeller(profile.id, reason);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Order ID</th>
                  <th className="border px-4 py-2">User</th>
                  <th className="border px-4 py-2">Total</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map(o => (
                  <tr key={o.id}>
                    <td className="border px-4 py-2">{o.id}</td>
                    <td className="border px-4 py-2">{o.user_id}</td>
                    <td className="border px-4 py-2">${o.total_amount}</td>
                    <td className="border px-4 py-2">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="border px-4 py-2 text-sm text-gray-600">
                      {o.updated_at ? new Date(o.updated_at).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;