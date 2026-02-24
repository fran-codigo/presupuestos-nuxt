# Finta

## Descripción del proyecto

Proyecto hecho para administrar presupuestos y sus gastos, administra metas financieras y notas. Cada usuario puede crear una cuenta y administrar sus propias cosas.

## Tech Stack

### Frontend
- **Nuxt** 4.3.0 - Framework web progresivo
- **Vue** 3.5.27 - Librería de interfaz de usuario
- **Vue Router** 4.6.4 - Enrutador para Vue
- **Tailwind CSS** 4.1.18 - Framework CSS utility-first
- **Radix Vue** 1.9.17 - Componentes UI accesibles
- **Iconify Vue** 5.0.0 - Librería de iconos
- **nuxt-toast** 1.4.0 - Notificaciones emergentes
- **@nuxt/ui** 4.4.0 - Componentes UI para Nuxt

### Backend
- **Drizzle ORM** 0.45.1 - ORM TypeScript
- **Drizzle Kit** 0.31.8 - CLI para migraciones
- **Neon Database** (serverless) - Base de datos PostgreSQL serverless
- **Nodemailer** 7.0.12 - Envío de correos electrónicos
- **nuxt-auth-utils** 0.5.28 - Utilidades de autenticación

### Otros
- **TypeScript** - Lenguaje tipado para JavaScript
- **Zod** 4.3.6 - Validación de esquemas
- **TSX** 4.21.0 - Ejecutor de TypeScript
- **PNPM** 10.30.0 - Gestor de paquetes

## Organización del Proyecto

El proyecto sigue la estructura de **Nuxt 4** con el directorio `app/` para todo el código del frontend:

```
presupuestos-nuxt/
├── app/                    # Frontend (Nuxt 4)
│   ├── assets/             # Estilos y recursos estáticos
│   ├── components/         # Componentes Vue
│   ├── composables/        # Composables de Vue
│   ├── layouts/            # Layouts de la aplicación
│   ├── middleware/         # Middleware de rutas
│   ├── pages/              # Páginas y rutas
│   ├── utils/              # Utilidades del cliente
│   └── app.vue             # Componente raíz
├── server/                 # Backend (Nitro)
│   ├── api/                # Endpoints de la API
│   ├── config/             # Configuraciones
│   ├── db/                 # Base de datos
│   ├── emails/             # Plantillas de correo
│   └── utils/              # Utilidades del servidor
├── shared/                 # Código compartido
│   ├── schemas/            # Esquemas Zod
│   └── utils/              # Utilidades compartidas
└── public/                 # Archivos públicos
```

## Frontend

### Estructura de Páginas

Las páginas se organizan en `app/pages/` usando routing automático de Nuxt:

```
pages/
├── index.vue                  # Página de inicio
├── auth.vue                   # Layout para autenticación (usa auth-layout)
│   └── auth/
│       ├── iniciar-sesion.vue
│       ├── crear-cuenta.vue
│       ├── confirmar-cuenta.vue
│       ├── olvide-password.vue
│       └── nueva-password.vue
└── app.vue                    # Layout principal (usa app-layout)
    └── app/
        ├── index.vue
        ├── perfil/
        ├── presupuestos/
        │   ├── index.vue
        │   ├── crear.vue
        │   └── [id]/
        │       ├── index.vue
        │       └── editar.vue
        ├── notas/
        │   ├── index.vue
        │   ├── crear.vue
        │   └── [id]/
        │       └── editar.vue
        └── ideas/
```

### Layouts

Los layouts se encuentran en `app/layouts/`:

- **`default.vue`** - Layout por defecto
- **`app-layout.vue`** - Layout para la aplicación autenticada (header con menú, contenido centrado, footer)
- **`auth-layout.vue`** - Layout para páginas de autenticación (dos columnas, branding a la izquierda)
- **`notes-layout.vue`** - Layout específico para notas

Para usar un layout en una página:

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'app-layout',
  middleware: 'auth'
})
</script>
```

### Componentes

Los componentes se agrupan por dominio en `app/components/`:

```
components/
├── app/                    # Componentes de la aplicación
│   ├── AppMenu.vue         # Menú de navegación principal
│   ├── budgets/            # Componentes de presupuestos
│   │   ├── BudgetMenu.vue
│   │   └── DeleteBudgetModal.vue
│   ├── expenses/           # Componentes de gastos
│   │   ├── ExpenseMenu.vue
│   │   ├── AddExpenseForm.vue
│   │   ├── EditExpenseForm.vue
│   │   └── DeleteExpenseForm.vue
│   └── profile/            # Componentes de perfil
│       ├── UpdateProfileForm.vue
│       └── UpdatePasswordForm.vue
└── ui/                     # Componentes UI reutilizables
    ├── ConfirmModal.vue
    ├── ModalContainer.vue
    └── CirculeProgress.vue
```

### Middleware

El middleware se encuentra en `app/middleware/`:

- **`auth.ts`** - Protege rutas que requieren autenticación

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession();

  if (!loggedIn.value) {
    return navigateTo("/auth/iniciar-sesion");
  }
});
```

Para aplicar middleware a una página:

```vue
definePageMeta({
  middleware: 'auth'
})
```

### Composables

Los composables están en `app/composables/`:

- **`useNote.ts`** - Operaciones CRUD para notas
- **`useHandleErrors.ts`** - Manejo centralizado de errores de API

Ejemplo de composable:

```typescript
export const useNote = () => {
  const create = async (data: any) => {
    return await $fetch("/api/notes", {
      method: "POST",
      body: data,
    });
  };
  // ... otros métodos
  return { create, deleteNote, updateNote, updateStatus };
};
```

### Utils

Utilidades del cliente en `app/utils/`:

- **`formatCurrency.ts`** - Formateo de moneda

## Backend (Server)

### API Endpoints

Los endpoints siguen la convención de Nitro en `server/api/`:

#### Nomenclatura de archivos

```
server/api/
├── auth/
│   ├── login.post.ts              # POST /api/auth/login
│   ├── register.post.ts           # POST /api/auth/register
│   ├── confirm-account.post.ts    # POST /api/auth/confirm-account
│   ├── forgot-password.post.ts    # POST /api/auth/forgot-password
│   ├── reset-password/
│   │   └── [token].post.ts        # POST /api/auth/reset-password/:token
│   └── validate-token.post.ts     # POST /api/auth/validate-token
├── budgets/
│   ├── index.get.ts               # GET /api/budgets
│   ├── index.post.ts              # POST /api/budgets
│   └── [id]/
│       ├── get.ts                 # GET /api/budgets/:id
│       ├── put.ts                 # PUT /api/budgets/:id
│       ├── delete.ts              # DELETE /api/budgets/:id
│       └── expenses/
│           ├── index.post.ts      # POST /api/budgets/:id/expenses
│           └── [expenseId]/
│               ├── get.ts         # GET /api/budgets/:id/expenses/:expenseId
│               ├── put.ts         # PUT /api/budgets/:id/expenses/:expenseId
│               └── delete.ts      # DELETE /api/budgets/:id/expenses/:expenseId
├── notes/
│   ├── index.get.ts               # GET /api/notes
│   ├── index.post.ts              # POST /api/notes
│   └── [id]/
│       ├── get.ts                 # GET /api/notes/:id
│       ├── put.ts                 # PUT /api/notes/:id
│       ├── delete.ts              # DELETE /api/notes/:id
│       └── update-status.put.ts   # PUT /api/notes/:id/update-status
└── user/
    ├── profile.get.ts             # GET /api/user/profile
    ├── update.put.ts              # PUT /api/user/update
    ├── update-password.put.ts     # PUT /api/user/update-password
    └── check-password.post.ts     # POST /api/user/check-password
```

#### Patrón de endpoint típico

```typescript
import { db } from "~~/server/db";
import { budgetsTable } from "~~/server/db/schema";
import { draftBudgetSchema } from "~~/shared/schemas";

export default eventHandler(async (event) => {
  // 1. Autenticación
  const session = await requireUserSession(event);
  
  // 2. Leer y validar body
  const body = await readBody(event);
  const validatedData = draftBudgetSchema.safeParse(body);

  if (!validatedData.success) {
    const errors = validatedData.error.issues.map((error) => error.message);
    throw createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Datos de presupuesto inválidos",
      data: errors,
    });
  }

  // 3. Operación de base de datos
  await db.insert(budgetsTable).values({
    name: validatedData.data.name,
    amount: String(validatedData.data.amount),
    userId: session.user.id,
  });

  // 4. Respuesta
  return { message: "Presupuesto creado correctamente" };
});
```

### Server Utils

Utilidades del servidor en `server/utils/`:

- **`budget.ts`** - Validación de propiedad de presupuestos
- **`expense.ts`** - Utilidades para gastos
- **`note.ts`** - Utilidades para notas
- **`validator.ts`** - Validación genérica de body con Zod

```typescript
// validator.ts - Validación reutilizable
export const validateBody = async <T extends z.ZodTypeAny>(
  event: H3Event,
  schema: T,
) => {
  const body = await readBody(event);
  const result = schema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => issue.message);
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Datos inválidos',
      data: errors,
    });
  }
  return result.data;
};
```

### Base de Datos

Ubicada en `server/db/`:

- **`index.ts`** - Conexión a la base de datos (Neon/PostgreSQL)
- **`schema.ts`** - Definición de tablas con Drizzle ORM
- **`seed.ts`** - Datos iniciales
- **`migrations/`** - Migraciones de Drizzle

#### Esquema de base de datos

```typescript
import { integer, pgTable, varchar, boolean, timestamp, text, decimal } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  name: varchar({ length: 100 }).notNull(),
  email: varchar({ length: 100 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  token: varchar({ length: 6 }),
  confirmed: boolean().default(false).notNull(),
});

export const budgetsTable = pgTable('budgets', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: integer().notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 100 }).notNull(),
  amount: decimal().notNull(),
});

export const expensesTable = pgTable('expenses', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  budgetId: integer().notNull().references(() => budgetsTable.id, { onDelete: 'cascade' }),
  name: varchar({ length: 100 }).notNull(),
  amount: decimal().notNull(),
  date: timestamp().defaultNow().notNull(),
});

export const notesTable = pgTable('notes', {
  id: integer().primaryKey().generatedByDefaultAsIdentity(),
  userId: integer().notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  status: varchar({ length: 20 }).notNull().default('active'),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});
```

### Configuración

- **`server/config/nodemailer.ts`** - Configuración de envío de correos
- **`server/emails/auth.ts`** - Plantillas y funciones de correo de autenticación

## Shared

Código compartido entre frontend y backend en `shared/`:

### Schemas (`shared/schemas/index.ts`)

Validación con Zod para todas las entidades:

```typescript
import { z } from 'zod';

// Autenticación
export const registerSchema = z.object({...});
export const loginSchema = z.object({...});
export const forgotPasswordSchema = z.object({...});
export const ResetPasswordSchema = z.object({...});
export const updatePasswordSchema = z.object({...});

// Perfil
export const updateProfileSchema = z.object({...});

// Presupuestos
export const draftBudgetSchema = z.object({
  name: z.string().min(1, { message: 'El Nombre del presupuesto es obligatorio' }),
  amount: z.coerce.number({ message: 'Cantidad no válida' }).min(1, { message: 'Cantidad no válida' }),
});

// Gastos
export const drafExpenseSchema = z.object({...});

// Notas
export const draftNoteSchema = z.object({...});
export const updateNoteSchema = z.object({...});
export const updateNoteStatusSchema = z.object({...});

// Respuestas de API
export const BudgetAPIResponseSchema = z.object({...});
export type Budget = z.infer<typeof BudgetAPIResponseSchema>;
```

### Utilidades (`shared/utils/`)

- **`generateToken.ts`** - Generación de tokens de 6 dígitos

### Tipos (`shared/auth.d.ts`)

Extensión de tipos para `nuxt-auth-utils`:

```typescript
declare module "#auth-utils" {
  interface User {
    id: number;
    name: string;
    email: string;
  }
}
```

## Autenticación

El proyecto usa `nuxt-auth-utils` para manejo de sesiones:

### En el servidor

```typescript
// Obtener sesión requerida
const { user } = await requireUserSession(event);

// Establecer sesión
await setUserSession(event, {
  user: { id, name, email }
});
```

### En el cliente

```typescript
const { user, loggedIn, clear } = useUserSession();
```

## Comandos

```bash
pnpm dev          # Desarrollo
pnpm build        # Build de producción
pnpm generate     # Generar sitio estático
pnpm db:seed      # Ejecutar seed de base de datos
```

## Estilos de código

- Usar TypeScript estricto
- Validar todos los inputs con Zod
- Usar composables para lógica reutilizable
- Mantener componentes pequeños y enfocados
- Seguir convenciones de Nuxt 4 (directorio `app/`)
