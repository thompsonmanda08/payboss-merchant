This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

# DOKER BUILD

```bash
docker build -t payboss-merchant .

# then after the build completes successfully

docker run . -p 3000:3000 payboss-merchant

```
