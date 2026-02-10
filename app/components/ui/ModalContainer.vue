<script setup lang="ts">
import {
  DialogTitle,
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
} from 'radix-vue';
import AddExpenseForm from '../app/expenses/AddExpenseForm.vue';
import EditExpenseForm from '../app/expenses/EditExpenseForm.vue';
import DeleteExpenseForm from '../app/expenses/DeleteExpenseForm.vue';

const route = useRoute();
const router = useRouter();

// Mapa de componentes
const componentsMap = {
  AddExpense: AddExpenseForm,
  EditExpense: EditExpenseForm,
  DeleteExpense: DeleteExpenseForm,
} as const;

// Determinar si el modal debe mostrarse
const show = computed(() => route.query.showModal === 'true');

// Determinar qué componente renderizar
const getComponentName = () => {
  if (route.query.addExpense) return 'AddExpense';
  if (route.query.editExpenseId) return 'EditExpense';
  if (route.query.deleteExpenseId) return 'DeleteExpense';
  return null;
};

const componentName = computed(() => getComponentName());
const ComponentToRender = computed(() => {
  const name = componentName.value;
  return name ? componentsMap[name] : null;
});

// Función para cerrar el modal
const closeModal = () => {
  const query = { ...route.query };

  // Eliminar todos los parámetros relacionados con el modal
  delete query.showModal;
  delete query.addExpense;
  delete query.editExpenseId;
  delete query.deleteExpenseId;

  router.replace({
    path: route.path,
    query,
  });
};
</script>

<template>
  <DialogRoot
    :open="show"
    @update:open="(value) => !value && closeModal()"
  >
    <DialogPortal>
      <!-- Overlay/Backdrop -->
      <DialogOverlay
        class="fixed inset-0 bg-black/60 z-40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />

      <!-- Contenido del modal -->
      <DialogContent
        class="fixed left-[50%] top-[50%] z-50 w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-16 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
      >
        <DialogTitle class="text-3xl font-bold mb-6">
        </DialogTitle>
        <component
          v-if="ComponentToRender"
          :is="ComponentToRender"
          :close-modal="closeModal"
        />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
