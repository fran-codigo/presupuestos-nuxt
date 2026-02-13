<script setup lang="ts">
const { handleErrors } = useHandleErrors();
const toast = useToast();

const loading = ref(false);
const formData = reactive({
  current_password: '',
  password: '',
  password_confirmation: '',
});

const onSubmit = async () => {
  try {
    loading.value = true;

    const res = await $fetch('/api/user/update-password', {
      method: 'PUT',
      body: formData,
    });

    toast.success({
      message: res.message,
    });

    formData.current_password = '';
    formData.password = '';
    formData.password_confirmation = '';
  } catch (error) {
    handleErrors(toast, error, 'Hubo un error al cambiar tu contraseña');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form
    @submit.prevent="onSubmit"
    class="space-y-3"
  >
    <div class="space-y-3">
      <label
        for="current_password"
        class="text-sm uppercase font-bold"
      >
        Contraseña Actual
      </label>
      <input
        id="current_password"
        v-model="formData.current_password"
        type="password"
        placeholder="Tu contraseña actual"
        class="w-full p-3 border border-gray-300 bg-gray-50 rounded focus:bg-white focus:border-blue-500 outline-none transition-all"
      />
    </div>

    <div class="space-y-3">
      <label
        for="password"
        class="text-sm uppercase font-bold"
      >
        Nueva Contraseña
      </label>
      <input
        id="password"
        v-model="formData.password"
        type="password"
        placeholder="Tu nueva contraseña"
        class="w-full p-3 border border-gray-300 bg-gray-50 rounded focus:bg-white focus:border-blue-500 outline-none transition-all"
      />
    </div>

    <div class="space-y-3">
      <label
        for="password_confirmation"
        class="text-sm uppercase font-bold"
      >
        Confirmar Contraseña
      </label>
      <input
        id="password_confirmation"
        v-model="formData.password_confirmation"
        type="password"
        placeholder="Confirma tu nueva contraseña"
        class="w-full p-3 border border-gray-300 bg-gray-50 rounded focus:bg-white focus:border-blue-500 outline-none transition-all"
      />
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="bg-blue-600 w-full p-3 text-white uppercase font-bold hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded"
    >
      {{ loading ? 'Cambiando...' : 'Cambiar Contraseña' }}
    </button>
  </form>
</template>