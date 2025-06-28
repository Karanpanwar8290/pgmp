'use server';
/**
 * @fileOverview A conversational AI flow for the Wellbeing Coach chatbot.
 *
 * - chat - A function that handles the chatbot conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The history of the conversation so far.'),
  message: z.string().describe('The latest message from the user.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export type ChatOutput = string;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: z.string(),
  },
  async ({ history, message }) => {
    const systemPrompt = `You are a friendly and encouraging AI Wellbeing Coach. Your name is "Wellbot".
Your goal is to help users improve their physical and mental health.
Provide supportive and actionable advice. You can suggest exercises, mindfulness techniques, healthy recipes, or just be a listening ear.
Keep your responses concise and easy to understand. Use emojis to make the conversation more engaging.`;

    // The history for the model should be a flat array of user and model messages
    const modelHistory = history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }]
    }));

    const result = await ai.generate({
      system: systemPrompt,
      prompt: message,
      history: modelHistory,
      output: { format: 'text' },
    });

    return result.text;
  }
);
