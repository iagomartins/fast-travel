<template>
  <q-page class="q-pa-md">
    <div class="full-width">
      <div class="full-width notification-bar">
        <q-btn flat icon="notifications" round @click="showNotificationsDialog = true">
          <q-badge v-if="notificationsStore.hasNotifications" color="secondary" floating />
          <q-tooltip>Notifications</q-tooltip>
        </q-btn>
      </div>

      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" narrow-indicator>
        <q-tab icon="flight_takeoff" name="travels" label="My Travels" />
        <q-tab v-if="authStore.isAdmin" icon="table_chart" name="dashboard" label="Dashboard" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="travels" class="q-pa-md">
          <q-table class="full-width q-mb-md" title="My Travels" :columns="columnsUser" :rows="ordersStore.userOrders"
            :loading="ordersStore.isLoading" flat bordered :rows-per-page-options="[10, 20, 50]" row-key="id">
            <template v-slot:no-data>
              <div class="full-width row flex-center text-grey q-gutter-sm">
                <q-icon name="inbox" size="2em" />
                <span>No travels found. Create your first travel!</span>
              </div>
            </template>
          </q-table>
          <div class="row justify-center q-mt-md">
            <q-btn color="primary" label="Create Travel" icon="add" @click="showCreateDialog = true" />
          </div>
        </q-tab-panel>

        <q-tab-panel name="dashboard" class="q-pa-md">
          <OrderFilters :filters="ordersStore.filters" :loading="ordersStore.isLoading" @apply="handleFilter"
            @clear="handleClearFilters" />
          <q-table class="full-width q-mb-md" title="All Travels" :columns="columns" :rows="ordersStore.allOrders"
            :loading="ordersStore.isLoading" flat bordered :rows-per-page-options="[10, 20, 50]" row-key="id">
            <template v-slot:body-cell-manage="props">
              <q-td :props="props">
                <q-btn unelevated color="primary" icon="edit" size="sm" @click="handleEditOrder(props.row)">
                  <q-tooltip>Edit Order</q-tooltip>
                </q-btn>
              </q-td>
            </template>
            <template v-slot:no-data>
              <div class="full-width row flex-center text-grey q-gutter-sm">
                <q-icon name="inbox" size="2em" />
                <span>No orders found</span>
              </div>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <TravelDialog v-model="showCreateDialog" :loading="ordersStore.isLoading" @submit="handleCreateOrder"
      @close="showCreateDialog = false" />

    <TravelDialog v-model="showEditDialog" :is-edit="true" :order="selectedOrder" :loading="ordersStore.isLoading"
      @submit="handleUpdateOrder" @close="showEditDialog = false" />

    <NotificationsDialog v-model="showNotificationsDialog" :notifications="notificationsStore.notifications"
      @delete="handleDeleteNotification" @close="showNotificationsDialog = false" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { Notify, Loading } from 'quasar'
import { useAuthStore } from 'src/stores/auth'
import { useOrdersStore } from 'src/stores/orders'
import { useNotificationsStore } from 'src/stores/notifications'
import TravelDialog from 'src/components/TravelDialog.vue'
import NotificationsDialog from 'src/components/NotificationsDialog.vue'
import OrderFilters from 'src/components/OrderFilters.vue'
import { SessionStorage } from 'quasar'

const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const notificationsStore = useNotificationsStore()

const tab = ref('travels')
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showNotificationsDialog = ref(false)
const selectedOrder = ref(null)

const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
    sortable: true
  },
  {
    name: 'customer_name',
    label: 'Customer',
    field: 'customer_name',
    align: 'left',
    sortable: true
  },
  {
    name: 'destiny',
    label: 'Destination',
    field: 'destiny',
    align: 'left',
    sortable: true
  },
  {
    name: 'start_date',
    label: 'Travel Date',
    field: 'start_date',
    align: 'left',
    sortable: true,
    format: (val) => formatDate(val)
  },
  {
    name: 'return_date',
    label: 'Return Date',
    field: 'return_date',
    align: 'left',
    sortable: true,
    format: (val) => formatDate(val)
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left',
    sortable: true
  },
  {
    name: 'created_at',
    label: 'Created at',
    field: 'created_at',
    align: 'left',
    format: (val) => formatDate(val)
  },
  {
    name: 'updated_at',
    label: 'Updated at',
    field: 'updated_at',
    align: 'left',
    format: (val) => formatDate(val)
  },
  {
    name: 'manage',
    label: 'Actions',
    field: 'manage',
    align: 'center'
  }
]

const columnsUser = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
    sortable: true
  },
  {
    name: 'customer_name',
    label: 'Customer',
    field: 'customer_name',
    align: 'left',
    sortable: true
  },
  {
    name: 'destiny',
    label: 'Destination',
    field: 'destiny',
    align: 'left',
    sortable: true
  },
  {
    name: 'start_date',
    label: 'Travel Date',
    field: 'start_date',
    align: 'left',
    sortable: true,
    format: (val) => formatDate(val)
  },
  {
    name: 'return_date',
    label: 'Return Date',
    field: 'return_date',
    align: 'left',
    sortable: true,
    format: (val) => formatDate(val)
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    align: 'left',
    sortable: true
  },
  {
    name: 'created_at',
    label: 'Created at',
    field: 'created_at',
    align: 'left',
    format: (val) => formatDate(val)
  },
  {
    name: 'updated_at',
    label: 'Updated at',
    field: 'updated_at',
    align: 'left',
    format: (val) => formatDate(val)
  }
]

function formatDate(dateString) {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  } catch {
    return dateString
  }
}

onMounted(async () => {
  Loading.show()
  try {
    // Initialize auth if needed
    authStore.initAuth()

    // Load data
    await Promise.all([
      loadUserOrders(),
      loadNotifications()
    ])

    // Load admin orders if admin
    if (authStore.isAdmin) {
      await ordersStore.fetchAllOrders()
    }
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
    Notify.create({
      message: 'Failed to load data',
      color: 'negative',
      position: 'top'
    })
  } finally {
    Loading.hide()
  }
})

async function loadUserOrders() {
  try {
    await ordersStore.fetchUserOrders()
  } catch (error) {
    console.error('Failed to load user orders:', error)
  }
}

async function loadNotifications() {
  try {
    await notificationsStore.fetchNotifications()
  } catch (error) {
    console.error('Failed to load notifications:', error)
  }
}

async function handleCreateOrder(orderData) {
  try {
    await ordersStore.createOrder(orderData)
    Notify.create({
      message: 'Travel created successfully!',
      color: 'positive',
      position: 'top'
    })
    showCreateDialog.value = false
  } catch (error) {
    Notify.create({
      message: error.response?.data?.message || 'Failed to create travel',
      color: 'negative',
      position: 'top'
    })
  }
}

function handleEditOrder(order) {
  selectedOrder.value = order
  showEditDialog.value = true
}

async function handleUpdateOrder(orderData) {
  if (!selectedOrder.value) return

  try {
    const updateData = {
      ...selectedOrder.value,
      status: orderData.status || selectedOrder.value.status,
      destiny: orderData.destiny || selectedOrder.value.destiny,
      start_date: orderData.startDate || selectedOrder.value.start_date,
      return_date: orderData.returnDate || selectedOrder.value.return_date
    }

    const result = await ordersStore.updateOrder(selectedOrder.value.id, updateData)

    if (result?.status === 'error') {
      Notify.create({
        message: result.message || 'Failed to update order',
        color: 'negative',
        position: 'top'
      })
    } else {
      Notify.create({
        message: 'Order updated successfully!',
        color: 'positive',
        position: 'top'
      })

      // Create notification for user
      if (updateData.user_id) {
        try {
          await notificationsStore.createNotification(
            updateData.user_id,
            'Your order was updated!'
          )
        } catch (error) {
          console.error('Failed to create notification:', error)
        }
      }

      // Refresh notifications
      await loadNotifications()
    }

    showEditDialog.value = false
    selectedOrder.value = null
  } catch (error) {
    Notify.create({
      message: error.response?.data?.message || 'Failed to update order',
      color: 'negative',
      position: 'top'
    })
  }
}

async function handleFilter(filters) {
  // Validate that at least one filter is provided
  if (!filters.destination && !filters.startDate && !filters.endDate) {
    Notify.create({
      message: 'Please provide at least one filter',
      color: 'warning',
      position: 'top'
    })
    return
  }

  try {
    await ordersStore.filterOrders(filters)
    Notify.create({
      message: 'Filters applied',
      color: 'positive',
      position: 'top'
    })
  } catch (error) {
    Notify.create({
      message: error.response?.data?.message || 'Failed to apply filters',
      color: 'negative',
      position: 'top'
    })
  }
}

async function handleClearFilters() {
  try {
    ordersStore.clearFilters()
    Notify.create({
      message: 'Filters cleared',
      color: 'info',
      position: 'top'
    })
  } catch (error) {
    console.error('Failed to clear filters:', error)
  }
}

async function handleDeleteNotification(notification) {
  try {
    await notificationsStore.deleteNotification(notification.id)
    Notify.create({
      message: 'Notification deleted',
      color: 'positive',
      position: 'top'
    })
  } catch (error) {
    Notify.create({
      message: 'Failed to delete notification',
      color: 'negative',
      position: 'top'
    })
  }
}

// Watch for tab changes to load appropriate data
watch(tab, async (newTab) => {
  if (newTab === 'dashboard' && authStore.isAdmin) {
    if (ordersStore.allOrders.length === 0) {
      Loading.show()
      try {
        await ordersStore.fetchAllOrders()
      } catch (error) {
        console.error('Failed to load orders:', error)
      } finally {
        Loading.hide()
      }
    }
  }
})
</script>
