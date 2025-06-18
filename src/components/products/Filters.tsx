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

interface SearchResult {
  id: number
  title: string
  slug: string
  price: number
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
}

export default function Filters({ categoryParam, searchParam }: FiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [searchInput, setSearchInput] = useState(searchParam || '')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearchFocused, setIsSearchFocused] = useState(false)

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
    <aside className="w-[300px] space-y-8">
      {/* Search */}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300 transition-colors"
          />
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {isSearchFocused && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            {searchResults.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="block px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <p className="text-gray-800">{product.title}</p>
                <p className="text-sm text-gray-500">{product.price}€</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="text-lg font-medium mb-4">Prix</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Min</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300 transition-colors"
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Max</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300 transition-colors"
              placeholder="1000"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-lg font-medium mb-4">Catégories</h3>
        <ul className="space-y-3">
          {categories.map(({ id, attributes, name }) => (
            <li key={id}>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    id={String(id)}
                    name={String(id)}
                    checked={selectedCategories.includes(id)}
                    onChange={handleChangeCategories}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-sm peer-checked:border-pink-500 peer-checked:bg-pink-500 transition-colors group-hover:border-pink-300">
                    <svg
                      className="w-full h-full text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <span className="text-gray-700 group-hover:text-pink-500 transition-colors">
                  {attributes?.name ?? name ?? 'Catégorie'}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={resetFilters}
        className="w-full px-4 py-3 text-sm font-medium text-pink-600 border border-pink-200 rounded-lg hover:bg-pink-50 transition-colors"
      >
        Effacer les filtres
      </button>
    </aside>
  )
}
