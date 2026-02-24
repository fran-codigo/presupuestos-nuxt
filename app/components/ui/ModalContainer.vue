<script setup lang="ts">
import { computed, ref, watch } from "vue";
import AddExpenseForm from "../app/expenses/AddExpenseForm.vue";
import EditExpenseForm from "../app/expenses/EditExpenseForm.vue";
import DeleteExpenseForm from "../app/expenses/DeleteExpenseForm.vue";
import DeleteBudgetModal from "../app/budgets/DeleteBudgetModal.vue";

const route = useRoute();
const router = useRouter();

// Mapa de componentes
const componentsMap = {
  AddExpense: AddExpenseForm,
  EditExpense: EditExpenseForm,
  DeleteExpense: DeleteExpenseForm,
  DeleteBudget: DeleteBudgetModal,
} as const;

// Determinar si el modal debe mostrarse
const show = computed({
  get: () => route.query.showModal === "true",
  set: (val) => {
    if (!val) closeModal();
  },
});

// Determinar qué componente renderizar basado en la ruta
const getComponentName = () => {
  if (route.query.addExpense) return "AddExpense";
  if (route.query.editExpenseId) return "EditExpense";
  if (route.query.deleteExpenseId) return "DeleteExpense";
  if (route.query.deleteBudget) return "DeleteBudget";
  return null;
};

// Mantener el componente activo para la animación de salida
const activeComponent = ref(getComponentName());
watch(
  () => route.query.showModal,
  (val) => {
    if (val === "true") {
      activeComponent.value = getComponentName();
    }
  },
  { immediate: true },
);

const ComponentToRender = computed(() => {
  const name = activeComponent.value;
  return name ? componentsMap[name] : null;
});

// Función para cerrar el modal
const closeModal = () => {
  const query = { ...route.query };

  // Eliminar todos los parámetros relacionados con el modal
  delete query.showModal;
  delete query.addExpense;
  delete query.editExpenseId;
  delete query.deleteExpenseId;
  delete query.deleteBudget;

  router.replace({
    path: route.path,
    query,
  });
};
</script>

<template>
  <UModal v-model:open="show">
    <template #content>
      <UCard>
        <component
          v-if="ComponentToRender"
          :is="ComponentToRender"
          :close-modal="closeModal"
        />
      </UCard>
    </template>
  </UModal>
</template>
