/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// This file has been deprecated and cleared to comply with the Zero AI Policy.
// All Assistant functionality is now static.

import { Product, AIKnowledgeItem } from '../types';

export const sendMessageToGemini = async (
    history: {role: string, text: string}[], 
    newMessage: string,
    products: Product[],
    knowledge: AIKnowledgeItem[]
): Promise<string> => {
    return "This feature is currently disabled.";
};