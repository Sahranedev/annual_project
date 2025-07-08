'use client'

import Filters from "@/components/products/Filters";
import ProductItem from "@/components/products/ProductItem";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
  parent: {
    slug: string;
  };
}

interface Product {
  id: number;
  title: string;
  slug: string | null;
  price: number;
  Promotion: boolean;
  discountPercent: number;
  documentId: number;
  images: Array<{
    formats: {
      thumbnail: { url: string };
      large: { url: string };
    };
  }>;
  categories: Category[];
}

export default function Page() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const searchParams = useSearchParams()
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const category = searchParams.getAll('category')

  let url = "http://localhost:1337/api/products?populate=*&populate=categories&populate=categories.parent&populate=images";

  // Récupérer toutes les catégories depuis les paramètres de recherche
  const categoryParams: string[] = [];
  if (category && category.length > 0) {
    console.log(category);
    categoryParams.push(...category);
  }

  if (categoryParams.length > 0) {
    const categoryFilters = categoryParams.map((slug) => `filters[categories][slug][$in]=${slug}`);
    url += `&${categoryFilters.join("&")}`;
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
    console.log(url);
    
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
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Mobile filters toggle */}
        <div className="mb-6 lg:hidden block">
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
                <Filters />
              </div>
            </div>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <Filters />
          </div>
          
          <main className="flex-1">
            <div className="mb-4 sm:mb-6 lg:mb-8 flex justify-between items-center">
              <p className="text-sm sm:text-base text-gray-600">{products.length} produits</p>
            </div>
            
            {products.length === 0 && (
              <p className="text-gray-600 text-center py-8">Aucun produit trouvé</p>
            )}
            
            {/* Responsive grid */}
            <motion.ul 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
            >
              {products.map((product, index) => (
                <ProductItem key={product.id} product={product} index={index} />
              ))}
            </motion.ul>
          </main>
        </div>
      </div>
    </div>
  );
}
