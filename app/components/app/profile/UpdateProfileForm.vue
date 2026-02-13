<script setup lang="ts">
const { user, fetch: refreshSession } = useUserSession();
const { handleErrors } = useHandleErrors();
const toast = useToast();

const loading = ref(false);
const formData = reactive({
  name: user.value?.name || '',
  email: user.value?.email || '',
});

const onSubmit = async () => {
  try {
    loading.value = true;

    // Enviamos la actualización
    const res = await $fetch('/api/user/update', {
      method: 'PUT',
      body: formData,
    });

    await refreshSession();

    toast.success({
      message: res.message,
    });
  } catch (error) {
    handleErrors(toast, error, 'Hubo un error al actualizar tu perfil');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <form
      @submit.prevent="onSubmit"
      class="space-y-3"
    >
      <div class="space-y-3">
        <label
          for="name"
          class="text-sm uppercase font-bold"
        >
          Nombre Completo
        </label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          placeholder="Tu nombre completo"
          class="w-full p-3 border border-gray-300 bg-gray-50 rounded focus:bg-white focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <div class="space-y-3">
        <label
          for="email"
          class="text-sm uppercase font-bold"
        >
          Correo Electrónico
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          placeholder="tu@email.com"
          class="w-full p-3 border border-gray-300 bg-gray-50 rounded focus:bg-white focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="bg-blue-600 w-full p-3 text-white uppercase font-bold hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded"
      >
        {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
      </button>
    </form>
  </div>
</template>
