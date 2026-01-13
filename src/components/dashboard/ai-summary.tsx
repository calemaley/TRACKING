'use client';
import { useState } from 'react';
import { Download, Loader, Wand2 } from 'lucide-react';
import { summarizeTransactionData } from '@/ai/flows/summarize-transaction-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Transaction } from '@/types';

interface AiSummaryProps {
    transactions: Transaction[];
}

export function AiSummary({ transactions }: AiSummaryProps) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSummary = async () => {
    setLoading(true);
    setError('');
    setSummary('');
    try {
      const transactionString = transactions.map(t => `${t.date} | ${t.type} | ${t.category} | ${t.amount.toFixed(2)} | ${t.description}`).join('\n');
      if (!transactionString) {
        setSummary('No transaction data available to summarize.');
        setLoading(false);
        return;
      }
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

  const handleDownloadSummary = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'financial-summary.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Wand2 className="h-6 w-6 text-primary" />
                <CardTitle>AI Financial Summary</CardTitle>
            </div>
            {summary && (
                <Button variant="ghost" size="icon" onClick={handleDownloadSummary} aria-label="Download Summary">
                    <Download className="h-5 w-5" />
                </Button>
            )}
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
        <Button onClick={handleGenerateSummary} disabled={loading || transactions.length === 0} className="w-full mt-auto">
          {loading ? 'Generating...' : 'Generate Summary'}
        </Button>
      </CardContent>
    </Card>
  );
}
