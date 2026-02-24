<script setup lang="ts">
const { handleErrors } = useHandleErrors();
const toast = useToast();

const formData = reactive({
  name: "",
  amount: 0,
});
const loading = ref(false);

const onSubmit = async () => {
  try {
    loading.value = true;

    const res = await $fetch("/api/budgets", {
      method: "POST",
      body: formData,
    });

    if (res && res.message) {
      toast.success({ message: res.message });
    }

    formData.name = "";
    formData.amount = 0;

    await navigateTo("/app/presupuestos");
  } catch (error) {
    handleErrors(toast, error, "Hubo un error al crear el presupuesto");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="space-y-8 max-w-3xl mx-auto">
    <!-- Header Section -->
    <div
      class="flex flex-col-reverse md:flex-row md:justify-between md:items-start gap-6"
    >
      <div class="flex-1">
        <div class="inline-flex items-baseline gap-3">
          <h1
            class="text-4xl md:text-5xl font-black text-white tracking-tighter"
          >
            Nuevo Presupuesto
          </h1>
          <div
            class="h-1 w-12 bg-linear-to-r from-primary-500 to-transparent rounded-full"
          />
        </div>
        <p class="text-lg text-gray-400 mt-4 leading-relaxed font-medium">
          Llena el formulario para crear un nuevo
          <span class="text-primary-400 font-semibold">presupuesto</span>
        </p>
      </div>

      <NuxtLink
        to="/app/presupuestos"
        class="inline-flex transform transition-transform hover:scale-105"
      >
        <UButton
          icon="i-heroicons-arrow-left-20-solid"
          size="lg"
          color="neutral"
          variant="soft"
          label="Volver"
        />
      </NuxtLink>
    </div>

    <UCard variant="soft" class="bg-gray-900/50 border-gray-800 mt-8">
      <form @submit.prevent="onSubmit" class="space-y-6" novalidate>
        <div class="space-y-2">
          <label for="name" class="text-sm font-semibold text-gray-300">
            Nombre del Presupuesto
          </label>
          <UInput
            id="name"
            v-model="formData.name"
            placeholder="Ej. Compras del mes"
            size="lg"
            color="primary"
            variant="outline"
          />
        </div>

        <div class="space-y-2">
          <label for="amount" class="text-sm font-semibold text-gray-300">
            Cantidad Inicial
          </label>
          <UInput
            id="amount"
            v-model="formData.amount"
            type="number"
            placeholder="0"
            size="lg"
            color="primary"
            variant="outline"
            icon="i-heroicons-currency-dollar"
          />
        </div>

        <div class="pt-4">
          <UButton
            type="submit"
            :loading="loading"
            class="w-full justify-center"
            size="xl"
            color="primary"
            label="Crear Presupuesto"
          />
        </div>
      </form>
    </UCard>
  </div>
</template>
