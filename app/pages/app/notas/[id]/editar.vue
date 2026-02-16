<script setup lang="ts">
import { useNote } from "~/composables/useNote";

const { handleErrors } = useHandleErrors();
const route = useRoute();
const toast = useToast();

const { data: note, pending } = await useFetch(`/api/notes/${route.params.id}`);
const { updateNote } = useNote();

const formData = reactive({
  title: note.value?.title || "",
  description: note.value?.description || "",
  status: note.value?.status || "active",
});

const loading = ref(false);

const statusOptions = [
  { value: "active", label: "Activa" },
  { value: "archived", label: "Archivada" },
];

const onSubmit = async () => {
  try {
    loading.value = true;
    // Envío simple: mandar el form completo
    const res = await updateNote(Number(route.params.id), formData);
    toast.success({ message: res.message });
    await navigateTo(`/app/notas/${route.params.id}`);
  } catch (error) {
    handleErrors(toast, error, "Hubo un error al actualizar la nota");
  } finally {
    loading.value = false;
  }
};

const onCancel = async () => {
  await navigateTo(`/app/notas/${route.params.id}`);
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
      <div
        class="flex flex-col-reverse md:flex-row md:justify-between md:items-center gap-4"
      >
        <div>
          <h1 class="text-4xl font-black text-white">Editar Nota</h1>
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
        <UForm :state="formData" @submit="onSubmit" class="space-y-6">
          <!-- Title Field -->
          <div class="space-y-2">
            <UFormField label="Título" name="title">
              <UInput
                v-model="formData.title"
                placeholder="Título de la nota"
                icon="i-heroicons-pencil-20-solid"
                :disabled="loading"
                maxlength="255"
                class="w-full"
              />
            </UFormField>
            <p class="text-xs text-gray-500">
              {{ formData.title.length }}/255 caracteres
            </p>
          </div>

          <!-- Description Field -->
          <div class="space-y-2">
            <UFormField label="Descripción" name="description" hint="Opcional">
              <UTextarea
                v-model="formData.description"
                placeholder="Escribe el contenido de tu nota..."
                :disabled="loading"
                maxlength="3000"
                class="w-full"
              />
            </UFormField>
            <p class="text-xs text-gray-500">
              {{ formData.description.length }}/3000 caracteres
            </p>
          </div>

          <!-- Status Field -->
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

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-6 border-t">
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
              :disabled="loading"
            />
          </div>
        </UForm>
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
