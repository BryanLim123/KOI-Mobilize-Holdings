/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { Product, JournalArticle, QAItem } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'MsKOI',
    tagline: 'The face of the digital revolution.',
    description: 'A virtual influencer and flagship character representing the bridge between traditional media and the metaverse.',
    longDescription: 'MsKOI is not just a character; she is a digital entity designed for the modern era. As the central figure of the KOI ecosystem, she navigates gaming environments, social media platforms, and brand collaborations. MsKOI represents the fusion of high-fashion aesthetics with next-gen gaming culture, building a community that transcends physical borders.',
    price: 0, // Informational only
    category: 'Character',
    imageUrl: 'https://images.unsplash.com/photo-1616004655123-818cbd4b3143?q=80&w=1000&auto=format&fit=crop', // Futuristic female figure
    gallery: [
      'https://images.unsplash.com/photo-1616004655123-818cbd4b3143?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1000&auto=format&fit=crop'
    ],
    features: ['Virtual Influencer', 'Cross-Platform Identity', 'Brand Ambassador']
  },
  {
    id: 'p2',
    name: 'Pumfys',
    tagline: 'Digital collectibles with soul.',
    description: 'A collection of unique digital assets designed for interoperability across gaming and social platforms.',
    longDescription: 'Pumfys are the playful heart of the KOI Mobilize ecosystem. These digital assets are designed not just as collectibles, but as functional keys to various experiences within our network. Each Pumfy carries unique traits that unlock special access, gaming abilities, and community privileges, creating a sustainable economy of fun and utility.',
    price: 0,
    category: 'Games',
    imageUrl: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000&auto=format&fit=crop', // Abstract colorful/toy-like
    gallery: [
        'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1633511090164-b43840ea1607?q=80&w=1000&auto=format&fit=crop'
    ],
    features: ['Interoperable Assets', 'Community Access', 'Gaming Utility']
  },
  {
    id: 'p3',
    name: 'KOI City',
    tagline: 'Where the ecosystem lives.',
    description: 'An immersive digital metropolis where creators, brands, and users converge to co-create value.',
    longDescription: 'KOI City is the ultimate destination for our IP portfolio. It is a persistent digital world designed for commerce, entertainment, and social interaction. Within KOI City, users can interact with MsKOI, utilize their Pumfys, and experience brand activations in a high-fidelity environment. It is the infrastructure of our vision—a place where digital and physical worlds merge.',
    price: 0,
    category: 'Stories',
    imageUrl: 'https://images.unsplash.com/photo-1535378437327-1017d9115f06?q=80&w=1000&auto=format&fit=crop', // Cyberpunk city
    gallery: [
        'https://images.unsplash.com/photo-1535378437327-1017d9115f06?q=80&w=1000&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1480796927426-f609979314bd?q=80&w=1000&auto=format&fit=crop'
    ],
    features: ['Metaverse Infrastructure', 'Social Hub', 'Creator Economy']
  }
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
    {
        id: 1,
        title: "Building Trust & Vision",
        date: "October 12, 2024",
        excerpt: "How KOI Mobilize is redefining the relationship between digital assets and sustainable value.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop", // Tech network
        content: `[DP] In an industry often defined by volatility, trust is the most valuable currency. At KOI Mobilize Holdings, our purpose is clear: to build trust and vision in the digital asset space.

We believe that the next generation of intellectual property (IP) must do more than entertain; it must empower. By creating ecosystems where creators, brands, and communities co-build, we ensure that value is shared and sustainable.

[Q] To create a new generation of IP that lives across digital and physical worlds.

This vision drives our commercialization strategy, from licensing and brand collaborations to direct digital asset monetization. We are not just building games; we are building economies.`
    },
    {
        id: 2,
        title: "The Rise of Co-Creation",
        date: "September 28, 2024",
        excerpt: "Empowering communities to shape the future of IP ecosystems.",
        image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop", // Meeting/Collab
        content: `The era of passive consumption is over. Today's audiences want to be participants. Our Mission at KOI Mobilize is to empower creators and communities to co-build scalable IP ecosystems.

Through assets like Pumfys and platforms like KOI City, we provide the tools for our community to leave their mark on the worlds we create. This collaborative approach ensures longevity and relevance in a fast-moving market.`
    },
    {
        id: 3,
        title: "Commercializing Creativity",
        date: "September 15, 2024",
        excerpt: "A deep dive into our original IP development and licensing strategies.",
        image: "https://images.unsplash.com/photo-1526304640152-d4619684e484?q=80&w=1000&auto=format&fit=crop", // Data/Charts
        content: `What We Do can be summarized in two powerful pillars: Create and Commercialize.

**Create:** We focus on original IP development that spans games, characters, and immersive stories. **Commercialize:** We leverage licensing, brand collaborations, and digital asset monetization to bring these creations to the global market.

[B] Original IP Development | Brand Collaborations | Digital Asset Monetization`
    }
];

export const DEFAULT_QA_ITEMS: QAItem[] = [
    {
        id: 1,
        question: "What is the core strategic mission of KOI Mobilize Holdings?",
        answer: "Our mission is to bridge the physical and digital worlds by creating sustainable, interoperable IP ecosystems. We empower creators and brands to co-build value that lasts, moving beyond transient trends to establish long-term equity."
    },
    {
        id: 2,
        question: "How does MsKOI fit into the global IP strategy?",
        answer: "MsKOI serves as our 'Digital Anchor.' Unlike human influencers, she is an always-on, scalable entity that can exist simultaneously in games, social media, and brand campaigns, providing a consistent and controllable interface for our ecosystem."
    },
    {
        id: 3,
        question: "What differentiates Pumfys from other digital collectibles?",
        answer: "Pumfys are designed with 'Utility First' principles. They are not just static images; they are keys that unlock specific functionalities, gaming experiences, and community governance rights within KOI City and partner networks."
    },
    {
        id: 4,
        question: "Can you explain the 'Create and Commercialize' model?",
        answer: "Certainly. 'Create' involves high-fidelity asset production and world-building. 'Commercialize' activates those assets through licensing, B2B partnerships, and direct-to-consumer digital sales, ensuring multiple revenue streams for every IP."
    },
    {
        id: 5,
        question: "What is the role of KOI City?",
        answer: "KOI City is the infrastructure layer—a persistent immersive environment where all our IPs converge. It functions as a social commerce hub where users can trade, interact, and experience the narrative depth of our portfolio."
    }
];

export const BRAND_NAME = 'KOI Mobilize';
export const PRIMARY_COLOR = 'slate-900'; 
export const ACCENT_COLOR = 'slate-500';