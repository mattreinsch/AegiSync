# RefactorAI

RefactorAI is a Firebase web app that scans your code for security vulnerabilities and uses AI to suggest fixes. It also integrates with GitHub to scan your pull requests, helping you catch and fix security issues before they make it into your codebase.

## Features

- **Code Analysis:** Scans your code for common security vulnerabilities like SQL injection, XSS, and more.
- **AI-Powered Suggestions:** Provides intelligent, context-aware suggestions to fix identified vulnerabilities.
- **GitHub Integration:** Automatically scans new pull requests in your repositories and posts comments with suggested fixes.
- **Web-Based Interface:** Easy-to-use web interface for viewing scan results and managing your repositories.

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Firebase Account
- Stripe Account
- GitHub Account

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/refactorai.git
   cd refactorai
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Copy the `.env.example` file to a new file named `.env` and fill in the required values:

   ```bash
   cp .env.example .env
   ```

   You will need to create a Firebase project, a Stripe account, and a GitHub App to get the necessary credentials.

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

## Usage

1. **Log in with your GitHub account.**
2. **Connect your repositories.**
3. **New pull requests will be automatically scanned for vulnerabilities.**
4. **View scan results and apply suggested fixes.**

## Future Improvements

- [ ] Add support for more programming languages.
- [ ] Improve the accuracy of the AI-powered suggestions.
- [ ] Add more detailed reporting and analytics.
- [ ] Integrate with other Git providers like GitLab and Bitbucket.
- [ ] Create a CI/CD pipeline for automated testing and deployment.