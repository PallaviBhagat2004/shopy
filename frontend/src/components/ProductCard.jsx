import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product._id}`} className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.stock === 0 && <span className="badge-out">Out of stock</span>}
        {product.featured && <span className="badge-featured">Featured</span>}
      </div>
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-meta">
          <span className="product-rating">⭐ {product.rating.toFixed(1)}</span>
          <span className="product-reviews">({product.numReviews})</span>
        </div>
        <p className="product-price">₹{product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}
