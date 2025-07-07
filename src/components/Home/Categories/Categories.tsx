import CategoryItem from "./CategoryItem";
import DiscoverProductButton from "../DiscoverProductButton";

interface Category {
  id: number
  name: string
}

export default async function Categories() {
  const response = await fetch(`http://localhost:1337/api/home-page?populate=Categories&populate=Categories.categories`);
  const data = await response.json();
  const categoriesData = data.data.Categories;
  
  return (
    <section className="flex justify-center py-10 sm:py-16 md:py-20 bg-orange px-4 sm:px-6 md:px-8">
      <ul className="w-full max-w-4xl flex flex-col items-center gap-6 sm:gap-8 md:gap-10">
        {categoriesData.categories.map((category: Category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
        <DiscoverProductButton />
      </ul>
    </section>
  );
} 