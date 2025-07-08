import parse, { domToReact, Element } from "html-react-parser";
import ReactMarkdown from "react-markdown";


export interface Creation {
    id: number;
    name: string;
    shortDescription: string;
    longDescription: string;
    slug: string | null;
    realisationDuration: number;
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
    creation_categories?: {
        data: {
            id: number;
            name: string;
        }[];
    };
}

interface CreationResponse {
    data: Creation;
}

export default async function CreationPage({ params }: { params: { creationId: string } }) {
    const res = await fetch(`http://localhost:1337/api/creations/${params.creationId}?populate=*`, {
        method: "GET",
        cache: "no-store",
    });

    console.log(res);

    const response: CreationResponse = await res.json();
    console.log(response);
    const creation = response.data;
    console.log(creation);


    const imageUrl = creation.images?.[0]?.formats?.small?.url;


    const fullImageUrl = imageUrl ? `http://127.0.0.1:1337${imageUrl}` : null;

    const styledHtml = parse(creation.longDescription, {
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
                    return <p className="text-black mb-4">{domToReact(domNode.children)}</p>;
                }

                if (tag === "ul") {
                    return (
                        <ul className="list-disc list-inside mb-4 text-gray-800">
                            {domToReact(domNode.children)}
                        </ul>
                    );
                }

                if (tag === "li") {
                    return <li className="mb-1">{domToReact(domNode.children)}</li>;
                }

                if (tag === "strong") {
                    return <strong className="font-semibold text-black">{domToReact(domNode.children)}</strong>;
                }
            }
        },
    });

    return (
        <main className="max-w-[70vw] mx-auto px-6 py-16">
            <article className="max-w-fit mx-auto flex flex-col md:flex-row items-start md:items-center justify-center gap-12">
                {fullImageUrl && (
                    <div className="w-full md:w-1/2 mb-12 md:mb-0">
                        <img
                            src={fullImageUrl}
                            alt={creation.name}
                            className="w-full h-[700px] object-cover brightness-110 shadow-md"
                            itemProp="image"
                        />
                    </div>
                )}

                <div className="md:w-1/2">
                    <h1 className="text-[60px] font-bold text-gray-800 mb-8">{creation.name}</h1>
                    {/* Catégories (en ligne, séparées par des virgules) */}
                    {creation.creation_categories?.length > 0 && (
                        <div className="mb-6">
                            <span className="text-black text-sm font-semibold">Catégories : </span>
                            <span className="text-pink-500 text-sm">
                                {creation.creation_categories.map((cat) => cat.name).join(", ")}
                            </span>
                        </div>
                    )}


                    {/* Short description */}
                    <p className="text-lg text-gray-600 leading-relaxed mb-6">
                        {creation.shortDescription}
                    </p>
                    <p className="bg-red-100 text-red-500 px-4 py-2 rounded-md mb-6">
                        <span className="text-black">Durée de réalisation : </span>
                        <span className="text-gray-700">{creation.realisationDuration} h</span>
                    </p>

                </div>
            </article>

            {/* Long description */}
            <div className="mt-16 w-full md:w-2/3 mx-auto text-base leading-relaxed p-12">
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
                        img: ({ node, ...props }) => (
                            <img
                                {...props}
                                className="w-full  mx-auto my-6  shadow-md"
                            />
                        ),
                    }}
                >
                    {creation.longDescription}
                </ReactMarkdown>            </div>
        </main>
    );
}
