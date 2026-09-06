# Harf Banaras API - Restructured to Match Portfolio-Tracker

This document outlines the complete restructuring of the Harf Banaras API to match the Portfolio-Tracker API architecture.

## Project Structure Overview

```
src/
├── core/                          # Core application modules
│   ├── compressions/              # Compression middleware configuration
│   ├── constants/                 # Application-wide constants
│   ├── decorators/                # Custom NestJS decorators
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── enums/                     # Enum definitions
│   │   ├── order-status.enum.ts
│   │   ├── product-status.enum.ts
│   │   └── role.enum.ts
│   ├── guards/                    # Authentication & authorization guards
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── interfaces/                # TypeScript interfaces
│   │   └── authenticated-user.interface.ts
│   ├── logger/                    # Logging utilities
│   │   └── index.ts
│   ├── mail/                      # Email service templates
│   │   └── templates/
│   ├── middleware/                # Express middleware
│   │   ├── index.ts
│   │   └── logger.middleware.ts
│   ├── strategies/                # Passport strategies
│   │   └── jwt.strategy.ts
│   ├── swagger/                   # Swagger documentation setup
│   │   └── index.ts
│   ├── utils/                     # Utility functions
│   │   ├── calculations/          # Price & business logic calculations
│   │   ├── export/                # Data export utilities (CSV, JSON)
│   │   └── index.ts
│   ├── bootstrap.ts               # Application bootstrap configuration
│   └── core.module.ts             # Core module definition
│
├── config/                        # Configuration services
│   └── appconfig.service.ts       # Application configuration
│
├── database/                      # Database-related modules
│   ├── mongodb/                   # MongoDB-specific implementations
│   │   ├── abstract/              # Abstract base classes
│   │   ├── connection/            # Connection management
│   │   ├── dao/                   # Data Access Objects
│   │   └── models/                # Mongoose models
│   ├── schemas/                   # Database schemas
│   │   ├── index.ts
│   │   ├── audit-log.schema.ts
│   │   ├── cart.schema.ts
│   │   ├── category.schema.ts
│   │   ├── order.schema.ts
│   │   ├── product.schema.ts
│   │   ├── review.schema.ts
│   │   ├── stock-movement.schema.ts
│   │   ├── user.schema.ts
│   │   └── wishlist.schema.ts
│   ├── database.module.ts         # Database module setup
│   ├── database.service.ts        # Database service
│   └── database.service.spec.ts   # Database service tests
│
├── modules/                       # Feature modules
│   ├── app/                       # Application root module
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   └── app.service.ts
│   ├── auth/                      # Authentication module
│   │   ├── dto/                   # Data Transfer Objects
│   │   │   └── auth.dto.ts
│   │   ├── auth.abstract.ts       # Abstract service
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── cart/                      # Shopping cart module
│   │   ├── cart.abstract.ts
│   │   ├── cart.controller.ts
│   │   ├── cart.module.ts
│   │   └── cart.service.ts
│   ├── categories/                # Product categories module
│   │   ├── categories.abstract.ts
│   │   ├── categories.controller.ts
│   │   ├── categories.module.ts
│   │   └── categories.service.ts
│   ├── dashboard/                 # Dashboard module
│   │   ├── dashboard.controller.ts
│   │   ├── dashboard.module.ts
│   │   └── dashboard.service.ts
│   ├── orders/                    # Orders module
│   │   ├── orders.controller.ts
│   │   ├── orders.module.ts
│   │   └── orders.service.ts
│   ├── products/                  # Products module
│   │   ├── dto/                   # DTOs
│   │   │   └── product-query.dto.ts
│   │   ├── products.abstract.ts
│   │   ├── products.controller.ts
│   │   ├── products.module.ts
│   │   └── products.service.ts
│   ├── reviews/                   # Product reviews module
│   │   ├── reviews.controller.ts
│   │   ├── reviews.module.ts
│   │   └── reviews.service.ts
│   ├── user-management/           # User management module
│   │   ├── users.abstract.ts
│   │   ├── users.controller.ts
│   │   ├── users.module.ts
│   │   └── users.service.ts
│   └── wishlist/                  # Wishlist module
│       ├── wishlist.controller.ts
│       ├── wishlist.module.ts
│       └── wishlist.service.ts
│
├── shared/                        # Shared utilities & responses
│   ├── appresponse.shared.ts      # API response templates
│   └── messages.shared.ts         # Message constants
│
└── main.ts                        # Application entry point
```

## Key Improvements from Restructuring

### 1. **Enhanced Core Module**
- Added `compressions/` for response compression configuration
- Added `constants/` for application-wide constants
- Added `logger/` for centralized logging
- Added `mail/` structure for email templates
- Added `middleware/` for custom middleware
- Added `swagger/` for API documentation
- Added `utils/` with sub-categories for calculations and exports
- Added `bootstrap.ts` for application setup
- Added `core.module.ts` as a global module

### 2. **Organized Database Layer**
- Created `mongodb/` subdirectory with:
  - `abstract/` - Repository pattern implementations
  - `connection/` - Connection management
  - `dao/` - Data Access Objects
  - `models/` - Mongoose model definitions
- Separated schema definitions in `schemas/` folder
- Added `database.service.ts` for database health checks

### 3. **Scalable Utilities**
- **Calculations**: Price calculations, discounts, taxes, pagination
- **Export**: CSV and JSON export functionality
- **Constants**: Centralized configuration values
- **Logger**: Structured logging with multiple levels
- **Middleware**: Request logging and other middleware

### 4. **Feature-Based Modules**
All modules follow consistent structure:
```
module/
├── dto/          (if applicable)
├── *.controller.ts
├── *.module.ts
├── *.service.ts
└── *.abstract.ts (optional, for shared logic)
```

## Migration Guide

### For New Features

When adding a new feature:

1. **Create module folder** under `src/modules/`
2. **Create necessary files**:
   - `{feature}.controller.ts` - Routes & request handling
   - `{feature}.module.ts` - NestJS module definition
   - `{feature}.service.ts` - Business logic
   - `{feature}.abstract.ts` - (Optional) Shared abstract logic
   - `dto/` folder - DTOs if needed

3. **Use core utilities**:
   - Import enums from `src/core/enums/`
   - Import decorators from `src/core/decorators/`
   - Use constants from `src/core/constants/`
   - Use utility functions from `src/core/utils/`

4. **Database operations**:
   - Define schema in `src/database/schemas/`
   - Create DAO in `src/database/mongodb/dao/`
   - Use abstract repository pattern

### For New Utilities

1. **Add to existing utility**:
   - Calculations → `src/core/utils/calculations/`
   - Export functions → `src/core/utils/export/`

2. **Create new utility folder** if needed:
   ```
   src/core/utils/new-utility/
   ├── index.ts
   └── ...
   ```

3. **Export from** `src/core/utils/index.ts`

## Configuration Files

The project includes:
- `tsconfig.json` - TypeScript configuration
- `nest-cli.json` - NestJS CLI configuration
- `package.json` - Dependencies and scripts
- `.env` - Environment variables

## Best Practices

1. **Use DTOs** for request/response validation
2. **Extend abstract classes** for common functionality
3. **Use guards** for authentication/authorization
4. **Follow module organization** for scalability
5. **Use constants** instead of magic numbers/strings
6. **Implement error handling** using NestJS filters
7. **Document APIs** using Swagger decorators

## Next Steps

1. Update imports in existing files to match new paths
2. Add missing MongoDB models in `src/database/mongodb/models/`
3. Implement DAOs in `src/database/mongodb/dao/`
4. Add email templates in `src/core/mail/templates/`
5. Implement mail service in `src/core/mail/`
6. Add additional API endpoints with proper Swagger documentation

## Testing

Run tests with:
```bash
npm run test
npm run test:e2e
npm run test:cov
```

## Building & Running

```bash
# Development
npm run start:dev

# Production build
npm run build

# Production start
npm run start:prod
```
