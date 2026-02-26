<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const id = route.params.id;
const {
  data: budget,
  error,
  refresh,
  pending,
} = await useFetch(`/api/budgets/${id}`);

if (error.value) {
  const toast = useToast();
  toast.error({ message: "Hubo un error al cargar el presupuesto" });
  await navigateTo("/app/presupuestos");
}

provide("refreshBudget", refresh);

const totalSpent = computed(() => {
  if (!budget.value?.expenses) return 0;
  return budget.value.expenses.reduce(
    (total, expense) => +expense.amount + total,
    0,
  );
});
const totalAvailable = computed(() => {
  if (!budget.value?.amount) return 0;
  return +budget.value.amount - totalSpent.value;
});

const percentage = computed(() => {
  if (!budget.value?.amount || +budget.value.amount === 0) return 0;
  return +((totalSpent.value / +budget.value.amount) * 100).toFixed(2);
});

const progressColor = computed(() => {
  if (percentage.value <= 30) {
    return "#3b82f6"; // blue-500
  } else if (percentage.value <= 80) {
    return "#f59e0b"; // amber-500
  } else {
    return "#ef4444"; // red-500
  }
});

const openAddExpenseModal = () => {
  router.push({
    query: {
      ...route.query,
      showModal: "true",
      addExpense: "true",
    },
  });
};
</script>

<template>
  <div class="space-y-12">
    <!-- Header Section -->
    <div
      class="flex flex-col-reverse md:flex-row md:justify-between md:items-start gap-6"
    >
      <div class="flex-1">
        <div class="inline-flex items-baseline gap-3">
          <h1
            class="text-4xl md:text-5xl font-black text-white tracking-tighter"
          >
            {{ budget?.name || "Cargando Presupuesto..." }}
          </h1>
          <div
            class="h-1 w-12 bg-linear-to-r from-primary-500 to-transparent rounded-full"
          />
        </div>
      </div>

      <div class="flex flex-wrap gap-4">
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
        <UButton
          icon="i-heroicons-plus-20-solid"
          size="lg"
          color="primary"
          variant="solid"
          class="transform transition-transform hover:scale-105"
          label="Agregar Gasto"
          @click="openAddExpenseModal"
        />
      </div>
    </div>

    <div v-if="pending" class="flex justify-center py-20">
      <USkeleton class="w-[300px] h-[300px] rounded-full" />
    </div>

    <!-- Budget Overview Section -->
    <div
      v-else
      class="flex flex-col md:flex-row justify-center items-center gap-12 py-8"
    >
      <UiCirculeProgress
        v-if="budget?.amount && budget.expenses"
        :percent="percentage"
        :size="300"
        :borderWidth="30"
        :fill-color="progressColor"
        empty-color="#1f2937"
      />

      <div
        class="space-y-6 bg-gray-900/50 p-6 rounded-2xl border border-gray-800 min-w-[320px] shadow-2xl"
      >
        <div
          class="flex justify-between items-center pb-4 border-b border-gray-800"
        >
          <span class="text-gray-400 font-medium text-lg"
            >Presupuesto Inicial:</span
          >
          <span
            v-if="budget?.amount"
            class="text-2xl text-primary-400 font-bold tracking-tight"
          >
            {{ formatCurrency(+budget.amount) }}
          </span>
        </div>
        <div
          class="flex justify-between items-center pb-4 border-b border-gray-800"
        >
          <span class="text-gray-400 font-medium text-lg">Disponible:</span>
          <span
            v-if="budget?.amount"
            class="text-2xl font-bold tracking-tight text-white"
          >
            {{ formatCurrency(totalAvailable) }}
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-gray-400 font-medium text-lg">Gastado:</span>
          <span
            v-if="budget?.amount"
            class="text-2xl font-bold tracking-tight"
            :style="{ color: progressColor }"
          >
            {{ formatCurrency(totalSpent) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Expenses List Section -->
    <div class="space-y-6">
      <div class="inline-flex items-baseline gap-3">
        <h2 class="text-3xl font-black text-white tracking-tighter">
          Gastos registrados
        </h2>
        <div
          class="h-1 w-8 bg-linear-to-r from-blue-500 to-transparent rounded-full"
        />
      </div>

      <div
        v-if="budget?.expenses && budget.expenses.length > 0"
        class="flex flex-col gap-4"
      >
        <UCard
          v-for="expense in budget.expenses"
          :key="expense.id"
          variant="soft"
          class="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors"
        >
          <div
            class="flex flex-col sm:flex-row justify-between sm:items-center gap-4"
          >
            <div class="flex items-center gap-4">
              <div class="p-3 bg-gray-800/80 rounded-lg">
                <UIcon
                  name="i-heroicons-receipt-percent-20-solid"
                  class="w-6 h-6 text-gray-400"
                />
              </div>
              <div class="min-w-0">
                <p class="text-xl font-bold text-white truncate">
                  {{ expense.name }}
                </p>
                <p
                  v-if="expense.createdAt"
                  class="text-sm text-gray-500 font-medium mt-1"
                >
                  {{ new Date(expense.createdAt).toLocaleDateString("es-ES") }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-4 sm:gap-6 self-end sm:self-auto">
              <p
                class="text-2xl font-bold tracking-tight"
                :style="{ color: progressColor }"
              >
                {{ formatCurrency(+expense.amount) }}
              </p>
              <AppExpensesExpenseMenu :expenseId="expense.id" />
            </div>
          </div>
        </UCard>
      </div>

      <!-- Empty State -->
      <div
        v-else
        class="py-16 text-center border-2 border-dashed border-gray-800 rounded-2xl bg-gray-900/20"
      >
        <UIcon
          name="i-heroicons-document-currency-dollar-20-solid"
          class="w-12 h-12 text-gray-600 mb-4 mx-auto"
        />
        <h3 class="text-xl font-bold text-gray-200 mb-2">
          No tienes gastos aún
        </h3>
        <p class="text-gray-500">
          Aún no has registrado ningún gasto en este presupuesto. Agrega uno
          para visualizar el estado.
        </p>
      </div>
    </div>

    <UiModalContainer />
  </div>
</template>
