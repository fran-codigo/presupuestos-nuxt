<script setup lang="ts">
const { data: budgets, refresh, pending } = await useFetch("/api/budgets");

provide("refreshBudgets", refresh);
</script>

<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div
      class="flex flex-col-reverse md:flex-row md:justify-between md:items-start gap-6"
    >
      <div class="flex-1">
        <div class="inline-flex items-baseline gap-3">
          <h1 class="text-5xl font-black text-white tracking-tighter">
            Mis Presupuestos
          </h1>
          <div
            class="h-1 w-12 bg-linear-to-r from-primary-500 to-transparent rounded-full"
          />
        </div>
        <p
          class="text-lg text-gray-500 mt-4 leading-relaxed max-w-lg font-medium"
        >
          Maneja y administra todos tus
          <span class="text-primary-400 font-semibold">presupuestos</span>
          fácilmente
        </p>
      </div>

      <NuxtLink
        to="/app/presupuestos/crear"
        class="inline-flex transform transition-transform hover:scale-105"
      >
        <UButton
          icon="i-heroicons-plus-20-solid"
          size="xl"
          color="primary"
          variant="soft"
          label="Nuevo Presupuesto"
        />
      </NuxtLink>
    </div>

    <!-- Skeletons while loading -->
    <div
      v-if="pending"
      class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      <USkeleton v-for="i in 6" :key="i" class="h-40 rounded-lg" />
    </div>

    <!-- Presupuestos Grid -->
    <div
      v-else-if="budgets && budgets.length > 0"
      class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max"
    >
      <div v-for="budget in budgets" :key="budget.id" class="group h-full">
        <UCard
          class="h-full cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-l-4 border-l-primary-500/80 hover:border-l-primary-400 bg-gray-900/50"
          variant="soft"
          @click="navigateTo(`/app/presupuestos/${budget.id}`)"
        >
          <template #header>
            <div class="flex items-start justify-between gap-3 pb-2">
              <h3
                class="text-xl font-bold text-white line-clamp-1 flex-1 group-hover:text-primary-300 transition-colors duration-300"
              >
                {{ budget.name }}
              </h3>
              <div class="flex items-center gap-2" @click.stop>
                <AppBudgetsBudgetMenu
                  :budget-id="budget.id"
                  @deleted="refresh"
                />
              </div>
            </div>
          </template>

          <p class="text-3xl font-black text-primary-400 mt-2">
            {{ formatCurrency(+budget.amount) }}
          </p>

          <template #footer>
            <div
              class="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-700/50"
            >
              <span class="flex items-center gap-1.5 font-medium">
                <UIcon
                  name="i-heroicons-banknotes-20-solid"
                  class="w-4 h-4 text-primary-400/60"
                />
                Presupuesto
              </span>
              <UIcon
                name="i-heroicons-arrow-right-20-solid"
                class="w-4 h-4 text-gray-500 group-hover:text-primary-400 transition-colors"
              />
            </div>
          </template>
        </UCard>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="py-24 text-center px-4">
      <div
        class="inline-block p-4 bg-primary-500/10 rounded-full mb-6 ring-2 ring-primary-500/20"
      >
        <UIcon
          name="i-heroicons-currency-dollar-20-solid"
          class="w-12 h-12 text-primary-400"
        />
      </div>
      <h3 class="text-2xl font-bold text-white mb-3">
        No tienes presupuestos aún
      </h3>
      <p class="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
        Comienza creando tu primer presupuesto para tomar el control de tus
        finanzas.
      </p>
      <NuxtLink
        to="/app/presupuestos/crear"
        class="inline-block transform transition-transform hover:scale-105"
      >
        <UButton
          size="lg"
          color="primary"
          variant="soft"
          icon="i-heroicons-plus-20-solid"
          label="Crear Presupuesto"
        />
      </NuxtLink>
    </div>

    <UiModalContainer />
  </div>
</template>
