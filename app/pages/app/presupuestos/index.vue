<script setup lang="ts"></script>

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

    <!-- {budgets.length ? (
        <>
          <ul
            role="list"
            class="divide-y divide-gray-300 border shadow-lg mt-10 "
          >
            {budgets.map((budget) => (
              <li key={budget.id} class="flex justify-between gap-x-6 p-5 ">
                <div class="flex min-w-0 gap-x-4">
                  <div class="min-w-0 flex-auto space-y-2">
                    <p class="text-sm font-semibold leading-6 text-gray-900">
                      <Link
                        href={`/admin/budgets/${budget.id}`}
                        class="cursor-pointer hover:underline text-2xl font-bold"
                      >
                        {budget.name}
                      </Link>
                    </p>
                    <p class="text-xl font-bold text-amber-500">
                      {formatCurrency(+budget.amount)}
                    </p>
                    <p class="text-gray-500  text-sm">
                      Última actualización {formatDate(budget.updatedAt)}
                    </p>
                  </div>
                </div>
                <div class="flex shrink-0 items-center gap-x-6">
                  <BudgetMenu budgetId={budget.id} />
                </div>
              </li>
            ))}
          </ul>
          <DeleteBudgetModal />
        </>
      ) : (
        <p class="text-center py-20">
          No hay presupuestos aún{" "}
          <Link
            href={"/admin/budgets/new"}
            class="text-purple-950 font-bold"
          >
            comienza creando uno
          </Link>
        </p>
      )} -->
  </div>
</template>
