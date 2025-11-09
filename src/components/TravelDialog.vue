<template>
  <q-dialog v-model="localShow" @hide="handleClose">
    <q-card class="travel-dialog" style="min-width: 400px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ isEdit ? 'Update Order' : 'Create Order' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleSubmit" class="q-gutter-md">
          <q-input
            v-if="!isEdit"
            v-model="formData.customerName"
            label="Customer Name *"
            outlined
            dense
            :rules="[val => !!val || 'Customer name is required']"
          />

          <q-input
            v-model="formData.destiny"
            label="Destination *"
            outlined
            dense
            :rules="[val => !!val || 'Destination is required']"
          />

          <q-input
            v-model="formData.startDate"
            label="Start Date *"
            type="date"
            outlined
            dense
            :rules="[val => !!val || 'Start date is required']"
          />

          <q-input
            v-model="formData.returnDate"
            label="Return Date *"
            type="date"
            outlined
            dense
            :rules="[val => !!val || 'Return date is required']"
          />

          <q-select
            v-if="isEdit"
            v-model="formData.status"
            :options="statusOptions"
            label="Status *"
            outlined
            dense
            emit-value
            map-options
            :rules="[val => !!val || 'Status is required']"
          />

          <div class="row q-gutter-sm justify-end q-mt-md">
            <q-btn
              flat
              label="Cancel"
              color="negative"
              @click="handleClose"
            />
            <q-btn
              type="submit"
              label="Save"
              color="primary"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  order: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'close'])

const localShow = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const statusOptions = ['Approved', 'Cancelled', 'Pending']

const formData = ref({
  customerName: '',
  destiny: '',
  startDate: '',
  returnDate: '',
  status: 'Pending'
})

watch(() => props.order, (newOrder) => {
  if (newOrder && props.isEdit) {
    formData.value = {
      customerName: newOrder.customer_name || '',
      destiny: newOrder.destiny || '',
      startDate: newOrder.start_date || '',
      returnDate: newOrder.return_date || '',
      status: newOrder.status || 'Pending'
    }
  }
}, { immediate: true })

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    // Reset form when dialog closes
    formData.value = {
      customerName: '',
      destiny: '',
      startDate: '',
      returnDate: '',
      status: 'Pending'
    }
  }
})

function handleSubmit() {
  emit('submit', { ...formData.value })
}

function handleClose() {
  emit('close')
  localShow.value = false
}
</script>

<style scoped>
.travel-dialog {
  border-radius: 8px;
}
</style>

