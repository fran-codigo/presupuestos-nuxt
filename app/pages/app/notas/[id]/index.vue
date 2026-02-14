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

    isDeleteDialogOpen.value = false;
    await navigateTo('/app/notas');
  } catch (error) {
    handleErrors(toast, error, 'Hubo un error al eliminar la nota');
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
      <div
        class="flex flex-col-reverse md:flex-row md:justify-between md:items-start gap-6"
      >
        <div class="flex-1 space-y-2">
          <h1 class="text-5xl font-black text-gray-900 break-words">
            {{ note.title }}
          </h1>
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-calendar-20-solid" class="w-4 h-4" />
              <span>{{ formattedCreatedDate }}</span>
            </div>
            <div
              v-if="note.createdAt !== note.updatedAt"
              class="flex items-center gap-2"
            >
              <UIcon name="i-heroicons-pencil-20-solid" class="w-4 h-4" />
              <span>{{ formattedUpdatedDate }}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <UBadge
            :color="statusColor"
            variant="soft"
            :ui="{ rounded: 'rounded-full' }"
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
        class="overflow-hidden transition-shadow duration-200 hover:shadow-md"
        :ui="{
          body: { padding: 'p-6 sm:p-8' },
          header: { padding: 'px-6 sm:px-8 py-4' },
        }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-document-text-20-solid"
              class="w-5 h-5 text-blue-600"
            />
            <h2 class="font-semibold text-gray-900">Contenido</h2>
          </div>
        </template>

        <div class="prose prose-sm max-w-none">
          <div
            class="whitespace-pre-wrap text-gray-700 leading-relaxed text-base font-normal"
          >
            {{ note.description }}
          </div>
        </div>
      </UCard>

      <div
        v-else
        class="rounded-lg bg-gray-50 dark:bg-gray-900/50 border-2 border-dashed border-gray-200 dark:border-gray-800 p-12 text-center"
      >
        <UIcon
          name="i-heroicons-document-text-20-solid"
          class="w-12 h-12 mx-auto text-gray-400 mb-4"
        />
        <p class="text-gray-600 dark:text-gray-400">
          Esta nota no tiene descripción
        </p>
      </div>

      <!-- Actions -->
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-800"
      >
        <NuxtLink
          to="/app/notas"
          class="order-2 sm:order-1"
        >
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-arrow-left-20-solid"
            label="Volver a lista"
          />
        </NuxtLink>

        <div class="flex gap-3 order-1 sm:order-2">
          <UButton
            to="`/app/notas/${route.params.id}/editar`"
            icon="i-heroicons-pencil-square-20-solid"
            color="blue"
            variant="soft"
            label="Editar"
            @click.prevent="onEdit"
          />
          <UButton
            icon="i-heroicons-trash-20-solid"
            color="red"
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
          color="red"
          variant="soft"
          label="Volver a notas"
          icon="i-heroicons-arrow-left-20-solid"
        />
      </NuxtLink>
    </div>

    <!-- Delete Confirmation Dialog -->
    <UModal
      v-model="isDeleteDialogOpen"
      :transition="true"
      :overlay="true"
    >
      <UCard
        :ui="{
          ring: 'ring-1 ring-gray-200 dark:ring-gray-800',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          body: { padding: 'px-4 py-6 sm:p-6' },
          header: { padding: 'px-4 py-4 sm:px-6' },
          footer: { padding: 'px-4 py-4 sm:px-6' },
        }"
      >
        <template #header>
          <div class="flex items-center gap-3">
            <div class="flex-shrink-0">
              <UIcon
                name="i-heroicons-exclamation-triangle-20-solid"
                class="w-6 h-6 text-red-500"
              />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Eliminar Nota</h3>
            </div>
            <UButton
              color="gray"
              variant="ghost"
              size="sm"
              icon="i-heroicons-x-mark-20-solid"
              class="ml-auto"
              @click="isDeleteDialogOpen = false"
            />
          </div>
        </template>

        <div class="space-y-4">
          <div class="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
            <p class="text-sm font-medium text-red-800 dark:text-red-200">
              ⚠️ Esta acción no se puede deshacer
            </p>
          </div>

          <div class="space-y-2">
            <p class="text-gray-600 dark:text-gray-300">
              ¿Estás seguro de que deseas eliminar esta nota?
            </p>
            <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-200 dark:border-gray-800">
              <p class="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                "{{ note?.title }}"
              </p>
              <p
                v-if="note?.description"
                class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2"
              >
                {{ note.description }}
              </p>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              color="gray"
              variant="ghost"
              label="Cancelar"
              @click="isDeleteDialogOpen = false"
              :disabled="deleteLoading"
            />
            <UButton
              color="red"
              icon="i-heroicons-trash-20-solid"
              label="Sí, Eliminar"
              :loading="deleteLoading"
              @click="onDelete"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>
