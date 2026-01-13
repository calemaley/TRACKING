'use client';
import { useState } from 'react';
import { Loader, Wand2 } from 'lucide-react';
import { summarizeTransactionData } from '@/ai/flows/summarize-transaction-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { transactions } from '@/lib/mock-data';

export function AiSummary() {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSummary = async () => {
    setLoading(true);
    setError('');
    setSummary('');
    try {
      const transactionString = transactions.map(t => `${t.date} | ${t.type} | ${t.category} | ${t.amount.toFixed(2)} | ${t.description}`).join('\n');
      const result = await summarizeTransactionData({ transactionData: transactionString });
      if (result.summary) {
        setSummary(result.summary);
      } else {
        setError('Failed to generate summary. The result was empty.');
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          <CardTitle>AI Financial Summary</CardTitle>
        </div>
        <CardDescription>
          Get instant insights into your financial data.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow items-center justify-center gap-4 text-center">
        {loading && <Loader className="h-8 w-8 animate-spin text-primary" />}
        {!loading && !summary && !error && (
            <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground">Click the button to generate an AI-powered summary of your recent transactions.</p>
            </div>
        )}
        {summary && (
            <div className="text-sm text-left whitespace-pre-wrap font-mono p-4 bg-muted rounded-md w-full h-full overflow-y-auto">
                {summary}
            </div>
        )}
         {error && <p className="text-sm text-destructive">{error}</p>}
        <Button onClick={handleGenerateSummary} disabled={loading} className="w-full mt-auto">
          {loading ? 'Generating...' : 'Generate Summary'}
        </Button>
      </CardContent>
    </Card>
  );
}
