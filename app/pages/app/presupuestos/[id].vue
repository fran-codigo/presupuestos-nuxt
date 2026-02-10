<script setup lang="ts">
const route = useRoute();
const id = route.params.id;
const { data: budget } = await useFetch(`/api/budgets/${id}`);
</script>

<template>
  <div>
    <h1 class="font-black text-4xl text-green-800 my-5">
      Presupuesto: {{ budget?.name }}
    </h1>

    <p class="text-lg font-semibold">
      Monto:
      <span
        v-if="budget?.amount"
        class="text-green-600 font-bold"
        >{{ formatCurrency(+budget.amount) }}</span
      >
    </p>

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
          <!-- <ExpenseMenu expenseId="{expense.id}" /> -->
        </li>
      </ul>
      <p
        v-else
        class="text-gray-500"
      >
        No hay gastos registrados para este presupuesto.
      </p>
    </div>
  </div>
</template>
