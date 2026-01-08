/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  price: number;
  category: string;
  imageUrl: string;
  gallery?: string[];
  features: string[];
}

export interface HeroData {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  mission?: string;
  vision?: string;
  purpose?: string;
  logoUrl?: string;
  companyLabel?: string;
}

export interface AboutData {
  purpose?: string;
  vision?: string;
  mission?: string;
  mainImage?: string; // Mapped from Intro > MainImage
  pillar1Title?: string;
  pillar1Desc?: string;
  pillar1Media?: string;
  pillar2Title?: string;
  pillar2Desc?: string;
  pillar2Media?: string;
}

export interface AIKnowledgeItem {
  category: string;
  information: string;
}

export interface JournalArticle {
  id: number | string; // Relaxed to support both
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content: string; // Changed from React.ReactNode to string for CSV parsing
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export type ViewState = 
  | { type: 'home' }
  | { type: 'product', product: Product }
  | { type: 'journal', article: JournalArticle }
  | { type: 'checkout' };