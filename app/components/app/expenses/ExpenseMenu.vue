<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  expenseId: number;
}>();

const route = useRoute();
const router = useRouter();

const openEditExpenseModal = () => {
  router.push({
    query: {
      ...route.query,
      showModal: "true",
      editExpenseId: props.expenseId.toString(),
    },
  });
};

const openDeleteExpenseModal = () => {
  router.push({
    query: {
      ...route.query,
      showModal: "true",
      deleteExpenseId: props.expenseId.toString(),
    },
  });
};

const items = computed(() => [
  [
    {
      label: "Editar gasto",
      icon: "i-heroicons-pencil-square-20-solid",
      onSelect: openEditExpenseModal,
    },
    {
      label: "Eliminar gasto",
      icon: "i-heroicons-trash-20-solid",
      color: "error",
      onSelect: openDeleteExpenseModal,
    },
  ],
]);
</script>

<template>
  <UDropdownMenu :items="items" :ui="{ content: 'w-48' }">
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-heroicons-ellipsis-vertical-20-solid"
      class="text-gray-400 hover:text-white transition-colors"
      aria-label="Abrir opciones"
    />
  </UDropdownMenu>
</template>
