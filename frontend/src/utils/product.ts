import productsJson from '@/data/reducers/ProductsList.json';

export async function fetchProductById(id: number) {
  return productsJson.products.find((product) => product.id === id);
}