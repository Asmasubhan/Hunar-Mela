import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const categories = [
  'Paintings',
  'Handmade Jewelry',
  'Home Decor',
  'Traditional Crafts',
  'Sculptures',
  'Textiles'
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 99999999]);
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products logic directly inside useEffect
    let filtered = products.filter(product =>
      (selectedCategory === '' || product.category === selectedCategory) &&
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    filtered.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } else {
        console.log('Fetched products:', data);
        setProducts(data || []);
      }
    } catch (error) {
      console.error('Error in fetchProducts:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 1000]);
    setSortBy('name');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="flex flex-wrap gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat} >{cat}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Min Price</label>
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Max Price</label>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="border px-4 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-4 py-2 rounded"
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Clear Filters
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <Loading />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;