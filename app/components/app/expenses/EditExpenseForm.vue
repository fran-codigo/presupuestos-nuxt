<script setup lang="ts">
import { ref, reactive, computed, inject, watch } from "vue";

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
const refreshBudget = inject<() => Promise<void>>("refreshBudget");

const formData = reactive({
  name: "",
  amount: 0,
});

const { data: expense, pending } = useFetch<any>(
  `/api/budgets/${budgetId}/expenses/${expenseId.value}`,
  {
    lazy: true,
    onResponseError() {
      props.closeModal();
    },
  },
);

watch(
  expense,
  (newVal) => {
    if (newVal) {
      formData.name = newVal.name;
      formData.amount = newVal.amount;
    }
  },
  { immediate: true },
);

const onSubmit = async () => {
  try {
    loading.value = true;
    const res = await $fetch(
      `/api/budgets/${budgetId}/expenses/${expenseId.value}`,
      {
        method: "PUT",
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
    props.closeModal();
    handleErrors(toast, error, "Hubo un error al actualizar el gasto");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6 relative min-h-[300px]">
    <!-- Loading Overlay -->
    <div
      v-if="pending"
      class="absolute inset-0 z-10 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center rounded-xl"
    >
      <UIcon
        name="i-heroicons-arrow-path-20-solid"
        class="w-10 h-10 text-primary-500 animate-spin"
      />
    </div>

    <div>
      <h2 class="text-3xl font-black text-white tracking-tight mb-2">
        Actualizar Gasto
      </h2>
      <p class="text-gray-400 font-medium">
        Modifica los detalles de este gasto
      </p>
    </div>

    <form @submit.prevent="onSubmit" class="space-y-6">
      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-300"
          >Nombre del gasto</label
        >
        <UInput
          v-model="formData.name"
          placeholder="Nombre del gasto"
          size="lg"
          color="primary"
          variant="outline"
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-300">Cantidad</label>
        <UInput
          v-model.number="formData.amount"
          type="number"
          placeholder="0"
          size="lg"
          color="primary"
          icon="i-heroicons-currency-dollar"
          variant="outline"
        />
      </div>

      <div
        class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800"
      >
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
          type="submit"
          :loading="loading"
          color="primary"
          variant="solid"
          size="xl"
          class="flex-1 justify-center"
          :label="loading ? 'Actualizando...' : 'Actualizar Gasto'"
        />
      </div>
    </form>
  </div>
</template>
