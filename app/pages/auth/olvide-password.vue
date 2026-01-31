<script setup lang="ts">
const { handleErrors } = useHandleErrors();

const toast = useToast();
const formData = reactive({
  email: "",
});
const loading = ref(false);

const onSubmit = async () => {
  try {
    loading.value = true;

    const res = await $fetch("/api/auth/forgot-password", {
      method: "POST",
      body: formData,
    });

    if (res && res.message) {
      toast.success({ message: res.message });
    }
  } catch (error) {
    handleErrors(toast, error, "Hubo un error al enviar las instrucciones");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="">
    <h1 class="font-black text-6xl text-green-800">¿Olvidaste tu contraseña</h1>
    <p class="text-3xl font-bold">
      Aquí puedes <span class="text-blue-500">reestablecerla</span>
    </p>

    <form @submit.prevent="onSubmit" class="mt-14 space-y-5" noValidate>
      <div class="flex flex-col gap-2 mb-10">
        <label class="font-bold text-2xl">Email</label>

        <input
          type="email"
          placeholder="Email de Registro"
          class="w-full border border-gray-300 p-3 rounded-lg"
          name="email"
          v-model="formData.email"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="bg-green-900 hover:bg-green-800 w-full p-3 rounded-lg text-white font-black text-xl cursor-pointer block"
        :class="{ 'opacity-50 cursor-not-allowed': loading }"
      >
        {{ loading ? "Enviando..." : "Enviar Instrucciones" }}
      </button>
    </form>
  </div>
</template>
