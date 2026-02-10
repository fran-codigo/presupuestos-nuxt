<script setup lang="ts">
const route = useRoute();
const id = route.params.id;
const { data: budget } = await useFetch(`/api/budgets/${id}`);
</script>

<template>
  <div>
    {{ budget?.name }}
  </div>
</template>