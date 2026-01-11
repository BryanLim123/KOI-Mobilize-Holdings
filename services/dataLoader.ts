/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Product, HeroData, AIKnowledgeItem, AboutData, JournalArticle, QAItem } from '../types';
import { DEFAULT_QA_ITEMS } from '../constants';

// Converted from pubhtml to pub?output=csv
const HERO_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXddgRxLZ0LndykpC73ZyzqxsuKoj4mzyY2Jpe5dohuRbBuIiYXVt1jyFhYJAxluL2aDELOArfubtL/pub?gid=0&single=true&output=csv';
const PRODUCTS_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXddgRxLZ0LndykpC73ZyzqxsuKoj4mzyY2Jpe5dohuRbBuIiYXVt1jyFhYJAxluL2aDELOArfubtL/pub?gid=1257734799&single=true&output=csv';

const AI_CONTEXT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXddgRxLZ0LndykpC73ZyzqxsuKoj4mzyY2Jpe5dohuRbBuIiYXVt1jyFhYJAxluL2aDELOArfubtL/pub?gid=1529591673&single=true&output=csv'; 

// About Config Sheet
const ABOUT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXddgRxLZ0LndykpC73ZyzqxsuKoj4mzyY2Jpe5dohuRbBuIiYXVt1jyFhYJAxluL2aDELOArfubtL/pub?gid=350955839&single=true&output=csv';

// Journal/Insights Sheet
const JOURNAL_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXddgRxLZ0LndykpC73ZyzqxsuKoj4mzyY2Jpe5dohuRbBuIiYXVt1jyFhYJAxluL2aDELOArfubtL/pub?gid=519114801&single=true&output=csv';

// QA Config Sheet - Updated GID as requested
const QA_CONFIG_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXddgRxLZ0LndykpC73ZyzqxsuKoj4mzyY2Jpe5dohuRbBuIiYXVt1jyFhYJAxluL2aDELOArfubtL/pub?gid=1167661763&single=true&output=csv';


const parseCSV = (text: string): Record<string, string>[] => {
  const result: string[][] = [];
  let row: string[] = [];
  let currentVal = '';
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuote) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          currentVal += '"';
          i++; 
        } else {
          // End of quoted field
          inQuote = false;
        }
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        inQuote = true;
      } else if (char === ',') {
        row.push(currentVal.trim());
        currentVal = '';
      } else if (char === '\n' || char === '\r') {
        // Handle CRLF or LF
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(currentVal.trim());
        currentVal = '';
        if (row.length > 0 && (row.length > 1 || row[0] !== '')) {
           result.push(row);
        }
        row = [];
      } else {
        currentVal += char;
      }
    }
  }

  // Handle trailing data
  if (currentVal || row.length > 0) {
      row.push(currentVal.trim());
      if (row.length > 0) {
          result.push(row);
      }
  }

  if (result.length < 2) return [];

  const headers = result[0].map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());

  return result.slice(1).map(values => {
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index] || '';
      return obj;
    }, {} as Record<string, string>);
  });
};

export const fetchAppContent = async (): Promise<{ 
    hero: HeroData | null, 
    products: Product[], 
    knowledge: AIKnowledgeItem[],
    about: AboutData | null,
    articles: JournalArticle[],
    qaItems: QAItem[]
}> => {
  try {
    const [heroResponse, productsResponse, contextResponse, aboutResponse, journalResponse, qaResponse] = await Promise.all([
      fetch(HERO_SHEET_URL),
      fetch(PRODUCTS_SHEET_URL),
      fetch(AI_CONTEXT_SHEET_URL).catch((err) => {
          console.error("Error fetching AI Context:", err);
          return null;
      }),
      fetch(ABOUT_SHEET_URL).catch((err) => {
          console.error("Error fetching About Config:", err);
          return null;
      }),
      fetch(JOURNAL_SHEET_URL).catch((err) => {
          console.error("Error fetching Journal Config:", err);
          return null;
      }),
      fetch(QA_CONFIG_SHEET_URL).catch((err) => {
          console.warn("QA Config Fetch failed, using default.");
          return null;
      })
    ]);

    const heroText = await heroResponse.text();
    const productsText = await productsResponse.text();
    const contextText = contextResponse ? await contextResponse.text() : '';
    const aboutText = aboutResponse ? await aboutResponse.text() : '';
    const journalText = journalResponse ? await journalResponse.text() : '';
    const qaText = qaResponse ? await qaResponse.text() : '';

    const heroRows = parseCSV(heroText);
    const productRows = parseCSV(productsText);
    const contextRows = contextText ? parseCSV(contextText) : [];
    const aboutRows = aboutText ? parseCSV(aboutText) : [];
    const journalRows = journalText ? parseCSV(journalText) : [];
    const qaRows = qaText ? parseCSV(qaText) : [];

    // Map Hero Data
    let hero: HeroData | null = null;
    
    // Helper to find content in Key-Value structure
    const findContent = (rows: Record<string, string>[], keyName: string) => {
        const row = rows.find(r => r['key']?.trim().toLowerCase() === keyName.toLowerCase());
        return row ? (row['content'] || row['value']) : undefined;
    };

    const isHeroKeyValue = heroRows.length > 0 && 'key' in heroRows[0] && ('content' in heroRows[0] || 'value' in heroRows[0]);

    if (isHeroKeyValue) {
        hero = {
            title: findContent(heroRows, 'MainTitle'),
            subtitle: findContent(heroRows, 'SubTitle'),
            backgroundImage: findContent(heroRows, 'HeroImage'),
            mission: findContent(heroRows, 'Mission'), 
            vision: findContent(heroRows, 'Vision'), 
            purpose: findContent(heroRows, 'Purpose'), 
            logoUrl: findContent(heroRows, 'LogoUrl'),
            companyLabel: findContent(heroRows, 'CompanyLabel')
        };
    } else if (heroRows.length > 0) {
        const r = heroRows[0];
        hero = {
            title: r['title'] || r['headline'],
            subtitle: r['subtitle'] || r['subhead'] || r['description'],
            backgroundImage: r['backgroundimage'] || r['image'] || r['bgimage'],
            mission: r['mission'],
            vision: r['vision'],
            purpose: r['purpose'],
            logoUrl: r['logourl'] || r['logo'],
            companyLabel: r['companylabel'] || r['label']
        };
    }

    // Map About Data
    let about: AboutData | null = null;
    const getAboutValue = (rows: Record<string, string>[], section: string, key: string) => {
        const valBySection = rows.find(r => 
            (r['section']?.trim().toLowerCase() === section.toLowerCase()) && 
            (r['key']?.trim().toLowerCase() === key.toLowerCase())
        );
        if (valBySection) return valBySection['content'] || valBySection['value'];

        const combinedKey = `${section}${key}`;
        const valByKey = rows.find(r => r['key']?.replace(/\s/g, '').toLowerCase() === combinedKey.toLowerCase());
        if (valByKey) return valByKey['content'] || valByKey['value'];
        
        return undefined;
    };

    if (aboutRows.length > 0) {
        about = {
            purpose: getAboutValue(aboutRows, 'Intro', 'Purpose') || findContent(aboutRows, 'Purpose') || findContent(aboutRows, 'PurposeText'),
            vision: getAboutValue(aboutRows, 'Intro', 'Vision') || findContent(aboutRows, 'Vision') || findContent(aboutRows, 'VisionText'),
            mission: getAboutValue(aboutRows, 'Intro', 'Mission') || findContent(aboutRows, 'Mission') || findContent(aboutRows, 'MissionText'),
            mainImage: getAboutValue(aboutRows, 'Intro', 'MainImage') || getAboutValue(aboutRows, 'Intro', 'OfficeImage') || findContent(aboutRows, 'AboutImage'),
            pillar1Title: getAboutValue(aboutRows, 'Pillar01', 'Title') || findContent(aboutRows, 'Pillar1Title'),
            pillar1Desc: getAboutValue(aboutRows, 'Pillar01', 'Desc') || findContent(aboutRows, 'Pillar1Desc'),
            pillar1Media: getAboutValue(aboutRows, 'Pillar01', 'Media') || findContent(aboutRows, 'Pillar1Media'),
            pillar2Title: getAboutValue(aboutRows, 'Pillar02', 'Title') || findContent(aboutRows, 'Pillar2Title'),
            pillar2Desc: getAboutValue(aboutRows, 'Pillar02', 'Desc') || findContent(aboutRows, 'Pillar2Desc'),
            pillar2Media: getAboutValue(aboutRows, 'Pillar02', 'Media') || findContent(aboutRows, 'Pillar2Media'),
        };
    }

    // Map Products Data
    const products: Product[] = productRows.map((r, index) => ({
      id: r['id'] || `sheet-p-${index}`,
      name: r['name'] || 'Untitled',
      tagline: r['tagline'] || r['tagline / description'] || r['tagline/description'] || '', // Check all variants
      description: r['description'] || '',
      longDescription: r['longdescription'] || r['long description'] || r['description'],
      price: parseFloat(r['price']) || 0,
      category: r['category'] || 'All',
      level: r['level'] || 'Item', // Map level column, default to Item
      imageUrl: r['imageurl'] || r['image'] || '',
      gallery: r['gallery'] ? r['gallery'].split('|').map(s => s.trim()) : [r['imageurl'] || ''],
      features: r['features'] ? r['features'].split(',').map(s => s.trim()) : []
    }));

    // Map Journal Data
    const articles: JournalArticle[] = journalRows.map((r, index) => ({
        id: r['id'] || index,
        title: r['title'] || 'Untitled Article',
        date: r['date'] || '',
        excerpt: r['excerpt'] || '',
        image: r['image'] || r['imageurl'] || '',
        content: r['content'] || '' // Store raw content with tags
    }));

    // Map AI Knowledge Data
    const knowledge: AIKnowledgeItem[] = contextRows.map(r => ({
      category: r['category'] || 'General',
      information: r['information'] || r['info'] || r['content'] || ''
    })).filter(k => k.information !== '');

    // Map QA Config Data
    const qaItems: QAItem[] = qaRows.map((r, index) => ({
        id: r['id'] || index + 1,
        question: r['question'] || r['q'] || '',
        answer: r['answer'] || r['a'] || ''
    })).filter(q => q.question !== '' && q.answer !== '');
    
    // Fallback to defaults if sheet is empty or failed
    const finalQaItems = qaItems.length > 0 ? qaItems : DEFAULT_QA_ITEMS;

    return { hero, products, knowledge, about, articles, qaItems: finalQaItems };

  } catch (error) {
    console.error("Failed to load Google Sheet data:", error);
    return { hero: null, products: [], knowledge: [], about: null, articles: [], qaItems: DEFAULT_QA_ITEMS };
  }
};