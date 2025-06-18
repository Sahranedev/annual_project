
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

interface ArticleResponse {
    data: Article;
}



export default async function ArticlePage({ params }: { params: { articleId: string } }) {
    const res = await fetch(`http://127.0.0.1:1337/api/articles/${params.articleId}?populate=image`, {
        method: "GET",
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch article");
    }

    const response: ArticleResponse = await res.json();
    const article = response.data;

    return (
        <main className="max-w-[70vw] mx-auto px-6 py-16">
            <article className="max-w-fit mx-auto flex items-center justify-center" itemScope itemType="http://schema.org/BlogPosting">
                {article.image?.formats?.small?.url && (
                    <div className="mb-12 w-1/3">
                        <img
                            src={`http://127.0.0.1:1337${article.image.formats.small.url}`}
                            alt={article.title}
                            className="w-[80vw] h-[700px]  brightness-125 object-cover"
                            itemProp="image"
                        />
                    </div>
                )}
                <div className='m-20 w-1/2 '>


                    {/* Titre principal */}
                    <h1
                        className="text-[60px] font-bold text-gray-800 mb-8 w-[80%]"
                        itemProp="headline"
                    >
                        {article.title}
                    </h1>
                    <div className="mb-8 space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-black text-sm">
                                Catégorie(s) :
                            </span>
                            <span className=" text-pink-500 rounded-sm">
                                Infos
                            </span>
                        </div>
                    </div>
                    {/* Description courte */}
                    <div className="mb-12">
                        <p className="text-lg text-gray-600 leading-relaxed">
                            {article.shortDescription}
                        </p>
                    </div>




                </div>
                {/* En-tête avec catégorie et date */}

            </article>
            {/* Description courte */}
            <div className="mb-12 w-1/2 mx-auto">
                <p className="text-lg text-gray-600 leading-relaxed">
                    {article.shortDescription}
                </p>
            </div>

            {/* Contenu principal */}
            <div
                className=" max-w-none mb-12 text-black"
                itemProp="articleBody"
                dangerouslySetInnerHTML={{ __html: article.longDescription }}
            />
        </main>
    );
}
