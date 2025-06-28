// src/ai/flows/generate-resource-recommendations.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized resource recommendations based on user profile, preferences, and goals.
 *
 * - generateResourceRecommendations - A function that takes user data and returns a list of recommended resources.
 * - GenerateResourceRecommendationsInput - The input type for the generateResourceRecommendations function.
 * - GenerateResourceRecommendationsOutput - The return type for the generateResourceRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow
const GenerateResourceRecommendationsInputSchema = z.object({
  userProfile: z
    .string()
    .describe('A detailed profile of the user, including demographics, assessment results, and activity logs.'),
  userPreferences: z
    .string()
    .describe('The user\u2019s preferences for content, format, and delivery of resources.'),
  userGoals: z.string().describe('The user\u2019s specific wellbeing goals and objectives.'),
});

export type GenerateResourceRecommendationsInput = z.infer<
  typeof GenerateResourceRecommendationsInputSchema
>;

// Define the output schema for the flow
const GenerateResourceRecommendationsOutputSchema = z.object({
  recommendedResources: z.array(
    z.object({
      title: z.string().describe('The title of the recommended resource.'),
      description: z.string().describe('A brief description of the resource.'),
      link: z.string().describe('A URL pointing to the resource.'),
      type: z
        .enum(['session', 'video', 'article', 'news', 'other'])
        .describe('The type of resource.'),
      imageUrl: z.string().describe('A URL for a relevant placeholder image for the resource, e.g., from https://placehold.co/600x400.png')
    })
  ).describe('A list of at least 12 resources recommended for the user.'),
});

export type GenerateResourceRecommendationsOutput = z.infer<
  typeof GenerateResourceRecommendationsOutputSchema
>;

// Define the prompt for generating resource recommendations
const resourceRecommendationPrompt = ai.definePrompt({
  name: 'resourceRecommendationPrompt',
  input: {schema: GenerateResourceRecommendationsInputSchema},
  output: {schema: GenerateResourceRecommendationsOutputSchema},
  prompt: `You are an AI assistant designed to provide a rich and diverse list of personalized resource recommendations to users based on their profile, preferences, and goals.

  Given the following information about the user, generate a list of at least 12 relevant resources that can help them achieve their wellbeing goals. 
  
  Include a mix of content types: guided audio 'sessions', 'videos', 'articles', and 'news' from reputable health sources like the NHS or WebMD. 
  
  For each resource, provide a title, a brief description, a direct link, the resource type, and a relevant placeholder image URL from https://placehold.co/.

  User Profile: {{{userProfile}}}
  User Preferences: {{{userPreferences}}}
  User Goals: {{{userGoals}}}

  Format the output as a valid JSON object.
  `,
});

// Define the Genkit flow for generating resource recommendations
const generateResourceRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateResourceRecommendationsFlow',
    inputSchema: GenerateResourceRecommendationsInputSchema,
    outputSchema: GenerateResourceRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await resourceRecommendationPrompt(input);
    return output!;
  }
);

/**
 * Generates personalized resource recommendations based on user profile, preferences, and goals.
 * @param input - The input containing user profile, preferences, and goals.
 * @returns A promise that resolves to a list of recommended resources.
 */
export async function generateResourceRecommendations(
  input: GenerateResourceRecommendationsInput
): Promise<GenerateResourceRecommendationsOutput> {
  return generateResourceRecommendationsFlow(input);
}
