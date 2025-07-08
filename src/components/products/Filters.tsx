'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: number
  name?: string
  slug?: string
  children?: {
    id: number
    name: string
    slug: string
  }[]
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

export default function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState('')
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
        const res = await fetch('http://localhost:1337/api/categories?filters[type][$eq]=product&filters[parent][$null]=true&populate=children', {
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

  // Sync selected categories from params
  useEffect(() => {
    const categoryParams: string[] = []
    const existingParams = Array.from(searchParams.entries())
    
    existingParams.forEach(([key, value]) => {
      if (key === 'category') {
        categoryParams.push(value)
      }
    })
    
    setSelectedCategories(categoryParams)
  }, [searchParams])



  const handleChangeCategories = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.name
    const updated = e.target.checked
      ? [...selectedCategories, slug]
      : selectedCategories.filter((catSlug) => catSlug !== slug)

    setSelectedCategories(updated)
    
    // Créer de nouveaux paramètres de recherche
    const newParams = new URLSearchParams(searchParams.toString())
    
    // Supprimer tous les paramètres de catégorie existants
    const existingParams = Array.from(newParams.entries())
    existingParams.forEach(([key]) => {
      if (key === 'category') {
        newParams.delete(key)
      }
    })
    
    // Ajouter les nouvelles catégories sélectionnées
    updated.forEach((catSlug) => {
      newParams.append('category', catSlug)
    })
    
    const query = newParams.toString()
    router.push(`/products${query ? `?${query}` : ''}`)
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
    <aside className="w-full lg:w-[300px] space-y-6 lg:space-y-8">
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
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300 transition-colors text-sm sm:text-base"
          />
          <svg
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400"
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
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {searchResults.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="block px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-50 transition-colors"
              >
                <p className="text-gray-800 text-sm sm:text-base">{product.title}</p>
                <p className="text-xs sm:text-sm text-gray-500">{product.price}€</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Prix</h3>
        <div className="flex gap-3 sm:gap-4">
          <div className="flex-1">
            <label className="block text-xs sm:text-sm text-gray-600 mb-1">Min</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300 transition-colors text-sm sm:text-base"
              placeholder="0"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs sm:text-sm text-gray-600 mb-1">Max</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-pink-300 transition-colors text-sm sm:text-base"
              placeholder="1000"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Catégories</h3>
        <ul className="space-y-2 sm:space-y-3">
          {categories.map(({ id, name, slug, children }) => (
            <li key={id}>
              <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group mb-2">
                <div className="relative">
                  <input
                    type="checkbox"
                    id={String(slug)}
                    name={String(slug)}
                    checked={selectedCategories.includes(slug || '')}
                    onChange={handleChangeCategories}
                    value={slug}
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-sm peer-checked:border-orange peer-checked:bg-orange transition-colors group-hover:border-orange">
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
                <span className="text-sm sm:text-base text-gray-700 group-hover:text-orange transition-colors">
                  {name}
                </span>
              </label>
              <ul className="flex flex-col gap-1 sm:gap-2 pl-4 sm:pl-6 lg:pl-8">
                {children?.map((childrenItem) => (
                  <li key={childrenItem.id}>
                  <label className="flex items-center gap-2 sm:gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={`${childrenItem.slug}`}
                        name={`${childrenItem.slug}`}
                        checked={selectedCategories.includes(childrenItem.slug)}
                        onChange={handleChangeCategories}
                        className="peer sr-only"
                      />
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-300 rounded-sm peer-checked:border-orange peer-checked:bg-orange transition-colors group-hover:border-orange">
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
                    <span className="text-sm sm:text-base text-gray-700 group-hover:text-orange transition-colors">
                      {childrenItem.name}
                    </span>
                  </label>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={resetFilters}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base font-medium text-orange border border-orange rounded-lg hover:bg-orange hover:text-white transition-colors cursor-pointer"
      >
        Effacer les filtres
      </button>
    </aside>
  )
}
