<script setup lang="ts">
import { PinInputInput, PinInputRoot } from "radix-vue";
const { handleErrors } = useHandleErrors();
const toast = useToast();

const token = ref<string[]>([]);

async function handleComplete(e: string[]) {
  try {
    const res = await $fetch("/api/auth/confirm-account", {
      method: "POST",
      body: { token: e.join("") },
    });

    if (res && res.message) {
      toast.success({ message: res.message });
      await navigateTo("/auth/iniciar-sesion");
    }
  } catch (error) {
    handleErrors(toast, error, "Hubo un error al confirmar la cuenta");
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-black text-6xl text-green-800">Confirma tu Cuenta</h1>
      <p class="text-3xl font-bold mt-2">
        Ingresa el código que recibiste
        <span class="text-blue-500">por correo</span>
      </p>
    </div>

    <div class="mt-10 flex justify-center">
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
  </div>
</template>
