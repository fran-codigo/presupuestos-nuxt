<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { handleErrors } = useHandleErrors();
const toast = useToast();
const route = useRoute();
const router = useRouter();

interface Note {
  id: number;
  title: string;
  description: string | null;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  description: string;
  status: 'active' | 'archived';
}

const { data: note, pending } = await useFetch<Note>(`/api/notes/${route.params.id}`);

const formData = reactive<FormData>({
  title: '',
  description: '',
  status: 'active',
});

const loading = ref(false);
const serverErrors = ref<string[]>([]);

const statusOptions = [
  { value: 'active', label: 'Activa' },
  { value: 'archived', label: 'Archivada' },
];

// Pre-fill form when note loads
watch(
  note,
  (newNote) => {
    if (newNote) {
      formData.title = newNote.title;
      formData.description = newNote.description || '';
      formData.status = newNote.status;
    }
  },
  { immediate: true }
);

const onSubmit = async () => {
  try {
    loading.value = true;
    serverErrors.value = [];

    // Only send fields that have changed or are different from original
    const updatePayload: Partial<FormData> = {};

    if (note.value && note.value.title !== formData.title) {
      updatePayload.title = formData.title;
    }

    if (note.value && note.value.description !== (formData.description || null)) {
      updatePayload.description = formData.description || null;
    }

    if (note.value && note.value.status !== formData.status) {
      updatePayload.status = formData.status;
    }

    const res = await $fetch(`/api/notes/${route.params.id}`, {
      method: 'PUT',
      body: updatePayload,
    });

    if (res && res.message) {
      toast.success({
        message: res.message,
      });
    }

    await router.push(`/app/notas/${route.params.id}`);
  } catch (error: any) {
    if (error.data?.data && Array.isArray(error.data.data)) {
      serverErrors.value = error.data.data;
    }
    handleErrors(toast, error, 'Hubo un error al actualizar la nota');
  } finally {
    loading.value = false;
  }
};

const onCancel = () => {
  router.push(`/app/notas/${route.params.id}`);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="pending" class="space-y-4">
      <USkeleton class="h-12 w-3/4" />
      <USkeleton class="h-96" />
      <USkeleton class="h-10 w-1/4" />
    </div>

    <!-- Edit Form -->
    <div v-else-if="note" class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 class="text-4xl font-black text-gray-900">Editar Nota</h1>
          <p class="text-lg text-gray-600 mt-2">
            Actualiza tu
            <span class="text-blue-600 font-semibold">nota</span>
          </p>
        </div>

        <NuxtLink :to="`/app/notas/${route.params.id}`">
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-left-20-solid"
            label="Volver"
          />
        </NuxtLink>
      </div>

      <!-- Form Card -->
      <UCard class="max-w-2xl">
        <form @submit.prevent="onSubmit" class="space-y-6">
          <!-- Title Field -->
          <div class="space-y-2">
            <UFormGroup
              label="Título"
              name="title"
              :error="serverErrors.length > 0 ? serverErrors[0] : undefined"
            >
              <UInput
                v-model="formData.title"
                placeholder="Título de la nota"
                icon="i-heroicons-pencil-20-solid"
                :disabled="loading"
                size="md"
                maxlength="255"
              />
            </UFormGroup>
            <p class="text-xs text-gray-500">
              {{ formData.title.length }}/255 caracteres
            </p>
          </div>

          <!-- Description Field -->
          <div class="space-y-2">
            <UFormGroup
              label="Descripción"
              name="description"
              hint="Opcional"
            >
              <UTextarea
                v-model="formData.description"
                placeholder="Escribe el contenido de tu nota..."
                :disabled="loading"
                maxlength="3000"
              />
            </UFormGroup>
            <p class="text-xs text-gray-500">
              {{ formData.description.length }}/3000 caracteres
            </p>
          </div>

          <!-- Status Field -->
          <div class="space-y-2">
            <UFormGroup label="Estado" name="status">
              <USelect
                v-model="formData.status"
                :options="statusOptions"
                option-attribute="label"
                value-attribute="value"
                :disabled="loading"
                size="md"
              />
            </UFormGroup>
          </div>

          <!-- Error Messages -->
          <div v-if="serverErrors.length > 0" class="space-y-2">
            <UAlert
              v-for="(error, index) in serverErrors"
              :key="index"
              color="warning"
              icon="i-heroicons-exclamation-circle-20-solid"
              :title="error"
            />
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-6 border-t">
            <UButton
              color="neutral"
              variant="ghost"
              label="Cancelar"
              :disabled="loading"
              @click="onCancel"
            />
            <UButton
              type="submit"
              color="secondary"
              icon="i-heroicons-check-20-solid"
              label="Guardar Cambios"
              :loading="loading"
            />
          </div>
        </form>
      </UCard>
    </div>

    <!-- Error State -->
    <div v-else class="text-center py-12">
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
  </div>
</template>
