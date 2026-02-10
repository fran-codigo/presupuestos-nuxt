<script setup lang="ts">
const { data: budgets, refresh } = await useFetch('/api/budgets');
</script>

<template>
  <div>
    <div
      class="flex flex-col-reverse md:flex-row md:justify-between items-center"
    >
      <div class="w-full md:w-auto">
        <h1 class="font-black text-4xl text-green-800 my-5">
          Mis Presupuestos
        </h1>
        <p class="text-xl font-bold">
          Maneja y administra tus
          <span class="text-blue-500">presupuestos</span>
        </p>
      </div>

      <div class="mb-5">
        <NuxtLink
          href="/app/presupuestos/crear"
          class="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          + Nuevo Presupuesto
        </NuxtLink>
      </div>
    </div>

    <ul
      v-if="budgets && budgets.length > 0"
      role="list"
      class="divide-y divide-gray-300 border shadow-lg mt-10"
    >
      <li
        v-for="budget in budgets"
        :key="budget.id"
        class="flex justify-between gap-x-6 p-5"
      >
        <div class="flex min-w-0 gap-x-4">
          <div class="min-w-0 flex-auto space-y-2">
            <p class="text-sm font-semibold leading-6 text-gray-900">
              <NuxtLink
                :href="`/app/presupuestos/${budget.id}`"
                class="cursor-pointer hover:underline text-2xl font-bold"
              >
                {{ budget.name }}
              </NuxtLink>
            </p>
            <p class="text-xl font-bold text-blue-500">
              {{ formatCurrency(+budget.amount) }}
            </p>
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-x-6">
          <AppBudgetsBudgetMenu
            :budget-id="budget.id"
            @deleted="refresh"
          />
        </div>
      </li>
    </ul>

    <p
      v-else
      class="text-center py-20"
    >
      No tienes presupuestos aún
      <NuxtLink
        href="/app/presupuestos/crear"
        class="text-blue-600 font-bold hover:underline"
      >
        comienza creando uno
      </NuxtLink>
    </p>
  </div>
</template>
