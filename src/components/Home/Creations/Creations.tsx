import CreationItem from "./CreationItem";

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  title: string
  slug: string
  price: number
  Promotion: boolean
  discountPercent: number
  images: Array<{
    formats: {
      thumbnail: { url: string }
      large: { url: string }
    }
  }>
  categories: Category[]
}

export default async function Creations() {
  const response = await fetch(`http://localhost:1337/api/home-page?populate=Produits&populate=Produits.products&limit=4&populate=Produits.products.images&populate=Produits.products.categories`);
  const data = await response.json();
  const productsData = data.data.Produits;  

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white px-4 sm:px-6 md:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-[1500px] mx-auto">
        {productsData.products.map((product: Product) => (
          <CreationItem key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
} 