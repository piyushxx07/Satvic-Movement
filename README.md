# Satvic Movement Language Studio

A small Next.js workspace concept for organizing Hindi source videos and regional language dubs.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The welcome screen types its messages and then opens `/home`.

## Video folders

Place Hindi source videos and regional dubs in the matching folders under `Videos/States`. Large video files are not intended to be committed to GitHub; keep them in shared storage and upload only the project code and folder placeholders.

## Deploy

Import the GitHub repository into Vercel. Vercel detects Next.js automatically; the default build command is `npm run build`.
