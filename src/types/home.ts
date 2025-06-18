export interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: null | string;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface HeroImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    thumbnail: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface HomePageData {
  data: {
    id: number;
    documentId: string;
    heroTitle: string;
    heroDescription: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    aboutTitle: string | null;
    aboutContent: string | null;
    heroImage: HeroImage;
  };
  meta: Record<string, unknown>;
} 