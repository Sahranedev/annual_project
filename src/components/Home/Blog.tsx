import Link from "next/link";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  shortDescription: string;
  category?: string;
  publishedAt: string;
  documentId: string;
  image?: {
    formats?: {
      small?: {
        url: string;
      };
    };
  };
}

export default async function Blog() {
  let articlesData: { title: string; articles: Article[] };

  try {
    const res = await fetch(
      "http://localhost:1337/api/home-page?populate=Blogs&populate=Blogs.articles&populate=Blogs.articles.image",
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const response = await res.json();
    articlesData = response.data.Blogs;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return null;
  }

  return (
    <section className="pb-12 sm:pb-16 md:pb-20 bg-gray-50">
      <div className="px-4 sm:px-6 md:px-8 max-w-[1500px] mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12">
          {articlesData.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {articlesData.articles.map((article: Article) => (
            <article
              key={article.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-40 sm:h-48">
                <Image
                  src={
                    `http://localhost:1337${article?.image?.formats?.small?.url}` ||
                    "/placeholder-image.jpg"
                  }
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 sm:p-6">
                <span className="text-xs sm:text-sm text-pink-500 font-semibold">
                  {article.category || "Général"}
                </span>
                <h3 className="text-lg sm:text-xl font-bold mt-2 mb-2 sm:mb-3">{article.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">{article.shortDescription}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-500">
                    {article.publishedAt}
                  </span>
                  <Link
                    href={`/blog/${article.documentId}`}
                    className="text-pink-500 hover:text-pink-600 font-semibold text-sm sm:text-base"
                  >
                    Lire la suite →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
