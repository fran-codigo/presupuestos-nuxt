<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const id = route.params.id;
const { data: budget } = await useFetch(`/api/budgets/${id}`);

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

const openAddExpenseModal = () => {
  router.push({
    query: {
      ...route.query,
      showModal: 'true',
      addExpense: 'true',
    },
  });
};
</script>

<template>
  <div>
    <div class="my-4 flex justify-between items-center">
      <h2 class="font-black text-4xl text-green-800 my-5">
        {{ budget?.name }}
      </h2>

      <button
        @click="openAddExpenseModal"
       class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        + Agregar gasto
      </button>
    </div>

    <div class="flex justify-center items-center gap-8">
      <UiCirculeProgress
        v-if="budget?.amount && budget.expenses"
        :percent="percentage"
        :size=300
        :borderWidth=30
        fill-color="#3b82f6"
        empty-color="#e1e1e1"
      />

      <div class="">
        <p class="text-lg font-semibold">
          Presupuesto:
          <span
            v-if="budget?.amount"
            class="text-green-600 font-bold"
            >{{ formatCurrency(+budget.amount) }}</span
          >
        </p>
        <p class="text-lg font-semibold">
          Disponible:
          <span
            v-if="budget?.amount"
            class="text-green-600 font-bold"
            >{{ formatCurrency(totalAvailable) }}</span
          >
        </p>
        <p class="text-lg font-semibold">
          Gastado:
          <span
            v-if="budget?.amount"
            class="text-green-600 font-bold"
            >{{ formatCurrency(totalSpent) }}</span
          >
        </p>
      </div>
    </div>

    <div>
      <h2 class="font-black text-4xl text-purple-950 mt-10">
        Gastos en este presupuesto
      </h2>
      <ul
        v-if="budget?.expenses && budget.expenses.length > 0"
        role="list"
        class="divide-y divide-gray-300 border shadow-lg mt-10"
      >
        <li
          v-for="expense in budget.expenses"
          :key="expense.id"
          class="flex justify-between gap-x-6 p-5"
        >
          <div class="flex min-w-0 gap-x-4">
            <div class="min-w-0 flex-auto space-y-2">
              <p class="text-2xl font-semibold text-gray-900">
                {{ expense.name }}
              </p>
              <p class="text-xl font-bold text-amber-500">
                {{ formatCurrency(+expense.amount) }}
              </p>
            </div>
          </div>
          <AppExpensesExpenseMenu :expenseId="expense.id" />
        </li>
      </ul>
      <p
        v-else
        class="text-gray-500"
      >
        No hay gastos registrados para este presupuesto.
      </p>
    </div>
    <UiModalContainer />
  </div>
</template>
