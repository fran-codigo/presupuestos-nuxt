<script setup lang="ts">
definePageMeta({
  layout: 'notes-layout',
  middleware: 'auth'
})
</script>

<template>
  <div class="">
    <UApp>
      <NuxtPage />
    </UApp>
  </div>
</template>