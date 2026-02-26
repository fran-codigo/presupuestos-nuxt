<script setup lang="ts">
import { useHandleErrors } from "~/composables/useHandleErrors";
import { useNote } from "~/composables/useNote";

const { handleErrors } = useHandleErrors();
const { create } = useNote();
const toast = useToast();

const formData = reactive({
  title: "",
  description: "",
  status: "active",
});
const statusOptions = [
  { value: "active", label: "Activa" },
  { value: "archived", label: "Archivada" },
];
const loading = ref(false);

const onSubmit = async () => {
  try {
    loading.value = true;
    const res = await create(formData);
    toast.success({ message: res.message });
    await navigateTo("/app/notas");
  } catch (error) {
    handleErrors(toast, error, "Error al crear la nota");
  } finally {
    loading.value = false;
  }
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
      <UForm :state="formData" @submit="onSubmit" class="space-y-6">
        <div class="space-y-2">
          <UFormField label="Título" name="title">
            <UInput
              v-model="formData.title"
              placeholder="Título de la nota"
              maxlength="255"
              size="md"
              class="w-full"
            />
          </UFormField>
          <p class="text-xs text-gray-500">
            {{ formData.title.length }}/255 caracteres
          </p>
        </div>

        <div class="space-y-2">
          <UFormField label="Descripción" name="description" hint="Opcional">
            <UTextarea
              v-model="formData.description"
              placeholder="Escribe el contenido de tu nota..."
              maxlength="3000"
              class="w-full"
            />
          </UFormField>
          <p class="text-xs text-gray-500">
            {{ formData.description.length }}/3000 caracteres
          </p>
        </div>

        <div class="space-y-2">
          <UFormField label="Estado" name="status">
            <USelect
              v-model="formData.status"
              :items="statusOptions"
              class="w-full"
              :disabled="loading"
            />
          </UFormField>
        </div>

        <UButton
          type="submit"
          color="secondary"
          :loading="loading"
          class="w-full block text-center"
          size="md"
          >Crear Nota</UButton
        >
      </UForm>
    </UCard>
  </div>
</template>
