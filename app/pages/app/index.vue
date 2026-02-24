<script setup lang="ts">
const { user } = useUserSession();
</script>

<template>
  <div class="space-y-12">
    <!-- Header Section -->
    <div
      class="flex flex-col-reverse md:flex-row md:justify-between md:items-start gap-6"
    >
      <div class="flex-1">
        <div class="inline-flex items-baseline gap-3">
          <h1 class="text-5xl font-black text-white tracking-tighter">
            Bienvenido,
            <span class="text-primary-400">{{ user?.name || "Usuario" }}</span>
          </h1>
          <div
            class="h-1 w-12 bg-linear-to-r from-primary-500 to-transparent rounded-full"
          />
        </div>
        <p
          class="text-lg text-gray-400 mt-4 leading-relaxed max-w-lg font-medium"
        >
          Desde aquí puedes administrar tus finanzas personales y organizar
          todas tus ideas en un solo lugar.
        </p>
      </div>
    </div>

    <!-- Acciones Rápidas -->
    <div class="grid gap-6 grid-cols-1 md:grid-cols-2 auto-rows-max">
      <NuxtLink to="/app/presupuestos" class="group h-full block">
        <UCard
          class="h-full cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-l-4 border-l-primary-500/80 hover:border-l-primary-400 flex flex-col justify-center p-4"
          variant="soft"
        >
          <div class="flex flex-col items-center text-center space-y-4">
            <div
              class="p-4 bg-primary-500/10 rounded-full ring-2 ring-primary-500/20 group-hover:bg-primary-500/20 transition-colors"
            >
              <UIcon
                name="i-heroicons-currency-dollar-20-solid"
                class="w-10 h-10 text-primary-400"
              />
            </div>
            <div>
              <h2
                class="text-2xl font-bold text-white group-hover:text-primary-300 transition-colors duration-300"
              >
                Presupuestos
              </h2>
              <p class="text-sm text-gray-400 mt-2 font-medium">
                Crea, gestiona y mantén el control de tus finanzas personales
                con facilidad.
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>

      <NuxtLink to="/app/notas" class="group h-full block">
        <UCard
          class="h-full cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-l-4 border-l-blue-500/80 hover:border-l-blue-400 flex flex-col justify-center p-4"
          variant="soft"
        >
          <div class="flex flex-col items-center text-center space-y-4">
            <div
              class="p-4 bg-blue-500/10 rounded-full ring-2 ring-blue-500/20 group-hover:bg-blue-500/20 transition-colors"
            >
              <UIcon
                name="i-heroicons-document-text-20-solid"
                class="w-10 h-10 text-blue-400"
              />
            </div>
            <div>
              <h2
                class="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300"
              >
                Notas
              </h2>
              <p class="text-sm text-gray-400 mt-2 font-medium">
                Captura ideas, listas de tareas y cualquier información
                importante de forma rápida.
              </p>
            </div>
          </div>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>
