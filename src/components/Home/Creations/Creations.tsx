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
  const response = await fetch(`http://localhost:1337/api/home-page?populate[creations][populate][0]=images&populate[creations][populate]=categories`);
  const data = await response.json();
  const creations = data.data.creations;

  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {creations.map((product: Product) => (
          <CreationItem key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
} 