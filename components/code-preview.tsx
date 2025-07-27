'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, ShieldAlert } from "lucide-react";

const vulnerabilities = {
  sqlInjection: {
    title: "SQL Injection",
    vulnerableCode: `const express = require('express');
const db = require('./database');
const app = express();
app.get('/users', (req, res) => {
  const userId = req.query.id;
  // Unsafe query construction
  const query = "SELECT * FROM users WHERE id = '" + userId + "'";
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});`,
    remediatedCode: `const express = require('express');
const db = require('./database');
const app = express();
app.get('/users', (req, res) => {
  const userId = req.query.id;
  // Use parameterized queries to prevent injection
  const query = "SELECT * FROM users WHERE id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});`,
    explanation: {
      title: "OWASP A03:2021 - Injection",
      description: "The original code directly concatenates user input into a SQL query. The fix uses a parameterized query, which treats user input strictly as data, not as executable code, neutralizing the threat.",
    }
  },
  xss: {
    title: "Cross-Site Scripting (XSS)",
    vulnerableCode: `function renderComment(comment) {
  const container = document.getElementById('comments');
  // Unsafe: directly setting innerHTML with user content
  container.innerHTML += '<div>' + comment.text + '</div>';
}`,
    remediatedCode: `function renderComment(comment) {
  const container = document.getElementById('comments');
  const div = document.createElement('div');
  // Safe: setting textContent escapes HTML
  div.textContent = comment.text;
  container.appendChild(div);
}`,
    explanation: {
      title: "OWASP A03:2021 - Injection (XSS)",
      description: "Using .innerHTML with untrusted user input allows malicious script injection. The fix uses .textContent, which automatically escapes HTML special characters, rendering them as plain text and preventing script execution.",
    }
  },
};

export default function CodePreview() {
  return (
    <section id="demo" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-headline font-bold">See It Fix in Real-Time</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Our AI doesn&#39;t just find flaws—it fixes them. See how RefactorAI hardens your code against common threats.
          </p>
        </div>
        <Tabs defaultValue="sqlInjection" className="w-full max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="sqlInjection">SQL Injection</TabsTrigger>
            <TabsTrigger value="xss">Cross-Site Scripting (XSS)</TabsTrigger>
          </TabsList>

          {Object.entries(vulnerabilities).map(([key, vuln]) => (
            <TabsContent key={key} value={key}>
              <Card className="relative w-full mx-auto bg-card/80 backdrop-blur-sm border-2 border-primary/20 shadow-2xl">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 mb-2 text-sm font-medium text-destructive">
                        <ShieldAlert className="h-4 w-4" />
                        Vulnerable Code ({vuln.title})
                      </label>
                      <div className="rounded-md bg-background/50 border h-[350px]">
                        <pre className="p-4 font-code text-xs text-muted-foreground overflow-auto h-full">{vuln.vulnerableCode}</pre>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -inset-px bg-gradient-to-br from-green-400 to-accent rounded-lg opacity-30 blur-lg"></div>
                      <div className="relative h-full rounded-lg bg-background/50 p-4 border border-green-400/50 flex flex-col">
                        <label className="flex items-center gap-2 mb-2 text-sm font-medium text-green-400">
                          <CheckCircle className="h-4 w-4" />
                          AI Hardening Suggestion
                        </label>
                        <div className="rounded-md bg-background/50 border h-[200px] mb-4">
                          <pre className="p-4 font-code text-xs text-foreground overflow-auto h-full">{vuln.remediatedCode}</pre>
                        </div>
                        <div className="bg-background/50 p-3 rounded-md border text-xs">
                           <p className="font-bold text-foreground mb-1">{vuln.explanation.title}</p>
                           <p className="text-muted-foreground">{vuln.explanation.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
