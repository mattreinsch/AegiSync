import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, MinusCircle } from "lucide-react";

const comparisonData = [
  { feature: "AI-Powered Code Remediation", refactorai: true, sonarqube: 'partial', snyk: 'partial' },
  { feature: "OWASP Top 10 & Compliance", refactorai: true, sonarqube: true, snyk: true },
  { feature: "Security Debt Dashboard", refactorai: true, sonarqube: true, snyk: true },
  { feature: "In-context Learning Explanations", refactorai: true, sonarqube: false, snyk: 'partial' },
  { feature: "CI/CD Pipeline Integration", refactorai: true, sonarqube: true, snyk: true },
  { feature: "Developer-First UX", refactorai: true, sonarqube: false, snyk: false },
];

const Icon = ({ status }: { status: boolean | 'partial' }) => {
  if (status === true) return <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />;
  if (status === 'partial') return <MinusCircle className="h-5 w-5 text-yellow-500 mx-auto" />;
  return <XCircle className="h-5 w-5 text-destructive mx-auto" />;
};

export default function Comparison() {
  return (
    <section id="comparison" className="py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl font-headline font-bold">How We Compare</h2>
          <p className="text-muted-foreground mt-2">
            See how RefactorAI stacks up against other code security tools.
          </p>
        </div>
        <Card className="max-w-4xl mx-auto bg-card/50 border-primary/10">
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[40%]">Feature</TableHead>
                            <TableHead className="text-center font-bold text-foreground">RefactorAI</TableHead>
                            <TableHead className="text-center">SonarQube</TableHead>
                            <TableHead className="text-center">Snyk Code</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {comparisonData.map((item) => (
                        <TableRow key={item.feature}>
                            <TableCell className="font-medium">{item.feature}</TableCell>
                            <TableCell><Icon status={item.refactorai} /></TableCell>
                            <TableCell><Icon status={item.sonarqube} /></TableCell>
                            <TableCell><Icon status={item.snyk} /></TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}
