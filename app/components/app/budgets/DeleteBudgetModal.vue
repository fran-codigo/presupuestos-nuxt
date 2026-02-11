<script setup lang="ts">
import { ref } from 'vue';
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
    <div
      class="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6 z-10"
    >
      <h3 class="text-2xl font-bold mb-2">Eliminar Presupuesto</h3>
      <p class="text-sm text-gray-600 mb-4">
        Para confirmar la eliminación, ingresa tu contraseña.
      </p>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Contraseña</label>
          <input
            v-model="password"
            type="password"
            class="w-full p-3 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-200"
            placeholder="Tu contraseña"
          />
        </div>

        <div class="flex gap-3 justify-end mt-4">
          <button
            type="button"
            @click="closeModal"
            class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>

          <button
            type="button"
            class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-60"
            @click="onSubmit"
          >
            Confirmar Eliminación
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
