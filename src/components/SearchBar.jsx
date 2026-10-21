export default function SearchBar({
  searchText,
  onSearchChange,
  inStockOnly,
  onInStockOnlyChange,
}) {
  return (
    <div className="search-bar">
      <label htmlFor="product-search">
        Tìm kiếm sản phẩm
      </label>

      <input
        id="product-search"
        type="search"
        placeholder="Nhập tên thuốc, vitamin..."
        value={searchText}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
      />

      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(event) =>
            onInStockOnlyChange(event.target.checked)
          }
        />

        Chỉ hiển thị sản phẩm còn hàng
      </label>
    </div>
  );
}
