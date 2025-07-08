"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/app/store/wishlistStore";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import { useCartStore } from "@/app/store/cartStore";

type WishlistItem = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  documentId: number;
};

export default function WishlistPage() {
  const { items, isLoading, fetch, remove } = useWishlistStore();
  const { token, isAuthenticated } = useAuthStore();
  const { add: addToCart } = useCartStore();
  const router = useRouter();
  const [isRemoving, setIsRemoving] = useState<Record<number, boolean>>({});
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/sign-in");
      return;
    }

    const loadWishlistData = async () => {
      try {
        await fetch(token);
      } catch (error) {
        console.error("Erreur lors du chargement de la wishlist:", error);
        toast.error("Impossible de charger votre liste de souhaits");
      } finally {
        setPageLoaded(true);
      }
    };

    loadWishlistData();
  }, [isAuthenticated, token, fetch, router]);

  const handleRemoveFromWishlist = async (id: number) => {
    setIsRemoving((prev) => ({ ...prev, [id]: true }));
    try {
      const success = await remove(id, token);
      if (success) {
        toast.success("Article retiré de votre liste de souhaits");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setIsRemoving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    const cartItem = {
      id: item.id,
      title: item.title,
      price: item.price,
      documentId: item.documentId,
      thumbnail: item.thumbnail,
      quantity: 1,
    };

    addToCart(cartItem);
    toast.success(`${item.title} ajouté au panier`);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (!pageLoaded || isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1500px]">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-medium mb-8 text-center">
        Ma liste de souhaits
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-gray-600 mb-6">
            Votre liste de souhaits est vide
          </p>
          <Link
            href="/products"
            className="inline-block bg-orange hover:bg-orange/90 text-white py-3 px-6 rounded-sm transition-colors"
          >
            Explorer nos produits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <Link
                href={`/products/${item.id}`}
                className="block relative aspect-square"
              >
                {item.thumbnail ? (
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Image non disponible</p>
                  </div>
                )}
              </Link>
              <div className="p-4">
                <h2 className="font-medium mb-2 line-clamp-2 h-12">
                  {item.title}
                </h2>
                <p className="font-medium text-lg mb-4">{item.price}€</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-orange hover:bg-orange/90 text-white py-2 px-4 rounded-sm flex-grow transition-colors"
                  >
                    Ajouter au panier
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    disabled={isRemoving[item.id]}
                    className="border border-gray-300 hover:border-pink-500 hover:text-pink-500 p-2 rounded-sm transition-colors"
                    title="Retirer de la liste"
                  >
                    {isRemoving[item.id] ? (
                      <span className="block h-6 w-6 animate-spin rounded-full border-2 border-t-pink-500"></span>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
