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
  <div class="">
    <div
      className="flex flex-col-reverse md:flex-row md:justify-between items-center"
    >
      <div className="w-full md:w-auto">
        <h1 className="font-black text-4xl text-green-800 my-5">
          Nuevo Presupuesto
        </h1>
        <p className="text-xl font-bold">
          Llena el formulario y crea un nuevo
          <span className="text-blue-500">presupuesto</span>
        </p>
      </div>
      <NuxtLink
        href="/app/presupuestos"
        className="bg-blue-500 p-2 rounded-lg text-white font-bold w-full md:w-auto text-center"
      >
        Volver
      </NuxtLink>
    </div>

    <div className="p-10 mt-10 shadow-lg">
      <form @submit.prevent="onSubmit" className="mt-10 space-y-3" noValidate>
        <div className="space-y-3">
          <label htmlFor="name" className="text-sm uppercase font-bold">
            Nombre Presupuesto
          </label>
          <input
            id="name"
            className="w-full p-3  border border-gray-100 bg-slate-100"
            type="text"
            placeholder="Nombre del Presupuesto"
            name="name"
            v-model="formData.name"
          />
        </div>
        <div className="space-y-3">
          <label htmlFor="amount" className="text-sm uppercase font-bold">
            Cantidad Presupuesto
          </label>
          <input
            type="number"
            id="amount"
            className="w-full p-3  border border-gray-100 bg-slate-100"
            placeholder="Cantidad Presupuesto"
            name="amount"
            v-model="formData.amount"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          className="bg-blue-500 w-full p-3 text-white uppercase font-bold hover:bg-blue-600 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Crear Presupuesto
        </button>
      </form>
    </div>
  </div>
</template>
