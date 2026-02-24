<script setup lang="ts">
const { handleErrors } = useHandleErrors();
const toast = useToast();

const loading = ref(false);
const formData = reactive({
  current_password: "",
  password: "",
  password_confirmation: "",
});

const onSubmit = async () => {
  try {
    loading.value = true;

    const res = await $fetch("/api/user/update-password", {
      method: "PUT",
      body: formData,
    });

    toast.success({
      message: res.message,
    });

    formData.current_password = "";
    formData.password = "";
    formData.password_confirmation = "";
  } catch (error) {
    handleErrors(toast, error, "Hubo un error al cambiar tu contraseña");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-5">
    <div class="space-y-2">
      <label
        for="current_password"
        class="block text-sm font-semibold text-gray-300"
      >
        Contraseña Actual
      </label>
      <UInput
        id="current_password"
        v-model="formData.current_password"
        type="password"
        placeholder="••••••••"
        size="lg"
        color="primary"
        variant="outline"
        icon="i-heroicons-lock-closed"
      />
    </div>

    <div class="space-y-2">
      <label for="password" class="block text-sm font-semibold text-gray-300">
        Nueva Contraseña
      </label>
      <UInput
        id="password"
        v-model="formData.password"
        type="password"
        placeholder="••••••••"
        size="lg"
        color="primary"
        variant="outline"
        icon="i-heroicons-key"
      />
    </div>

    <div class="space-y-2">
      <label
        for="password_confirmation"
        class="block text-sm font-semibold text-gray-300"
      >
        Confirmar Contraseña
      </label>
      <UInput
        id="password_confirmation"
        v-model="formData.password_confirmation"
        type="password"
        placeholder="••••••••"
        size="lg"
        color="primary"
        variant="outline"
        icon="i-heroicons-key"
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
        :label="loading ? 'Cambiando...' : 'Cambiar Contraseña'"
      />
    </div>
  </form>
</template>
