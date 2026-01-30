import React from "react";

// Individual Product Card
const ProductCard = ({ image, category, title, description, categoryColor = "bg-orange-500" }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:-translate-y-3 hover:scale-105 cursor-pointer group">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      <div className="p-6">
        <span className={`${categoryColor} text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-3 transition-all duration-300 group-hover:px-4`}>
          {category}
        </span>
        <h3 className="text-xl font-bold text-gray-900 leading-snug mb-2 transition-colors duration-300 group-hover:text-orange-600">
          {description}
        </h3>
      </div>
    </div>
  );
};

// Products Section (Grid of products)
const ProductsSection = () => {
  const products = [
    { 
      category: "paintings", 
      title: "Paintings",
      description: "Discover Beautiful Handcrafted Paintings That Bring Life to Your Walls",
      image: "/home_images/P.jpeg",
      categoryColor: "bg-orange-500"
    },
    { 
      category: "Jewelry", 
      title: "Handmade Jewelry",
      description: "Unique Artisan Jewelry Pieces That Add Elegance to Every Outfit",
      image: "/home_images/J.jpeg",
      categoryColor: "bg-orange-500"
    },
    { 
      category: "Home Decor", 
      title: "Home Decor",
      description: "Transform Your Space with Stunning Handmade Decor Items",
      image: "/home_images/HD.jpeg",
      categoryColor: "bg-orange-500"
    },
    { 
      category: "Traditional Crafts", 
      title: "Traditional Crafts",
      description: "Authentic Traditional Crafts That Celebrate Cultural Heritage",
      image: "/home_images/TC.jpeg",
      categoryColor: "bg-orange-500"
    },
    { 
      category: "Sculptures", 
      title: "Sculptures",
      description: "Exquisite Handcrafted Sculptures That Make a Bold Statement",
      image: "/home_images/S.jpeg",
      categoryColor: "bg-orange-500"
    },
    { 
      category: "Textiles", 
      title: "Textiles",
      description: "Premium Quality Handwoven Textiles with Intricate Designs",
      image: "/home_images/T.jpeg",
      categoryColor: "bg-orange-500"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-6">

      <h2 className="text-5xl font-bold text-center text-gray-900 mb-12">
        Browse <span className="text-orange-600">Categories</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <ProductCard 
            key={index} 
            category={product.category}
            title={product.title} 
            description={product.description}
            image={product.image}
            categoryColor={product.categoryColor}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;