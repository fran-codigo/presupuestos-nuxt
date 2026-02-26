<script setup lang="ts">
interface Props {
  closeModal: () => void;
}

const props = defineProps<Props>();
const refreshBudget = inject<() => Promise<void>>("refreshBudget");

const route = useRoute();
const budgetId = route.params.id;
const expenseId = computed(() => route.query.deleteExpenseId as string);

const loading = ref(false);

const onDelete = async () => {
  try {
    loading.value = true;
    const res = await $fetch(
      `/api/budgets/${budgetId}/expenses/${expenseId.value}`,
      {
        method: "DELETE",
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
    toast.error({ message: "Hubo un error al eliminar el gasto" });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="text-center">
      <div
        class="inline-flex justify-center items-center w-16 h-16 rounded-full bg-red-500/10 mb-4 ring-2 ring-red-500/20"
      >
        <UIcon
          name="i-heroicons-exclamation-triangle-20-solid"
          class="w-8 h-8 text-red-500"
        />
      </div>
      <h2 class="text-3xl font-black text-white tracking-tight mb-2">
        Eliminar Gasto
      </h2>
      <p class="text-gray-400 font-medium max-w-sm mx-auto">
        ¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede
        deshacer.
      </p>
    </div>

    <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-800">
      <UButton
        type="button"
        color="neutral"
        variant="soft"
        size="xl"
        class="flex-1 justify-center"
        label="Cancelar"
        @click="closeModal"
      />
      <UButton
        type="button"
        :loading="loading"
        color="error"
        variant="solid"
        size="xl"
        class="flex-1 justify-center"
        :label="loading ? 'Eliminando...' : 'Sí, Eliminar'"
        @click="onDelete"
      />
    </div>
  </div>
</template>
