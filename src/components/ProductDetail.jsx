export default function ProductDetail({
  product,
  onClose,
  onAddToCart
}) {
  if (!product) {
    return null;
  }

  return (
    <div className="detail-overlay" onClick={onClose}>
      <section
        className="detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="detail-close"
          onClick={onClose}
          aria-label="Đóng chi tiết sản phẩm"
        >
          ×
        </button>

        <div className="detail-content">
          <img
            className="detail-image"
            src={product.thumbnail}
            alt={product.name}
          />

          <div className="detail-info">
            <h2 id="product-detail-title">
              {product.name}
            </h2>

            <p>
              <strong>Thương hiệu:</strong>{' '}
              {product.brand || 'Chưa có thông tin'}
            </p>

            <p>
              <strong>Danh mục:</strong>{' '}
              {product.category}
            </p>

            <p className="detail-price">
              {product.price.toLocaleString('vi-VN')}
            </p>

            <p>
              <strong>Tình trạng:</strong>{' '}
              {product.stocked
                ? 'Còn hàng'
                : 'Hết hàng'}
            </p>

            <p>
              <strong>Số lượng tồn kho:</strong>{' '}
              {product.stock ?? 'Chưa có thông tin'}
            </p>

            <p>
              <strong>Đánh giá:</strong>{' '}
              {product.rating ?? 'Chưa có đánh giá'}
            </p>

            <h3>Mô tả sản phẩm</h3>

            <p>
              {product.description ||
                'Chưa có mô tả cho sản phẩm này.'}
            </p>

            <button
              className="detail-add-button"
              disabled={!product.stocked}
              onClick={() => onAddToCart(product)}
            >
              {product.stocked
                ? 'Thêm vào giỏ hàng'
                : 'Sản phẩm hết hàng'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}