
'use server';
import { refactorCode, type RefactorCodeInput, type RefactorCodeOutput } from '@/ai/flows/refactor-code';
import { Octokit } from 'octokit';
import { z } from 'zod';

export async function getRefactoringSuggestions(input: RefactorCodeInput): Promise<{ success: true; data: RefactorCodeOutput } | { success: false; error: string }> {
    try {
        const result = await refactorCode(input);
        return { success: true, data: result };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: `An unexpected error occurred on the server: ${errorMessage}` };
    }
}

export async function getGithubRepos(token: string) {
  // TODO: Add support for other Git providers (GitLab, Bitbucket, etc.)
  if (!token) {
        return { success: false, error: 'GitHub token is required.' };
    }
    try {
        const octokit = new Octokit({ auth: token });
        const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
            per_page: 100, // fetch up to 100 repos
            sort: 'updated',
            direction: 'desc',
        });
        return { success: true, repos };
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: `Failed to fetch repositories: ${errorMessage}` };
    }
}

const ScanRepoInputSchema = z.object({
  owner: z.string(),
  repo: z.string(),
  token: z.string(),
});

export async function scanGithubFile(input: z.infer<typeof ScanRepoInputSchema>): Promise<{ success: true; data: RefactorCodeOutput, scannedFile: string } | { success: false; error: string }> {
    const parseResult = ScanRepoInputSchema.safeParse(input);
    if (!parseResult.success) {
        return { success: false, error: 'Invalid input for scanning repository.' };
    }

    const { owner, repo, token } = parseResult.data;

    if (!token) {
        return { success: false, error: 'GitHub token is required.' };
    }

    try {
        const octokit = new Octokit({ auth: token });

        // Potential file paths to check for scannable code.
        const potentialPaths = [
            'index.js', 'src/index.js', 'app.js', 'server.js', // JavaScript
            'main.py', 'app.py', // Python
            'index.ts', 'src/index.ts', // TypeScript
            'main.go', // Go
            'main.rb', // Ruby
            'src/main.rs', // Rust
            'Program.cs', // C#
            'src/main/java/Main.java', // Java
        ];

        let fileContent: string | null = null;
        let filePath: string | null = null;
        let fileLanguage: string | null = null;

        for (const path of potentialPaths) {
            try {
                const { data: content } = await octokit.rest.repos.getContent({
                    owner,
                    repo,
                    path,
                });

                if (content && 'type' in content && content.type === 'file' && content.content) {
                    fileContent = Buffer.from(content.content, 'base64').toString('utf-8');
                    filePath = content.path;
                    const extension = filePath.split('.').pop() || '';
                    // Simple language mapping from extension
                    const langMap: { [key: string]: string } = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  // TODO: Add more language mappings here
};
                    fileLanguage = langMap[extension] || 'javascript';
                    break; 
                }
            } catch (error: any) {
                // This is expected if a file doesn't exist, so we continue to the next path.
                if (error.status !== 404) {
                    console.warn(`Could not check file at ${path}:`, error.message);
                }
            }
        }
        
        if (!fileContent || !filePath || !fileLanguage) {
            return { success: false, error: `Could not find a scannable source file in the repository. Looked for common files like 'index.js', 'main.py', etc.` };
        }

        const result = await getRefactoringSuggestions({ code: fileContent, language: fileLanguage });
        
        if (result.success) {
            return {
                success: true,
                data: result.data,
                scannedFile: filePath,
            };
        } else {
            return { success: false, error: result.error };
        }

    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        return { success: false, error: `Failed to scan file: ${errorMessage}` };
    }
}
