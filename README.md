# Conversational GitHub Issue Interaction

A web app with a natural language interface for managing GitHub issues, built with [tambo ai](https://tambo.co/) for AI-powered UI.

## Setup Instructions

To run locally:

1. Get a Tambo AI API key:

- run `npx tambo init`

2. create a GitHub OAuth App:

- Go to GitHub Settings > Developer Settings > OAuth Apps > New OAuth App
- Set the Application name
- Set the Homepage URL to your app's URL (e.g., http://localhost:3000 for development)
- Set the Authorization callback URL to http://localhost:3000/auth/callback (or your production URL)
- Copy the Client ID and Client Secret

update your `.env.local` file:

```bash
NEXT_PUBLIC_TAMBO_API_KEY=
NEXT_PUBLIC_GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Then:

`npm i`

`npm run dev`
