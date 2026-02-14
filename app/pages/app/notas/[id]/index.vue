<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { handleErrors } = useHandleErrors();
const toast = useToast();
const route = useRoute();

interface Note {
  id: number;
  title: string;
  description: string | null;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

const {
  data: note,
  refresh,
  pending,
} = await useFetch<Note>(`/api/notes/${route.params.id}`);

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

    await navigateTo('/app/notas');
  } catch (error) {
    handleErrors(toast, error, 'Hubo un error al eliminar la nota');
    isDeleteDialogOpen.value = false;
  } finally {
    deleteLoading.value = false;
  }
};

const onEdit = async () => {
  await navigateTo(`/app/notas/${route.params.id}/editar`);
};

provide('refreshNotes', refresh);
</script>

<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div
      v-if="pending"
      class="space-y-4"
    >
      <USkeleton class="h-12 w-3/4" />
      <USkeleton class="h-32" />
      <USkeleton class="h-10 w-1/4" />
    </div>

    <!-- Note Content -->
    <div
      v-else-if="note"
      class="space-y-6"
    >
      <!-- Header -->
      <div
        class="flex flex-col-reverse md:flex-row md:justify-between md:items-start gap-4"
      >
        <div class="flex-1">
          <h1 class="text-4xl font-black text-gray-900 mb-2">
            {{ note.title }}
          </h1>
          <p class="text-gray-600">
            Creado el {{ formattedCreatedDate }}
            <span
              v-if="note.createdAt !== note.updatedAt"
              class="text-xs text-gray-500"
            >
              • Editado el {{ formattedUpdatedDate }}
            </span>
          </p>
        </div>

        <div class="flex items-center gap-2">
          <UBadge
            :color="statusColor"
            variant="soft"
            class="text-base px-4 py-2"
          >
            {{ statusLabel }}
          </UBadge>
        </div>
      </div>

      <!-- Content Card -->
      <UCard
        v-if="note.description"
        class="prose prose-sm max-w-none"
      >
        <div class="whitespace-pre-wrap text-gray-700 leading-relaxed">
          {{ note.description }}
        </div>
      </UCard>

      <div
        v-else
        class="text-center py-12"
      >
        <UIcon
          name="i-heroicons-document-text-20-solid"
          class="w-12 h-12 mx-auto text-gray-400 mb-4"
        />
        <p class="text-gray-500">Esta nota no tiene descripción</p>
      </div>

      <!-- Actions -->
      <div class="flex justify-between items-center pt-6 border-t gap-3">
        <NuxtLink to="/app/notas">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-left-20-solid"
            label="Volver"
          />
        </NuxtLink>

        <div class="flex gap-3">
          <UButton
            icon="i-heroicons-pencil-square-20-solid"
            color="secondary"
            variant="soft"
            label="Editar"
            @click="onEdit"
          />
          <UButton
            icon="i-heroicons-trash-20-solid"
            color="warning"
            variant="soft"
            label="Eliminar"
            @click="isDeleteDialogOpen = true"
          />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else
      class="text-center py-12"
    >
      <UIcon
        name="i-heroicons-exclamation-triangle-20-solid"
        class="w-12 h-12 mx-auto text-red-400 mb-4"
      />
      <p class="text-gray-600 mb-4">Nota no encontrada</p>
      <NuxtLink to="/app/notas">
        <UButton
          color="secondary"
          variant="soft"
          label="Volver a notas"
          icon="i-heroicons-arrow-left-20-solid"
        />
      </NuxtLink>
    </div>

    <!-- Delete Confirmation Dialog -->
    <UModal
      v-model="isDeleteDialogOpen"
    >
      <UCard
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold leading-6 text-gray-900">
              Eliminar Nota
            </h3>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="isDeleteDialogOpen = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-gray-600">
            ¿Estás seguro de que deseas eliminar esta nota? Esta acción no se
            puede deshacer.
          </p>
          <p class="font-semibold text-gray-900">{{ note?.title }}</p>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
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
              label="Eliminar"
              :loading="deleteLoading"
              @click="onDelete"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
