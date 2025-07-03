"use client";

import React, { useCallback, useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ColorPicker from "@/components/products/ColorPicker";
import ReactMarkdown from "react-markdown";
import Reviews from "@/components/products/Reviews";
import { useCartStore } from "@/app/store/cartStore";
import { toast } from "react-toastify";
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
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);
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
        const isId = !isNaN(Number(slug));

        const filter = isId
          ? `filters[id][$eq]=${slug}`
          : `filters[slug][$eq]=${slug}`;

        const res = await fetch(
          `http://localhost:1337/api/products?${filter}&populate[categories]=true&populate[Couleurs][populate][color]=true&populate[Taille]=true&populate[Pompom]=true&populate[Informations]=true&populate[images]=true&populate`,
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
  }, [slug, router]);

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
        {/* Left side - Images */}
        <div className="space-y-3 sm:space-y-4">
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
              product?.images?.slice(0, 5).map((image: ProductImage) => (
                <button
                  key={image.id}
                  className={`relative aspect-square rounded-lg overflow-hidden ${imgSelected === `http://localhost:1337${image.formats.thumbnail.url}` ? "ring-2 ring-pink-400" : ""}`}
                  onClick={() =>
                    setImgSelected(
                      `http://localhost:1337${image.formats.thumbnail.url}`
                    )
                  }
                >
                  <Image
                    src={`http://localhost:1337${image.formats.thumbnail.url}`}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 25vw, (max-width: 1024px) 10vw, 8vw"
                  />
                </button>
              ))}
          </div>
        </div>

        {/* Right side - Product Info */}
        <div className="space-y-4 sm:space-y-6">
          <div>
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
          </div>

          {/* Color Selection */}
          {product.Couleurs?.length > 0 && (
            <div className="space-y-2">
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
            </div>
          )}

          {/* Size Selection */}
          {product.Taille?.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Taille
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {product.Taille.map((size: ProductSize) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md ${
                      selectedSize === size.id
                        ? "bg-orange text-white border-2 border-orange"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {size.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pompom Selection */}
          {product.Pompom && product.Pompom.enabled && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Pompom
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsPompom(true)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md ${
                    isPompom
                      ? "bg-orange text-white border-2 border-orange"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Oui
                </button>
                <button
                  onClick={() => setIsPompom(false)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md ${
                    !isPompom
                      ? "bg-orange text-white border-2 border-orange"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Non
                </button>
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {(isPompom || selectedColor !== null || selectedSize !== null) && (
            <button
              onClick={clearFilter}
              className="text-xs sm:text-sm text-orange hover:text-orange"
            >
              Effacer les sélections
            </button>
          )}

          {/* Gift Wrapping */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
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
          </div>

          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="relative">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full sm:w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange"
              />
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-orange text-white px-4 sm:px-6 py-3 rounded-md hover:bg-orange transition-colors text-sm sm:text-base"
            >
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
        <div className="lg:col-span-2 prose prose-pink max-w-none prose-sm sm:prose-base">
          <ReactMarkdown>{product.longDescription}</ReactMarkdown>
        </div>
        <div>
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
        </div>
      </div>

      {/* Reviews & Suggested Articles */}
      <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Reviews productId={product.id} productSlug={slug} />
        </div>
        <div>
          <SuggestedProduct productId={product.documentId.toString()} />
        </div>
      </div>
    </div>
  );
}