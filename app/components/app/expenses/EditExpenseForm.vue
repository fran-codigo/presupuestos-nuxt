<script setup lang="ts">
import { DialogTitle } from 'radix-vue';
const { handleErrors } = useHandleErrors();

interface Props {
  closeModal: () => void;
}
const props = defineProps<Props>();

const toast = useToast();
const route = useRoute();
const budgetId = route.params.id;
const expenseId = computed(() => route.query.editExpenseId as string);
const loading = ref(false);
const refreshBudget = inject<() => Promise<void>>('refreshBudget');

const { data: expense } = await useFetch(
  `/api/budgets/${budgetId}/expenses/${expenseId.value}`,
);

const formData = reactive({
  name: expense.value?.name || '',
  amount: expense.value?.amount || 0,
});

const onSubmit = async () => {
  try {
    loading.value = true;
    const res = await $fetch(
      `/api/budgets/${budgetId}/expenses/${expenseId.value}`,
      {
        method: 'PUT',
        body: formData,
      },
    );

    if (refreshBudget) {
      await refreshBudget();
    }

    if (res && res.message) {
      toast.success({ message: res.message });
    }

    props.closeModal();
  } catch (error) {
    handleErrors(toast, error, 'Hubo un error al actualizar el gasto');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <DialogTitle class="text-2xl font-bold mb-4">Actualizar Gasto</DialogTitle>
    <form
      @submit.prevent="onSubmit"
      class="space-y-4"
    >
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
      <div class="flex flex-col gap-2">
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600"
        >
          {{ loading ? 'Actualizando...' : 'Actualizar Gasto' }}
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
