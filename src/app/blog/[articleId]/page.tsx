import parse, { domToReact, Element } from "html-react-parser";
import ReactMarkdown from "react-markdown";


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
    const res = await fetch(`http://localhost:1337/api/articles/${params.articleId}?populate=image`, {
        method: "GET",
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("Failed to fetch article");
    }

    const response: ArticleResponse = await res.json();
    const article = response.data;
    const styledHtml = parse(article.longDescription, {
        replace: (domNode) => {
            if (domNode instanceof Element) {
                const tag = domNode.name;

                if (tag === "h2") {
                    return (
                        <h2 className="text-2xl font-bold mt-8 mb-4" style={{ color: "#E8A499" }}>
                            {domToReact(domNode.children)}
                        </h2>
                    );
                }

                if (tag === "p") {
                    return (
                        <p className="text-gray-700 mb-4">
                            {domToReact(domNode.children)}
                        </p>
                    );
                }

                if (tag === "ul") {
                    return (
                        <ul className="list-disc list-inside mb-4 text-gray-800">
                            {domToReact(domNode.children)}
                        </ul>
                    );
                }

                if (tag === "li") {
                    return (
                        <li className="mb-1">
                            {domToReact(domNode.children)}
                        </li>
                    );
                }

                if (tag === "strong") {
                    return (
                        <strong className="font-semibold text-black">
                            {domToReact(domNode.children)}
                        </strong>
                    );
                }
            }
        },
    });

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
            <div className="mb-12 w-1/2 mx-auto text-black">
                <ReactMarkdown
                    components={{
                        h1: ({ node, children }) => (
                            <h1 className="text-5xl font-bold mt-8 mb-4" style={{ color: "#E8A499" }}>
                                {children}
                            </h1>
                        ),
                        h2: ({ node, children }) => (
                            <h2 className="text-4xl font-bold mt-8 mb-4" style={{ color: "#E8A499" }}>
                                {children}
                            </h2>
                        ),
                        h3: ({ node, children }) => (
                            <h3 className="text-3xl font-bold mt-6 mb-3" style={{ color: "#E8A499" }}>
                                {children}
                            </h3>
                        ),
                        ul: ({ node, children }) => (
                            <ul className="list-disc list-inside text-gray-800 mb-6 space-y-1">
                                {children}
                            </ul>
                        ),
                        li: ({ node, children }) => (
                            <li className="mb-1 text-black">
                                {children}
                            </li>
                        ),
                        p: ({ node, children }) => (
                            <p className="mb-4 text-gray-700">
                                {children}
                            </p>
                        ),
                        strong: ({ node, children }) => (
                            <strong className="font-semibold text-black">
                                {children}
                            </strong>
                        ),
                    }}
                >
                    {article.longDescription}
                </ReactMarkdown>
            </div>




        </main>
    );
}
