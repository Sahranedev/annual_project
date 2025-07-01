interface Block {
  id: number;
  Title: string;
  Content: string;
}

export default async function SecondSection() {
  const response = await fetch(`http://localhost:1337/api/home-page?populate=Arguments&populate=Arguments.Arguments`);
  const data = await response.json();  
  const blocks: Block[] = data.data.Arguments.Arguments;  

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white px-4 sm:px-6 md:px-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-20 max-w-[1200px] mx-auto">
        {blocks.map((block: Block, index: number) => (
          <div key={block.id} className="flex flex-col gap-4 sm:gap-6 flex-1 lg:mt-10">
            <span className="font-light text-orange text-2xl sm:text-3xl md:text-4xl lg:text-5xl">0{index + 1}</span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-aboreto">{block.Title}</h3>
            <p className="text-sm sm:text-base text-text-light leading-relaxed">{block.Content}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 