import ProductItem from "@/components/products/ProductItem";
import { Product } from "@/types/product";

export default async function Creations() {
  const response = await fetch(
    `http://localhost:1337/api/home-page?populate=Produits&populate=Produits.products&limit=4&populate=Produits.products.images&populate=Produits.products.categories&populate=Produits.products.categories.parent`
  );
  const data = await response.json();
  const productsData = data.data.Produits;

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-gray-50 px-4 sm:px-6 md:px-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-6 sm:mb-8 text-center pb-6 sm:pb-8 md:pb-10 max-w-[1500px] mx-auto">
        {productsData.title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-[1500px] mx-auto">
        {productsData.products.map((product: Product, index: number) => (
          <ProductItem key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
