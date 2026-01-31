<script setup lang="ts"></script>

<template>
  <div class="">
    <header class="bg-green-800 py-5">
      <div
        class="max-w-5xl mx-auto flex flex-col gap-4 lg:flex-row items-center justify-center lg:justify-between"
      >
        <div class="w-96 text-center lg:text-left">
          <NuxtLink to="/app" class="text-white text-3xl font-bold">
            Presupuestos
          </NuxtLink>
        </div>

        <AppMenu />
      </div>
    </header>
    <section class="max-w-5xl mx-auto mt-10 p-3 py-10">
      <slot />
    </section>

    <footer class="py-5">
      <p class="text-center">
        Todos los Derechos Reservados &copy; {{ new Date().getFullYear() }}
      </p>
    </footer>
  </div>
</template>
