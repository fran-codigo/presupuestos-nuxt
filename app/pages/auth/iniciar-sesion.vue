<script setup lang="ts">
const email = ref('')
const password = ref('')
const loading = ref(false)

const onSubmit = async () => {

}
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
          v-model="email"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label class="font-bold text-2xl">Password</label>

        <input
          type="password"
          placeholder="Password de Registro"
          class="w-full border border-gray-300 p-3 rounded-lg"
          name="password"
          v-model="password"
        />
      </div>

      <input
        type="submit"
        value="Iniciar Sesión"
        class="bg-green-900 hover:bg-green-800 w-full p-3 rounded-lg text-white font-black text-xl cursor-pointer"
      />
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
