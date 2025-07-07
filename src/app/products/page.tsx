'use client'

import Filters from "@/components/products/Filters";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  slug: string | null;
  price: number;
  Promotion: boolean;
  discountPercent: number;
  images: Array<{
    formats: {
      thumbnail: { url: string };
      large: { url: string };
    };
  }>;
  categories: Category[];
}

interface PageProps {
  searchParams?: {
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default function Page({ searchParams }: PageProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { category, minPrice, maxPrice } = searchParams ?? {};

  let url = "http://localhost:1337/api/products?populate=*";

  if (category) {
    const categoryArray = category
      .split(",")
      .map((id) => `filters[categories][id][$in]=${id}`);
    url += `&${categoryArray.join("&")}`;
  }

  if (minPrice) {
    url += `&filters[price][$gte]=${minPrice}`;
  }
  if (maxPrice) {
    url += `&filters[price][$lte]=${maxPrice}`;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(url, { method: "GET", cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setProducts(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [url]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section - responsive height */}
      <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-100 mb-6 sm:mb-8 md:mb-12 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif px-4 text-center">Boutique</h1>
        </div>
      </div>
      
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile filters toggle */}
        <div className="mb-6">
          <button 
            onClick={() => setIsFiltersOpen(true)}
            className="w-full px-4 py-3 bg-orange text-white rounded-lg font-medium flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtres et recherche
          </button>
        </div>
        
        {/* Mobile Filters Modal */}
        {isFiltersOpen && (
          <div className="fixed z-50">
            <div className="fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto transform transition-transform duration-300 ease-out">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-medium">Filtres</h2>
                <button 
                  onClick={() => setIsFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <Filters categoryParam={category} />
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          <main className="flex-1">
            <div className="mb-4 sm:mb-6 lg:mb-8 flex justify-between items-center">
              <p className="text-sm sm:text-base text-gray-600">{products.length} produits</p>
            </div>
            
            {products.length === 0 && (
              <p className="text-gray-600 text-center py-8">Aucun produit trouvé</p>
            )}
            
            {/* Responsive grid */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {products.map((product) => (
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
                        <span className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-pink-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm">
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
                  </li>
                </Link>
              ))}
            </ul>
          </main>
        </div>
      </div>
    </div>
  );
}
