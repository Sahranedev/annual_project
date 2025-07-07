export interface ProductColor {
  id: number;
  color: {
    id: number;
    name: string;
    color: string;
    label: string;
  };
  price: number;
}

export interface ProductSize {
  id: number;
  size: string;
  price: number;
}

export interface ProductPompom {
  id: number;
  enabled: boolean;
  price: number;
}

export interface ProductImage {
  id: number;
  url: string;
  formats: {
    thumbnail: {
      url: string;
    };
    small: {
      url: string;
    };
    medium: {
      url: string;
    };
    large: {
      url: string;
    };
  };
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  parent: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface ProductInformation {
  id: number;
  label: string;
  value: string;
}
export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  documentId: number;
  title: string;
  slug: string;
  price: number;
  shortDescription: string;
  longDescription: string;
  Promotion: boolean;
  discountPercent: number;
  Couleurs: ProductColor[];
  Taille: ProductSize[];
  Pompom: ProductPompom;
  categories: ProductCategory[];
  images: ProductImage[];
  Informations: ProductInformation[];
}
