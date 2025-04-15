import { z } from 'zod';


/**
 * Complete search jobs prompt definition for MCP server
 */
export const searchJobsPrompt = server => server.prompt(
  'search_jobs',
  'Extract job search parameters from a natural language query',
  z.object({
    query: z.string().describe('Job search query'),
  }),
  (inputs) => {
    return {
      messages: [
        {
          role: 'system',
          content: `
You are a helpful assistant who helps users search for jobs by understanding their job search requirements.
Based on the user query, extract the search parameters needed to find relevant jobs.
`,
        },
        {
          role: 'user',
          content: `
Extract search parameters from the following job search query: "${inputs.query}"

Provide the following information:
1. Job title or keywords
2. Location (if specified, otherwise assume "Remote")
3. Any specific companies mentioned
4. Job type preferences (full-time, part-time, contract, etc.)
5. Experience level requirements (entry, mid, senior)
        `,
        },
      ],
    };
  },
);
