interface HeaderLink {
  id: number;
  url: string;
  label: string;
  sublinks?: SubLink[];
}

interface SubLink {
  id: number;
  url: string;
  label: string;
  description?: string;
  img?: {
    url: string;
    alternativeText: string;
  };
}

export interface HeaderDataProps {
  logo?: {
    url: string;
    alternativeText: string;
  };
  links?: HeaderLink[];
}
