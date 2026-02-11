<script setup lang="ts">
import { DialogTitle } from 'radix-vue';

interface Props {
  closeModal: () => void;
}

const props = defineProps<Props>();
const refreshBudget = inject<() => Promise<void>>('refreshBudget');

const route = useRoute();
const budgetId = route.params.id;
const expenseId = computed(() => route.query.deleteExpenseId as string);

const onDelete = async () => {
  try {
    const res = await $fetch(
      `/api/budgets/${budgetId}/expenses/${expenseId.value}`,
      {
        method: 'DELETE',
      },
    );

    const toast = useToast();
    toast.success({ message: res.message });

    if (refreshBudget) {
      await refreshBudget();
    }

    props.closeModal();
  } catch (error) {
    const toast = useToast();
    toast.error({ message: 'Hubo un error al eliminar el gasto' });
  }
};
</script>

<template>
  <div>
    <DialogTitle as="h3" class="font-black text-4xl text-green-800 my-5">
      Eliminar Gasto
    </DialogTitle>
    
    <p class="text-xl font-bold">
      Confirma para eliminar, 
      <span class="text-blue-500">el gasto</span>
    </p>
    <p class="text-gray-600 text-sm">
      (Un gasto eliminado no se puede recuperar)
    </p>
    
    <div class="grid grid-cols-2 gap-5 mt-10">
      <button
        @click="props.closeModal"
        class="bg-blue-500 w-full p-3 text-white uppercase font-bold hover:bg-blue-600 cursor-pointer transition-colors"
      >
        Cancelar
      </button>
      <button
        type="button"
        @click="onDelete"
        class="bg-red-500 w-full p-3 text-white uppercase font-bold hover:bg-red-600 cursor-pointer transition-colors"
      >
        Eliminar
      </button>
    </div>
  </div>
</template>
