<script setup lang="ts">
import { ref } from "vue";
const { user, clear } = useUserSession();

const isOpen = ref(false);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

const logout = async () => {
  await clear();
  closeMenu();
  await navigateTo("/auth/iniciar-sesion");
};
</script>

<template>
  <div class="relative inline-block">
    <!-- Botón trigger -->
    <button
      @click="toggleMenu"
      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
    >
      Menú
      <svg
        class="inline-block w-4 h-4 ml-2 -mr-1 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      v-if="isOpen"
      @click.outside="closeMenu"
      class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10 text-center"
    >
      <p
        @click.prevent="closeMenu"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 first:rounded-t-md transition-colors"
      >
        Hola : {{ user?.name }}
      </p>
      <a
        href="#"
        @click.prevent="closeMenu"
        class="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
      >
        Opción 2
      </a>
      <button
        @click.prevent="logout"
        class="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 last:rounded-b-md transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  </div>
</template>
