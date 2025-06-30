interface Link {
  id: number;
  label: string;
  url: string;
  img?: {
    url: string;
    alternativeText: string;
  };
}

interface LinkCategory {
  category: string;
  links: Link[];
}

interface SocialLink {
  id: number;
  url: string;
  img: {
    url: string;
    alternativeText: string;
  };
}

export interface FooterDataProps {
  links_category?: LinkCategory[];
  footer_main?: {
    img: {
      url: string;
      alternativeText: string;
    };
    description: string;
  };
  social_network_links?: SocialLink[];
}
