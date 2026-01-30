import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { generateProductDescription } from '../services/ai';
import imageCompression from 'browser-image-compression';
import Loading from '../components/Loading';

const categories = [
  'Paintings',
  'Handmade Jewelry',
  'Home Decor',
  'Traditional Crafts',
  'Sculptures',
  'Textiles'
];

const SellerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sellerProfile, setSellerProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [salesStats, setSalesStats] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    material: '',
    region_culture: '',
    product_type: 'limited',
    stock_quantity: ''
  });

  // Profile form data
  const [profileForm, setProfileForm] = useState({
    business_name: '',
    business_type: 'individual',
    description: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    website: '',
    social_media: { facebook: '', instagram: '', twitter: '' }
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');

  const fetchSellerProfile = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('seller_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setSellerProfile(data);
        setProfileForm({
          business_name: data.business_name || '',
          business_type: data.business_type || 'individual',
          description: data.description || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          address: data.address || '',
          website: data.website || '',
          social_media: data.social_media || { facebook: '', instagram: '', twitter: '' }
        });
      }
    } catch (error) {
      console.error('Error fetching seller profile:', error);
    }
  }, [user]);

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    }
  }, [user]);

  const fetchSalesStats = useCallback(async () => {
    if (!user) return;
    
    try {
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', user.id);

      const { data: orderItems } = await supabase
        .from('order_items')
        .select(`
          quantity,
          products!inner(seller_id)
        `)
        .eq('products.seller_id', user.id);

      const totalSold = orderItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

      const { data: revenueData } = await supabase
        .from('order_items')
        .select(`
          quantity,
          price,
          products!inner(seller_id)
        `)
        .eq('products.seller_id', user.id);

      const totalRevenue = revenueData?.reduce((sum, item) => sum + (item.quantity * item.price), 0) || 0;

      setSalesStats({
        totalProducts: totalProducts || 0,
        totalSold,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching sales stats:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSellerProfile();
      fetchProducts();
      fetchSalesStats();
    }
  }, [user, fetchSellerProfile, fetchProducts, fetchSalesStats]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const isApplyingForApproval = !sellerProfile || sellerProfile.approval_status === 'rejected' || !sellerProfile.approval_status;

      const { error } = await supabase
        .from('seller_profiles')
        .upsert({
          user_id: user.id,
          ...profileForm,
          approval_status: isApplyingForApproval ? 'pending' : sellerProfile.approval_status,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      await fetchSellerProfile();

      if (isApplyingForApproval) {
        alert('Profile saved successfully! Your application for seller approval has been submitted.');
      } else {
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setImageError('Image file is too large. Please select an image under 10MB.');
      return;
    }

    setImageError('');
    setUploadingImage(true);

    try {
      const options = {
        maxSizeMB: 0.5, // 500KB max
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        quality: 0.8
      };

      const compressedFile = await imageCompression(file, options);

      setImageFile(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
    } catch (error) {
      console.error('Error compressing image:', error);
      setImageError('Error processing image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return '';

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Upload failed:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.name || !formData.category) {
      setError('Please fill in product name and category first');
      return;
    }

    setGeneratingDescription(true);
    setError('');

    try {
      const { description, background } = await generateProductDescription(
        formData.name,
        formData.category,
        formData.material,
        formData.region_culture,
        imageFile 
      );

      if (description && background) {
        setFormData(prev => ({
          ...prev,
          description: `${description}\n\n${background}`
        }));
      } else {
        setError('Failed to generate description. Please try again.');
      }
    } catch (error) {
      console.error('Error generating description:', error);
      setError('Failed to generate description. Please try again.');
    } finally {
      setGeneratingDescription(false);
    }
  };

const handleProductTypeChange = (productType) => {
    let stock = formData.stock_quantity;
    
    if (productType === 'unique') {
      stock = '1';
    } else if (productType === 'mass') {
      stock = '';
    }

    setFormData(prev => ({
      ...prev,
      product_type: productType,
      stock_quantity: stock
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!sellerProfile || sellerProfile.approval_status !== 'approved') {
      setError('Your seller account is not approved yet. Please complete your profile and wait for admin approval.');
      setLoading(false);
      return;
    }

    try {
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      if (!imageFile) {
        throw new Error('Please upload a product image');
      }

      const imageUrl = await uploadImage();

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        material: formData.material.trim(),
        region_culture: formData.region_culture.trim(),
        product_type: formData.product_type,
        stock_quantity: formData.product_type === 'mass' 
    ? 999999 
    : (parseInt(formData.stock_quantity) || 0),
        seller_id: user.id,
        image_url: imageUrl
      };

      const { error: insertError } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (insertError) throw insertError;

      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        material: '',
        region_culture: '',
        product_type: 'limited',
        stock_quantity: ''
      });
      setImageFile(null);
      setImagePreview('');
      setShowForm(false);
      await fetchProducts();
      await fetchSalesStats();

    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.user_metadata?.role !== 'seller') {
    return <div className="container mx-auto px-4 py-8">Access denied. Please sign in as a seller.</div>;
  }

  const isApproved = sellerProfile?.approval_status === 'approved';
  const isPending = sellerProfile?.approval_status === 'pending' || !sellerProfile;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>

      {/* Approval Status Banner */}
      {isPending && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <span className="font-semibold">Waiting for Approval</span>
          </div>
          <p className="mt-1">Your seller account is pending admin approval. Please complete your profile below and wait for approval before adding products.</p>
        </div>
      )}

      {sellerProfile?.approval_status === 'rejected' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <span className="font-semibold">Application Rejected</span>
          </div>
          <p className="mt-1">Reason: {sellerProfile.rejection_reason || 'No reason provided'}</p>
          <p className="mt-1">Please update your profile and reapply.</p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'dashboard'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'products'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'profile'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Edit Details
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-orange-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Total Products</h3>
              <p className="text-3xl font-bold text-blue-600">{salesStats.totalProducts}</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Items Sold</h3>
              <p className="text-3xl font-bold text-green-600">{salesStats.totalSold}</p>
            </div>
            <div className="bg-purple-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">Total Revenue</h3>
              <p className="text-3xl font-bold text-purple-600">${salesStats.totalRevenue?.toFixed(2)}</p>
            </div>
          </div>

          {sellerProfile && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Business Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Business Name</p>
                  <p className="font-medium">{sellerProfile.business_name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium capitalize">{sellerProfile.business_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approval Status</p>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    sellerProfile.approval_status === 'approved' ? 'bg-green-100 text-green-800' :
                    sellerProfile.approval_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {sellerProfile.approval_status?.charAt(0).toUpperCase() + sellerProfile.approval_status?.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Email</p>
                  <p className="font-medium">{sellerProfile.contact_email || 'Not set'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          {isApproved && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-orange-500 text-white px-4 py-2 rounded mb-4 hover:bg-orange-600"
            >
              {showForm ? 'Cancel' : 'Add New Product'}
            </button>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {showForm && isApproved && (
            <form onSubmit={handleSubmit} className="border rounded p-6 mb-8 bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">Add New Product</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

            <div>
              <label className="block text-sm font-medium mb-1">Material</label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) => setFormData(prev => ({ ...prev, material: e.target.value }))}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Region/Culture</label>
              <input
                type="text"
                value={formData.region_culture}
                onChange={(e) => setFormData(prev => ({ ...prev, region_culture: e.target.value }))}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

<div>
              <label className="block text-sm font-medium mb-1">Product Type</label>
              <select
                value={formData.product_type}
                onChange={(e) => handleProductTypeChange(e.target.value)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="unique">Unique Piece (1 of 1)</option>
                <option value="limited">Limited Edition</option>
                <option value="mass">Mass Produced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity</label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, stock_quantity: e.target.value }))}
                className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  (formData.product_type === 'mass' || formData.product_type === 'unique') ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                disabled={formData.product_type === 'mass' || formData.product_type === 'unique'}
                placeholder={formData.product_type === 'mass' ? "Infinite" : ""}
                min="1"
                required={formData.product_type === 'limited'}
              />
              {formData.product_type === 'unique' && (
                <p className="text-xs text-blue-600 mt-1">Unique items are restricted to a quantity of 1.</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Product Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {uploadingImage && (
              <div className="mt-2 flex items-center gap-2">
                <Loading size="sm" />
                <span className="text-sm text-gray-600">Compressing image...</span>
              </div>
            )}
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-32 h-32 object-cover border rounded"
                />
              </div>
            )}
            {imageError && (
              <p className="text-red-500 mt-1 text-sm">{imageError}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              placeholder="Describe your product..."
            />
            <button
              type="button"
              onClick={handleGenerateDescription}
              disabled={generatingDescription || !formData.name || !formData.category}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 text-sm flex items-center gap-2"
            >
              {generatingDescription && <Loading size="sm" />}
              {generatingDescription ? 'Generating...' : 'Generate AI Description'}
            </button>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={loading || !imageFile}
              className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loading size="sm" />}
              Add Product
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{product.category}</p>
            <p className="text-green-600 font-bold">${product.price}</p>
            <p className="text-sm text-gray-500">Stock: {product.stock_quantity}</p>
            <p className="text-xs text-gray-400 capitalize">{product.product_type}</p>
          </div>
        ))}
      </div>
    </div>
  )}

  {/* Profile Tab */}
  {activeTab === 'profile' && (
    <div className="max-w-2xl">
      <form onSubmit={handleProfileSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Business/Individual Name *</label>
          <input
            type="text"
            value={profileForm.business_name}
            onChange={(e) => setProfileForm({...profileForm, business_name: e.target.value})}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type *</label>
          <select
            value={profileForm.business_type}
            onChange={(e) => setProfileForm({...profileForm, business_type: e.target.value})}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="individual">Individual Artist/Craftsman</option>
            <option value="business">Business/Company</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <textarea
            value={profileForm.description}
            onChange={(e) => setProfileForm({...profileForm, description: e.target.value})}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            placeholder="Tell customers about yourself, your background, and what makes your work special..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email *</label>
            <input
              type="email"
              value={profileForm.contact_email}
              onChange={(e) => setProfileForm({...profileForm, contact_email: e.target.value})}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Phone</label>
            <input
              type="tel"
              value={profileForm.contact_phone}
              onChange={(e) => setProfileForm({...profileForm, contact_phone: e.target.value})}
              className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea
            value={profileForm.address}
            onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
            placeholder="Your business address or location"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Website</label>
          <input
            type="url"
            value={profileForm.website}
            onChange={(e) => setProfileForm({...profileForm, website: e.target.value})}
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://yourwebsite.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Social Media</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Facebook</label>
              <input
                type="url"
                value={profileForm.social_media.facebook}
                onChange={(e) => setProfileForm({
                  ...profileForm,
                  social_media: {...profileForm.social_media, facebook: e.target.value}
                })}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Instagram</label>
              <input
                type="url"
                value={profileForm.social_media.instagram}
                onChange={(e) => setProfileForm({
                  ...profileForm,
                  social_media: {...profileForm.social_media, instagram: e.target.value}
                })}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Twitter</label>
              <input
                type="url"
                value={profileForm.social_media.twitter}
                onChange={(e) => setProfileForm({
                  ...profileForm,
                  social_media: {...profileForm.social_media, twitter: e.target.value}
                })}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://twitter.com/..."
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-3 px-4 rounded hover:bg-orange-700 disabled:opacity-50 font-medium"
        >
          {loading ? 'Saving...' : (!sellerProfile || sellerProfile.approval_status === 'rejected' || !sellerProfile.approval_status ? 'Save Profile & Apply for Approval' : 'Save Info')}
        </button>
      </form>
    </div>
  )}
</div>);
}

export default SellerDashboard;