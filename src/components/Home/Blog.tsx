import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Mon tout premier marché artisanal : retour sur l'expérience",
    excerpt: "Découvrez mon expérience lors de mon premier marché artisanal...",
    date: "08/06/2025",
    image: "/images/blog/marche.jpg",
    category: "Événements"
  },
  {
    id: 2,
    title: "Addi King Size vs Sentro 48 : quelle machine choisir pour tes projets créatifs ?",
    excerpt: "Comparatif détaillé entre les deux machines à tricoter...",
    date: "04/04/2025",
    image: "/images/blog/machines.jpg",
    category: "Matériel"
  },
  {
    id: 3,
    title: "Quelle laine choisir ? (Guide Complet 2025)",
    excerpt: "Guide complet pour choisir la laine adaptée à vos projets...",
    date: "12/03/2025",
    image: "/images/blog/laine.jpg",
    category: "Infos"
  }
];

export default function Blog() {
  return (
    <section className="pb-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Découvre le blog ❣️
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <span className="text-sm text-pink-500 font-semibold">{post.category}</span>
                <h3 className="text-xl font-bold mt-2 mb-3">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <Link 
                    href={`/blog/${post.id}`}
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