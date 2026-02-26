<script setup lang="ts">
interface Props {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'
  confirmLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  confirmLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  confirmColor: 'primary',
  confirmLoading: false,
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
  cancel: []
}>()

const onConfirm = () => emit('confirm')
const onCancel = () => {
  emit('cancel')
  emit('update:open', false)
}
</script>

<template>
  <UModal
    :open="open"
    :title="title"
    :description="description"
    @update:open="$emit('update:open', $event)"
  >
    <slot />

    <template #footer>
      <div class="flex justify-end gap-3 w-full px-3 py-2">
        <UButton
          color="neutral"
          variant="ghost"
          :label="cancelLabel"
          @click="onCancel"
        />
        <UButton
          :color="confirmColor"
          :label="confirmLabel"
          :loading="confirmLoading"
          @click="onConfirm"
        />
      </div>
    </template>
  </UModal>
</template>
