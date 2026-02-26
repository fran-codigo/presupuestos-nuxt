<script setup lang="ts">
import { z } from "zod";
import markdownIt from "markdown-it";

definePageMeta({
  middleware: "auth",
});

const toast = useToast();

const schema = z.object({
  idea: z
    .string()
    .min(1, "Escribe una idea")
    .min(10, "Escribe al menos 10 caracteres")
    .max(1200, "Máximo 1200 caracteres"),
});

type FormState = z.infer<typeof schema>;

const state = reactive<FormState>({
  idea: "",
});

const generating = ref(false);
const resultText = ref("");
const errorText = ref<string | null>(null);
const ideas = ref<{ id: number; title: string; content: string; createdAt: string }[]>([]);
const ideaCount = ref(0);
const hasGenerated = ref(false);

const canGenerate = computed(() => state.idea.trim().length >= 10);
const hasReachedLimit = computed(() => ideaCount.value >= 3);

const loadIdeas = async () => {
  try {
    const data = await $fetch<{ ideas: { id: number; title: string; content: string; createdAt: string }[]; count: number }>("/api/ideas");
    ideas.value = data.ideas;
    ideaCount.value = data.count;
  } catch (error) {
    console.error("Error loading ideas:", error);
  }
};

loadIdeas();

const onGenerate = async () => {
  if (!canGenerate.value || generating.value || hasReachedLimit.value) return;

  generating.value = true;
  errorText.value = null;
  resultText.value = "";
  hasGenerated.value = false;

  try {
    const res = await $fetch<{ idea: string; title: string }>("/api/ideas/generate", {
      method: "POST",
      body: {
        idea: state.idea,
      },
    });

    resultText.value = res.idea;
    hasGenerated.value = true;
    toast.success({ message: "Idea generada" });
  } catch (error: any) {
    errorText.value = error.data?.statusMessage || "No se pudo generar la idea";
    toast.error({ message: error.data?.statusMessage || "No se pudo generar la idea" });
  } finally {
    generating.value = false;
  }
};

const onSave = async () => {
  if (!resultText.value) return;

  try {
    const title = state.idea.substring(0, 50) + (state.idea.length > 50 ? "..." : "");
    
    await $fetch("/api/ideas/save", {
      method: "POST",
      body: {
        title,
        content: resultText.value,
      },
    });

    toast.success({ message: "Idea guardada correctamente" });
    onClear();
    await loadIdeas();
  } catch (error: any) {
    toast.error({ message: error.data?.statusMessage || "No se pudo guardar la idea" });
  }
};

const onDiscard = () => {
  onClear();
};

const onClear = () => {
  state.idea = "";
  resultText.value = "";
  errorText.value = null;
  hasGenerated.value = false;
};

const onCopy = async () => {
  if (!resultText.value) return;

  try {
    await navigator.clipboard.writeText(resultText.value);
    toast.success({ message: "Copiado al portapapeles" });
  } catch (error) {
    toast.error({ message: "No se pudo copiar" });
  }
};

const md = new markdownIt({
  html: false,
  linkify: true,
  breaks: true,
});

const defaultLinkOpen = md.renderer.rules.link_open;

md.renderer.rules.link_open = (
  tokens: any,
  idx: any,
  options: any,
  env: any,
  self: any,
) => {
  const token = tokens[idx];
  if (!token.attrGet("target")) token.attrSet("target", "_blank");
  const rel = token.attrGet("rel");
  token.attrSet(
    "rel",
    rel ? `${rel} noreferrer noopener` : "noreferrer noopener",
  );
  return defaultLinkOpen
    ? defaultLinkOpen(tokens, idx, options, env, self)
    : self.renderToken(tokens, idx, options);
};

const renderedHtml = computed(() => md.render(resultText.value || ""));

const renderContent = (content: string) => md.render(content);
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-start justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Ideas
        </h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Describe tu idea y obtén una estructura lista para empezar un MVP.
        </p>
      </div>

      <div v-if="!hasGenerated" class="flex items-center gap-2">
        <UButton
          color="neutral"
          variant="soft"
          :disabled="!resultText"
          @click="onCopy"
        >
          <UIcon name="i-heroicons-clipboard-document-20-solid" class="size-4" />
          Copiar
        </UButton>
        <UButton color="neutral" variant="outline" @click="onClear">
          <UIcon name="i-heroicons-trash-20-solid" class="size-4" />
          Limpiar
        </UButton>
      </div>

      <div v-else class="flex items-center gap-2">
        <UButton color="primary" @click="onSave">
          <UIcon name="i-heroicons-check-20-solid" class="size-4" />
          Guardar idea
        </UButton>
        <UButton color="neutral" variant="outline" @click="onDiscard">
          <UIcon name="i-heroicons-x-mark-20-solid" class="size-4" />
          Descartar
        </UButton>
      </div>
    </div>

    <UAlert
      v-if="hasReachedLimit"
      color="warning"
      variant="soft"
      title="Límite alcanzado"
      description="Has alcanzado el límite de 3 ideas. No puedes generar más ideas."
    />

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <div class="space-y-1">
              <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">
                Tu idea
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Mientras más contexto des, mejor será la estructura.
              </p>
            </div>
          </div>
        </template>

        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onGenerate"
        >
          <UFormField label="Describe la idea" name="idea">
            <UTextarea
              v-model="state.idea"
              :rows="10"
              placeholder="Ej: App para administrar presupuestos y metas financieras con reportes automáticos..."
              :disabled="generating || hasReachedLimit"
              autoresize
              class="w-full"
            />
          </UFormField>

          <div class="flex items-center justify-between">
            <p class="text-xs text-gray-500">
              {{ state.idea.trim().length }} / 1200
            </p>

            <div class="flex items-center gap-2">
              <UButton
                type="submit"
                color="primary"
                :loading="generating"
                :disabled="!canGenerate || hasReachedLimit"
              >
                Generar
              </UButton>
              <UButton
                type="button"
                color="neutral"
                variant="outline"
                :disabled="generating && !resultText"
                @click="onClear"
              >
                Limpiar
              </UButton>
            </div>
          </div>
        </UForm>
      </UCard>

      <UCard>
        <template #header>
          <div class="space-y-1">
            <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">
              Estructura sugerida
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Puedes copiarla y editarla para convertirla en un plan de ejecución.
            </p>
          </div>
        </template>

        <div class="space-y-4">
          <UAlert
            v-if="errorText"
            color="error"
            variant="soft"
            title="Error"
            :description="errorText"
          />

          <div v-else-if="generating" class="space-y-3">
            <USkeleton class="h-4 w-4/5" />
            <USkeleton class="h-4 w-11/12" />
            <USkeleton class="h-4 w-10/12" />
            <USkeleton class="h-4 w-9/12" />
            <USkeleton class="h-4 w-11/12" />
          </div>

          <UAlert
            v-else-if="!resultText"
            color="neutral"
            variant="soft"
            title="Aún no hay resultados"
            description="Escribe una idea y presiona Generar para ver el resultado aquí."
          />

          <div
            v-else
            class="max-h-[70vh] overflow-auto rounded-md border border-gray-200/60 bg-gray-50 p-4 dark:border-gray-200/20 dark:bg-gray-950/20"
          >
            <div class="md-root" v-html="renderedHtml" />
          </div>
        </div>
      </UCard>
    </div>

    <div v-if="ideas.length > 0" class="mt-8 space-y-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Ideas guardadas ({{ ideaCount }}/3)
      </h2>
      <div class="grid gap-4">
        <UCard v-for="idea in ideas" :key="idea.id">
          <template #header>
            <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ idea.title }}</h3>
          </template>
          <div class="md-root" v-html="renderContent(idea.content)" />
        </UCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.md-root {
  color: rgb(229 231 235);
  font-size: 0.875rem;
  line-height: 1.65;
}

:global(.dark) .md-root {
  color: rgb(229 231 235);
}

.md-root :deep(h1),
.md-root :deep(h2),
.md-root :deep(h3),
.md-root :deep(h4) {
  font-weight: 650;
  margin-top: 0.9rem;
  margin-bottom: 0.5rem;
}

.md-root :deep(p) {
  margin: 0.55rem 0;
}

.md-root :deep(ul),
.md-root :deep(ol) {
  margin: 0.55rem 0;
  padding-left: 1.25rem;
}

.md-root :deep(ul) {
  list-style: disc;
}

.md-root :deep(ol) {
  list-style: decimal;
}

.md-root :deep(li) {
  margin: 0.25rem 0;
}

.md-root :deep(a) {
  color: rgb(37 99 235);
  text-decoration: underline;
  text-underline-offset: 2px;
}

:global(.dark) .md-root :deep(a) {
  color: rgb(147 197 253);
}

.md-root :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.85em;
  padding: 0.15rem 0.35rem;
  border-radius: 0.375rem;
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

:global(.dark) .md-root :deep(code) {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.md-root :deep(pre) {
  margin: 0.75rem 0;
  padding: 0.75rem;
  border-radius: 0.75rem;
  overflow: auto;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

:global(.dark) .md-root :deep(pre) {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.md-root :deep(pre code) {
  border: none;
  background: transparent;
  padding: 0;
  font-size: 0.85em;
  white-space: pre;
}

.md-root :deep(blockquote) {
  margin: 0.75rem 0;
  padding: 0.25rem 0.75rem;
  border-left: 3px solid rgba(0, 0, 0, 0.12);
}

:global(.dark) .md-root :deep(blockquote) {
  border-left: 3px solid rgba(255, 255, 255, 0.15);
}
</style>
