<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  budgetId: number;
}>();

const route = useRoute();
const router = useRouter();

const openDeleteBudgetModal = () => {
  router.push({
    query: {
      ...route.query,
      showModal: "true",
      deleteBudget: props.budgetId.toString(),
    },
  });
};

const items = computed(() => [
  [
    {
      label: "Ver presupuesto",
      icon: "i-heroicons-eye-20-solid",
      to: `/app/presupuestos/${props.budgetId}`,
    },
    {
      label: "Editar presupuesto",
      icon: "i-heroicons-pencil-square-20-solid",
      to: `/app/presupuestos/${props.budgetId}/editar`,
    },
    {
      label: "Eliminar presupuesto",
      icon: "i-heroicons-trash-20-solid",
      color: "error",
      onSelect: openDeleteBudgetModal,
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
