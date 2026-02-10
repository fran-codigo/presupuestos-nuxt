<script setup lang="ts">
interface Props {
  closeModal: () => void;
}

defineProps<Props>();

const formData = reactive({
  name: '',
  amount: 0,
});

const onSubmit = async () => {
  // Tu lógica para crear gasto
  console.log('Crear gasto:', formData);
  // closeModal();
};
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Agregar Gasto</h2>
    <form @submit.prevent="onSubmit" class="space-y-4">
      <div>
        <label class="block text-sm font-bold mb-2">Nombre</label>
        <input
          v-model="formData.name"
          type="text"
          class="w-full p-3 border border-gray-200 rounded"
          placeholder="Nombre del gasto"
        />
      </div>
      <div>
        <label class="block text-sm font-bold mb-2">Cantidad</label>
        <input
          v-model.number="formData.amount"
          type="number"
          class="w-full p-3 border border-gray-200 rounded"
          placeholder="Cantidad"
        />
      </div>
      <div class="flex gap-2">
        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Guardar
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