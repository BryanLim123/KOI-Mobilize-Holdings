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
  level?: string; // New field for hierarchy logic (Cover vs Item)
  imageUrl: string;
  gallery?: string[];
  features: string[];
  actionLink?: string;
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

export interface Pillar {
  id: string;
  title: string;
  description: string;
  media: string;
  detailContent: string;
}

export interface AboutData {
  purpose?: string;
  vision?: string;
  mission?: string;
  mainImage?: string; // Mapped from Intro > MainImage
  pillars: Pillar[];
}

export interface AIKnowledgeItem {
  category: string;
  information: string;
}

export interface QAItem {
    id: string | number;
    question: string;
    answer: string;
}

export interface JournalArticle {
  id: number | string; // Relaxed to support both
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content: string; // Changed from React.ReactNode to string for CSV parsing
  sourceLink?: string;
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