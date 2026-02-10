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
  expenseId: number;
}>();

const route = useRoute();
const router = useRouter();

const openEditExpenseModal = (expenseId: number) => {
  router.push({
    query: {
      ...route.query,
      showModal: 'true',
      editExpenseId: expenseId.toString(),
    },
  });
};

const openDeleteExpenseModal = (expenseId: number) => {
  router.push({
    query: {
      ...route.query,
      showModal: 'true',
      deleteExpenseId: expenseId.toString(),
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
            <button
              @click="openEditExpenseModal(expenseId)"
              class="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
            >
              Editar gasto
            </button>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <button
              @click="openDeleteExpenseModal(expenseId)"
              class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Eliminar gasto
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenuRoot>
  </div>
</template>
