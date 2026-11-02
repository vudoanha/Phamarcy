export async function fetchProducts(signal) {
  const response = await fetch(
    'https://dummyjson.com/products?limit=8',
    { signal }
  );

  if (!response.ok) {
    throw new Error('Không thể tải sản phẩm');
  }

  const data = await response.json();

  return data.products.map((product) => ({
    id: product.id,
    name: product.title,
    price: product.price,
    category: product.category,
    stocked: product.stock > 0,
    description: product.description,
    thumbnail: `/images/products/${product.id}.png`,
    brand: product.brand,
    stock: product.stock,
    rating: product.rating
  }));
}