export default function Cart({
  cart,
  onUpdateQuantity,
  onRemove
}) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <section className="cart">
      <div className="cart-header">
        <div>
          <h2>Giỏ hàng</h2>
          <p>{totalQuantity} sản phẩm</p>
        </div>
      </div>

      {cart.length === 0 ? (
        <p className="cart-empty">
          Giỏ hàng đang trống.
        </p>
      ) : (
        <>
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <h3>{item.name}</h3>

                  <p className="cart-unit-price">
                    Giá: {item.price.toLocaleString('vi-VN')} ₫
                  </p>

                  <p className="cart-subtotal">
                    Thành tiền: {(item.price * item.quantity).toLocaleString('vi-VN')} ₫
                  </p>
                </div>

                <div className="cart-actions">
                  <button
                    className="quantity-btn"
                    onClick={() =>
                      onUpdateQuantity(item.id, -1)
                    }
                    aria-label={`Giảm số lượng ${item.name}`}
                  >
                    −
                  </button>

                  <span className="quantity-value">
                    {item.quantity}
                  </span>

                  <button
                    className="quantity-btn"
                    onClick={() =>
                      onUpdateQuantity(item.id, 1)
                    }
                    aria-label={`Tăng số lượng ${item.name}`}
                  >
                    +
                  </button>

                  <button
                    className="remove-btn"
                    onClick={() => onRemove(item.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-total">
            <span>Tổng tiền</span>
            <strong>
              {total.toLocaleString('vi-VN')} ₫
            </strong>
          </div>
        </>
      )}
    </section>
  );
}