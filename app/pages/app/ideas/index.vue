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

 const state = reactive({
   idea: "",
 });

 const generating = ref(false);
 const resultText = ref("");
 const errorText = ref<string | null>(null);

 const canGenerate = computed(() => state.idea.trim().length >= 10);

 const onGenerate = async () => {
   if (!canGenerate.value || generating.value) return;

   generating.value = true;
   errorText.value = null;
   resultText.value = "";

   try {
     const res = await $fetch<{ idea: string }>("/api/ideas", {
       method: "POST",
       body: {
         idea: state.idea,
       },
     });

     resultText.value = res.idea;
     toast.success({ message: "Idea generada" });
   } catch (error) {
     console.error("Error generating idea:", error);
     errorText.value = `Error: ${error instanceof Error ? error.message : "No se pudo generar la idea"}`;
     toast.error({ message: "No se pudo generar la idea" });
   } finally {
     generating.value = false;
   }
 };

 const onClear = () => {
   state.idea = "";
   resultText.value = "";
   errorText.value = null;
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
   html: true,
   linkify: true,
   breaks: true,
 });

 const renderedHtml = computed(() => md.render(resultText.value || ""));

</script>

<template>
  <div class="space-y-6">
    <div class="flex items-start justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">Ideas</h1>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Describe tu idea y obtén una estructura lista para empezar un MVP.
        </p>
      </div>

      <div class="flex items-center gap-2">
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
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <div class="space-y-1">
              <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">Tu idea</h2>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                Mientras más contexto des, mejor será la estructura.
              </p>
            </div>
          </div>
        </template>

        <UForm :schema="schema" :state="state" class="space-y-4" @submit="onGenerate">
          <UFormField label="Describe la idea" name="idea">
            <UTextarea
              v-model="state.idea"
              :rows="10"
              placeholder="Ej: App para administrar presupuestos y metas financieras con reportes automáticos..."
              :disabled="generating"
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
                :disabled="!canGenerate"
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
            <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">Estructura sugerida</h2>
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
            class="max-h-[70vh] overflow-auto rounded-md border text-gray-100 border-gray-200/60 bg-gray-900 p-4"
          >
            <div class="md-root" v-html="renderedHtml" />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>