<script setup lang="ts">
const { user, fetch: refreshSession } = useUserSession();
const { handleErrors } = useHandleErrors();
const toast = useToast();

const loading = ref(false);
const formData = reactive({
  name: user.value?.name || "",
  email: user.value?.email || "",
});

const onSubmit = async () => {
  try {
    loading.value = true;

    // Enviamos la actualización
    const res = await $fetch("/api/user/update", {
      method: "PUT",
      body: formData,
    });

    await refreshSession();

    toast.success({
      message: res.message,
    });
  } catch (error) {
    handleErrors(toast, error, "Hubo un error al actualizar tu perfil");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-5">
    <div class="space-y-2">
      <label for="name" class="block text-sm font-semibold text-gray-300">
        Nombre Completo
      </label>
      <UInput
        id="name"
        v-model="formData.name"
        type="text"
        placeholder="Tu nombre completo"
        size="lg"
        color="primary"
        variant="outline"
        icon="i-heroicons-user"
      />
    </div>

    <div class="space-y-2">
      <label for="email" class="block text-sm font-semibold text-gray-300">
        Correo Electrónico
      </label>
      <UInput
        id="email"
        v-model="formData.email"
        type="email"
        placeholder="tu@email.com"
        size="lg"
        color="primary"
        variant="outline"
        icon="i-heroicons-envelope"
      />
    </div>

    <div class="pt-4 border-t border-gray-800">
      <UButton
        type="submit"
        :loading="loading"
        color="primary"
        variant="solid"
        size="xl"
        class="w-full justify-center"
        :label="loading ? 'Guardando...' : 'Guardar Cambios'"
      />
    </div>
  </form>
</template>
