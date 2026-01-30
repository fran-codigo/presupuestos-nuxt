<script setup lang="ts">
const { handleErrors } = useHandleErrors();
const toast = useToast();

const data = reactive({
  email: "",
  name: "",
  password: "",
  password_confirmation: "",
});
const loading = ref(false);
const message = ref("");

const onSubmit = async () => {
  try {
    loading.value = true;

    const res = await $fetch("/api/auth/register", {
      method: "POST",
      body: data,
    });

    if (res && res.message) {
      message.value = res.message;
    }

    data.email = "";
    data.name = "";
    data.password = "";
    data.password_confirmation = "";
  } catch (error) {
    handleErrors(toast, error, "Hubo un error al crear la cuenta");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="">
    <h1 class="font-black text-6xl text-green-800">Crea una Cuenta</h1>
    <p class="text-3xl font-bold">
      y controla tus <span class="text-blue-500">finanzas</span>
    </p>

    <form @submit.prevent="onSubmit" class="mt-14 space-y-5" noValidate>
      <p
        v-if="message"
        class="my-4 text-green-800 font-bold text-center text-xl border border-green-300 p-1 rounded-lg"
      >
        {{ message }}
      </p>
      <div class="flex flex-col gap-2">
        <label class="font-bold text-2xl">Nombre</label>
        <input
          type="text"
          placeholder="Nombre de Registro"
          class="w-full border border-gray-300 p-3 rounded-lg"
          name="name"
          v-model="data.name"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold text-2xl" htmlFor="email"> Email </label>
        <input
          id="email"
          type="email"
          placeholder="Email de Registro"
          class="w-full border border-gray-300 p-3 rounded-lg"
          name="email"
          v-model="data.email"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold text-2xl">Password</label>
        <input
          type="password"
          placeholder="Password de Registro"
          class="w-full border border-gray-300 p-3 rounded-lg"
          name="password"
          v-model="data.password"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold text-2xl">Repetir Password</label>
        <input
          id="password_confirmation"
          type="password"
          placeholder="Repite Password de Registro"
          class="w-full border border-gray-300 p-3 rounded-lg"
          name="password_confirmation"
          v-model="data.password_confirmation"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="bg-green-900 hover:bg-green-800 w-full p-3 rounded-lg text-white font-black text-xl cursor-pointer block"
        :class="{ 'opacity-50 cursor-not-allowed': loading }"
      >
        <span v-if="loading">Creando Cuenta...</span
        ><span v-else>Registrarme</span>
      </button>
    </form>
  </div>
</template>
