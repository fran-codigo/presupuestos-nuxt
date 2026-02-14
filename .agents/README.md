# 🚀 Agentes & Skills - Presupuestos Nuxt

Bienvenido al sistema de Skills especializado para tu proyecto Nuxt de gestión de presupuestos.

## ¿Qué encontrarás aquí?

Este directorio contiene **Skills** - herramientas de IA especializadas que aceleran significativamente el desarrollo de APIs.

Cada Skill es un paquete independiente con:
- ✅ Guías de patrón paso a paso
- ✅ Ejemplos código listos para adaptar
- ✅ Referencias para casos específicos
- ✅ Best practices del proyecto

---

## 🎯 Skill Disponible

### 🔄 **CRUD APIs** (`skill-nuxt-crud`)
Crea endpoints rápidamente: listar, crear, actualizar, eliminar.

**Ideal para:**
- Agregar nuevos recursos (categorías, metas, etc.)
- Endpoints de gestión básico-avanzado
- Cualquier operación CRUD estándar
- APIs con autenticación y validación

**Ejemplo:**
```
Necesito crear un API completo para "Categorías"
→ Abre skill-nuxt-crud/SKILL.md
→ Define schema en shared/schemas/
→ Copia patterns de GET/POST/PUT/DELETE
→ Adapta ejemplos a tu caso
```

---

## 🚀 Inicio Rápido

### Crear API de nuevo recurso

```
Paso 1: Entender el patrón
→ Lee: skill-nuxt-crud/SKILL.md

Paso 2: Definir datos
→ Crea schema en shared/schemas/
→ Crea tabla en server/db/schema.ts

Paso 3: Implementar endpoints
→ GET lista → skill-nuxt-crud/references/get-api.md
→ POST crear → skill-nuxt-crud/references/post-api.md
→ PUT actualizar → skill-nuxt-crud/references/put-api.md
→ DELETE eliminar → skill-nuxt-crud/references/delete-api.md

Paso 4: Validar y lanzar
→ Zod validation → skill-nuxt-crud/references/validation-patterns.md
→ Error handling → skill-nuxt-crud/references/error-handling.md
```

### Resolver un problema

```
"Mi endpoint no funciona" / "¿Por qué da error?"

Soluciones por error:
→ 400 Bad Request: Ver validation-patterns.md
→ 401 Unauthorized: Check requireUserSession()
→ 404 Not Found: Verify resource ownership
→ 500 Server Error: Add logging, check console
```

---

## 📚 Estructura de la Skill

```
skill-nuxt-crud/
├── SKILL.md                    ← Empeza aquí
└── references/
    ├── get-api.md            (Obtener items)
    ├── post-api.md           (Crear items)
    ├── put-api.md            (Actualizar items)
    ├── delete-api.md         (Eliminar items)
    ├── validation-patterns.md (Zod & validación)
    └── error-handling.md     (Errores)
```

**Cómo usarla:**
1. **SKILL.md** = "¿Qué es CRUD y cómo funciona?"
2. **references/** = "¿Cómo hago X específico?"

---

## 💡 Tips de Uso

### ✅ Mejor forma: Copia & Adapta
```typescript
// 1. Abre el reference que necesitas
// 2. Copia el patrón completo
// 3. Cambia nombres: budgetsTable → categoriesTable
// 4. Cambia tipos: Budget → Category
// 5. ¡Listo!
```

### ❌ No hacer: Memorizar todo
No necesitas memorizar. La Skill está para consultarla constantemente.

### ✅ Mejor forma: Search & Reference
```
"Necesito un PUT endpoint"
→ Abre skill-nuxt-crud/references/put-api.md
→ Copia el patrón
→ Adapta nombres/tipos
→ ¡Done!
```

---

## 🛠 Tecnologías Base

Todo lo que necesitas ya está en el proyecto:

- **Nuxt 4** - Framework web
- **Drizzle ORM** - Queries a BD
- **Zod** - Validación
- **H3** - HTTP handlers
- **nuxt-auth-utils** - Sesiones

¡No hay que aprender nada nuevo!

---

## 🎓 Orden Recomendado de Lectura

Si eres nuevo:

1. **Primero:** `skill-nuxt-crud/SKILL.md` (5 min)
2. **Luego:** `references/get-api.md` + `post-api.md` (10 min)
3. **Después:** `references/put-api.md` + `delete-api.md` (10 min)
4. **Finalmente:** `references/validation-patterns.md` y `error-handling.md` (cuando lo necesites)

---

## 🤖 Trabajar con Claude

Cuando uses esta Skill con Claude:

```
"Crea un endpoint para [recurso] usando skill-nuxt-crud"
→ Claude aplicará la Skill automáticamente
```

```
"¿Cómo hago [cosa]?"
→ Claude buscará en la Skill
```

```
"Tengo error [descripción]"
→ Claude consultará references/error-handling.md
```

---

## 📝 Convenciones del Proyecto

Que debes seguir siempre:

- ✅ **Mensajes en español** siempre
- ✅ **Validación obligatoria** con Zod antes de BD
- ✅ **Autenticación verificada** en endpoints protegidos
- ✅ **Errores tipificados** con createError()
- ✅ **Importes con ~** para rutas absolutas

---

## 🚀 Próximos Pasos

1. ✅ Abre [skill-nuxt-crud/SKILL.md](skills/skill-nuxt-crud/SKILL.md)
2. ✅ Lee el workflow de creación de CRUD
3. ✅ Consulta references cuando las necesites
4. ✅ Adapta ejemplos
5. ✅ ¡Prepara a lanzar!

---

**Versión:** 1.0
**Última actualización:** 14 de febrero de 2026
**Autor:** AI Assistant Setup

¡Happy coding! 🎉
