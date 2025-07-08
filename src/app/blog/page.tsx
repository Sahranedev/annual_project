import Link from 'next/link';

// Mise à jour de l'interface pour inclure l'image
export interface Article {
    id: number;
    documentId: string;
    title: string;
    lectureDuration: string;
    shortDescription: string;
    longDescription: string;
    slug: string | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    image?: {
        formats?: {
            medium?: {
                url: string;
            };
            small?: {
                url: string;
            };
        };
    };
}

interface StrapiResponse {
    data: Article[];
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

export default async function Page() {
    const res = await fetch("http://localhost:1337/api/articles?populate=image", {
        method: "GET",
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const response: StrapiResponse = await res.json();
    const articles = response.data;
    const pageContent = await fetch("http://localhost:1337/api/article-title"); // Remplace avec ton endpoint Strapi réel
    const articleTitle = await pageContent.json();

    return (
        <main className="max-w-[85vw] mx-auto px-6 py-16 bg-white p-20">
            <header className="mb-16 text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">{articleTitle.data.ArticleTitle}</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    {articleTitle.data.ArticleSubTitle}
                </p>
            </header>

            <section className="space-y-16">
                {articles.reverse().map((article, index) => (
                    <Link
                        href={`/blog/${article.documentId}`}
                        key={article.id}
                        className="block group"
                    >
                        <article
                            className="cursor-pointer grid grid-cols-1 md:grid-cols-2 gap-8"
                            itemScope
                            itemType="http://schema.org/BlogPosting"
                        >
                            {/* Contenu texte */}
                            <div className={`space-y-4 flex flex-col justify-center ${index % 2 === 1 ? 'md:order-last' : ''}`}>
                                <div className="flex items-center space-x-2">
                                    <span className="bg-black text-white text-xs px-3 py-1.5 rounded-sm">
                                        Infos
                                    </span>
                                </div>

                                <h2
                                    className="text-3xl font-bold text-gray-900 group-hover:text-black transition-colors"
                                    itemProp="headline"
                                >
                                    {article.title}
                                </h2>

                                <div className="flex items-center text-sm text-red-300 font-medium">
                                    <time itemProp="datePublished" dateTime={article.publishedAt}>
                                        {formatDate(article.publishedAt)}
                                    </time>
                                    <span className="mx-2">|</span>
                                    <span>
                                        {article.lectureDuration} minutes de lecture estimées
                                    </span>
                                </div>

                                <p
                                    className="text-gray-600 leading-relaxed"
                                    itemProp="description"
                                >
                                    {article.shortDescription}
                                </p>

                                <div className="pt-4">
                                    <span className="underline underline-offset-8 text-pink-500 text-sm font-medium hover:text-pink-600 hover:underline-offset-8 transition-colors inline-flex items-center">
                                        Lire l&apos;article
                                        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            {/* Image */}
                            {article.image?.formats?.small?.url && (
                                <div className={`${index % 2 === 0 ? 'md:order-last' : ''} order-first`}>
                                    <img
                                        src={`http://127.0.0.1:1337${article.image.formats.small.url}`}
                                        alt={article.title}
                                        className="w-full h-[550px] object-cover shadow-md group-hover:shadow-xl transition-shadow"
                                        itemProp="image"
                                    />
                                </div>
                            )}
                        </article>
                    </Link>
                ))}
            </section>
        </main>
    );
}