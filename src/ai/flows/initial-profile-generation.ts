'use server';

/**
 * @fileOverview Generates an initial wellbeing profile for a new user based on their answers to a few simple questions.
 *
 * - generateInitialProfile - A function that handles the initial profile generation process.
 * - InitialProfileInput - The input type for the generateInitialProfile function.
 * - InitialProfileOutput - The return type for the generateInitialProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialProfileInputSchema = z.object({
  stressLevel: z
    .string()
    .describe('The user reported level of stress (low, medium, high).'),
  sleepQuality: z
    .string()
    .describe('The user reported quality of sleep (poor, average, good).'),
  exerciseFrequency: z
    .string()
    .describe(
      'The user reported frequency of exercise (rarely, sometimes, often).' /* TODO: fix type */
    ),
});
export type InitialProfileInput = z.infer<typeof InitialProfileInputSchema>;

const InitialProfileOutputSchema = z.object({
  wellbeingProfile: z
    .string()
    .describe(
      'A summary of the users wellbeing profile based on their answers.'
    ),
  recommendations: z
    .string()
    .describe(
      'Personalized recommendations for the user based on their wellbeing profile.'
    ),
});
export type InitialProfileOutput = z.infer<typeof InitialProfileOutputSchema>;

export async function generateInitialProfile(
  input: InitialProfileInput
): Promise<InitialProfileOutput> {
  return initialProfileFlow(input);
}

const initialProfilePrompt = ai.definePrompt({
  name: 'initialProfilePrompt',
  input: {schema: InitialProfileInputSchema},
  output: {schema: InitialProfileOutputSchema},
  prompt: `You are an AI wellbeing assistant. You will generate a wellbeing profile and recommendations for the user based on their answers to the following questions.

Stress Level: {{{stressLevel}}}
Sleep Quality: {{{sleepQuality}}}
Exercise Frequency: {{{exerciseFrequency}}}

Based on this information, create a wellbeing profile summarizing the users current wellbeing, and some personalized recommendations for how they can improve their wellbeing.
`,
});

const initialProfileFlow = ai.defineFlow(
  {
    name: 'initialProfileFlow',
    inputSchema: InitialProfileInputSchema,
    outputSchema: InitialProfileOutputSchema,
  },
  async input => {
    const {output} = await initialProfilePrompt(input);
    return output!;
  }
);
