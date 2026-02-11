<script setup lang="ts">
import { DialogTitle } from 'radix-vue';
const { handleErrors } = useHandleErrors();
const toast = useToast();
const route = useRoute();
const budgetId = route.params.id;
const loading = ref(false);
const formData = reactive({
  name: '',
  amount: 0,
});
const refreshBudget = inject<() => Promise<void>>('refreshBudget');

interface Props {
  closeModal: () => void;
}

const props = defineProps<Props>();

const onSubmit = async () => {
  try {
    loading.value = true;
    const res = await $fetch(`/api/budgets/${budgetId}/expenses`, {
      method: 'POST',
      body: formData,
    });

    if (refreshBudget) {
      await refreshBudget();
    }

    if (res && res.message) {
      toast.success({ message: res.message });
    }
    formData.name = '';
    formData.amount = 0;
    props.closeModal();
  } catch (error) {
    handleErrors(toast, error, 'Hubo un error al agregar el gasto');
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <DialogTitle class="text-2xl font-bold mb-4">Agregar Gasto</DialogTitle>
    <p class="text-xl font-bold">
      Llena el formulario y crea un
      <span class="text-green-800">gasto</span>
    </p>
    <form
      @submit.prevent="onSubmit"
      noValidate
      class="bg-gray-100 shadow-lg rounded-lg p-10 mt-10 border"
    >
      <div class="mb-5">
        <label class="text-sm uppercase font-bold">Nombre</label>
        <input
          v-model="formData.name"
          type="text"
          class="w-full p-3 borderborder-gray-100 bg-white"
          placeholder="Nombre del gasto"
        />
      </div>
      <div class="mb-5">
        <label class="text-sm uppercase font-bold">Cantidad</label>
        <input
          v-model.number="formData.amount"
          type="number"
          class="w-full p-3 borderborder-gray-100 bg-white"
          placeholder="Cantidad"
        />
      </div>
      <div class="flex flex-col gap-2">
        <button
          type="submit"
          :disabled="loading"
          class="bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600"
        >
          {{ loading ? 'Agregando...' : 'Agregar Gasto' }}
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
