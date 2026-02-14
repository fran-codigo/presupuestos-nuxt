# 📚 Índice de Skills

Directorio completo de todas las Skills disponibles para el proyecto Finta.

---

## 🎯 Skills Disponible (Actual: 1)

### ✅ skill-nuxt-crud
**Estado:** ✓ Producción
**Carpeta:** `skills/skill-nuxt-crud/`

**Descripción:**
Skill completa para crear APIs CRUD estándar (Create, Read, Update, Delete) en Nuxt 4 con patrones establecidos del proyecto.

**Cuándo usarla:**
- Necesitas crear un nuevo recurso con operaciones básicas
- Requieres validación con Zod
- Necesitas autenticación y autorización
- Quieres seguir los patrones del proyecto

**Qué incluye:**
- ✅ GET endpoints (listar y obtener uno)
- ✅ POST endpoint (crear)
- ✅ PUT endpoint (actualizar)
- ✅ DELETE endpoint (eliminar)
- ✅ Validación con Zod
- ✅ Manejo de errores standardizado
- ✅ Ejemplos genéricos y reutilizables
- ✅ Integración frontend

**Archivos principales:**
```
skill-nuxt-crud/
├── SKILL.md                      # Guía principal
└── references/
    ├── get-api.md              # GET endpoints
    ├── post-api.md             # POST endpoint
    ├── put-api.md              # PUT endpoint
    ├── delete-api.md           # DELETE endpoint
    ├── validation-patterns.md   # Zod validation
    └── error-handling.md       # Error management
```

**Ruta rápida:**
1. Lee [SKILL.md](skills/skill-nuxt-crud/SKILL.md)
2. Define schema en `shared/schemas/`
3. Crea tabla en `server/db/schema.ts`
4. Consulta los references según necesites
5. Adapta patterns a tu caso

**Ejemplo de uso:**
```
Necesito un API para "Tags"
↓
Abre skill-nuxt-crud/SKILL.md
↓
Define schema: export const tagSchema = z.object({ name: z.string() })
↓
Crea tabla: export const tagsTable = pgTable('tags', { ... })
↓
GET: Abre get-api.md → copia patrón de lista
↓
POST: Abre post-api.md → copia patrón de create
↓
PUT: Abre put-api.md → copia patrón de update
↓
DELETE: Abre delete-api.md → copia patrón de delete
↓
¡Listo! API completo
```

---

## 📋 Matriz de Decisión

| Necesidad | Skill |
|-----------|-------|
| Crear API para nuevo recurso | skill-nuxt-crud ✅ |
| CRUD simple (GET/POST/PUT/DELETE) | skill-nuxt-crud ✅ |
| Validación de datos | skill-nuxt-crud ✅ |
| Autorización y ownership | skill-nuxt-crud ✅ |
| Nested resources | skill-nuxt-crud ✅ |

---

## 🚀 Flujo Rápido por Caso

### Caso 1: Agregar nuevo recurso
```
Requisito: API para "Notificaciones"

Pasos:
1. Lee skill-nuxt-crud/SKILL.md
2. Define schema en shared/schemas/
3. Crea tabla en server/db/schema.ts
4. Consulta references según necesites
5. ¡Implementa!
```

### Caso 2: API con relaciones
```
Requisito: API para "Comentarios" dentro de "Presupuestos"

Pasos:
1. Usa skill-nuxt-crud
2. Ve a references/get-api.md → Sección "Nested Items"
3. Ve a references/post-api.md → Sección "Create Nested"
4. Ve a references/delete-api.md → Sección "Delete Nested"
```

### Caso 3: API con validación compleja
```
Requisito: "Categorías" con validación de nombre único

Pasos:
1. Usa skill-nuxt-crud
2. Ve a references/validation-patterns.md
3. Ve sección "Custom Validations"
```

---

## 📖 Lectura Recomendada por Experiencia

### Nivel: Principiante
1. [skill-nuxt-crud/SKILL.md](skills/skill-nuxt-crud/SKILL.md) - Entiende conceptos
2. [references/get-api.md](skills/skill-nuxt-crud/references/get-api.md) - Consultas
3. [references/post-api.md](skills/skill-nuxt-crud/references/post-api.md) - Crear

### Nivel: Intermedio
1. [references/put-api.md](skills/skill-nuxt-crud/references/put-api.md) - Actualizar
2. [references/delete-api.md](skills/skill-nuxt-crud/references/delete-api.md) - Eliminar
3. [references/validation-patterns.md](skills/skill-nuxt-crud/references/validation-patterns.md) - Validar

### Nivel: Avanzado
1. [references/validation-patterns.md](skills/skill-nuxt-crud/references/validation-patterns.md) - Custom validation
2. [references/error-handling.md](skills/skill-nuxt-crud/references/error-handling.md) - Error management
3. Combina múltiples references para casos complejos

---

## 🔍 Búsqueda Rápida

### Por problema:
- **"Endpoint retorna 400"** → [error-handling.md](skills/skill-nuxt-crud/references/error-handling.md)
- **"No valida datos"** → [validation-patterns.md](skills/skill-nuxt-crud/references/validation-patterns.md)
- **"No obtiene datos"** → [get-api.md](skills/skill-nuxt-crud/references/get-api.md)
- **"No guarda datos"** → [post-api.md](skills/skill-nuxt-crud/references/post-api.md)
- **"No actualiza"** → [put-api.md](skills/skill-nuxt-crud/references/put-api.md)
- **"No borra"** → [delete-api.md](skills/skill-nuxt-crud/references/delete-api.md)

### Por método HTTP:
- **GET** → [get-api.md](skills/skill-nuxt-crud/references/get-api.md)
- **POST** → [post-api.md](skills/skill-nuxt-crud/references/post-api.md)
- **PUT** → [put-api.md](skills/skill-nuxt-crud/references/put-api.md)
- **DELETE** → [delete-api.md](skills/skill-nuxt-crud/references/delete-api.md)

---

## 🎯 Casos de Uso Cubiertos

### skill-nuxt-crud cubre:
- ✅ Endpoints de lectura (lista, obtener uno)
- ✅ Endpoints de escritura (crear, actualizar)
- ✅ Endpoints de eliminación (borrar)
- ✅ Validación de entrada (Zod schemas)
- ✅ Autenticación (requireUserSession)
- ✅ Autorización (ownership checks)
- ✅ Manejo de errores (createError)
- ✅ Recursos anidados (parent/child items)
- ✅ Operaciones bulk (múltiples items)
- ✅ Integración frontend (error mapping)

---

## 📊 Cobertura

| Característica | skill-nuxt-crud |
|---|---|
| CRUD Básico | ✅ 100% |
| Validación | ✅ 100% |
| Autenticación | ✅ 100% |
| Autorización | ✅ 100% |
| Errores | ✅ 100% |
| Nested Resources | ✅ 100% |
| Soft Delete | ✅ 100% |
| Frontend Integration | ✅ 100% |

---

## 🚀 Próximos Pasos

1. ✅ Abre [skill-nuxt-crud/SKILL.md](skills/skill-nuxt-crud/SKILL.md)
2. ✅ Lee durante 5 minutos
3. ✅ Inicia tu primer API
4. ✅ Consulta references según necesites
5. ✅ ¡Lanzalo!

---

## 📝 Información General

**Total de Skills:** 1
**Estado:** Producción
**Última actualización:** 14 de febrero de 2026
**Versión del Índice:** 1.0

---

## 💡 Tips

- 💡 No necesitas leer todo. Lee SKILL.md y usa references cuando los necesites
- 💡 Los ejemplos en references son genéricos. Adapta los nombres a tu caso
- 💡 Todos los endpoints requieren autenticación. Ver `requireUserSession()`
- 💡 Todos los datos se validan con Zod antes de guardar
- 💡 Los errores siguen patrón estándar: `{ message, data: errors }`

---

## Patrones Clave del Proyecto

### Estructura de Carpetas
```
server/
├── api/           # HTTP endpoints
├── db/            # Database
├── utils/         # Helper functions
├── emails/        # Email templates
├── config/        # Configuration
└── middleware/    # Custom middleware
```

### Tecnologías Base
- **Nuxt** 4.3.0 - Framework
- **Drizzle ORM** 0.45.1 - Database
- **Zod** 4.3.6 - Validation
- **Nodemailer** 7.0.12 - Emails
- **nuxt-auth-utils** 0.5.28 - Auth

### Convenciones
- Archivos HTTP por método: `[name].get.ts`, `[name].post.ts`, etc.
- Schemas en `shared/schemas/index.ts`
- Importar tipos con `type { }` syntax
- Mensajes en español siempre
- Validación obligatoria con Zod antes de BD

---

**Última actualización:** 14 de febrero de 2026
**Versión:** 1.0
**Autor:** AI Assistant
