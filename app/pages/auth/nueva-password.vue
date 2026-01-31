<script setup lang="ts">
import { PinInputInput, PinInputRoot } from "radix-vue";
const { handleErrors } = useHandleErrors();
const toast = useToast();

const token = ref<string[]>([]);
const isValidToken = ref(false);
const formData = reactive({
  password: "",
  password_confirmation: "",
});
const loading = ref(false);

async function handleComplete(e: string[]) {
  try {
    const res = await $fetch("/api/auth/validate-token", {
      method: "POST",
      body: { token: e.join("") },
    });

    if (res) {
      toast.success({
        message: res.message,
      });
      isValidToken.value = true;
    }
  } catch (error) {
    handleErrors(toast, error, "Token inválido o expirado");
  }
}

const onSubmit = async () => {
  console.log(token.value.join(""));
  try {
    loading.value = true;

    const res = await $fetch(
      `/api/auth/reset-password/${token.value.join("")}`,
      {
        method: "POST",
        body: {
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        },
      },
    );

    if (res && res.message) {
      toast.success({ message: res.message });
      await navigateTo("/auth/iniciar-sesion");
    }
  } catch (error) {
    handleErrors(toast, error, "Hubo un error al reestablecer la contraseña");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="">
    <h1 class="font-black text-6xl text-green-800">Reestablecer Contraseña</h1>
    <p class="text-3xl font-bold">
      Ingresa el código que recibiste
      <span class="text-blue-500"> por correo</span>
    </p>

    <div v-if="!isValidToken" class="mt-10 flex justify-center">
      <PinInputRoot
        id="pin-input"
        class="flex gap-2 items-center mt-1"
        length="6"
        v-model="token"
        @complete="handleComplete"
      >
        <PinInputInput
          v-for="(id, index) in 6"
          :key="id"
          :index="index"
          class="w-16 h-16 bg-white rounded text-lg text-center font-semibold shadow-lg text-green-500 placeholder:text-mauve8 focus:outline-2 focus:outline-offset-2 focus:outline-white"
        />
      </PinInputRoot>
    </div>

    <div v-if="isValidToken" class="mt-10 flex justify-center">
      <form @submit.prevent="onSubmit" class="mt-14 space-y-5" noValidate>
        <div class="flex flex-col gap-5">
          <label class="font-bold text-2xl">Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            class="w-full border border-gray-300 p-3 rounded-lg"
            name="password"
            v-model="formData.password"
          />
        </div>

        <div class="flex flex-col gap-5">
          <label class="font-bold text-2xl">Repetir Password</label>

          <input
            id="password_confirmation"
            type="password"
            placeholder="Repite Password de Registro"
            class="w-full border border-gray-300 p-3 rounded-lg"
            name="password_confirmation"
            v-model="formData.password_confirmation"
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
  </div>
</template>
