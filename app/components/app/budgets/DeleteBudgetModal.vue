<script setup lang="ts">
import { ref } from 'vue';
import { DialogTitle } from 'radix-vue';
const { handleErrors } = useHandleErrors();
const toast = useToast();
const route = useRoute();
const budgetId = computed(() => {
  const id = route.query.deleteBudget;
  return id ? Number(id) : null;
});

interface Props {
  closeModal: () => void;
}
const props = defineProps<Props>();
const refreshBudgets = inject<() => Promise<void>>('refreshBudgets');
const password = ref('');

const onSubmit = async () => {
  try {
    const checkPassword = await $fetch('/api/user/check-password', {
      method: 'POST',
      body: { password: password.value },
    });

    if (!checkPassword.success) {
      toast.error({ message: 'Contraseña incorrecta' });
      return;
    }

    const res = await $fetch(`/api/budgets/${budgetId.value}`, {
      method: 'DELETE',
    });

    if (refreshBudgets) await refreshBudgets();

    if (res && res.message) {
      toast.success({ message: res.message });
    }
    props.closeModal();
  } catch (error) {
    handleErrors(toast, error, 'Hubo un error al eliminar el presupuesto');
  }
};
</script>

<template>
  <div>
    <div class="relative bg-white rounded-lg shadow-lg w-full p-6 z-10">
      <DialogTitle
        as="h3"
        class="font-black text-4xl text-green-800 my-5"
      >
        Eliminar Presupuesto
      </DialogTitle>

      <p class="text-xl font-bold">
        Confirma para eliminar,
        <span class="text-blue-500"> el presupuesto</span>
      </p>
      <p class="text-gray-600 text-sm">
        (Un presupuesto eliminado no se puede recuperar)
      </p>

      <div class="space-y-4 mt-6">
        <div>
          <label class="block text-sm font-medium mb-1">Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-200"
            placeholder="Tu contraseña"
          />
        </div>

        <div class="grid grid-cols-2 gap-5 mt-6">
          <button
            @click="props.closeModal"
            class="bg-blue-500 w-full p-3 text-white uppercase font-bold hover:bg-blue-600 cursor-pointer transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            @click="onSubmit"
            class="bg-red-500 w-full p-3 text-white uppercase font-bold hover:bg-red-600 cursor-pointer transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
