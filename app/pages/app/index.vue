<script setup lang="ts">
const { user } = useUserSession();
</script>

<template>
  <div>
    <h1 class="text-3xl">
      Bienvenido: <span class="font-bold">{{ user?.name }}</span>
    </h1>
    <p class="text-gray-600 mt-2">
      Desde aquí puedes administrar tus presupuestos y notas
    </p>

    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <NuxtLink
        to="/app/presupuestos"
        class="flex flex-col items-center justify-center p-8 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg hover:border-blue-500 transition-all"
      >
        <svg
          class="w-12 h-12 text-blue-600 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <h2 class="text-lg font-bold text-gray-900 mb-2">Presupuestos</h2>
        <p class="text-sm text-gray-600 text-center">
          Crea y gestiona tus presupuestos
        </p>
      </NuxtLink>

      <NuxtLink
        to="/app/notas"
        class="flex flex-col items-center justify-center p-8 bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg hover:border-blue-500 transition-all"
      >
        <UIcon
          name="i-heroicons-document-text-20-solid"
          class="w-12 h-12 text-blue-600 mb-3"
        />
        <h2 class="text-lg font-bold text-gray-900 mb-2">Notas</h2>
        <p class="text-sm text-gray-600 text-center">
          Crea y gestiona tus notas
        </p>
      </NuxtLink>
    </div>
  </div>
</template>
