import Filters from '@/components/products/Filters'
import Image from 'next/image'
import Link from 'next/link'

interface PageProps {
  searchParams?: {
    category?: string
    search?: string,
    minPrice?: string
    maxPrice?: string
  }
}

export default async function Page({ searchParams }: PageProps) {
  const { category, minPrice, maxPrice } = await Promise.resolve(searchParams ?? {})

  let url = 'http://localhost:1337/api/products?populate=*'

  if (category) {
    const categoryArray = category.split(',').map((id) => `filters[categories][id][$in]=${id}`)
    url += `&${categoryArray.join('&')}`
  }

  if (minPrice) {
    url += `&filters[price][$gte]=${minPrice}`
  }
  if (maxPrice) {
    url += `&filters[price][$lte]=${maxPrice}`
  }

  const res = await fetch(url, { method: 'GET', cache: 'no-store' })

  if (!res.ok) throw new Error('Failed to fetch data')

  const data = await res.json()
  const products = data.data

  console.log('products', products);

  return (
    <div>
      <div className='w-full h-80 bg-gray-300 mb-10'></div>
      <div className='flex gap-10 mx-40'>
        <Filters categoryParam={category} />
        <main className='flex-1'>
          <ul className='grid grid-cols-3 gap-10'>
            {products.map((product: any) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <li className='flex flex-col items-center gap-2 aspect-square'>
                  <div className='relative flex flex-col items-center justify-end w-full aspect-square'>
                    {product.images?.[0]?.formats?.thumbnail?.url && (
                      <Image
                        src={`http://localhost:1337${product.images[0].formats.large.url}`}
                        alt={product.title}
                        fill
                        className='absolute top-0 left-0 object-cover w-full h-full -z-10'
                      />
                    )}
                    <button className='p-2 m-4 bg-white border border-black rounded-lg'>Ajouter au panier</button>
                    {product.Promotion && (
                      <p className='absolute left-2 top-2 bg-pink-300 px-4 py-2'>En promo</p>
                    )}
                  </div>
                  <p>
                    {product.categories?.map((category: any, index: number) => (
                      <span key={category.id} className='text-sm text-gray-500'>
                        {category.name}
                        {index !== product.categories.length - 1 &&
                          product.categories.length > 1 &&
                          ' / '}
                      </span>
                    ))}
                  </p>
                  <h2 className='text-lg font-bold'>{product.title}</h2>
                  <p className='text-lg'>À partir de <span className={`${product.Promotion ?'line-through' : ''}`}>{product.price}€</span>{product.Promotion && <span className='text-bold text-pink-400'> {(product.price - product.price * (product.discountPercent / 100)).toFixed(2)}€</span>}</p>
                </li>
              </Link>
            ))}
          </ul>
        </main>
      </div>
    </div>
  )
}
