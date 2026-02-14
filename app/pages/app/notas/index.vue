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
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-4xl font-black text-gray-900">Mis Notas</h1>
        <p class="text-lg text-gray-600 mt-2">
          Organiza y gestiona todas tus
          <span class="text-blue-600 font-semibold">notas</span>
        </p>
      </div>

      <NuxtLink
        to="/app/notas/crear"
        class="inline-flex p-2"
      >
        <UButton
          icon="i-heroicons-plus-20-solid"
          size="lg"
          color="secondary"
          label="Nueva Nota"
          class="cursor-pointer"
        />
      </NuxtLink>
    </div>

    <!-- Notas Grid -->
    <div
      v-if="pending"
      class="space-y-3"
    >
      <USkeleton
        v-for="i in 3"
        :key="i"
        class="h-24"
      />
    </div>

    <div
      v-else-if="notes && notes.length > 0"
      class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="note in notes"
        :key="note.id"
        class="group"
      >
        <NuxtLink :to="`/app/notas/${note.id}`">
          <UCard
            class="cursor-pointer hover:shadow-lg transition-all duration-200 h-full hover:rotate-1"
          >
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900 line-clamp-2">
                {{ note.title }}
              </h3>
            </template>

            <p
              v-if="note.description"
              class="text-gray-600 line-clamp-3 text-sm"
            >
              {{ note.description }}
            </p>
            <p
              v-else
              class="text-gray-400 italic text-sm"
            >
              Sin descripción
            </p>

            <template #footer>
              <div class="flex justify-between items-center text-xs text-gray-500">
                <span>{{ new Date(note.createdAt).toLocaleDateString('es-ES') }}</span>
                <UBadge
                  color="primary"
                  variant="subtle"
                >
                  {{ note.status === 'active' ? 'Activa' : 'Archivada' }}
                </UBadge>
              </div>
            </template>
          </UCard>
        </NuxtLink>
      </div>
    </div>

    <div
      v-else
      class="text-center py-12"
    >
      <UIcon
        name="i-heroicons-document-20-solid"
        class="w-12 h-12 mx-auto text-gray-400 mb-4"
      />
      <p class="text-gray-600">No tienes notas aún</p>
      <NuxtLink to="/app/notas/crear">
        <UButton
          variant="link"
          color="secondary"
          label="Crea tu primera nota"
          class="mt-2"
        />
      </NuxtLink>
    </div>
  </div>
</template>
