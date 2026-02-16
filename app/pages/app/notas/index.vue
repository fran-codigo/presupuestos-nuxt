<script setup lang="ts">
const { data: notes, refresh, pending } = await useFetch("/api/notes");

const toast = useToast();

const toggling = reactive<Record<number, boolean>>({});
const toggleDialogOpen = ref(false);
const noteToToggle = ref<any | null>(null);

const openToggleDialog = (note: any, event?: Event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  noteToToggle.value = note;
  toggleDialogOpen.value = true;
};

const confirmToggleStatus = async () => {
  if (!noteToToggle.value) return;
  const note = noteToToggle.value;
  try {
    toggling[note.id] = true;
    const newStatus = note.status === "active" ? "archived" : "active";
    await $fetch(`/api/notes/${note.id}/update-status`, {
      method: "PUT",
      body: { status: newStatus },
    });
    toggleDialogOpen.value = false;
    noteToToggle.value = null;
    await refresh();
    toast.success({
      message: `Nota ${newStatus === "active" ? "activada" : "archivada"} correctamente`,
    });
  } catch (err) {
    toast.error({
      message: "No se pudo cambiar el estado de la nota",
    });
    console.error("Error updating note status", err);
  } finally {
    toggling[note.id] = false;
  }
};

const onModalClose = () => {
  noteToToggle.value = null;
};

provide("refreshNotes", refresh);
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
            Mis Notas
          </h1>
          <div
            class="h-1 w-12 bg-linear-to-r from-primary-500 to-transparent rounded-full"
          />
        </div>
        <p
          class="text-lg text-gray-500 mt-4 leading-relaxed max-w-lg font-medium"
        >
          Organiza, crea y gestiona todas tus
          <span class="text-primary-400 font-semibold">notas personales</span>
          en un solo lugar
        </p>
      </div>

      <NuxtLink
        to="/app/notas/crear"
        class="inline-flex transform transition-transform hover:scale-105"
      >
        <UButton
          icon="i-heroicons-plus-20-solid"
          size="xl"
          color="primary"
          variant="soft"
          label="Nueva Nota"
        />
      </NuxtLink>
    </div>

    <!-- Notas Grid -->
    <div
      v-if="pending"
      class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    >
      <USkeleton v-for="i in 6" :key="i" class="h-40 rounded-lg" />
    </div>

    <div
      v-else-if="notes && notes.length > 0"
      class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max"
    >
      <div v-for="note in notes" :key="note.id" class="group h-full">
        <NuxtLink :to="`/app/notas/${note.id}`" class="block h-full">
          <UCard
            class="h-full cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-l-4 border-l-primary-500/80 hover:border-l-primary-400"
            variant="soft"
          >
            <template #header>
              <div class="flex items-start justify-between gap-3 pb-2">
                <h3
                  class="text-lg font-bold text-white line-clamp-2 flex-1 group-hover:text-primary-300 transition-colors duration-300"
                >
                  {{ note.title }}
                </h3>
                <UBadge
                  :color="note.status === 'active' ? 'primary' : 'neutral'"
                  variant="subtle"
                  class="text-xs whitespace-nowrap cursor-pointer"
                  :class="{ 'opacity-60': toggling[note.id] }"
                  size="sm"
                  @click.stop.prevent="openToggleDialog(note, $event)"
                >
                  {{ note.status === "active" ? "✓ Activa" : "⊘ Archivada" }}
                </UBadge>
              </div>
            </template>

            <p
              v-if="note.description"
              class="text-gray-500 line-clamp-3 text-sm leading-relaxed font-medium"
            >
              {{ note.description }}
            </p>
            <p v-else class="text-gray-400/70 text-sm font-medium">
              Sin descripción
            </p>

            <template #footer>
              <div
                class="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-700/50"
              >
                <span class="flex items-center gap-1.5 font-medium">
                  <UIcon
                    name="i-heroicons-calendar-days-20-solid"
                    class="w-3.5 h-3.5 text-primary-400/60"
                  />
                  {{ new Date(note.createdAt).toLocaleDateString("es-ES") }}
                </span>
                <UIcon
                  name="i-heroicons-chevron-right-20-solid"
                  class="w-4 h-4 group-hover:translate-x-2 transition-all text-gray-500 group-hover:text-primary-400"
                />
              </div>
            </template>
          </UCard>
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="py-24 text-center px-4">
      <div
        class="inline-block p-4 bg-primary-500/10 rounded-full mb-6 ring-2 ring-primary-500/20"
      >
        <UIcon
          name="i-heroicons-document-20-solid"
          class="w-12 h-12 text-primary-400"
        />
      </div>
      <h3 class="text-2xl font-bold text-white mb-3">No tienes notas aún</h3>
      <p class="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
        Comienza creando tu primera nota para organizar y gestionar tus ideas de
        forma segura
      </p>
      <NuxtLink
        to="/app/notas/crear"
        class="inline-block transform transition-transform hover:scale-105"
      >
        <UButton
          size="lg"
          color="primary"
          variant="soft"
          icon="i-heroicons-plus-20-solid"
          label="Crear Primera Nota"
        />
      </NuxtLink>
    </div>
  </div>

  <UiConfirmModal
    v-model:open="toggleDialogOpen"
    title="Cambiar estado"
    description="Confirma que deseas cambiar el estado de esta nota"
    :confirm-loading="!!(noteToToggle && toggling[noteToToggle.id])"
    @confirm="confirmToggleStatus"
    @cancel="onModalClose"
  />
</template>
