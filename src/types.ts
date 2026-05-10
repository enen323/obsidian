export interface AffiliateLink {
  name: string;
  url: string;
  description: string;
  vendor: string;
}

export interface TutorialMeta {
  title: string;
  description: string;
  field: string;
  software: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  slug: string;
  date: string;
  readTime: number;
  translationOf?: string;
  featured?: boolean;
  affiliateLinks?: AffiliateLink[];
}

export interface TutorialPost extends TutorialMeta {
  path: string;
  url: string;
  content: string;
}

export interface FieldInfo {
  key: string;
  name: string;
  icon: string;
  count: number;
}
