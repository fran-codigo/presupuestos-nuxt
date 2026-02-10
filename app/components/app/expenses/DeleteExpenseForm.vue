<script setup lang="ts">
interface Props {
  closeModal: () => void;
}

const props = defineProps<Props>();

const route = useRoute();
const expenseId = computed(() => route.query.deleteExpenseId as string);

const onDelete = async () => {
  console.log('Eliminar gasto:', expenseId.value);
  // Lógica para eliminar
  props.closeModal();
};
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4 text-red-600">Eliminar Gasto</h2>
    <p class="mb-6">¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer.</p>
    <div class="flex gap-2">
      <button
        @click="onDelete"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Eliminar
      </button>
      <button
        @click="closeModal"
        class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>