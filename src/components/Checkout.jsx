import { useState } from 'react';

export default function Checkout({
  cart,
  totalPrice,
  onClose,
  onPlaceOrder,
  isPlacingOrder
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  const [formError, setFormError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (cart.length === 0) {
      setFormError('Giỏ hàng đang trống.');
      return;
    }

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      setFormError('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (!/^(0|\+84)\d{9,10}$/.test(formData.phone.trim())) {
      setFormError('Số điện thoại chưa đúng định dạng.');
      return;
    }

    setFormError('');

    onPlaceOrder({
      customer: formData,
      items: cart,
      totalPrice
    });
  }

  return (
    <section className="checkout">
      <div className="checkout-header">
        <h2>Thông tin nhận hàng</h2>

        <button 
            type="button" 
            className="checkout-close-button"
            onClick={onClose}
            aria-label="Đóng biểu mẫu đặt hàng"
        >
          X Đóng
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Họ và tên</label>

          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Nhập họ và tên"
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>

          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Ví dụ: 0912345678"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Địa chỉ nhận hàng</label>

          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Số nhà, đường, phường/xã..."
            rows={3}
          />
        </div>

        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <div className="checkout-summary">
          <p>Số sản phẩm: {cart.reduce(
            (total, item) => total + item.quantity,
            0
          )}</p>

          <p>
            Tổng tiền: {totalPrice.toLocaleString('vi-VN')}
          </p>
        </div>

        <button
          className="checkout-submit"
          type="submit"
          disabled={cart.length === 0 || isPlacingOrder}
        >
          {isPlacingOrder
            ? 'Đang xử lý...'
            : 'Xác nhận đặt hàng'}
        </button>
      </form>
    </section>
  );
}