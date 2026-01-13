'use server';

/**
 * @fileOverview Summarizes transaction data to provide insights into the school's financial situation.
 *
 * - summarizeTransactionData - A function that summarizes transaction data using AI.
 * - SummarizeTransactionDataInput - The input type for the summarizeTransactionData function.
 * - SummarizeTransactionDataOutput - The return type for the summarizeTransactionData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTransactionDataInputSchema = z.object({
  transactionData: z.string().describe('A string containing transaction data to be summarized.'),
});
export type SummarizeTransactionDataInput = z.infer<typeof SummarizeTransactionDataInputSchema>;

const SummarizeTransactionDataOutputSchema = z.object({
  summary: z.string().describe('A summary of the transaction data, including key insights.'),
});
export type SummarizeTransactionDataOutput = z.infer<typeof SummarizeTransactionDataOutputSchema>;

export async function summarizeTransactionData(
  input: SummarizeTransactionDataInput
): Promise<SummarizeTransactionDataOutput> {
  return summarizeTransactionDataFlow(input);
}

const summarizeTransactionDataPrompt = ai.definePrompt({
  name: 'summarizeTransactionDataPrompt',
  input: {schema: SummarizeTransactionDataInputSchema},
  output: {schema: SummarizeTransactionDataOutputSchema},
  prompt: `You are an expert financial analyst for schools. Analyze the following transaction data and provide a concise summary of key insights, including top expense categories and revenue trends. Use a professional tone and format the summary for easy understanding by school administrators.\n\nTransaction Data: {{{transactionData}}}`,
});

const summarizeTransactionDataFlow = ai.defineFlow(
  {
    name: 'summarizeTransactionDataFlow',
    inputSchema: SummarizeTransactionDataInputSchema,
    outputSchema: SummarizeTransactionDataOutputSchema,
  },
  async input => {
    const {output} = await summarizeTransactionDataPrompt(input);
    return output!;
  }
);
