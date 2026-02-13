<script setup lang="ts">
import { TabsContent, TabsIndicator, TabsList, TabsRoot, TabsTrigger } from 'radix-vue'
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <h1 class="font-black text-4xl text-green-800 mb-2">Perfil</h1>
    <p class="text-lg text-gray-600 mb-8">Administra tu cuenta y seguridad</p>

    <TabsRoot
      class="flex flex-col w-full border border-gray-300 rounded-lg shadow-md"
      default-value="tab1"
    >
      <TabsList
        class="relative shrink-0 flex border-b border-gray-300 bg-gray-50"
        aria-label="Manage your account"
      >
        <TabsIndicator class="absolute px-8 left-0 h-0.75 bottom-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full transition-[width,transform] duration-300">
          <div class="bg-blue-600 w-full h-full" />
        </TabsIndicator>
        <TabsTrigger
          class="bg-gray-50 px-6 py-3 flex-1 flex items-center justify-center text-[15px] font-semibold leading-none text-gray-600 select-none rounded-tl-lg hover:text-blue-600 hover:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 outline-none cursor-default focus-visible:relative focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-blue-500 transition-colors duration-200"
          value="tab1"
        >
          Mi cuenta
        </TabsTrigger>
        <TabsTrigger
          class="bg-gray-50 px-6 py-3 flex-1 flex items-center justify-center text-[15px] font-semibold leading-none text-gray-600 select-none rounded-tr-lg hover:text-blue-600 hover:bg-blue-50 data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 outline-none cursor-default focus-visible:relative focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-blue-500 transition-colors duration-200"
          value="tab2"
        >
          Cambiar Contraseña
        </TabsTrigger>
      </TabsList>
      <TabsContent
        class="grow p-6 bg-white rounded-b-lg outline-none focus:shadow-[0_0_0_2px] focus:shadow-blue-500"
        value="tab1"
      >
        <p class="mb-6 text-gray-700 text-[15px] leading-relaxed">
          Actualiza tu información personal. Los cambios se guardarán inmediatamente.
        </p>
        <AppProfileUpdateProfileForm/>
      </TabsContent>
      <TabsContent
        class="grow p-6 bg-white rounded-b-lg outline-none focus:shadow-[0_0_0_2px] focus:shadow-blue-500"
        value="tab2"
      >
        <p class="mb-6 text-gray-700 text-[15px] leading-relaxed">
          Cambia tu contraseña. Después de guardar, tendrás que iniciar sesión nuevamente.
        </p>
        <AppProfileUpdatePasswordForm/>
      </TabsContent>
    </TabsRoot>
  </div>
</template>