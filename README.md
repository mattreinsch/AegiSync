#  RefactorAI

RefactorAI is an AI-powered DevSecOps assistant designed to identify and remediate security vulnerabilities in your code and pull requests — **before they hit production**.

Built with [Next.js](https://nextjs.org/), Firebase, and OpenAI, it integrates seamlessly with GitHub to provide **real-time PR scanning**, **on-demand static analysis**, and **AI-suggested fixes** — right in your browser.

---

##  Live Demo

 [Visit AegiSync](https://aegisync.dev) 

---

## ✨ Features

- ✅ **Security Vulnerability Detection**  
  Automatically detects SQL injection, XSS, unsafe regex, insecure deserialization, and more.

- ✅ **AI-Powered Remediation**  
  Context-aware suggestions to harden your code using LLMs.

- ✅ **GitHub Integration**  
  Scans new pull requests and comments with inline security suggestions.

- ✅ **On-Demand Code Scanner**  
  Paste your code into the web app and get immediate security hardening advice.

- ✅ **Security Dashboard**  
  Live feed of your repo’s pull request scan history and outcomes.

- ✅ **Stripe Integration**  
  Basic authentication and payment handling built-in for SaaS monetization.

---

## ️ Tech Stack

- **Frontend**: Next.js, TailwindCSS  
- **Backend**: Firebase Functions  
- **AI**: OpenAI API  
- **CI/CD**: GitHub Actions  
- **Payments**: Stripe  
- **Auth**: Firebase Auth with GitHub OAuth

---

## ⚙️ Getting Started

### 1. Clone and install

```bash
git clone https://github.com/mattreinsch/refactorai.git
cd refactorai
npm install
```
### 2. Configure environment
```bash
cp .env.example .env
```
Update .env with:

*   Firebase project credentials

*   OpenAI API key

*   GitHub App credentials

*   Stripe test keys

### 3. Run locally
```bash
npm run dev
```
App will run at: `http://localhost:3000`

## Usage
*   Log in with GitHub.

*   Connect a repository.

*   Create a pull request.

*   View inline security comments.

*   Paste raw code into the dashboard for direct feedback.

## Folder Structure
```bash
├── ai/              # LLM prompt templates and API logic
├── api/             # Firebase function endpoints
├── components/      # React UI components
├── context/         # App context providers
├── app/             # Next.js app routing and layout
├── hooks/           # Reusable logic
├── workflows/       # GitHub Actions CI/CD
├── demo/            # Demo/test code and PRs
└── .env.example     # Required environment variables
```
## ️ Roadmap
*   Add GitLab & Bitbucket support

*   Multi-language scanning (Python, Go, Java)

*   Enterprise RBAC and audit logs

*   Slack/Discord notification integrations

*   SOC 2 readiness features

## ‍ Contributing
RefactorAI is pre-release but open to contributions!
To get involved:

*   Fork this repo

*   Create a feature branch

*   Submit a pull request

## License
MIT — see LICENSE

## Built by Matt Reinsch
Scaling GenAI SaaS, LLM Infrastructure, and ML Systems for real-world impact.
