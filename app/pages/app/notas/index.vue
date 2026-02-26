<script setup lang="ts">
import { useNote } from "~/composables/useNote";

const { data: notes, refresh, pending } = await useFetch("/api/notes");

const toast = useToast();
const { updateStatus, deleteNote } = useNote();

const route = useRoute();
const router = useRouter();

const toggling = reactive<Record<number, boolean>>({});
const toggleDialogOpen = ref(false);
const noteToToggle = ref<any | null>(null);

const deleting = reactive<Record<number, boolean>>({});
const deleteDialogOpen = ref(false);
const noteToDelete = ref<any | null>(null);

const detailsDialogOpen = ref(false);
const noteIdToView = ref<number | null>(null);

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
    await updateStatus(note.id, newStatus);
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

watch(
  () => detailsDialogOpen.value,
  async (open) => {
    if (open) return;
    await closeDetailsModal();
  },
);

const onModalClose = () => {
  noteToToggle.value = null;
};

const openDeleteDialog = (note: any, event?: Event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  noteToDelete.value = note;
  deleteDialogOpen.value = true;
};

const confirmDeleteNote = async () => {
  if (!noteToDelete.value) return;
  const note = noteToDelete.value;
  try {
    deleting[note.id] = true;
    const res = await deleteNote(note.id);
    if (res?.message) {
      toast.success({ message: res.message });
    }
    deleteDialogOpen.value = false;
    noteToDelete.value = null;
    await refresh();
  } catch (err) {
    toast.error({ message: "No se pudo eliminar la nota" });
    console.error("Error deleting note", err);
  } finally {
    deleting[note.id] = false;
  }
};

const onDeleteModalClose = () => {
  noteToDelete.value = null;
};

const openDetailsModal = (noteId: number, event?: Event) => {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  noteIdToView.value = noteId;
  detailsDialogOpen.value = true;
};

const closeDetailsModal = async () => {
  detailsDialogOpen.value = false;
  noteIdToView.value = null;

  if (route.query.noteId) {
    const query = { ...route.query };
    delete query.noteId;
    await router.replace({ path: route.path, query });
  }
};

watch(
  () => route.query.noteId,
  (noteId) => {
    if (!noteId) return;
    const parsed = Number(noteId);
    if (!Number.isFinite(parsed)) return;
    noteIdToView.value = parsed;
    detailsDialogOpen.value = true;
  },
  { immediate: true },
);

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
        <UCard
          class="h-full cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-l-4 border-l-primary-500/80 hover:border-l-primary-400"
          variant="soft"
          @click="openDetailsModal(note.id, $event)"
        >
          <template #header>
            <div class="flex items-start justify-between gap-3 pb-2">
              <h3
                class="text-lg font-bold text-white line-clamp-2 flex-1 group-hover:text-primary-300 transition-colors duration-300"
              >
                {{ note.title }}
              </h3>
              <div class="flex items-center gap-2">
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

                <UButton
                  color="secondary"
                  variant="ghost"
                  icon="i-heroicons-pencil-square-20-solid"
                  :to="`/app/notas/${note.id}/editar`"
                  @click.stop
                />

                <UButton
                  color="warning"
                  variant="ghost"
                  icon="i-heroicons-trash-20-solid"
                  :loading="deleting[note.id]"
                  @click.stop.prevent="openDeleteDialog(note, $event)"
                />
              </div>
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
                name="i-heroicons-eye-20-solid"
                class="w-4 h-4 text-gray-500 group-hover:text-primary-400"
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

  <NotesNoteDetailsModal
    v-model:open="detailsDialogOpen"
    :note-id="noteIdToView"
  />

  <UiConfirmModal
    v-model:open="deleteDialogOpen"
    title="Eliminar Nota"
    description="Esta acción no se puede deshacer."
    :confirm-loading="!!(noteToDelete && deleting[noteToDelete.id])"
    confirm-label="Sí, eliminar"
    confirm-color="warning"
    @confirm="confirmDeleteNote"
    @cancel="onDeleteModalClose"
  />
</template>
