'use client'

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { toast } from "react-toastify";
import { useCartStore } from "@/app/store/cartStore";

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

interface ProductItemProps {
  product: Product;
  index: number;
}

export default function ProductItem({ product, index }: ProductItemProps) {
  const { add } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!product) return;

    const cartItem = {
      id: product.id,
      title: product.title,
      price: product.price,
      documentId: product.documentId,
      thumbnail:
        `http://localhost:1337${product.images?.[0]?.formats?.thumbnail?.url}`,
      quantity: 1,
    };

    add(cartItem);

    toast.success(`${product.title} ajouté au panier`);
  };

  return (
    <motion.li
      key={product.id}
      variants={{
        hidden: { 
          opacity: 0, 
          y: 20,
          scale: 0.95
        },
        visible: { 
          opacity: 1, 
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        }
      }}
      className="list-none"
    >
      <Link
        href={`/products/${product.categories[0].parent ? product.categories[0].parent.slug + '/' : ''}${product.categories[0].slug}/${product.slug || product.id}`}
        className="cursor-pointer block"
      >
        <div className="group">
          <motion.div 
            className="relative aspect-square mb-3 sm:mb-4 overflow-hidden rounded-lg"
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            {product.images?.[0]?.formats?.thumbnail?.url && (
              <Image
                src={`http://localhost:1337${product.images[0].formats.large.url}`}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
            {product.Promotion && (
              <motion.span 
                className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-pink-500 text-white px-2 sm:px-3 py-1 text-xs sm:text-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, type: "spring", stiffness: 200 }}
              >
                En promo !
              </motion.span>
            )}
            <motion.button 
              className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-orange text-white py-2 px-3 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center cursor-pointer text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => handleAddToCart(e)}
            >
              Ajouter au panier
            </motion.button>
          </motion.div>
          <motion.div 
            className="text-center px-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
          >
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
          </motion.div>
        </div>
      </Link>
    </motion.li>
  );
} 