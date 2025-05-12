<template>
  <q-page class="flex flex-center">
      <div class="centered-column">
        <div class="full-width notification-bar">
          <q-btn
            flat
            icon="fa-solid fa-bell"
            rounded
            @click="togleShowNotify"
          >
          <q-badge v-show="hasNotifications" color="secondary" floating></q-badge>
          </q-btn>
          <q-btn
            flat
            icon="fa-solid fa-arrow-right-from-bracket"
            rounded
            @click="() => { $router.push('/') }"
          >
          <q-tooltip>Logout</q-tooltip>
          </q-btn>
        </div>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          narrow-indicator
        >
          <q-tab icon="fa-solid fa-plane-departure" name="travels" label="My Travels" />
          <q-tab v-show="isAdm" icon="fa-solid fa-table" name="dashboard" label="Dashboard" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="travels">
            <q-table class="full-width q-mb-md" title="My travels:" :columns="columnsUser" :rows="userTableData" flat bordered>
            </q-table>
            <div class="centered-row full-width">
              <q-btn color="primary" class="q-px-md" label="Create travel" dense @click="addItem = true"></q-btn>
            </div>
          </q-tab-panel>

          <q-tab-panel name="dashboard">
            <div class="centered-row full-width q-mb-md">
              <span>Filters:</span>
              <q-input label="Destination" dense outlined v-model="destination"></q-input>
              <q-input label="Start date" dense outlined type="date" v-model="startDate"></q-input>
              <q-input label="End date" dense outlined type="date" v-model="endDate"></q-input>
              <q-btn color="primary" class="q-px-md" label="Apply" dense @click="filterTableData()"></q-btn>
              <q-btn color="red" class="q-px-md" label="Clear" dense @click="clearFilters()"></q-btn>
            </div>
            <q-table class="full-width q-mb-md" title="Travels list:" :columns="columns" :rows="tableData" flat bordered>
              <template v-slot:body-cell-manage="props">
                <q-td :props="props">
                  <q-btn unelevated color="primary" @click="handleAction(props.row)" icon="fa-solid fa-pen-to-square"></q-btn>
                </q-td>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panels>
      </div>
      <q-dialog v-model="editItem">
        <div class="centered-column full-width bg-white">
          <h6 class="q-ma-none">Update order:</h6>
          <q-select label="Approve or cancel" :options="statusOptions" v-model="statusSelect"></q-select>
          <q-btn class="q-px-md" color="primary" dense label="Save" @click="updateItem(selectedRow)"></q-btn>
        </div>
      </q-dialog>
      <q-dialog v-model="addItem">
        <div class="centered-column full-width bg-white">
          <h6 class="q-ma-none">Create order:</h6>
          <q-input class="full-width" label="Name" dense outlined v-model="customerName"></q-input>
          <q-input class="full-width" label="Destination" dense outlined v-model="destiny"></q-input>
          <q-input class="full-width" label="Start date" type="date" dense outlined v-model="startDateC"></q-input>
          <q-input class="full-width" label="Return date" type="date" dense outlined v-model="returnDate"></q-input>
          <q-btn class="q-px-md" color="primary" dense label="Save" @click="createItem()"></q-btn>
        </div>
      </q-dialog>
      <q-dialog v-model="showNotify">
        <div class="centered-column full-width bg-white">
          <h6 class="q-mb-md">Notifications:</h6>
          <div class="notify-block">
            <span v-for="(item, index) in notifications" :key="index" class="notify-item">{{ item.message }} <q-icon @click="clearNotification(item)" name="fa-solid fa-trash"></q-icon></span>
          </div>
        </div>
      </q-dialog>
  </q-page>
</template>

<script setup>
  import axios from 'axios'
  import { Loading, Notify, SessionStorage } from 'quasar'
  import { ref } from 'vue'

  const columns = [
    { name: 'id', label: 'Id', field: 'id' },
    { name: 'customer_name', label: 'Customer', field: 'customer_name' },
    { name: 'destiny', label: 'Destiny', field: 'destiny' },
    { name: 'start_date', label: 'Travel Date', field: 'start_date', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
    { name: 'return_date', label: 'Return Date', field: 'return_date', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
    { name: 'status', label: 'Status', field: 'status' },
    { name: 'created_at', label: 'Creted at', field: 'created_at' },
    { name: 'updated_at', label: 'Updated at', field: 'updated_at' },
    { name: 'manage', label: 'Manage' }
  ]

  const columnsUser = [
    { name: 'id', label: 'Id', field: 'id' },
    { name: 'customer_name', label: 'Customer', field: 'customer_name' },
    { name: 'destiny', label: 'Destiny', field: 'destiny' },
    { name: 'start_date', label: 'Travel Date', field: 'start_date', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
    { name: 'return_date', label: 'Return Date', field: 'return_date', sortable: true, sort: (a, b) => parseInt(a, 10) - parseInt(b, 10) },
    { name: 'status', label: 'Status', field: 'status' },
    { name: 'created_at', label: 'Creted at', field: 'created_at' },
    { name: 'updated_at', label: 'Updated at', field: 'updated_at' }
  ]

  const tableData = ref([])
  const userTableData = ref([])
  const selectedRow = ref('')
  const statusSelect = ref('Selecione...')
  const editItem = ref(false)
  const addItem = ref(false)
  const statusOptions = ['Approved', 'Cancelled']
  const destination = ref('')
  const startDate = ref('')
  const endDate = ref('')
  const customerName = ref('')
  const destiny = ref('')
  const startDateC = ref('')
  const returnDate = ref('')
  const tab = ref('travels')
  const notifications = ref([])
  const hasNotifications = ref(false)
  const showNotify = ref(false)
  const isAdm = ref(false)

  setTimeout(() => {
    isAdm.value = SessionStorage.getItem('user_type') === 'adm' ? true : false
    Loading.hide();
  }, 500)

  const config = {
    headers: {
      Authorization: `Bearer ${SessionStorage.getItem('session_key')}`
    }
  }

  axios.get(`${process.env.API_URL}/api/v1/orders`, config).then(({ data }) => {
    tableData.value = data
  })

  setTimeout(() => {
    axios.post(`${process.env.API_URL}/api/v1/ordersByUser`, { user_id: SessionStorage.getItem('user_id') }, config).then(({ data }) => {
      userTableData.value = data
    })
    axios.post(`${process.env.API_URL}/api/v1/showUserNotifications`, {
      user_id: SessionStorage.getItem('user_id')
    }, config).then(({ data }) => {
      notifications.value = data
      if (data.length) {
        hasNotifications.value = true
      }
    })
  }, 500)

  function handleAction(row) {
    selectedRow.value = row
    editItem.value = !editItem.value
  }

  function updateItem(row) {
    Loading.show()

    const body = row
    body.status = statusSelect

    const config = {
      headers: {
        Authorization: `Bearer ${SessionStorage.getItem('session_key')}`
      }
    }

    axios.put(`${process.env.API_URL}/api/v1/orders/${row.id}`, body, config).then(({ data }) => {
      if (data.status === 'error') {
        Notify.create({
          message: data.message,
          color: 'negative'
        })
      } else {
        Notify.create({
          message: 'Order updated',
          color: 'secondary'
        })

        axios.post(`${process.env.API_URL}/api/v1/notifications`, {
          user_id: body.user_id,
          message: 'Your order was updated!'
        }, config)
      }
      Loading.hide()
    }).catch(() => {
      Loading.hide()
    })

    editItem.value = false
  }

  function createItem() {
    const body = {
      customer_name: customerName.value,
      destiny: destiny.value,
      start_date: startDateC.value,
      return_date: returnDate.value,
      status: "Pending",
      user_id: SessionStorage.getItem('user_id')
    }

    const config = {
      headers: {
        Authorization: `Bearer ${SessionStorage.getItem('session_key')}`
      }
    }

    if (customerName.value === '' || destiny.value === '' || startDateC.value === '' || returnDate.value === '') {
      Notify.create({
        message: 'You must fulfill the form!',
        color: 'red'
      })
      return
    }

    axios.post(`${process.env.API_URL}/api/v1/orders`, body, config).then(({ data }) => {
      Notify.create({
        message: 'Order created!',
        color: 'secondary'
      })
      Loading.hide()
    }).catch(() => {
      Loading.hide()
    })

    addItem.value = false

    clearFilters()
  }

  function filterTableData() {
    if (destination.value === '' || startDate.value === '' || endDate.value === '') {
      Notify.create({
        message: 'You must select all filters!',
        color: 'red'
      })

      return
    }

    Loading.show()

    const config = {
      headers: {
        Authorization: `Bearer ${SessionStorage.getItem('session_key')}`
      }
    }

    const body = {
      destination: destination.value,
      start_date: startDate.value,
      end_date: endDate.value
    }

    axios.post(`${process.env.API_URL}/api/v1/filterOrders`, body, config).then(({ data }) => {
      tableData.value = data
      Loading.hide()
    }).catch(() => {
      Loading.hide()
    })
  }

  function clearFilters() {
    const config = {
      headers: {
        Authorization: `Bearer ${SessionStorage.getItem('session_key')}`
      }
    }

    axios.get(`${process.env.API_URL}/api/v1/orders`, config).then(({ data }) => {
      tableData.value = data
    })

    axios.post(`${process.env.API_URL}/api/v1/ordersByUser`, { user_id: SessionStorage.getItem('user_id') }, config).then(({ data }) => {
      userTableData.value = data
    })
  }

  function togleShowNotify() {
    showNotify.value = !showNotify.value
  }

  function clearNotification(item) {
    axios.delete(`${process.env.API_URL}/api/v1/notifications/${item.id}`, config)

    const notifyArray = notifications.value.filter((el) => {
      return el.id !== item.id;
    })

    notifications.value = notifyArray;

    if (!notifications.value.length) {
      hasNotifications.value = false;
    }
  }
</script>
