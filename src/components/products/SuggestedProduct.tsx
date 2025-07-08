import { Product } from '@/types/product';
import ProductItem from './ProductItem';
import React, { useEffect, useState } from 'react'

export default function SuggestedProduct({ productId }: { productId: string }) {
  const [suggested, setSuggested] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
        {suggested.map((product, index) => (
          <ProductItem key={product.id} product={product} index={index} />
        ))}
      </ul>
    </section>
  );
}
