"use client";

import { useWishlistStore } from "@/app/store/wishlistStore";
import { useAuthStore } from "@/app/store/authStore";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

type WishlistButtonProps = {
  product: {
    id: number;
    title: string;
    price: number;
    documentId: number;
    images?: Array<{
      formats?: {
        thumbnail?: {
          url?: string;
        };
      };
    }>;
  };
  className?: string;
};

export default function WishlistButton({
  product,
  className = "",
}: WishlistButtonProps) {
  const { add, remove, isFavorite, items } = useWishlistStore();
  const { token, isAuthenticated } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (isFavorite(product.id)) {
      setIsFav(true);
    }
  }, [product.id, isFavorite]);

  useEffect(() => {
    if (isMounted) {
      setIsFav(isFavorite(product.id));
    }
  }, [isMounted, items, product.id, isFavorite]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessing) return;

    setIsProcessing(true);

    if (!isAuthenticated && !isFav) {
      toast.info(
        "Connectez-vous pour ajouter des articles à votre liste de souhaits"
      );
      setIsProcessing(false);
      return;
    }

    try {
      let success = false;

      if (isFav) {
        setIsFav(false);

        success = await remove(product.id, token);

        if (success) {
          toast.success(`${product.title} retiré de votre liste de souhaits`);
        } else {
          setIsFav(true);
          toast.error("Erreur lors de la suppression de l'article");
        }
      } else {
        setIsFav(true);

        const wishlistItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          documentId: product.documentId,
          thumbnail: product.images?.[0]?.formats?.thumbnail?.url
            ? `http://localhost:1337${product.images[0].formats.thumbnail.url}`
            : "",
        };

        success = await add(wishlistItem, token);

        if (success) {
          toast.success(`${product.title} ajouté à votre liste de souhaits`);
        } else {
          setIsFav(false);
          toast.error("Erreur lors de l'ajout à la liste de souhaits");
        }
      }
    } catch (error: unknown) {
      console.error("Erreur wishlist:", error);
      toast.error("Une erreur est survenue");
      setIsFav(isFavorite(product.id));
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isMounted) {
    return (
      <div className={`${className} flex items-center justify-center`}>
        <span className="block h-5 w-5 animate-spin rounded-full border-2 border-t-gray-300"></span>
      </div>
    );
  }

  return (
    <motion.button
      className={`${className} transition-transform duration-200`}
      onClick={handleToggleWishlist}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      disabled={isProcessing}
      title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      {isProcessing ? (
        <span className="block h-6 w-6 animate-spin rounded-full border-2 border-t-pink-500"></span>
      ) : isFav ? (
        <FaHeart className="w-6 h-6 text-pink-500" />
      ) : (
        <FaRegHeart className="w-6 h-6 text-gray-600 hover:text-pink-500" />
      )}
    </motion.button>
  );
}
