
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { RefactorCodeOutput } from '@/ai/flows/refactor-code';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { useMemo } from 'react';

type Suggestion = RefactorCodeOutput['suggestions'][0];

type PRCommentDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: Suggestion[];
  scannedFile: string;
};

function formatSuggestionsToMarkdown(suggestions: Suggestion[], scannedFile: string): string {
  if (!suggestions.length) {
    return "No suggestions to display.";
  }

  const header = `### RefactorAI Security Analysis\n\nFound **${suggestions.length}** potential issue(s) in \`${scannedFile || 'the submitted code'}\`:\n\n---\n\n`;

  const body = suggestions.map(suggestion => {
    const severityEmoji = {
      high: '🚨',
      medium: '⚠️',
      low: '💡',
    };

    return `
#### ${severityEmoji[suggestion.severity]} ${suggestion.title} (${suggestion.severity.toUpperCase()})

**Compliance:** ${suggestion.compliance}

**Description:** ${suggestion.description}

**Explanation:** ${suggestion.explanation}

**Suggested Fix:**
\`\`\`diff
- Vulnerable code (for context)
+ ${suggestion.refactoredCode.split('\n').join('\n+ ')}
\`\`\`
    `.trim();
  }).join('\n\n---\n\n');

  return header + body;
}

export function PRCommentDialog({ open, onOpenChange, suggestions, scannedFile }: PRCommentDialogProps) {
  const { toast } = useToast();
  
  const markdownContent = useMemo(() => formatSuggestionsToMarkdown(suggestions, scannedFile), [suggestions, scannedFile]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(markdownContent).then(() => {
      toast({
        title: "Copied to Clipboard!",
        description: "The PR comment has been copied successfully.",
      });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not copy text to clipboard.",
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Copy PR Comment</DialogTitle>
          <DialogDescription>
            Copy this markdown and paste it as a comment on your pull request.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            readOnly
            value={markdownContent}
            className="h-96 font-code text-xs bg-muted/50"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleCopyToClipboard} className="w-full bg-primary hover:bg-primary/90">
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
