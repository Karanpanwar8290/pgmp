// Summarize wellbeing data into a coherent overview for the user.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WellbeingDataSchema = z.object({
  assessments: z.array(z.object({
    name: z.string(),
    score: z.number(),
    maxScore: z.number(),
    interpretation: z.string().optional(),
  })).optional().describe('Wellbeing assessment scores and interpretations.'),
  demographics: z.object({
    age: z.number().optional(),
    gender: z.string().optional(),
    location: z.string().optional(),
  }).optional().describe('Demographic information about the user.'),
  activityLogs: z.array(z.object({
    type: z.string(),
    duration: z.number().optional(),
    intensity: z.string().optional(),
    timestamp: z.string().datetime().optional(),
  })).optional().describe('Logs of user activities and behaviors.'),
}).describe('Comprehensive user wellbeing data from various sources.');

export type WellbeingData = z.infer<typeof WellbeingDataSchema>;

const WellbeingSummarySchema = z.object({
  summary: z.string().describe('A concise summary of the user\s wellbeing data, identifying key areas of strength and improvement.'),
  areasForImprovement: z.array(z.string()).optional().describe('Specific areas where the user could focus on improving their wellbeing.'),
});

export type WellbeingSummary = z.infer<typeof WellbeingSummarySchema>;

export async function summarizeWellbeingData(data: WellbeingData): Promise<WellbeingSummary> {
  return summarizeWellbeingDataFlow(data);
}

const summarizeWellbeingDataPrompt = ai.definePrompt({
  name: 'summarizeWellbeingDataPrompt',
  input: {schema: WellbeingDataSchema},
  output: {schema: WellbeingSummarySchema},
  prompt: `You are a wellbeing expert summarizing user data to provide a clear overview of their current state.

  Analyze the following wellbeing data from various sources:

  Assessments:
  {{#if assessments}}
    {{#each assessments}}
      - {{name}}: {{score}} / {{maxScore}}
        {{#if interpretation}}
          Interpretation: {{interpretation}}
        {{/if}}
    {{/each}}
  {{else}}
    No assessment data available.
  {{/if}}

  Demographics:
  {{#if demographics}}
    Age: {{demographics.age}}
    Gender: {{demographics.gender}}
    Location: {{demographics.location}}
  {{else}}
    No demographic data available.
  {{/if}}

  Activity Logs:
  {{#if activityLogs}}
    {{#each activityLogs}}
      - {{type}}: {{duration}} minutes, Intensity: {{intensity}}, Timestamp: {{timestamp}}
    {{/each}}
  {{else}}
    No activity log data available.
  {{/if}}

  Provide a concise summary of the user's wellbeing, highlighting key strengths and areas for improvement.  If the user has specific areas of weakness, list at least 3 specific areas for improvement in areasForImprovement field.
  Assume that the score are percentages. Always try to provide areas of improvement when possible.
  Even if the provided input is incomplete, use your best judgment to fill in missing values to always respond with a complete and valid JSON.
  `, 
});

const summarizeWellbeingDataFlow = ai.defineFlow(
  {
    name: 'summarizeWellbeingDataFlow',
    inputSchema: WellbeingDataSchema,
    outputSchema: WellbeingSummarySchema,
  },
  async data => {
    const {output} = await summarizeWellbeingDataPrompt(data);
    return output!;
  }
);
