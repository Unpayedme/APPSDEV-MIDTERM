function ProductCard({ image, productName, price, description }) {
  return (
    <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-4 flex flex-col justify-between w-60">
      <img
        src={image}
        alt={productName}
        className="w-full h-40 object-contain mb-3 rounded-lg"
      />
      <h2 className="text-lg font-semibold text-white truncate">
        {productName}
      </h2>
      <h3 className="text-blue-400 font-bold mt-1">₱{price}</h3>
      <p className="text-gray-400 text-sm line-clamp-2 overflow-hidden">
        {description}
      </p>
      <button className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition">
        Buy Now
      </button>
    </div>
  );
}

export default ProductCard;
