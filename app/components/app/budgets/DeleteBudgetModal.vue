<script setup lang="ts">
import { ref } from "vue";
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
const refreshBudgets = inject<() => Promise<void>>("refreshBudgets");
const password = ref("");
const loading = ref(false);

const onSubmit = async () => {
  try {
    loading.value = true;
    const checkPassword = await $fetch("/api/user/check-password", {
      method: "POST",
      body: { password: password.value },
    });

    if (!checkPassword.success) {
      toast.error({ message: "Contraseña incorrecta" });
      return;
    }

    const res = await $fetch(`/api/budgets/${budgetId.value}`, {
      method: "DELETE",
    });

    if (refreshBudgets) await refreshBudgets();

    if (res && res.message) {
      toast.success({ message: res.message });
    }
    props.closeModal();
  } catch (error) {
    handleErrors(toast, error, "Hubo un error al eliminar el presupuesto");
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
        Eliminar Presupuesto
      </h2>
      <p class="text-gray-400 font-medium max-w-sm mx-auto">
        ¿Estás seguro de que deseas eliminar este presupuesto por completo? Esta
        acción es <strong class="text-red-400">permanente</strong>.
      </p>
    </div>

    <form
      @submit.prevent="onSubmit"
      class="space-y-6 pt-4 border-t border-gray-800"
    >
      <div class="space-y-2 text-left">
        <label class="block text-sm font-semibold text-gray-300"
          >Confirma con tu contraseña</label
        >
        <UInput
          v-model="password"
          type="password"
          size="lg"
          placeholder="••••••••"
          color="primary"
          variant="outline"
          icon="i-heroicons-lock-closed-20-solid"
        />
      </div>

      <div class="flex flex-col sm:flex-row gap-3 pt-2">
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
          color="error"
          variant="solid"
          size="xl"
          class="flex-1 justify-center"
          :label="loading ? 'Eliminando...' : 'Sí, Eliminar'"
        />
      </div>
    </form>
  </div>
</template>
