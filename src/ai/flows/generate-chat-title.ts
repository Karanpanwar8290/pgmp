'use server';

/**
 * @fileOverview Generates a short title for a new chat session.
 * 
 * - generateChatTitle - A function that generates a title from a message.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const TitleInputSchema = z.object({
  message: z.string().describe("The first message from the user in a conversation.")
});

const TitleOutputSchema = z.object({
  title: z.string().describe("A concise, 5-word-or-less title for the conversation.")
});

export async function generateChatTitle(message: string): Promise<string> {
  const result = await generateChatTitleFlow({ message });
  return result.title;
}

const titlePrompt = ai.definePrompt({
  name: 'generateChatTitlePrompt',
  input: { schema: TitleInputSchema },
  output: { schema: TitleOutputSchema },
  prompt: `Generate a concise, 5-word-or-less title for the following user query. Do not use quotes in the title.
  
  User Query: {{{message}}}
  `,
});

const generateChatTitleFlow = ai.defineFlow(
  {
    name: 'generateChatTitleFlow',
    inputSchema: TitleInputSchema,
    outputSchema: TitleOutputSchema,
  },
  async (input) => {
    const {output} = await titlePrompt(input);
    return output!;
  }
);
