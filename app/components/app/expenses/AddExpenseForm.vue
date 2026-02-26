<script setup lang="ts">
const { handleErrors } = useHandleErrors();
const toast = useToast();
const route = useRoute();
const budgetId = route.params.id;
const loading = ref(false);
const formData = reactive({
  name: "",
  amount: 0,
});
const refreshBudget = inject<() => Promise<void>>("refreshBudget");

interface Props {
  closeModal: () => void;
}

const props = defineProps<Props>();

const onSubmit = async () => {
  try {
    loading.value = true;
    const res = await $fetch(`/api/budgets/${budgetId}/expenses`, {
      method: "POST",
      body: formData,
    });

    if (refreshBudget) {
      await refreshBudget();
    }

    if (res && res.message) {
      toast.success({ message: res.message });
    }
    formData.name = "";
    formData.amount = 0;
    props.closeModal();
  } catch (error) {
    handleErrors(toast, error, "Hubo un error al agregar el gasto");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-3xl font-black text-white tracking-tight mb-2">
        Agregar Gasto
      </h2>
      <p class="text-gray-400 font-medium">
        Llena el formulario para registrar un nuevo
        <span class="text-primary-400">gasto</span> en este presupuesto
      </p>
    </div>

    <form @submit.prevent="onSubmit" novalidate class="space-y-6">
      <div class="space-y-2">
        <label class="text-sm font-semibold text-gray-300"
          >Nombre del gasto</label
        >
        <UInput
          v-model="formData.name"
          placeholder="Ej. Cena con amigos"
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
          :label="loading ? 'Agregando...' : 'Agregar Gasto'"
        />
      </div>
    </form>
  </div>
</template>
