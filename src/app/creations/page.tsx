
"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function Page() {
  const [categories, setCategories] = useState([]);
  const [creations, setCreations] = useState([]);
  const [filteredCreations, setFilteredCreations] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const catRes = await fetch("http://localhost:1337/api/creation-categories");
      const catData = await catRes.json();
      setCategories(catData.data);

      const creationsRes = await fetch("http://localhost:1337/api/creations?populate=*");
      const creationsData = await creationsRes.json();
      console.log(creationsData.data);
      setCreations(creationsData.data);
      setFilteredCreations(creationsData.data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategoryId === null) {
      setFilteredCreations(creations);
    } else {
      const filtered = creations.filter((creation) =>
        creation.creation_categories.some((cat) => cat.id === selectedCategoryId)
      );
      setFilteredCreations(filtered);
    }
  }, [selectedCategoryId, creations]);

  return (
    <main className="max-w-[85vw] mx-auto px-6 py-16 bg-white">
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Découvrez mes créations personnalisées
        </h1>
        <p className="text-xl text-gray-600 max-w-6xl mx-auto">
          Découvrez mes créations passées, chacune unique et réalisée avec soin.
          Elles peuvent vous inspirer pour une commande personnalisée : il vous suffit
          de me contacter pour en discuter ensemble ! 😊
        </p>
      </header>

      <section className="space-y-16">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-4 py-2 border ${selectedCategoryId === null ? "bg-red-100 text-red-500 border-red-200" : "text-red-300 border-pink-200 hover:bg-red-50"}`}
          >
            Tout
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-4 py-2 border ${selectedCategoryId === cat.id ? "bg-red-100 text-red-500 border-red-200" : "text-red-300 border-pink-200 hover:bg-red-50"}`}
            >
              {cat.name || "Sans nom"}
            </button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
        {filteredCreations.map((creation) => {
          const imageUrl = `http://127.0.0.1:1337${creation.images[0]?.formats?.small?.url}`;

          return (
            <Link
              href={`/creations/${creation.documentId}`}
              key={creation.id}
              className="aspect-square bg-gray-100 rounded-md shadow-md overflow-hidden group block"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={creation.name}
                  className="w-full h-[550px] object-cover shadow-md group-hover:shadow-xl transition-shadow"
                  itemProp="image"
                />
              ) : (
                <div className="w-full h-full" />
              )}
            </Link>
          );
        })}
      </section>
    </main>
  );
}
