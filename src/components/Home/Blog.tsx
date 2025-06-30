import Link from "next/link";
import Image from "next/image";

export default async function Blog() {
  let articlesData;

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
  }

  return (
    <section className="pb-20 bg-gray-50">
      <div className="px-4 max-w-[1500px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          {articlesData.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articlesData.articles.map((article: any) => (
            <article
              key={article.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative h-48">
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
              <div className="p-6">
                <span className="text-sm text-pink-500 font-semibold">
                  {article.category || "Général"}
                </span>
                <h3 className="text-xl font-bold mt-2 mb-3">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.shortDescription}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {article.publishedAt}
                  </span>
                  <Link
                    href={`/blog/${article.documentId}`}
                    className="text-pink-500 hover:text-pink-600 font-semibold"
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
