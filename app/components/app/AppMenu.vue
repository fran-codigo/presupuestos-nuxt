<script setup lang="ts">
import { computed } from "vue";
const { user, clear } = useUserSession();

const logout = async () => {
  await clear();
  await navigateTo("/auth/iniciar-sesion");
};

const items = computed(() => [
  [
    {
      label: `Hola, ${user.value?.name || "Usuario"}`,
      disabled: true,
      class: "font-semibold text-gray-300",
    },
  ],
  [
    {
      label: "Mi perfil",
      to: "/app/perfil",
      icon: "i-heroicons-user-20-solid",
    },
    {
      label: "Mis Presupuestos",
      to: "/app/presupuestos",
      icon: "i-heroicons-currency-dollar-20-solid",
    },
    {
      label: "Mis Notas",
      to: "/app/notas",
      icon: "i-heroicons-document-text-20-solid",
    },
  ],
  [
    {
      label: "Cerrar sesión",
      icon: "i-heroicons-arrow-right-start-on-rectangle-20-solid",
      color: "error",
      onSelect: logout,
    },
  ],
]);
</script>

<template>
  <UDropdownMenu :items="items" :ui="{ content: 'w-56' }">
    <UButton
      color="neutral"
      variant="ghost"
      trailing-icon="i-heroicons-chevron-down-20-solid"
      class="text-gray-300 hover:text-white transition-colors"
    >
      Menú
    </UButton>
  </UDropdownMenu>
</template>
