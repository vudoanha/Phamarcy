  import { useState, useEffect, useRef, useMemo } from 'react';
  import SearchBar from './components/SearchBar.jsx';
  import ProductTable from './components/ProductTable.jsx';
  import useProducts from './hooks/useProducts.js';
  import Cart from './components/Cart.jsx';
  import ProductDetail from './components/ProductDetail.jsx';
  import Checkout from './components/Checkout.jsx';

  export default function App() {
    // State tìm kiếm
    const [searchText, setSearchText] = useState('');

    // State lọc tồn kho
    const [inStockOnly, setInStockOnly] = useState(false);

    // State danh mục đang chọn
    const [selectedCategory, setSelectedCategory] =
      useState('All');
      
    // State sắp xếp
    const [sortOrder, setSortOrder] = useState('default');

    // State giỏ hàng
    const [cart, setCart] = useState(() => {
      const savedCart = localStorage.getItem('cart');

      return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const {
      products,
      loadingProducts,
      productsError,
      retryLoading
    } = useProducts();

    // Tính danh sách sản phẩm phù hợp
    const filteredProducts = useMemo(() => {
      return products.filter((product) => {
        const matchesSearch = product.name
          .toLowerCase()
          .includes(searchText.trim().toLowerCase());

        const matchesStock =
          !inStockOnly || product.stocked;

        const matchesCategory =
          selectedCategory === 'All' ||
          product.category === selectedCategory;

        return (
          matchesSearch &&
          matchesStock &&
          matchesCategory
      );
    });
  }, [products, searchText, inStockOnly, selectedCategory]);

    const sortedProducts = useMemo(() => {
      const result = [...filteredProducts];

      if (sortOrder === 'asc') {
        result.sort((a, b) => a.price - b.price);
      } else if (sortOrder === 'desc') {
        result.sort((a, b) => b.price - a.price);
      }

      return result;
  }, [filteredProducts, sortOrder]);
    
    const categories = [
      ...new Set(products.map((product) => product.category)),
    ].sort();

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const cartRef = useRef(null);

    const totalPrice = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    function handleAddToCart(product) {
      const existingProduct = cart.find(
        (item) => item.id === product.id
      );
      if (existingProduct) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
    } else {
      setCart([
        ...cart,
        { ...product, quantity: 1 }
      ]);
    }
  }

    function updateQuantity(productId, amount) {
      setCart(
        cart
          .map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity: item.quantity + amount
                }
              : item
          )
          .filter((item) => item.quantity > 0)
      );
  }

    function  removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  }

    function handlePlaceOrder(order) {
      if (isPlacingOrder) {
        return;
      }

      setIsPlacingOrder(true);

      console.log('Đơn hàng mô phỏng:', order);

      setCart([]);
      setIsCheckoutOpen(false);
      setOrderSuccess(true);

      setIsPlacingOrder(false);
    }

    return (
      <main className="page">
        <header className="hero">
          <p className="eyebrow">NHÀ THUỐC TRỰC TUYẾN</p>

          <h1>Capitol Pharmacy</h1>
          <p>Giỏ hàng: {
              cart.reduce((total, item) => total + item.quantity, 0)
            } sản phẩm
          </p>
          <p className="subtitle">
            Chăm sóc sức khỏe của bạn với những sản phẩm
            phù hợp cho nhu cầu hằng ngày.
          </p>
        </header>
          
        <section className="panel">
          <h2>Tìm kiếm sản phẩm</h2>

          <SearchBar
            searchText={searchText}
            onSearchChange={setSearchText}
            inStockOnly={inStockOnly}
            onInStockOnlyChange={setInStockOnly}
          />
          <div className="category-filter">
            <label htmlFor="sort-order">
              Sắp xếp theo giá
            </label>

            <select
              id="sort-order"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value)
              }
            >
              <option value="default">Mặc định</option>

              <option value="asc">Giá từ thấp đến cao</option>

              <option value="desc">Giá từ cao xuống thấp</option>

            </select>
            
            <label htmlFor="category">
              Danh mục sản phẩm
            </label>

            <select
              id="category"
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value)
              }
            >
              <option value="All">
                Tất cả danh mục
              </option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="result-heading">
            <h2>Danh sách sản phẩm</h2>

            <span className="count">
              {filteredProducts.length} sản phẩm
            </span>
          </div>          
          {loadingProducts && products.length === 0 && (
            <p>Đang tải sản phẩm...</p>
          )}

          {productsError && (
            <div className="product-error">
              <p>Lỗi tải sản phẩm: {productsError}</p>

              <button
                type="button"
                onClick={retryLoading}
                disabled={loadingProducts}
              >
                {loadingProducts ? 'Đang tải...' : 'Thử tải lại'}
              </button>
            </div>
          )}
            {!loadingProducts &&
               !productsError &&
               products.length === 0 && (
                <p>Không có sản phẩm nào.</p>
            )}
              {products.length > 0 && (
                <ProductTable
                  products={sortedProducts}
                  onAddToCart={handleAddToCart}
                  onViewDetails={setSelectedProduct}
                />
              )}
          {selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              onClose={() => setSelectedProduct(null)}
              onAddToCart={(product) => {
                handleAddToCart(product);
                setSelectedProduct(null);

                setTimeout(() => {
                  cartRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }, 100);
              }}
            />
          )}
            <div ref={cartRef} id="shopping-cart">
              <Cart
                cart={cart}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            </div>
            
          {cart.length > 0 && (
            <button
              type="button"
              className="checkout-open-button"
              onClick={() => {
                setOrderSuccess(false);
                setIsCheckoutOpen(true);
              }}
            >
              Tiến hành đặt hàng
            </button>
          )}

          {isCheckoutOpen && (
            <Checkout
              cart={cart}
              totalPrice={totalPrice}
              onClose={() => setIsCheckoutOpen(false)}
              onPlaceOrder={handlePlaceOrder}
              isPlacingOrder={isPlacingOrder}
            />
          )}

          {orderSuccess && (
            <section className="order-success">
              <h2>🎉 Đặt hàng thành công!</h2>
              <p>
                Đơn hàng mô phỏng của bạn đã được ghi nhận trên giao diện.
              </p>

              <button
                type="button"
                onClick={() => {
                  setOrderSuccess(false);
                
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                  });
                }}
              >
                Tiếp tục mua sắm
              </button>
            </section>
          )}
        </section>
        <footer className="footer">
          <p>
            © 2026 Capitol Pharmacy — Dự án thực hành ReactJS.
          </p>
          <small>
            Dữ liệu sản phẩm trong phiên bản này chỉ dùng để
            minh họa giao diện và chức năng lọc.
          </small>
        </footer>
      </main>
    );
  }
