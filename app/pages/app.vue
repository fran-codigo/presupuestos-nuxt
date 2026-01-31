<script setup lang="ts">
definePageMeta({
  layout: 'app-layout',
  middleware: 'auth'
})
</script>

<template>
  <div class="">
    <NuxtPage />
  </div>
</template>