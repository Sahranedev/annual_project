import Image from "next/image"
import Link from "next/link"

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
  const response = await fetch(`http://localhost:1337/api/home-page?populate=Produits&populate=Produits.products&limit=4&populate=Produits.products.images`);
  const data = await response.json();
  const productsData = data.data.Produits;  

  return (
    <section className="py-10 bg-gray-50">
      <h2 className="text-4xl font-medium mb-8 text-center pb-10 max-w-[1500px] mx-auto">{productsData.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1500px] mx-auto">
      {productsData.products.map((product: Product) => (
          <Link key={product.id} href={`/products/${product.slug}`}>
            <div className="group">
              <div className="relative aspect-square mb-4 overflow-hidden">
                {product.images?.[0]?.formats?.thumbnail?.url && (
                  <Image
                    src={`http://localhost:1337${product.images[0].formats.large.url}`}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                {product.Promotion && (
                  <span className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 text-sm">
                    En promo !
                  </span>
                )}
                <button className="absolute bottom-4 left-4 right-4 bg-white border border-black py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  Ajouter au panier
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">
                  {product.categories?.map((category, index) => (
                    <span key={category.id}>
                      {category.name}
                      {index !== product.categories.length - 1 && ' / '}
                    </span>
                  ))}
                </p>
                <h2 className="text-lg font-medium mb-2">{product.title}</h2>
                <p className="text-lg">
                  {product.Promotion ? (
                    <>
                      <span className="line-through text-gray-500">{product.price}€</span>
                      <span className="ml-2 text-pink-500 font-medium">
                        {(product.price - product.price * (product.discountPercent / 100)).toFixed(2)}€
                      </span>
                    </>
                  ) : (
                    <span>{product.price}€</span>
                  )}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
} 