import { useState, useEffect } from "react";
import ProductCard from "./component/ProductCard";

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);

  // ✅ Fetch products
  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=50")
      .then((res) => res.json())
      .then((data) => {
        const formattedProducts = data.products.map((p) => ({
          id: p.id,
          image: p.thumbnail,
          productName: p.title,
          description: p.description,
          price: p.price * 60,
          category: p.category,
        }));
        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // ✅ Filters & Sorting
  useEffect(() => {
    let result = [...products];

    if (search) {
      result = result.filter((p) =>
        p.productName.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category !== "All") {
      result = result.filter((p) => p.category === category);
    }
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (sort === "low-high") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  }, [search, sort, priceRange, category, products]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.productName} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* HEADER */}
      <header className="text-center py-6 bg-[#090040] text-white shadow-md">
        <h1 className="text-3xl font-bold">🛍 E-Commerce Shop</h1>
        <p className="text-sm">Find the best product deals here!</p>
      </header>

      {/* FILTERS */}
      <div className="flex flex-wrap justify-center items-center gap-4 py-6 bg-gray-800 shadow-md">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-md text-gray-900 w-64"
        />

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2 rounded-md bg-gray-700"
        >
          <option value="default">Sort By</option>
          <option value="low-high">Price: Low → High</option>
          <option value="high-low">Price: High → Low</option>
        </select>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 rounded-md bg-gray-700"
        >
          <option value="All">All Categories</option>
          {[...new Set(products.map((p) => p.category))].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <div className="flex items-center gap-2">
          <label>₱{priceRange[0]} - ₱{priceRange[1]}</label>
          <input
            type="range"
            min="0"
            max="5000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
            className="w-40"
          />
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6 justify-items-center">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            productName={product.productName}
            price={product.price}
            description={product.description}
            onAddToCart={() => addToCart(product)}
          />
        ))}
      </div>

      {/* CART SECTION */}
      <div className="bg-gray-800 p-6 mt-6 shadow-inner max-w-3xl mx-auto rounded-lg">
        <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-400">No items in cart.</p>
        ) : (
          <ul className="list-disc pl-6 space-y-1">
            {cart.map((item, index) => (
              <li key={index}>
                {item.productName} - ₱{item.price}
              </li>
            ))}
          </ul>
        )}
        <h3 className="text-xl font-bold mt-4">
          Total: ₱{cart.reduce((sum, item) => sum + item.price, 0)}
        </h3>
        <button
          disabled={cart.length === 0}
          className={`mt-4 px-5 py-3 rounded-lg text-white text-lg transition ${
            cart.length === 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700"
          }`}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default App;
