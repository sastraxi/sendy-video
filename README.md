## Things to do
- [x] welcome page and "login with Google" link
- [x] add next-auth
  - [x] set up postgres connection
- [x] set up prisma
- [x] postgres: projects collection and show my projects on logged-in page
- [x] styled-components
- [x] projects page
  - [ ] styling
- [x] create project page
  - [x] automatically create "Sendy Projects" folder
  - [x] automatically create sub-folder with project name (req. unique names per user)
    - folder can be moved without losing connectivity due to gdrive file IDs
  - [ ] styling
- [ ] view project page
  - [ ] styling
- [x] project submission page (via unique url)
  - [x] https://github.com/google/google-api-javascript-client
  - [x] xfer after recording is finished
  - [x] reset (discard current video)
  - [ ] upload my own video
- [ ] make things not look like trash (fonts, logo, favicon, <head>)
- [ ] list submissions on project page
  - [ ] direct links to videos
- [ ] extra constraints
  - [ ] max length
  - [ ] max size per submission
  - [ ] max size for all submissions
  - [ ] max number of submissions
  - [x] require (google) auth
- [ ] post-submission page
- [ ] set metadata on project submission
- [ ] api route to redirect to a submission's web link

## Deployment
  - [ ] 

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
