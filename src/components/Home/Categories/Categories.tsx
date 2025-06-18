import CategoryItem from "./CategoryItem";

interface Category {
  id: number
  name: string
}

export default async function Categories() {
  const response = await fetch(`http://localhost:1337/api/home-page?populate=Categories&populate=Categories.categories`);
  const data = await response.json();
  const categoriesData = data.data.Categories;
  
  return (
    <section className="flex justify-center py-20 bg-pink-50">
      <ul className="mx-20 w-fit flex flex-col items-center gap-10">
        {categoriesData.categories.map((category: Category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
        <button className="bg-pink-300 text-white px-4 py-2 rounded-md">Voir la boutique</button>
      </ul>
    </section>
  );
} 