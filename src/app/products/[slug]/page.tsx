'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ColorPicker from '@/components/products/ColorPicker'
import ReactMarkdown from 'react-markdown'

export default function ProductPage({ params } ) {
  const router = useRouter()
  const { slug } = params

  const [product, setProduct] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<number | null>(null)
  const [imgSelected, setImgSelected] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [isPompom, setIsPompom] = useState<boolean>(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:1337/api/products?filters[slug][$eq]=${slug}&populate[categories]=true&populate[Couleurs][populate][color]=true&populate[Taille]=true&populate[Pompom]=true&populate[Informations]=true&populate[images]=true`,
          { cache: 'no-store' }
        )
        if (!res.ok) throw new Error('Échec du chargement')

        const data = await res.json()
        const fetchedProduct = data.data?.[0]

        if (!fetchedProduct) {
          router.push('/404')
          return
        }

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
    <div className="flex flex-col w-[1200px] mx-auto py-10 gap-20">
      <div className="flex gap-10">
        <div className='flex flex-col gap-4 flex-1'>
          <div className="flex-1 relative aspect-square">
            {product?.images?.[0]?.formats?.thumbnail?.url && (
              <Image
                src={imgSelected || ""}
                alt={product.title}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className='flex items-center gap-2'>
            {product?.images.length > 1 && product?.images?.slice(0, 4).map((image: any) => (
              <button key={image.id} className="relative aspect-square w-24 cursor-pointer" onClick={() => setImgSelected(`http://localhost:1337${image.formats.thumbnail.url}`)}>
                <Image
                  src={`http://localhost:1337${image.formats.thumbnail.url}`}
                  alt={product.title}
                  fill
                  className="object-cover size-full"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <div className="flex gap-2 mb-4">
            {product.categories?.map((category: any) => (
              <span key={category.id} className="text-gray-500 text-base">
                {category.name}
              </span>
            ))}
          </div>
          <p className="text-gray-600 mb-2">{product.shortDescription}</p>
          <p className="text-2xl font-semibold mb-8"><span className={`${product.Promotion ?'line-through' : ''}`}>{product.Promotion ? product.price : priceCalculated() }€</span>{product.Promotion && <span className='text-pink-400'> {priceCalculated()}€</span>}</p>
          {product.Couleurs.length > 0 && (
            <div className='mb-4'>
              <p><strong>Couleur</strong>{selectedColor && <span>:</span>} {selectedColor && product.Couleurs.find(c => c.id === selectedColor)?.color.label}</p>
              <ColorPicker colors={product.Couleurs} select={selectColor} />
            </div>
          )}
          {product.Taille.length > 0 && (
          <div className='mb-4'>
            <strong>Taille</strong>
            <div className='flex items-center gap-2'>
              {product.Taille.map((size: any) => (
                <div key={size.id} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`${size.id}`}
                    name={`${size.id}`}
                    checked={selectedSize === size.id}
                    onChange={() => setSelectedSize(size.id)}
                  />
                  <label htmlFor={`${size.id}`} className="text-gray-700">{size.size}</label>
                </div>
              ))}
            </div>
          </div>
          )}
          {product.Pompom && product.Pompom.enabled && (
          <div className='mb-4'>
            <strong>Pompom</strong>
            <div className='flex items-center gap-2'>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="pompom-true"
                    name="pompom-true"
                    checked={isPompom}
                    onChange={() => setIsPompom(true)}
                  />
                  <label htmlFor="pompom-true" className="text-gray-700">Oui</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="pompom-false"
                    name="pompom-false"
                    checked={!isPompom}
                    onChange={() => setIsPompom(false)}
                  />
                  <label htmlFor="pompom-false" className="text-gray-700">Non</label>
                </div>
            </div>
          </div>
          )}
          {(isPompom || selectedColor !== null || selectedSize !== null) && (
            <button onClick={clearFilter} className='mb-4 cursor-pointer'>Effacer</button>
          )}
          <div className='mb-4'>
            <strong>Emballage cadeau</strong>
            <p>
              Lors de la validation de commande, n’hésitez pas à ajouter un message qui pourra être joint et m’indiquer si vous souhaitez que le produit soit directement emballé et scellé (si vous l’expédiez directement chez le destinataire du cadeau).
              Valable pour 1 produit
            </p>
          </div>
          <div className='flex items-center'>
            <input type="number" name="" id="" className='bg-gray-200 focus:outline-0 p-2 w-20'/>
            <button className='py-2 px-8 bg-pink-400 cursor-pointer'>Ajouter au panier</button>
          </div>
        </div>
      </div>
      <div className="flex gap-10">
        <div className="flex-2">
          <ReactMarkdown className='whitespace-pre-wrap'>{product.longDescription}</ReactMarkdown>
        </div>
        <div className="flex-1">
          {product.Informations.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Informations</h2>
              {product.Informations.map((info: any) => (
                <div key={info.id} className="mb-2">
                  <p><strong>{info.label}</strong> {info.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
