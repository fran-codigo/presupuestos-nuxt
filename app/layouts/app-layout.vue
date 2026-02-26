<script setup lang="ts"></script>

<template>
  <div
    class="min-h-screen bg-gray-950 text-gray-200 font-sans selection:bg-primary-500/30"
  >
    <header
      class="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <NuxtLink
            to="/app"
            class="text-white text-3xl font-black tracking-tight hover:text-primary-400 transition-colors"
          >
            Finio<span class="text-primary-500">.</span>
          </NuxtLink>
        </div>

        <AppMenu />
      </div>
    </header>

    <main
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-160px)]"
    >
      <slot />
    </main>

    <footer
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-800"
    >
      <p class="text-center text-sm text-gray-500">
        &copy; {{ new Date().getFullYear() }} Finio. Todos los derechos
        reservados.
      </p>
    </footer>
  </div>
</template>
