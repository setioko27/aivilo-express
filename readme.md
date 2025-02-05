# Aivilo Express

Aivilo Express is a Node.js boilerplate with Express.js, built for quickly setting up well-structured REST APIs. It follows best practices, ensures type safety, and includes essential features commonly needed for API development.

## Features

- 🚀 **TypeScript** - Type safety dan better developer experience
- 🔒 **Security** - Built-in security middlewares (helmet, rate limit, XSS protection)
- 📝 **Validation** - Request validation menggunakan Zod
- 🗄️ **Database** - Prisma ORM dengan type safety
- 🔄 **CRUD Generator** - Base service dan controller yang reusable
- 🚦 **Error Handling** - Centralized error handling dan custom errors
- 📊 **Pagination** - Built-in pagination support
- 🔍 **Type-safe Environment** - Environment variables validation dengan Zod

## Quick Start
```bash
# Clone repository
git clone https://github.com/yourusername/aivilo-express.git

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Project Structure

```
src/
├── config/             # App configuration
│   ├── db.ts          # Database configuration
│   ├── env.ts         # Environment variables validation
│   └── zod.ts         # Zod custom error messages
├── middleware/         # Express middlewares
│   ├── auth.ts        # Authentication middleware
│   ├── validate.ts    # Request validation middleware
|   |-- permission.ts  # Permissions validation middleware
│   └── error.ts       # Error handling middleware
├── modules/           # Feature modules
│   ├── user/          # User module
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.route.ts
│   │   └── user.schema.ts
│   └── role/          # Role module
├── utils/             # Utility functions
│   ├── crud/          # Base CRUD operations
│   │   ├── controller.ts
│   │   └── service.ts
│   ├── errors.ts      # Custom error classes
│   └── response.ts    # Response formatter
└── types/             # Type definitions
    └── express.d.ts   # Express type extensions
```

## Basic CRUD Example

### 1. Define Schema (role.schema.ts)
```typescript
export const roleSchema = {
    create: z.object({
        name: z.string(),
        permissions: z.array(z.string())
    }),
    update: z.object({
        name: z.string().optional(),
        permissions: z.array(z.string()).optional()
    })
};
```

### 2. Create Service (role.service.ts)
```typescript
const roleService = CRUDService<RoleDTO.Create, RoleDTO.Update>(
    'Role',
    prisma.role,
    {
        selectFields: {
            id: true,
            name: true,
            permissions: true
        },
        searchFields: ['name'],
        createSchema: roleSchema.create,
        updateSchema: roleSchema.update
    }
);
```

### 3. Create Controller (role.controller.ts)
```typescript
const roleController = CRUDController(roleService, {
    list: (data) => data.map(item => ({
        ...item,
        permissions: parseJSON(item.permissions)
    }))
});
```

### 4. Define Routes (role.route.ts)
```typescript
router.get('/', roleController.getAll);
router.get('/:id', roleController.getById);
router.post('/', validate(roleSchema.create), roleController.create);
router.put('/:id', validate(roleSchema.update), roleController.update);
router.delete('/:id', roleController.remove);
```

## Custom Operations Example

```typescript
// service
const customService = {
    ...roleService,
    async customOperation(data: CustomDTO) {
        // custom logic here
    }
};

// controller
const customController = {
    ...roleController,
    async customEndpoint(req: Request, res: Response) {
        const result = await customService.customOperation(req.body);
        success(res, "Custom operation successful", result);
    }
};

// route
router.post('/custom', validate(customSchema), customController.customEndpoint);
```

## Environment Variables

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
```

## Available Scripts

```json
{
  "scripts": {
    "dev": "nodemon",
    "build": "tsc && tsc-alias",
    "start": "node dist/server.js",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

## Security Features

- Helmet for security headers
- Rate limiting
- XSS protection
- HTTP Parameter Pollution protection
- Input sanitization
- CORS configuration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
