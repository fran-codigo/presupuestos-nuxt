<template>
  <div class="lg:grid lg:grid-cols-2 lg:min-h-screen">
    <div class="flex justify-center bg-green-800 lg:bg-auth">
      <div class="w-96 p-10 lg:pd-20 flex place-content-center">
        <NuxtLink to="/" class="text-5xl font-bold text-white"> Presupuestos </NuxtLink>
      </div>
    </div>
    <div class="p-10 lg:py-28">
      <div class="max-w-3xl mx-auto"><slot /></div>
    </div>
  </div>
</template>
