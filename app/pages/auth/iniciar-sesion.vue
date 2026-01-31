<script setup lang="ts">
const { fetch } = useUserSession();
const { handleErrors } = useHandleErrors();
const toast = useToast();

const loginData = reactive({
  email: "",
  password: "",
});
const loading = ref(false);

const onSubmit = async () => {
  try {
    loading.value = true;

    const res = await $fetch("/api/auth/login", {
      method: "POST",
      body: loginData,
    });

    if (res) {
      await fetch();
      // TODO: Redirect to dashboard or home page
      await navigateTo("/");
    }
  } catch (error) {
    handleErrors(toast, error, "Hubo un error al iniciar sesión");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="">
    <h1 class="font-black text-6xl text-green-800">Iniciar Sesión</h1>
    <p class="text-3xl font-bold">
      y controla tus <span class="text-blue-500">finanzas</span>
    </p>

    <form @submit.prevent="onSubmit" class="mt-14 space-y-5" noValidate>
      <div class="flex flex-col gap-2">
        <label class="font-bold text-2xl">Email</label>

        <input
          id="email"
          type="email"
          placeholder="Email de Registro"
          class="w-full border border-gray-300 p-3 rounded-lg"
          name="email"
          v-model="loginData.email"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold text-2xl">Password</label>

        <input
          type="password"
          placeholder="Password de Registro"
          class="w-full border border-gray-300 p-3 rounded-lg"
          name="password"
          v-model="loginData.password"
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="bg-green-900 hover:bg-green-800 w-full p-3 rounded-lg text-white font-black text-xl cursor-pointer disabled:opacity-50"
      >
        {{ loading ? "Iniciando Sesión..." : "Iniciar Sesión" }}
      </button>
    </form>

    <nav class="mt-10 flex flex-col space-y-4">
      <!-- <Link href="/auth/register" class="text-center text-gray-500">
      ¿No tienes cuenta? Crear una
    </Link>
    <Link href="/auth/forgot-password" class="text-center text-gray-500">
        ¿Olvidaste tu contraseña? Reestablecer
    </Link> -->
    </nav>
  </div>
</template>
