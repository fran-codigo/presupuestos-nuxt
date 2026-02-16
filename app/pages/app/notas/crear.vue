<script setup lang="ts">
const { handleErrors } = useHandleErrors();
const toast = useToast();
const router = useRouter();

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

    const payload = {
      title: formData.title,
      description: formData.description || undefined,
      status: formData.status,
    } as any;

    const res = await $fetch('/api/notes', {
      method: 'POST',
      body: payload,
    });

    if (res && res.message) {
      toast.success({ message: res.message });
    }

    await router.push('/app/notas');
  } catch (error: any) {
    if (error.data?.data && Array.isArray(error.data.data)) {
      serverErrors.value = error.data.data;
    }
    handleErrors(toast, error, 'Hubo un error al crear la nota');
  } finally {
    loading.value = false;
  }
};

const onCancel = () => {
  router.push('/app/notas');
};
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-4"
    >
      <div>
        <h1 class="text-4xl font-black text-white">Crear Nota</h1>
        <p class="text-lg text-gray-600 mt-2">
          Crea una nueva <span class="text-blue-600 font-semibold">nota</span>
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
      <UForm
        :state="formData"
        @submit="onSubmit"
        class="space-y-6"
      >
        <UFormField
          label="Titulo"
          name="title"
        >
          <UInput v-model="formData.title" class="w-full" />
        </UFormField>

        <UFormField
          label="Descripción"
          name="description"
        >
          <UTextarea v-model="formData.description" class="w-full" />
        </UFormField>

        <UFormField
          label="Estado"
          name="status"
        >
          <USelect
            v-model="formData.status"
            :items="statusOptions"
            class="w-full"
          />
        </UFormField>

        <UButton type="submit" :loading="loading" class="w-full block text-center"> Crear Nota </UButton>
      </UForm>
    </UCard>
  </div>
</template>
