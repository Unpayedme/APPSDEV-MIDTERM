function ProductCard({ image, productName, price, description }) {


  return (
    <div className="container">
      <div className="box">
        <section className="card">
          <img src={image} alt={productName} />
          <h2>{productName}</h2>
          <h3>₱{price}</h3>
          <p>{description}</p>
          <button onClick={function handleClick() {
            alert("Successfully to Buy")
          }}>Buy Now</button>
        </section>
      </div>
    </div>


  )
}
export default ProductCard;