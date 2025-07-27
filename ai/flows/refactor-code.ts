// src/ai/flows/refactor-code.ts
'use server';
/**
 * @fileOverview An AI agent for security-focused code refactoring.
 *
 * - refactorCode - A function that handles the code hardening and remediation process.
 * - RefactorCodeInput - The input type for the refactorCode function.
 * - RefactorCodeOutput - The return type for the refactorCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefactorCodeInputSchema = z.object({
  code: z.string().describe('The code to be analyzed and hardened.'),
  language: z.string().describe('The programming language of the code.'),
});
export type RefactorCodeInput = z.infer<typeof RefactorCodeInputSchema>;

const SuggestionSchema = z.object({
    title: z.string().describe('A brief, descriptive title for the vulnerability (e.g., "SQL Injection").'),
    severity: z.enum(['low', 'medium', 'high']).describe('The assessed severity of the vulnerability.'),
    description: z.string().describe('A clear description of the security risk.'),
    refactoredCode: z.string().describe('A refactored, hardened code snippet that remediates the vulnerability.'),
    explanation: z.string().describe('An explanation of why the refactored code is more secure.'),
    compliance: z.string().describe('The relevant compliance standard (e.g., "OWASP A03:2021 - Injection").'),
});

const RefactorCodeOutputSchema = z.object({
  suggestions: z.array(SuggestionSchema).describe('A list of security hardening suggestions for the code.'),
});
export type RefactorCodeOutput = z.infer<typeof RefactorCodeOutputSchema>;


export async function refactorCode(input: RefactorCodeInput): Promise<RefactorCodeOutput> {
  return refactorCodeFlow(input);
}

const refactorCodePrompt = ai.definePrompt({
  name: 'refactorCodePrompt',
  input: {schema: RefactorCodeInputSchema},
  output: {schema: RefactorCodeOutputSchema},
  // TODO: Improve the accuracy of the AI-powered suggestions.
  prompt: `You are an expert DevSecOps engineer specializing in code hardening and vulnerability remediation. Please analyze the following code written in "{{language}}" and identify potential security vulnerabilities.

Focus on common attack vectors like SQL injection, Cross-Site Scripting (XSS), insecure deserialization, command injection, and other issues relevant to the OWASP Top 10.

For each vulnerability found, provide a JSON object with the following fields:
1.  "title": A brief title for the vulnerability.
2.  "severity": The assessed severity, which must be one of: "low", "medium", or "high".
3.  "description": A clear description of the security risk.
4.  "refactoredCode": A hardened code snippet that remediates the vulnerability.
5.  "explanation": An explanation of why the refactored code is more secure.
6.  "compliance": The relevant compliance standard (e.g., "OWASP A03:2021 - Injection").

Return your findings as a JSON object with a single key "suggestions" which is an array of these vulnerability objects.

--- Code to Analyze ({{language}}) ---
{{{code}}}
--- End Code ---
`,
});

const refactorCodeFlow = ai.defineFlow(
  {
    name: 'refactorCodeFlow',
    inputSchema: RefactorCodeInputSchema,
    outputSchema: RefactorCodeOutputSchema,
  },
  async input => {
    const {output} = await refactorCodePrompt(input);
    return output!;
  }
);
