<template>
  <div class="order-filters q-pa-md q-mb-md">
    <div class="text-subtitle2 q-mb-md">Filters:</div>
    <div class="row q-gutter-md items-end">
      <q-input v-model="localFilters.destination" label="Destination" outlined dense class="col-12 col-sm-3"
        clearable />

      <q-input v-model="localFilters.startDate" label="Start Date" type="date" outlined dense class="col-12 col-sm-3"
        clearable />

      <q-input v-model="localFilters.endDate" label="End Date" type="date" outlined dense class="col-12 col-sm-3"
        clearable />
      <q-btn class="q-py-sm" color="primary" label="Apply" @click="handleApply" :loading="loading" />
      <q-btn class="q-py-sm" color="negative" label="Clear" outline @click="handleClear" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    default: () => ({
      destination: '',
      startDate: '',
      endDate: ''
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['apply', 'clear'])

const localFilters = ref({
  destination: props.filters.destination || '',
  startDate: props.filters.startDate || '',
  endDate: props.filters.endDate || ''
})

watch(() => props.filters, (newFilters) => {
  localFilters.value = {
    destination: newFilters.destination || '',
    startDate: newFilters.startDate || '',
    endDate: newFilters.endDate || ''
  }
}, { deep: true })

function handleApply() {
  // Allow filtering with at least one field filled
  if (!localFilters.value.destination && !localFilters.value.startDate && !localFilters.value.endDate) {
    return
  }
  emit('apply', { ...localFilters.value })
}

function handleClear() {
  localFilters.value = {
    destination: '',
    startDate: '',
    endDate: ''
  }
  emit('clear')
}
</script>

<style scoped>
.order-filters {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

.body--dark .order-filters {
  background: rgba(255, 255, 255, 0.05);
}
</style>
