## Things to do
- [x] welcome page and "login with Google" link
- [x] add next-auth
  - [x] set up mongodb connection
  - https://blog.devtylerjones.com/how_to_configure_next-auth_with_mongodb_atlas_mongoose
  - https://github.com/nextauthjs/next-auth/issues/671
- [ ] styled-components, fonts, logo
- [ ] mongo: projects collection and show my projects on logged-in page
- [ ] create project page
  - [ ] choose a new top-level folder to create or select an existing one by searching (autocomplete)
    - https://github.com/kentcdodds/match-sorter
    - downshift
  - folder can be moved without losing connectivity
- [ ] view project page
- [ ] project submission page (via unique url)
  - [ ] https://github.com/google/google-api-javascript-client
  - [ ] chunked xfer after recording is finished
  - [ ] max size or max time
  - [ ] reset (discard current video)

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
