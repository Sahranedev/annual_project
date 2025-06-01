'use client'

import React, { useCallback, useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ColorPicker from '@/components/products/ColorPicker'
import ReactMarkdown from 'react-markdown'
import Reviews from '@/components/products/Reviews'

export default function ProductPage ({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const { slug } = use(params)
  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<number | null>(null)
  const [imgSelected, setImgSelected] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [isPompom, setIsPompom] = useState<boolean>(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `http://localhost:1337/api/products?filters[slug][$eq]=${slug}&populate[categories]=true&populate[Couleurs][populate][color]=true&populate[Taille]=true&populate[Pompom]=true&populate[Informations]=true&populate[images]=true&populate`,
          { cache: 'no-store' }
        )
        if (!res.ok) throw new Error('Échec du chargement')
        const data = await res.json()
        const fetchedProduct = data.data?.[0]

        setProduct(fetchedProduct)
        if (fetchedProduct.images?.[0]?.formats?.thumbnail?.url) {
          setImgSelected(`http://localhost:1337${fetchedProduct.images[0].formats.thumbnail.url}`)
        }        
        
      } catch (err) {
        console.error(err)
        setError('Erreur de chargement du produit')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug, router])

  const selectColor = (colorId: number) => {
    setSelectedColor(colorId)
  }

  const clearFilter = () => {
    setSelectedColor(null)
    setSelectedSize(null)
    setIsPompom(false)
  }

  const priceCalculated = useCallback(() => {
    let price = 0
    if(product.Promotion) {
      price = product.price - product.price * (product.discountPercent / 100)
    }
    else {
      price = product.price
    }
    if (selectedColor) {
      const color = product.Couleurs.find((c: any) => c.id === selectedColor)
      if (color) {
        price += color.price
      }
    }
    if (selectedSize) {
      const size = product.Taille.find((s: any) => s.id === selectedSize)
      if (size) {
        price += size.price
      }
    }
    if (isPompom) {
      price += product.Pompom.price
    }
    return price.toFixed(2)
  }, [product, selectedColor, selectedSize, isPompom])

  if (loading) return <div className="text-center py-10">Chargement...</div>
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left side - Images */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            {product?.images?.[0]?.formats?.thumbnail?.url && (
              <Image
                src={imgSelected || ""}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product?.images.length > 1 && product?.images?.slice(0, 4).map((image: any) => (
              <button 
                key={image.id} 
                className={`relative aspect-square rounded-lg overflow-hidden ${imgSelected === `http://localhost:1337${image.formats.thumbnail.url}` ? 'ring-2 ring-pink-400' : ''}`}
                onClick={() => setImgSelected(`http://localhost:1337${image.formats.thumbnail.url}`)}
              >
                <Image
                  src={`http://localhost:1337${image.formats.thumbnail.url}`}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 12vw"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right side - Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
            <div className="flex gap-2 mb-4">
              {product.categories?.map((category: any) => (
                <span key={category.id} className="text-sm text-gray-500">
                  {category.name}
                </span>
              ))}
            </div>
            <p className="text-gray-600 mb-4">{product.shortDescription}</p>
            <div className="flex items-baseline gap-2 mb-6">
              <span className={`text-2xl font-semibold ${product.Promotion ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                {product.Promotion ? product.price : priceCalculated()}€
              </span>
              {product.Promotion && (
                <span className="text-2xl font-semibold text-pink-500">
                  {priceCalculated()}€
                </span>
              )}
            </div>
          </div>

          {/* Color Selection */}
          {product.Couleurs.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Couleur</label>
                {selectedColor && (
                  <span className="text-sm text-gray-500">
                    {product.Couleurs.find(c => c.id === selectedColor)?.color.label}
                  </span>
                )}
              </div>
              <ColorPicker colors={product.Couleurs} select={selectColor} />
            </div>
          )}

          {/* Size Selection */}
          {product.Taille.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Taille</label>
              <div className="grid grid-cols-4 gap-2">
                {product.Taille.map((size: any) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                      selectedSize === size.id
                        ? 'bg-pink-100 text-pink-700 border-2 border-pink-500'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
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
              <label className="text-sm font-medium text-gray-700">Pompom</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsPompom(true)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    isPompom
                      ? 'bg-pink-100 text-pink-700 border-2 border-pink-500'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Oui
                </button>
                <button
                  onClick={() => setIsPompom(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    !isPompom
                      ? 'bg-pink-100 text-pink-700 border-2 border-pink-500'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
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
              className="text-sm text-pink-600 hover:text-pink-700"
            >
              Effacer les sélections
            </button>
          )}

          {/* Gift Wrapping */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Emballage cadeau</h3>
            <p className="text-sm text-gray-600">
              Lors de la validation de commande, n&apos;hésitez pas à ajouter un message qui pourra être joint et m&apos;indiquer si vous souhaitez que le produit soit directement emballé et scellé (si vous l&apos;expédiez directement chez le destinataire du cadeau).
              Valable pour 1 produit
            </p>
          </div>

          {/* Add to Cart */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <input 
                type="number" 
                min="1"
                defaultValue="1"
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <button className="flex-1 bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition-colors">
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 prose prose-pink max-w-none">
          <ReactMarkdown>{product.longDescription}</ReactMarkdown>
        </div>
        <div>
          {product.Informations.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations</h2>
              <dl className="space-y-3">
                {product.Informations.map((info: any) => (
                  <div key={info.id} className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">{info.label}</dt>
                    <dd className="text-sm text-gray-900">{info.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <Reviews productId={product.id} productSlug={slug} />
      </div>
    </div>
  )
}
