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
