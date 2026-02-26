<script setup lang="ts">
import { shallowRef } from 'vue';

const items = [
  {
    label: 'Mi cuenta',
    icon: 'i-heroicons-user-circle',
    slot: 'account',
  },
  {
    label: 'Seguridad',
    icon: 'i-heroicons-lock-closed',
    slot: 'security',
  },
];
</script>

<template>
  <div class="space-y-12">
    <div>
      <div class="inline-flex items-baseline gap-3">
        <h1 class="text-4xl md:text-5xl font-black text-white tracking-tighter">
          Perfil
        </h1>
        <div
          class="h-1 w-12 bg-linear-to-r from-primary-500 to-transparent rounded-full"
        />
      </div>
      <p class="text-gray-400 font-medium mt-2">
        Administra tu cuenta y seguridad de acceso
      </p>
    </div>

    <UCard class="w-2/3">
      <UTabs
        :items="items"
        class="w-full"
      >
        <template #account>
          <div class="mt-6 space-y-6">
            <div>
              <h3 class="text-lg font-bold text-white mb-1">
                Actualiza tu información
              </h3>
              <p class="text-sm text-gray-400">
                Los cambios en tu cuenta se guardarán de forma inmediata y se
                reflejarán en toda la plataforma.
              </p>
            </div>
            <AppProfileUpdateProfileForm />
          </div>
        </template>

        <template #security>
          <div class="mt-6 space-y-6">
            <div>
              <h3 class="text-lg font-bold text-white mb-1">
                Cambia tu contraseña
              </h3>
              <p class="text-sm text-gray-400">
                Asegura tu cuenta cambiando tu contraseña regularmente. Después
                de actualizarla, tendrás que volver a iniciar sesión.
              </p>
            </div>
            <AppProfileUpdatePasswordForm />
          </div>
        </template>
      </UTabs>
    </UCard>
  </div>
</template>
