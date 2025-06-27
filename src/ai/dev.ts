import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-wellbeing-data.ts';
import '@/ai/flows/initial-profile-generation.ts';
import '@/ai/flows/generate-resource-recommendations.ts';