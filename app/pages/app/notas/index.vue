<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

interface Note {
  id: number;
  title: string;
  description: string | null;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

const { data: notes, refresh, pending } = await useFetch<Note[]>('/api/notes');

provide('refreshNotes', refresh);
</script>

<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="flex flex-col-reverse md:flex-row md:justify-between md:items-start gap-6">
      <div class="flex-1">
        <h1 class="text-5xl font-black text-gray-900 tracking-tight">
          Mis Notas
        </h1>
        <p class="text-lg text-gray-600 mt-3 leading-relaxed max-w-lg">
          Organiza, crea y gestiona todas tus
          <span class="text-primary-600 font-semibold">notas personales</span>
          en un solo lugar
        </p>
      </div>

      <NuxtLink to="/app/notas/crear" class="inline-flex">
        <UButton
          icon="i-heroicons-plus-20-solid"
          size="xl"
          color="primary"
          label="+ Nueva Nota"
          trail-icon="i-heroicons-arrow-right-20-solid"
        />
      </NuxtLink>
    </div>

    <UDivider />

    <!-- Notas Grid -->
    <div v-if="pending" class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <USkeleton v-for="i in 6" :key="i" class="h-40 rounded-lg" />
    </div>

    <div
      v-else-if="notes && notes.length > 0"
      class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max"
    >
      <div v-for="note in notes" :key="note.id" class="group h-full">
        <NuxtLink :to="`/app/notas/${note.id}`" class="block h-full">
          <UCard
            class="h-full cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary-500"
            :ui="{
              body: { padding: 'p-5 sm:p-6' },
              header: { padding: 'px-5 sm:px-6 py-4' },
              footer: { padding: 'px-5 sm:px-6 py-3' },
              ring: 'ring-1 ring-gray-200 dark:ring-gray-700',
            }"
          >
            <template #header>
              <div class="flex items-start justify-between gap-2">
                <h3 class="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 group-hover:text-primary-600 transition-colors">
                  {{ note.title }}
                </h3>
                <UBadge
                  :color="note.status === 'active' ? 'green' : 'gray'"
                  variant="soft"
                  :ui="{ rounded: 'rounded-full' }"
                  class="text-xs"
                  size="sm"
                >
                  {{ note.status === 'active' ? 'Activa' : 'Archivada' }}
                </UBadge>
              </div>
            </template>

            <p v-if="note.description" class="text-gray-600 line-clamp-3 text-sm leading-relaxed">
              {{ note.description }}
            </p>
            <p v-else class="text-gray-400 italic text-sm">
              Sin descripción
            </p>

            <template #footer>
              <div class="flex items-center justify-between text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-calendar-days-20-solid" class="w-3.5 h-3.5" />
                  {{ new Date(note.createdAt).toLocaleDateString('es-ES') }}
                </span>
                <UIcon
                  name="i-heroicons-chevron-right-20-solid"
                  class="w-4 h-4 group-hover:translate-x-1 transition-transform text-gray-400"
                />
              </div>
            </template>
          </UCard>
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="py-16 text-center">
      <UIcon name="i-heroicons-document-20-solid" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
      <h3 class="text-xl font-semibold text-gray-900 mb-2">
        No tienes notas aún
      </h3>
      <p class="text-gray-600 mb-8">
        Comienza creando tu primera nota para organizar tus ideas
      </p>
      <NuxtLink to="/app/notas/crear">
        <UButton size="lg" color="primary" icon="i-heroicons-plus-20-solid" label="Crear Primera Nota" />
      </NuxtLink>
    </div>
  </div>
</template>
