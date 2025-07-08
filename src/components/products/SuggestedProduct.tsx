import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

export default function SuggestedProduct({ productId }: { productId: string }) {
  const [suggested, setSuggested] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(productId);

  useEffect(() => {
    const fetchSuggested = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:1337/api/products/${productId}/suggested`, { cache: "no-store" });
        if (!res.ok) throw new Error("Erreur lors du chargement des suggestions");
        const data = await res.json();
        setSuggested(data.data || []);
      } catch {
        setError("Erreur lors du chargement des suggestions");
      } finally {
        setLoading(false);
      }
    };
    fetchSuggested();
  }, [productId]);

  if (loading) return <div>Chargement des suggestions...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!suggested.length) return null;

  return (
    <section className="mt-8">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-black font-aboreto">Tu pourrais aussi aimer...</h2>    
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {suggested.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug || product.id}`}
          className="cursor-pointer"
        >
          <li className="group">
            <div className="relative aspect-square mb-3 sm:mb-4 overflow-hidden rounded-lg">
              {product.images?.[0]?.formats?.thumbnail?.url && (
                <Image
                  src={`http://localhost:1337${product.images[0].formats.large.url}`}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              {product.Promotion && (
                <span className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-orange text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  En promo !
                </span>
              )}
              <button className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-orange text-white py-2 px-3 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center cursor-pointer text-sm sm:text-base">
                Ajouter au panier
              </button>
            </div>
            <div className="text-center px-2">
              <p className="text-xs sm:text-sm text-gray-500 mb-1">
                {product.categories?.map((category, index) => (
                  <span key={category.id}>
                    {category.name}
                    {index !== product.categories.length - 1 && " / "}
                  </span>
                ))}
              </p>
              <h2 className="text-sm sm:text-base lg:text-lg font-medium mb-1 sm:mb-2 line-clamp-2">
                {product.title}
              </h2>
              <p className="text-sm sm:text-base lg:text-lg">
                {product.Promotion ? (
                  <>
                    <span className="line-through text-gray-500">
                      {product.price}€
                    </span>
                    <span className="ml-2 text-orange font-medium">
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
          </li>
        </Link>
        ))}
      </ul>
    </section>
  );
}
