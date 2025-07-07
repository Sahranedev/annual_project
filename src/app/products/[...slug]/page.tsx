"use client";

import React, { useCallback, useEffect, useState, use } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";
import ColorPicker from "@/components/products/ColorPicker";
import ReactMarkdown from "react-markdown";
import Reviews from "@/components/products/Reviews";
import { useCartStore } from "@/app/store/cartStore";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  Product,
  ProductImage,
  ProductColor,
  ProductSize,
  ProductInformation,
  ProductCategory,
} from "@/types/product";
import SuggestedProduct from "@/components/products/SuggestedProduct";

export default function ProductPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const router = useRouter();
  const { slug } = use(params);
  
  if (slug.length < 1 || slug.length > 3) {
    notFound()
  }
  const slugString = slug ? slug.join('/') : '';
  
  // Analyser la structure de l'URL
  const slugParts = slug || [];
  const isThreeLevels = slugParts.length === 3; // /category/subcategory/product
  const isTwoLevels = slugParts.length === 2;   // /subcategory/product
  const isOneLevel = slugParts.length === 1;    // /product
  
  // Extraire les parties selon la structure
  const productSlug = isThreeLevels ? slugParts[2] : isTwoLevels ? slugParts[1] : isOneLevel ? slugParts[0] : null;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [imgSelected, setImgSelected] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isPompom, setIsPompom] = useState<boolean>(false);
  const [quantity, setQuantity] = useState(1);

  const { add } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {

        const res = await fetch(
          `http://localhost:1337/api/products?filters[slug][$eq]=${productSlug}&populate=categories&populate=categories.parent&populate=Couleurs.color&populate=Taille&populate=Pompom&populate=Informations&populate=images`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Échec du chargement");
        const data = await res.json();
        const fetchedProduct = data.data?.[0];

        if (!fetchedProduct) {
          setError("Produit non trouvé");
          return;
        }

        setProduct(fetchedProduct);
        if (fetchedProduct.images?.[0]?.formats?.thumbnail?.url) {
          setImgSelected(
            `http://localhost:1337${fetchedProduct.images[0].formats.thumbnail.url}`
          );
        }
      } catch (err) {
        console.error(err);
        setError("Erreur de chargement du produit");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, productSlug, router]);

  const selectColor = (colorId: number) => {
    setSelectedColor(colorId);
  };

  const clearFilter = () => {
    setSelectedColor(null);
    setSelectedSize(null);
    setIsPompom(false);
  };

  const priceCalculated = useCallback(() => {
    if (!product) return "0.00";

    let price = 0;
    if (product.Promotion) {
      price = product.price - product.price * (product.discountPercent / 100);
    } else {
      price = product.price;
    }
    if (selectedColor) {
      const color = product.Couleurs.find(
        (c: ProductColor) => c.id === selectedColor
      );
      if (color) {
        price += color.price;
      }
    }
    if (selectedSize) {
      const size = product.Taille.find(
        (s: ProductSize) => s.id === selectedSize
      );
      if (size) {
        price += size.price;
      }
    }
    if (isPompom) {
      price += product.Pompom.price;
    }
    return price.toFixed(2);
  }, [product, selectedColor, selectedSize, isPompom]);

  const handleAddToCart = () => {
    if (!product) return;

    const finalPrice = parseFloat(priceCalculated());

    const cartItem = {
      id: product.id,
      title: product.title,
      price: finalPrice,
      thumbnail:
        imgSelected ||
        `http://localhost:1337${product.images?.[0]?.formats?.thumbnail?.url}`,
      quantity: quantity,
    };

    add(cartItem);

    toast.success(`${product.title} ajouté au panier`);
  };

  if (loading) return <div className="text-center py-6 sm:py-10">Chargement...</div>;
  if (error)
    return <div className="text-center text-red-500 py-6 sm:py-10">{error}</div>;
  if (!product)
    return (
      <div className="text-center text-red-500 py-6 sm:py-10">Produit non trouvé</div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Breadcrumb */}
      <motion.nav 
        className="mb-6 sm:mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ol className="flex items-center space-x-2 text-sm sm:text-base">
          <li>
            <Link 
              href="/" 
              className="text-gray-500 hover:text-orange transition-colors"
            >
              Accueil
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link 
              href="/products" 
              className="text-gray-500 hover:text-orange transition-colors"
            >
              Produits
            </Link>
          </li>
          {product.categories.length > 0 && product.categories[0].parent && (
            <>
              <li className="text-gray-400">/</li>
              <li>
                <Link 
                  href={`/products?category=${product.categories[0].parent.slug}`}
                  className="text-gray-500 hover:text-orange transition-colors"
                >
                  {product.categories[0].parent.name}
                </Link>
              </li>
            </>
          )}
          {product.categories.length > 0 && (
            <>
              <li className="text-gray-400">/</li>
              <li>
                <Link 
                  href={`/products?category=${product.categories[0].slug}`}
                  className="text-gray-500 hover:text-orange transition-colors"
                >
                  {product.categories[0].name}
                </Link>
              </li>
            </>
          )}
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium truncate">
            {product.title}
          </li>
        </ol>
      </motion.nav>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left side - Images */}
        <motion.div 
          className="space-y-3 sm:space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            {product?.images?.[0]?.formats?.thumbnail?.url && (
              <Image
                src={imgSelected || ""}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            )}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
            {product?.images.length > 1 &&
              product?.images?.slice(0, 5).map((image: ProductImage, index: number) => (
                <motion.button
                  key={image.id}
                  className={`relative aspect-square rounded-lg overflow-hidden ${imgSelected === `http://localhost:1337${image.formats.thumbnail.url}` ? "ring-2 ring-pink-400" : ""}`}
                  onClick={() =>
                    setImgSelected(
                      `http://localhost:1337${image.formats.thumbnail.url}`
                    )
                  }
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Image
                    src={`http://localhost:1337${image.formats.thumbnail.url}`}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 25vw, (max-width: 1024px) 10vw, 8vw"
                  />
                </motion.button>
              ))}
          </div>
        </motion.div>

        {/* Right side - Product Info */}
        <motion.div 
          className="space-y-4 sm:space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
              {product.categories?.map((category: ProductCategory) => (
                <span key={category.id} className="text-xs sm:text-sm text-gray-500">
                  {category.name}
                </span>
              ))}
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">{product.shortDescription}</p>
            <div className="flex items-baseline gap-2 mb-4 sm:mb-6">
              <span
                className={`text-xl sm:text-2xl font-semibold ${product.Promotion ? "line-through text-gray-400" : "text-gray-900"}`}
              >
                {product.Promotion ? product.price : priceCalculated()}€
              </span>
              {product.Promotion && (
                <span className="text-xl sm:text-2xl font-semibold text-orange">
                  {priceCalculated()}€
                </span>
              )}
            </div>
          </motion.div>

          {/* Color Selection */}
          {product.Couleurs?.length > 0 && (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Couleur
                </label>
                {selectedColor && (
                  <span className="text-xs sm:text-sm text-gray-500">
                    {
                      product.Couleurs.find(
                        (c: ProductColor) => c.id === selectedColor
                      )?.color.label
                    }
                  </span>
                )}
              </div>
              <ColorPicker colors={product.Couleurs} select={selectColor} />
            </motion.div>
          )}

          {/* Size Selection */}
          {product.Taille?.length > 0 && (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <label className="text-sm font-medium text-gray-700">
                Taille
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {product.Taille.map((size: ProductSize) => (
                  <motion.button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md ${
                      selectedSize === size.id
                        ? "bg-orange text-white border-2 border-orange"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {size.size}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Pompom Selection */}
          {product.Pompom && product.Pompom.enabled && (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <label className="text-sm font-medium text-gray-700">
                Pompom
              </label>
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  onClick={() => setIsPompom(true)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md ${
                    isPompom
                      ? "bg-orange text-white border-2 border-orange"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Oui
                </motion.button>
                <motion.button
                  onClick={() => setIsPompom(false)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md ${
                    !isPompom
                      ? "bg-orange text-white border-2 border-orange"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Non
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Clear Filters */}
          {(isPompom || selectedColor !== null || selectedSize !== null) && (
            <motion.button
              onClick={clearFilter}
              className="text-xs sm:text-sm text-orange hover:text-orange"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              Effacer les sélections
            </motion.button>
          )}

          {/* Gift Wrapping */}
          <motion.div 
            className="bg-gray-50 p-3 sm:p-4 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Emballage cadeau
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Lors de la validation de commande, n&apos;hésitez pas à ajouter un
              message qui pourra être joint et m&apos;indiquer si vous souhaitez
              que le produit soit directement emballé et scellé (si vous
              l&apos;expédiez directement chez le destinataire du cadeau).
              Valable pour 1 produit
            </p>
          </motion.div>

          {/* Add to Cart */}
          <motion.div 
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <div className="relative">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange"
              />
            </div>
            <motion.button
              onClick={handleAddToCart}
              className="flex-1 bg-orange text-white px-4 sm:px-6 py-3 rounded-md hover:bg-orange transition-colors text-sm sm:text-base"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Ajouter au panier
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Product Details */}
      <motion.div 
        className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <motion.div 
          className="lg:col-span-2 prose prose-pink max-w-none prose-sm sm:prose-base"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <ReactMarkdown>{product.longDescription}</ReactMarkdown>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          {product.Informations?.length > 0 && (
            <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Informations
              </h2>
              <dl className="space-y-2 sm:space-y-3">
                {product.Informations.map((info: ProductInformation) => (
                  <div key={info.id} className="flex justify-between">
                    <dt className="text-xs sm:text-sm font-medium text-gray-500">
                      {info.label}
                    </dt>
                    <dd className="text-xs sm:text-sm text-gray-900">{info.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Reviews & Suggested Articles */}
      <motion.div 
        className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.3 }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <Reviews productId={product.id} productSlug={slugString} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <SuggestedProduct productId={product.documentId.toString()} />
        </motion.div>
      </motion.div>
    </div>
  );
}