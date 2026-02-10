<script setup lang="ts">
interface Props {
  closeModal: () => void;
}

defineProps<Props>();

const route = useRoute();
const expenseId = computed(() => route.query.editExpenseId as string);

// Aquí cargarías los datos del gasto
const formData = reactive({
  name: 'Gasto a editar',
  amount: 100,
});

const onSubmit = async () => {
  console.log('Editar gasto:', expenseId.value, formData);
  // closeModal();
};
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Editar Gasto</h2>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-bold mb-2">Nombre</label>
        <input
          v-model="formData.name"
          type="text"
          class="w-full p-3 border border-gray-200 rounded"
        />
      </div>
      <div>
        <label class="block text-sm font-bold mb-2">Cantidad</label>
        <input
          v-model.number="formData.amount"
          type="number"
          class="w-full p-3 border border-gray-200 rounded"
        />
      </div>
      <div class="flex gap-2">
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Actualizar
        </button>
        <button
          type="button"
          @click="closeModal"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>