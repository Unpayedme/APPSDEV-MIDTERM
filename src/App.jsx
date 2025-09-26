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

  // ✅ Fetch products from DummyJSON API
  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=50")
      .then((res) => res.json())
      .then((data) => {
        // Map API fields to match your product format
        const formattedProducts = data.products.map((p) => ({
          id: p.id,
          image: p.thumbnail,
          productName: p.title,
          description: p.description,
          price: p.price * 60, // convert to php
          category: p.category,
        }));
        setProducts(formattedProducts);
        setFilteredProducts(formattedProducts);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

 
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
    <div style={{ fontFamily: "Arial, sans-serif", background: "#fafafa" }}>
      {/* HEADER */}
      <header
        style={{
          textAlign: "center",
          padding: "20px",
          background: "#ff5722",
          color: "white",
        }}
      >
        <h1 style={{ margin: 0 }}> 🛍 E-Commerce Shop</h1>
        <p style={{ margin: 0 }}>Find the best product deals here!</p>
      </header>

      {/* FILTERS */}
      <div
        style={{
          textAlign: "center",
          padding: "15px",
          background: "white",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        }}
      >
        {/* Search */}
        <input
          type="text"
          placeholder=" Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            margin: "10px",
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "250px",
          }}
        />

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ margin: "10px", padding: "10px", borderRadius: "5px" }}
        >
          <option value="default">Sort By</option>
          <option value="low-high">Price: Low → High</option>
          <option value="high-low">Price: High → Low</option>
        </select>

        {/* Dropdown Category (Dynamic from API) */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ margin: "10px", padding: "10px", borderRadius: "5px" }}
        >
          <option value="All">All Categories</option>
          {[...new Set(products.map((p) => p.category))].map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <label style={{ marginLeft: "10px" }}>
          Price: ₱{priceRange[0]} - ₱{priceRange[1]}
        </label>
        <input
          type="range"
          min="0"
          max="5000"
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
          style={{ marginLeft: "10px" }}
        />
      </div>

      {/* PRODUCT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
          padding: "20px",
        }}
      >
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
      <div
        style={{
          background: "white",
          padding: "20px",
          marginTop: "20px",
          boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <h2>🛒 Your Cart</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">No items in cart.</p>
        ) : (
          <ul className="list-disc pl-6 space-y-1">
            {cart.map((item, index) => (
              <li key={index} className="text-gray-800">
                {item.productName} - ₱{item.price}
              </li>
            ))}
          </ul>
        )}

        <h3 className="text-lg font-bold mt-4">
          Total: ₱{cart.reduce((sum, item) => sum + item.price, 0)}
        </h3>

        <button
          disabled={cart.length === 0}
          className={`mt-4 px-5 py-3 rounded text-white text-lg transition 
            ${cart.length === 0 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-orange-600 hover:bg-orange-700"}`}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

export default App;
