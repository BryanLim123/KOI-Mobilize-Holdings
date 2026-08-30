/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Single source of truth for the shape of site-content.json.
 * The admin panel, the API and the public site all speak this schema.
 */

export interface NavLink {
  label: string;
  target: string; // section id: about | products | journal | footer
}

export interface LegalLink {
  label: string;
  href: string;
}

export interface FooterContent {
  blurb: string;
  newsletterTitle: string;
  newsletterBlurb: string;
  newsletterSuccess: string;
  legalLinks: LegalLink[];
}

export interface SiteContent {
  brandName: string;
  companyName: string;
  logoUrl: string;
  loaderLogoUrl: string;
  contactEmail: string;
  copyright: string;
  nav: NavLink[];
  footer: FooterContent;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  backgroundMedia: string; // .mp4 -> video, otherwise image
  badgeLabel: string;
  ctaText: string;
  ctaHoverText: string;
  ctaLink: string; // empty = decorative button (no navigation)
}

export interface Pillar {
  id: string;
  title: string;
  description: string;
  media: string;
  detailContent: string;
}

/**
 * The value chain shown between the intro and the pillars.
 * `steps` are the nodes of one continuous chain (IP -> Platform -> ...);
 * `closing` is the separate summary line beneath it.
 */
export interface PhilosophyContent {
  enabled: boolean;
  label: string;
  title: string;
  steps: string[];
  closing: string;
}

export interface AboutContent {
  sectionLabel: string;
  purpose: string;
  visionTitle: string;
  vision: string;
  missionTitle: string;
  mission: string;
  mainImage: string;
  /** Optional so documents written before V5.0.1 still load. */
  philosophy?: PhilosophyContent;
  pillars: Pillar[];
}

export interface IPItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string;
  actionLink: string;
  actionLabel: string;
  inquiryLabel: string;
  inquiryEnabled: boolean;
}

export interface IPCategory {
  id: string;
  name: string;
  tagline: string;
  coverImage: string;
  items: IPItem[];
}

export interface PortfolioContent {
  sectionLabel: string;
  sectionTitle: string;
  sectionSubtitle: string;
  countSuffix: string;
  enterLabel: string;
  categories: IPCategory[];
}

export interface JournalArticle {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content: string; // supports [DP] [Q] [B] block tags
  sourceLink: string;
  published: boolean;
}

export interface JournalContent {
  sectionLabel: string;
  sectionTitle: string;
  articles: JournalArticle[];
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
}

export interface AssistantContent {
  enabled: boolean;
  title: string;
  welcomeMessage: string;
  qaItems: QAItem[];
}

export interface KnowledgeItem {
  id: string;
  category: string;
  information: string;
}

export interface SiteDocument {
  schemaVersion: number;
  updatedAt: string;
  updatedBy: string;
  site: SiteContent;
  hero: HeroContent;
  about: AboutContent;
  portfolio: PortfolioContent;
  journal: JournalContent;
  assistant: AssistantContent;
  knowledge: KnowledgeItem[];
}

export type ContentSection = keyof Pick<
  SiteDocument,
  'site' | 'hero' | 'about' | 'portfolio' | 'journal' | 'assistant' | 'knowledge'
>;

/* ---------------------------------------------------------------- */
/* Runtime-only view state                                           */
/* ---------------------------------------------------------------- */

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type ViewState =
  | { type: 'home' }
  | { type: 'ip'; item: IPItem; category: IPCategory }
  | { type: 'journal'; article: JournalArticle };

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string;
  source: string;
}
