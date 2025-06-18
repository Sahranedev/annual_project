export default async function SecondSection() {

  const response = await fetch(`http://localhost:1337/api/home-page?populate=Arguments&populate=Arguments.Arguments`);
  const data = await response.json();  
  const blocks = data.data.Arguments.Arguments;  

  return (
    <section className="py-20 bg-white">
      <div className="flex gap-20 max-w-[1200px] mx-auto">
        {blocks.map((block: any, index: number) => (
          <div key={block.id} className="flex flex-col gap-4 flex-1 even:mt-10">
            <span className="text-pink-200 text-2xl">0{index + 1}</span>
            <h3 className="text-2xl font-bold">{block.Title}</h3>
            <p className="text-base">{block.Content}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 