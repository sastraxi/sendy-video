## Things to do
- [x] welcome page and "login with Google" link
- [x] add next-auth
  - [x] set up postgres connection
- [x] set up prisma
- [x] postgres: projects collection and show my projects on logged-in page
- [x] styled-components
- [ ] home page
  - [x] prototype as "projects page"
  - [x] list projects
    - [x] copy url
    - [ ] copy greeting
    - [ ] isOpen (project status column)
    - [x] make # submissions the external link to gdrive
      - [x] update when submissions are deleted
    - [ ] calc (cache?) total size
  - [x] list submissions
    - [ ] list submissions-as-guest (attach to session?)
    - [x] direct links to videos
    - [x] delete submission (w/confirmation)
    - [ ] thumbnail (https://stackoverflow.com/a/45027853/220642)
  - [x] cool layout
  - [x] styling
  - [x] action buttons --> icon buttons
  - [x] only show 5 in each table; order by creation desc
  - [ ] pagination
- [x] create project page
  - [x] automatically create "Sendy Projects" folder
  - [x] automatically create sub-folder with project name (req. unique names per user)
    - folder can be moved without losing connectivity due to gdrive file IDs
  - [x] styling
  - [x] "sucessfully created" message
- [x] view project page
  - [x] styling
- [ ] common ui
  - [ ] header
    - [ ] logo-that-goes-home size={['md', 'sm']}
    - [ ] profile badge + user menu
  - [ ] basic theme colours in chakra
  - [ ] basic fonts
  - [ ] mobile responsive ui
- [x] post-submission back to home page
  - [x] "sucessfully uploaded" message
- [x] project submission page (via unique url)
  - [x] https://github.com/google/google-api-javascript-client
  - [x] xfer after recording is finished
  - [x] reset (discard current video)
  - [ ] "Need help?" button clears form
  - [ ] upload my own video
  - [ ] do enumeration for Capture Settings *after* getting permission
  - [ ] friendly device names (no "Camera", "Microphone", "(Built-in)", or "(\hex+-\hex+)"
  - [ ] correctly dispose of MediaStream when you navigate away (useEffect?)
  - [ ] file extension based on mimetype (e.g. webm instead of mp4)
- [ ] extra constraints
  - [ ] max length
  - [ ] max size per submission
  - [ ] max size for all submissions
  - [ ] limit to one submission per user + "retry"
  - [ ] close submissions at some instant in the future
  - [x] require (google) auth
  - [ ] upload to sso user's drive + create shortcut
- [x] set metadata on project submission
- [x] share file with user
- [x] api route to redirect to a submission's web link
- [x] dev: sharing prisma instances / connection pooling: https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices

## Deployment
- [x] database
- [x] vercel
- [x] CD
- [x] CORS: www.sendy.video was passed in as Origin to Google, but they expected sendy.video
- [x] CSP / vercel-analytics: https://stackoverflow.com/questions/65551212/using-csp-in-nextjs-nginx-and-material-uissr
  - was just adblock

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
