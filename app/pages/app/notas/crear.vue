<script setup lang="ts">
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

const statusOptions = [
  { value: 'active', label: 'Activa' },
  { value: 'archived', label: 'Archivada' },
];

const onSubmit = async () => {
  try {
    loading.value = true;
    await $fetch('/api/notes', {
      method: 'POST',
      body: {
        title: formData.title,
        description: formData.description || null,
        status: formData.status,
      },
    });
    await router.push('/app/notas');
  } catch (error) {
    // Manejo mínimo: log en consola
    // eslint-disable-next-line no-console
    console.error('Error creando nota', error);
  } finally {
    loading.value = false;
  }
};

const onCancel = () => router.push('/app/notas');
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 class="text-4xl font-black text-white">Crear Nota</h1>
        <p class="text-lg text-gray-600 mt-2">Crea una nueva <span class="text-blue-600 font-semibold">nota</span></p>
      </div>

      <NuxtLink to="/app/notas">
        <UButton color="neutral" variant="ghost" icon="i-heroicons-arrow-left-20-solid" label="Volver" />
      </NuxtLink>
    </div>

    <!-- Form Card -->
    <UCard class="max-w-2xl">
      <UForm :state="formData" @submit="onSubmit" class="space-y-6">
        <div class="space-y-2">
          <UFormField label="Título" name="title">
            <UInput v-model="formData.title" placeholder="Título de la nota" maxlength="255" size="md" class="w-full" />
          </UFormField>
          <p class="text-xs text-gray-500">{{ formData.title.length }}/255 caracteres</p>
        </div>

        <div class="space-y-2">
          <UFormField label="Descripción" name="description" hint="Opcional">
            <UTextarea v-model="formData.description" placeholder="Escribe el contenido de tu nota..." maxlength="3000" class="w-full" />
          </UFormField>
          <p class="text-xs text-gray-500">{{ formData.description.length }}/3000 caracteres</p>
        </div>

        <div class="space-y-2">
          <UFormField label="Estado" name="status">
            <USelect v-model="formData.status" :items="statusOptions" class="w-full" :disabled="loading" />
          </UFormField>
        </div>

        <UButton type="submit" color="secondary" icon="i-heroicons-plus-20-solid" :loading="loading" class="w-full" size="md">Crear Nota</UButton>
      </UForm>
    </UCard>
  </div>
</template>
