<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { handleErrors } = useHandleErrors();
const toast = useToast();
const route = useRoute();

const {
  data: note,
  refresh,
  pending,
} = await useFetch(`/api/notes/${route.params.id}`);

const deleteLoading = ref(false);
const isDeleteDialogOpen = ref(false);

const statusLabel = computed(() => {
  return note.value?.status === 'active' ? 'Activa' : 'Archivada';
});

const statusColor = computed(() => {
  return note.value?.status === 'active' ? 'primary' : 'neutral';
});

const formattedCreatedDate = computed(() => {
  if (!note.value?.createdAt) return '';
  const date = new Date(note.value.createdAt);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

const formattedUpdatedDate = computed(() => {
  if (!note.value?.updatedAt) return '';
  const date = new Date(note.value.updatedAt);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
});

const onDelete = async () => {
  try {
    deleteLoading.value = true;

    const res = await $fetch(`/api/notes/${route.params.id}`, {
      method: 'DELETE',
    });

    if (res && res.message) {
      toast.success({
        message: res.message,
      });
    }

    isDeleteDialogOpen.value = false;
    await navigateTo('/app/notas');
  } catch (error) {
    handleErrors(toast, error, 'Hubo un error al eliminar la nota');
  } finally {
    deleteLoading.value = false;
  }
};

// navegación directa con `:to` en el botón Editar

provide('refreshNotes', refresh);
</script>

<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div
      v-if="pending"
      class="space-y-6"
    >
      <div class="space-y-3">
        <USkeleton class="h-12 w-3/4" />
        <div class="flex gap-4">
          <USkeleton class="h-4 w-32" />
          <USkeleton class="h-4 w-40" />
        </div>
      </div>
      <USkeleton class="h-32" />
      <div class="flex gap-3">
        <USkeleton class="h-10 w-24" />
        <USkeleton class="h-10 w-24" />
      </div>
    </div>

    <!-- Note Content -->
    <div
      v-else-if="note"
      class="space-y-6"
    >
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
        <div class="flex-1">
          <h1 class="text-4xl md:text-5xl font-extrabold text-gray-100 leading-tight wrap-break-words">
            {{ note.title }}
          </h1>
          <div class="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-200">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-calendar-20-solid" class="w-4 h-4" />
              <span class="text-sm">{{ formattedCreatedDate }}</span>
            </div>
            <div v-if="note.createdAt !== note.updatedAt" class="flex items-center gap-2">
              <UIcon name="i-heroicons-pencil-20-solid" class="w-4 h-4" />
              <span class="text-sm">{{ formattedUpdatedDate }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <UBadge
            :color="statusColor"
            variant="soft"
            class="text-sm px-4 py-2 whitespace-nowrap"
          >
            <div class="flex items-center gap-2">
              <UIcon
                :name="statusColor === 'primary' ? 'i-heroicons-check-circle-20-solid' : 'i-heroicons-archive-box-20-solid'"
                class="w-4 h-4"
              />
              {{ statusLabel }}
            </div>
          </UBadge>
        </div>
      </div>

      <!-- Content Card -->
      <UCard
        v-if="note.description"
        class="overflow-hidden transition-shadow duration-200 hover:shadow-md rounded-xl"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-document-text-20-solid"
              class="w-5 h-5 text-blue-600"
            />
            <h2 class="font-semibold text-white">Contenido</h2>
          </div>
        </template>

        <div class="prose prose-sm max-w-none">
          <div class="whitespace-pre-wrap text-gray-200 leading-relaxed text-base font-normal">
            {{ note.description }}
          </div>
        </div>
      </UCard>

      <div v-else class="rounded-lg bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed border-gray-200 dark:border-gray-800 p-12 text-center">
        <UIcon
          name="i-heroicons-document-text-20-solid"
          class="w-12 h-12 mx-auto text-gray-400 mb-4"
        />
        <p class="text-gray-600 dark:text-gray-400">
          Esta nota no tiene descripción
        </p>
      </div>

      <!-- Actions -->
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
        <NuxtLink
          to="/app/notas"
          class="order-2 sm:order-1"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-left-20-solid"
            label="Volver a lista"
          />
        </NuxtLink>

        <div class="flex gap-3 order-1 sm:order-2">
            <UButton
              :to="`/app/notas/${route.params.id}/editar`"
              icon="i-heroicons-pencil-square-20-solid"
              color="secondary"
              variant="soft"
              label="Editar"
              size="md"
            />
            <UButton
              icon="i-heroicons-trash-20-solid"
              color="warning"
              variant="soft"
              label="Eliminar"
              @click="isDeleteDialogOpen = true"
              size="md"
            />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else
      class="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-12 text-center space-y-4"
    >
      <UIcon
        name="i-heroicons-exclamation-triangle-20-solid"
        class="w-12 h-12 mx-auto text-red-500"
      />
      <div class="space-y-2">
        <p class="text-gray-900 dark:text-gray-100 font-semibold">
          Nota no encontrada
        </p>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          La nota que buscas no existe o ha sido eliminada
        </p>
      </div>
      <NuxtLink to="/app/notas">
        <UButton
          color="warning"
          variant="soft"
          label="Volver a notas"
          icon="i-heroicons-arrow-left-20-solid"
        />
      </NuxtLink>
    </div>

    <!-- Delete Confirmation Dialog -->
    <UModal
      v-model:open="isDeleteDialogOpen"
      title="Eliminar Nota"
      description="Esta acción no se puede deshacer."
      :transition="true"
      :overlay="true"
      :close-on-overlay-click="false"
      :close-on-esc="false"
    >
      <template #footer>
        <div class="flex justify-end gap-3 w-full">
          <UButton
            color="neutral"
            variant="ghost"
            label="Cancelar"
            @click="isDeleteDialogOpen = false"
            :disabled="deleteLoading"
          />
          <UButton
            color="warning"
            icon="i-heroicons-trash-20-solid"
            label="Sí, Eliminar"
            :loading="deleteLoading"
            @click="onDelete"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
