import Link from "next/link";

interface Tab {
  id: string;
  label: string;
  path: string;
  content: React.ReactNode;
}

interface ProfileTabsProps {
  tabs: Tab[];
  activeTab: string;
}

export default function ProfileTabs({ tabs, activeTab }: ProfileTabsProps) {
  const active = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="flex flex-col">
      <div className="border-b border-gray-200">
        <nav
          className="flex space-x-8 overflow-x-auto scrollbar-hide"
          aria-label="Tabs"
        >
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.path}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ml-2 ${
                activeTab === tab.id
                  ? "border-[#F6B99C] text-[#F6B99C]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } transition-colors duration-150 ease-in-out`}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="pt-6">{active?.content}</div>
    </div>
  );
}
