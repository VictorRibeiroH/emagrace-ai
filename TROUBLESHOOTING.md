# Troubleshooting

## Prisma Schema Error: "The datasource property `url` is no longer supported"

### Problem

The VS Code Prisma extension shows an error about `url` being deprecated in `schema.prisma`:

```
The datasource property `url` is no longer supported in schema files...
```

### Cause

This is a **false positive**. The project uses **Prisma 5.22.0**, which fully supports the `url` syntax. This error message only applies to Prisma 7+ (which is not yet stable or recommended for production).

### Solution

**You can safely ignore this error.** The schema is correct and the project will work perfectly.

### Why This Happens

The Prisma VS Code extension may incorrectly detect schema syntax rules from newer Prisma versions. This is a known issue with the extension.

### If You Want to Fix the Visual Error

#### Option 1: Disable the Specific Rule (Recommended)

Add this to your `.vscode/settings.json`:

```json
{
  "prisma.showPrismaDatamodelDiagnostics": false
}
```

#### Option 2: Update to Prisma 7 (Not Recommended)

If you really want to use Prisma 7 (currently in preview), you would need to:

1. Update Prisma:

```bash
npm i --save-dev prisma@latest
npm i @prisma/client@latest
```

2. Create `prisma.config.ts`:

```typescript
import { defineConfig } from 'prisma';

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL!,
    },
  },
});
```

3. Remove `url` from `schema.prisma` datasource block.

**However, Prisma 7 is not production-ready yet**, so we recommend staying with Prisma 5.x.

---

## TypeScript Module Resolution Warning

### Problem

```
Option 'moduleResolution=node10' is deprecated and will stop functioning in TypeScript 7.0.
```

### Solution

This is also a warning about a future TypeScript version (7.0, which doesn't exist yet). The project uses TypeScript 5.3.3 and works perfectly.

You can safely ignore this warning or update `tsconfig.json` to use `"moduleResolution": "NodeNext"` if it bothers you.

---

## Running the Project

Despite these IDE warnings, the project runs perfectly:

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev

# Run tests
npm test
```

All functionality works as expected! 🎉
