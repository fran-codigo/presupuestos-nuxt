<script setup lang="ts">
import { useNote } from "~/composables/useNote";

interface Props {
  open: boolean;
  noteId: number | string | null;
}

interface NoteDetails {
  id: number;
  title: string;
  description: string | null;
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:open": [value: boolean];
  deleted: [];
}>();

const { handleErrors } = useHandleErrors();
const toast = useToast();
const { deleteNote } = useNote();

const refreshNotes = inject<() => Promise<void>>("refreshNotes");

const note = ref<NoteDetails | null>(null);
const pending = ref(false);
const loadError = ref<unknown>(null);

const modelOpen = computed({
  get: () => props.open,
  set: (value: boolean) => emit("update:open", value),
});

const loadNote = async () => {
  if (!props.noteId) return;
  try {
    pending.value = true;
    loadError.value = null;
    note.value = await $fetch<NoteDetails>(`/api/notes/${props.noteId}`);
  } catch (error) {
    handleErrors(toast, error, "Hubo un error al cargar la nota");
    loadError.value = error;
    note.value = null;
  } finally {
    pending.value = false;
  }
};

watch(
  () => [props.open, props.noteId],
  async ([open]) => {
    if (open && props.noteId) {
      await loadNote();
    }

    if (!open) {
      note.value = null;
      loadError.value = null;
    }
  },
  { immediate: true },
);

const statusLabel = computed(() => {
  return note.value?.status === "active" ? "Activa" : "Archivada";
});

const statusColor = computed(() => {
  return note.value?.status === "active" ? "primary" : "neutral";
});

const formattedCreatedDate = computed(() => {
  if (!note.value?.createdAt) return "";
  return new Date(note.value.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const formattedUpdatedDate = computed(() => {
  if (!note.value?.updatedAt) return "";
  return new Date(note.value.updatedAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const deleteLoading = ref(false);
const isDeleteDialogOpen = ref(false);

const onDelete = async () => {
  if (!props.noteId) return;
  try {
    deleteLoading.value = true;
    const res = await deleteNote(Number(props.noteId));

    if (res?.message) {
      toast.success({ message: res.message });
    }

    isDeleteDialogOpen.value = false;
    emit("update:open", false);

    if (refreshNotes) {
      await refreshNotes();
    }

    emit("deleted");
  } catch (error) {
    handleErrors(toast, error, "Hubo un error al eliminar la nota");
  } finally {
    deleteLoading.value = false;
  }
};

const close = () => emit("update:open", false);
</script>

<template>
  <UModal
    v-model:open="modelOpen"
    title="Detalle de nota"
    :transition="true"
    :overlay="true"
    :ui="{
      content: 'sm:max-w-3xl max-h-[90vh]',
    }"
  >
    <template #content>
      <div class="space-y-4">
        <div v-if="pending" class="space-y-4">
          <USkeleton class="h-8 w-2/3" />
          <USkeleton class="h-4 w-1/3" />
          <USkeleton class="h-32" />
        </div>

        <div v-else-if="loadError" class="space-y-3">
          <UAlert
            color="error"
            variant="soft"
            title="No se pudo cargar la nota"
            description="Intenta nuevamente."
          />

          <div class="flex justify-end">
            <UButton
              color="neutral"
              variant="soft"
              label="Reintentar"
              :loading="pending"
              @click="loadNote"
            />
          </div>
        </div>

        <UCard v-else-if="note" variant="soft">
          <template #header>
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <h3 class="text-lg font-bold text-white wrap-break-word">
                  {{ note.title }}
                </h3>

                <div
                  class="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400"
                >
                  <span>Creada: {{ formattedCreatedDate }}</span>
                  <span
                    v-if="note.updatedAt && note.updatedAt !== note.createdAt"
                  >
                    · Editada: {{ formattedUpdatedDate }}
                  </span>
                </div>
              </div>

              <UBadge
                :color="statusColor"
                variant="subtle"
                size="sm"
                class="whitespace-nowrap"
              >
                {{ statusLabel }}
              </UBadge>
            </div>
          </template>

          <div class="space-y-2 max-h-[72vh] overflow-y-auto pr-1">
            <p
              v-if="note.description"
              class="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed"
            >
              {{ note.description }}
            </p>
            <p v-else class="text-sm text-gray-400/70">Sin descripción</p>
          </div>
        </UCard>

        <UAlert
          v-else
          color="neutral"
          variant="soft"
          title="Selecciona una nota"
          description="Haz clic sobre una nota para ver sus detalles."
        />
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end w-full px-3 py-2">
        <UButton
          color="neutral"
          variant="ghost"
          label="Cerrar"
          @click="close"
        />
      </div>
    </template>
  </UModal>
</template>
