'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface FiltersProps {
  categoryParam?: string
  searchParam?: string
}

interface Category {
  id: number
  attributes?: {
    name: string
  }
  name?: string
}

type ParamUpdates = Record<string, string | null>

const updateMultipleSearchParams = (
  updates: ParamUpdates,
  searchParams: URLSearchParams,
  router: ReturnType<typeof useRouter>
) => {
  const newParams = new URLSearchParams(searchParams.toString())

  for (const key in updates) {
    const value = updates[key]
    if (value === null || value === '') {
      newParams.delete(key)
    } else {
      newParams.set(key, value)
    }
  }

  const query = newParams.toString()
  router.push(`/products${query ? `?${query}` : ''}`)

  console.log('✅ Updated multiple search params:', query)
}

export default function Filters({ categoryParam, searchParam }: FiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [searchInput, setSearchInput] = useState(searchParam || '')

  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])

  // Sync min/max price from URL
  useEffect(() => {
    setMinPrice(searchParams.get('minPrice') || '')
    setMaxPrice(searchParams.get('maxPrice') || '')
  }, [searchParams])

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:1337/api/categories?filters[type][$eq]=product', {
          method: 'GET',
          cache: 'no-store',
        })
        const data = await res.json()
        setCategories(data.data)
      } catch (err) {
        console.error('Error fetching categories', err)
      }
    }
    fetchCategories()
  }, [])

  // Sync selected categories from param
  useEffect(() => {
    if (categoryParam) {
      const parsed = categoryParam.split(',').map((id) => parseInt(id, 10))
      setSelectedCategories(parsed)
    }
  }, [categoryParam])

  // Handle single param update (category or search)
  const updateSearchParam = useCallback(
    (key: string, value: string | null) => {
      updateMultipleSearchParams({ [key]: value }, searchParams, router)
    },
    [searchParams, router]
  )

  const handleChangeCategories = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = parseInt(e.target.name, 10)
    const updated = e.target.checked
      ? [...selectedCategories, id]
      : selectedCategories.filter((catId) => catId !== id)

    setSelectedCategories(updated)
    updateSearchParam('category', updated.length ? updated.join(',') : null)
  }

  // Debounced min/max price update
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateMultipleSearchParams(
        {
          minPrice: minPrice || null,
          maxPrice: maxPrice || null,
        },
        searchParams,
        router
      )
    }, 400)

    return () => clearTimeout(timeout)
  }, [minPrice, maxPrice, searchParams, router])

  // Debounced search input
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!searchInput) return setSearchResults([])

      const res = await fetch(
        `http://localhost:1337/api/products?filters[title][$contains]=${searchInput}`,
        { method: 'GET', cache: 'no-store' }
      )

      if (res.ok) {
        const data = await res.json()
        setSearchResults(data.data)
      }
    }, 500)

    return () => clearTimeout(timeout)
  }, [searchInput])

  const resetFilters = () => {
    router.push('/products')
    setSelectedCategories([])
    setMinPrice('')
    setMaxPrice('')
    setSearchInput('')
  }

  return (
    <aside className="flex flex-col gap-4 w-[300px] h-fit bg-white p-4 border border-gray-300 rounded-lg">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="p-2 border border-black focus:outline-none rounded-lg w-full"
        />
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 flex flex-col gap-2 mt-2 z-40 bg-white border border-gray-300 rounded-lg p-4 w-full">
            {searchResults.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="text-sm text-gray-500 w-full">
                {product.title}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="text-lg font-bold mb-2">Prix</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full p-2 border border-black rounded-lg"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full p-2 border border-black rounded-lg"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-bold mb-4">Catégories</h3>
        <ul className="flex flex-col items-start gap-4">
          {categories.map(({ id, attributes, name }) => (
            <li key={id} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={String(id)}
                name={String(id)}
                checked={selectedCategories.includes(id)}
                onChange={handleChangeCategories}
              />
              <label htmlFor={String(id)}>{attributes?.name ?? name ?? 'Catégorie'}</label>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={resetFilters} className="p-2 border border-black rounded-lg w-full">
        Effacer les filtres
      </button>
    </aside>
  )
}
