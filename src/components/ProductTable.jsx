export default function ProductTable({
  products,
  onAddToCart,
  onViewDetails
}) {
  if (products.length === 0) {
    return (
      <p className="empty-products">
        Không tìm thấy sản phẩm phù hợp.
      </p>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <div className="product-image-wrapper">
            <img
              className="product-image"
              src={product.thumbnail}
              alt={product.name}
              loading="lazy"
              onError={(event) => {
                event.currentTarget.style.visibility = 'hidden';
              }}
            />
          </div>

          <div className="product-card-content">
            <span className="product-category">
              {product.category}
            </span>

            <h3 className="product-name">
              {product.name}
            </h3>

            <p className="product-price">
              {product.price.toLocaleString('vi-VN')}
            </p>

            <span
              className={`stock-badge ${
                product.stocked ? 'in-stock' : 'out-of-stock'
              }`}
            >
              {product.stocked ? 'Còn hàng' : 'Hết hàng'}
            </span>

            <div className="product-actions">
              <button
                className="add-to-cart-button"
                disabled={!product.stocked}
                onClick={() => onAddToCart(product)}
              >
                + Thêm vào giỏ hàng
              </button>

              <button
                className="view-details-button"
                onClick={() => onViewDetails(product)}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}