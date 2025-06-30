import Filters from "@/components/products/Filters";
import Image from "next/image";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  title: string;
  slug: string | null;
  price: number;
  Promotion: boolean;
  discountPercent: number;
  images: Array<{
    formats: {
      thumbnail: { url: string };
      large: { url: string };
    };
  }>;
  categories: Category[];
}

interface PageProps {
  searchParams?: {
    category?: string;
    search?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const { category, minPrice, maxPrice } = await Promise.resolve(
    searchParams ?? {}
  );

  let url = "http://localhost:1337/api/products?populate=*";

  if (category) {
    const categoryArray = category
      .split(",")
      .map((id) => `filters[categories][id][$in]=${id}`);
    url += `&${categoryArray.join("&")}`;
  }

  if (minPrice) {
    url += `&filters[price][$gte]=${minPrice}`;
  }
  if (maxPrice) {
    url += `&filters[price][$lte]=${maxPrice}`;
  }

  const res = await fetch(url, { method: "GET", cache: "no-store" });

  if (!res.ok) throw new Error("Failed to fetch data");

  const data = await res.json();
  const products: Product[] = data.data;

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full h-96 bg-gray-100 mb-12 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-serif">Boutique</h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          <Filters categoryParam={category} />
          <main className="flex-1">
            <div className="mb-8 flex justify-between items-center">
              <p className="text-gray-600">{products.length} produits</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug || product.id}`}
                >
                  <li className="group">
                    <div className="relative aspect-square mb-4 overflow-hidden">
                      {product.images?.[0]?.formats?.thumbnail?.url && (
                        <Image
                          src={`http://localhost:1337${product.images[0].formats.large.url}`}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      )}
                      {product.Promotion && (
                        <span className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 text-sm">
                          En promo !
                        </span>
                      )}
                      <button className="absolute bottom-4 left-4 right-4 bg-white border border-black py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                        Ajouter au panier
                      </button>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">
                        {product.categories?.map((category, index) => (
                          <span key={category.id}>
                            {category.name}
                            {index !== product.categories.length - 1 && " / "}
                          </span>
                        ))}
                      </p>
                      <h2 className="text-lg font-medium mb-2">
                        {product.title}
                      </h2>
                      <p className="text-lg">
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
                    </div>
                  </li>
                </Link>
              ))}
            </ul>
          </main>
        </div>
      </div>
    </div>
  );
}
