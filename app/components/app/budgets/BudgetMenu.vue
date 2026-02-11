<script setup lang="ts">
import { Icon } from '@iconify/vue';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'radix-vue';

defineProps<{
  budgetId: number;
}>();
const route = useRoute();
const router = useRouter();

const openDeleteBudgetModal = (budgetId: number) => {
  router.push({
    query: {
      ...route.query,
      showModal: 'true',
      deleteBudget: budgetId.toString(),
    },
  });
};
</script>

<template>
  <div>
    <DropdownMenuRoot>
      <DropdownMenuTrigger
        class="rounded-full w-8.75 h-8.75 inline-flex items-center justify-center text-gray-600 bg-white hover:bg-gray-100 outline-none focus:ring-2 focus:ring-gray-400"
        aria-label="Abrir opciones"
      >
        <Icon
          icon="radix-icons:dots-vertical"
          class="w-5 h-5"
        />
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent
          class="min-w-40 bg-white rounded-md shadow-lg py-1 z-50"
          :side-offset="5"
        >
          <DropdownMenuItem asChild>
            <NuxtLink
              :to="`/app/presupuestos/${budgetId}`"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Ver presupuesto
            </NuxtLink>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <NuxtLink
              :to="`/app/presupuestos/${budgetId}/editar`"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Editar Presupuesto
            </NuxtLink>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <button
              class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              @click.prevent="openDeleteBudgetModal(budgetId)"
            >
              Eliminar presupuesto
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  </div>
</template>
