<template>
  <q-dialog v-model="localShow" @hide="handleClose">
    <q-card class="notifications-dialog" style="min-width: 400px; max-width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Notifications</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div v-if="notifications.length === 0" class="text-center q-pa-lg text-grey">
          No notifications
        </div>
        <div v-else class="q-gutter-sm">
          <q-item
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item q-pa-md"
          >
            <q-item-section>
              <q-item-label>{{ notification.message }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                icon="delete"
                flat
                round
                dense
                color="negative"
                @click="handleDelete(notification)"
                :loading="deletingId === notification.id"
              />
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  notifications: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'delete', 'close'])

const localShow = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const deletingId = ref(null)

function handleDelete(notification) {
  deletingId.value = notification.id
  emit('delete', notification)
  // Reset after a short delay
  setTimeout(() => {
    deletingId.value = null
  }, 500)
}

function handleClose() {
  emit('close')
  localShow.value = false
}
</script>

<style scoped>
.notifications-dialog {
  border-radius: 8px;
}

.notification-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.body--dark .notification-item {
  border-bottom-color: rgba(255, 255, 255, 0.12);
}
</style>

