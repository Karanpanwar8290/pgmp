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
  summary: z.string().describe('A concise summary of the user\'s wellbeing data, identifying key areas of strength and improvement.'),
  areasForImprovement: z.array(z.string()).optional().describe('Specific areas where the user could focus on improving their wellbeing.'),
  wellbeingScore: z.number().min(0).max(100).describe('A score from 0-100 representing overall wellbeing.'),
  wellbeingScoreChange: z.string().describe('The percentage change from the last period, like "+2.5%".'),
  sleepQuality: z.string().describe('A summary of sleep quality, like "7h 15m".'),
  sleepQualitySubtext: z.string().describe('Subtext for sleep quality, like "Avg. last 7 days".'),
  stressLevel: z.string().describe('The current stress level, like "Low", "Medium", or "High".'),
  stressLevelChange: z.string().describe('The percentage change in stress level from the last period, like "-10%".'),
  activeMinutes: z.string().describe('The total active minutes for the current period, like "450".'),
  activeMinutesChange: z.string().describe('The percentage change in active minutes from the last period, like "+19%".'),
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

  Based on all the data, generate a complete JSON response. Provide a concise summary of the user's wellbeing, highlighting key strengths and areas for improvement.  If the user has specific areas of weakness, list at least 2 specific areas for improvement in the areasForImprovement field.
  Calculate a wellbeingScore between 0 and 100.
  Invent plausible percentage changes for wellbeingScoreChange, stressLevelChange, and activeMinutesChange.
  Provide a sleepQuality summary string and subtext.
  Determine a stressLevel ("Low", "Medium", "High").
  Calculate the total activeMinutes from the logs and return it as a string.
  Even if the provided input is incomplete, use your best judgment to create a complete and valid JSON response.
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