<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const { handleErrors } = useHandleErrors();
const toast = useToast();

interface FormData {
  title: string;
  description: string;
  status: 'active' | 'archived';
}

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

const onSubmit = async () => {
  try {
    loading.value = true;
    serverErrors.value = [];

    const res = await $fetch('/api/notes', {
      method: 'POST',
      body: {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
      },
    });

    if (res && res.message) {
      toast.success({
        message: res.message
      });
    }

    await navigateTo('/app/notas');
  } catch (error){ 
    handleErrors(toast, error, 'Hubo un error al crear la nota');
  } finally {
    loading.value = false;
  }
};

const onCancel = () => {
  navigateTo('/app/notas');
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-4xl font-black text-gray-900">Nueva Nota</h1>
        <p class="text-lg text-gray-600 mt-2">
          Crea una nueva
          <span class="text-blue-600 font-semibold">nota</span>
        </p>
      </div>

      <NuxtLink to="/app/notas">
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
              size="md"
              maxlength="3000"
              autofocus
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
            label="Guardar Nota"
            :loading="loading"
          />
        </div>
      </form>
    </UCard>
  </div>
</template>
