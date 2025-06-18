<script setup lang="ts">
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

defineOptions({
  name: 'AppUiConfirmPopup',
})

const visible = defineModel<boolean>('visible', { type: Boolean })

const props = defineProps<{
  title?: string
  message?: string
  confirmLabel?: string
  confirmSeverity?: string
  cancelLabel?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
}>()
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :modal="true"
    :draggable="false"
    position="top"
    dismissableMask
    class="max-w-[350px]"
  >
    <template #header>
      <h3 class="text-lg font-medium">{{ props.title || 'Confirmation' }}</h3>
    </template>
    <p class="text-sm">{{ props.message || 'Are you sure you want to proceed?' }}</p>

    <template #footer>
      <Button
        data-test-id="cancelButton"
        :label="props.cancelLabel || 'Cancel'"
        @click="visible = false"
        severity="secondary"
        size="small"
      />
      <Button
        data-test-id="confirmButton"
        :label="props.confirmLabel || 'Confirm'"
        @click="emit('confirm')"
        :severity="props.confirmSeverity || 'primary'"
        size="small"
        :loading="props.loading"
      />
    </template>
  </Dialog>
</template>
