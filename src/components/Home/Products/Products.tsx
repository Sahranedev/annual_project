import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

export default async function Creations() {
  const response = await fetch(
    `http://localhost:1337/api/home-page?populate=Produits&populate=Produits.products&limit=4&populate=Produits.products.images`
  );
  const data = await response.json();
  const productsData = data.data.Produits;

  return (
    <section className="py-10 sm:py-12 md:py-16 bg-gray-50 px-4 sm:px-6 md:px-8">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-6 sm:mb-8 text-center pb-6 sm:pb-8 md:pb-10 max-w-[1500px] mx-auto">
        {productsData.title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-[1500px] mx-auto">
        {productsData.products.map((product: Product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug || product.id}`}
          >
            <div className="group">
              <div className="relative aspect-square mb-3 sm:mb-4 overflow-hidden">
                {product.images?.[0]?.formats?.thumbnail?.url && (
                  <Image
                    src={`http://localhost:1337${product.images[0].formats.large.url}`}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                {product.Promotion && (
                  <span className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-pink-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
                    En promo !
                  </span>
                )}
                <button className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-white border border-black py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-sm sm:text-base">
                  Ajouter au panier
                </button>
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm text-gray-500 mb-1">
                  {product.categories?.map((category, index) => (
                    <span key={category.id}>
                      {category.name}
                      {index !== product.categories.length - 1 && " / "}
                    </span>
                  ))}
                </p>
                <h2 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">{product.title}</h2>
                <p className="text-base sm:text-lg">
                  {product.Promotion ? (
                    <>
                      <span className="line-through text-gray-500">
                        {product.price}€
                      </span>
                      <span className="ml-2 text-pink-500 font-medium">
                        {(
                          product.price -
                          product.price * (product.discountPercent / 100)
                        ).toFixed(2)}
                        €
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
