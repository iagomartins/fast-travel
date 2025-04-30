<template>
  <q-page class="flex flex-center">
      <div class="centered-column">
        <div class="centered-row full-width">
          <span>Filters:</span>
          <q-input label="Destination" dense outlined v-model="destination"></q-input>
          <q-input label="Start date" dense outlined type="date" v-model="startDate"></q-input>
          <q-input label="End date" dense outlined type="date" v-model="endDate"></q-input>
          <q-btn color="primary" class="q-px-md" label="Apply" dense @click="filterTableData()"></q-btn>
          <q-btn color="red" class="q-px-md" label="Clear" dense @click="clearFilters()"></q-btn>
        </div>
        <q-table title="Travels list:" :columns="columns" :rows="tableData" flat bordered>
          <template v-slot:body-cell-manage="props">
            <q-td :props="props">
              <q-btn unelevated color="primary" @click="handleAction(props.row)" icon="menu"></q-btn>
            </q-td>
          </template>
        </q-table>
        <div class="centered-row full-width">
          <q-btn color="primary" class="q-px-md" label="Create travel" dense @click="addItem = true"></q-btn>
        </div>
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
  </q-page>
</template>

<script setup>
  import axios from 'axios'
  import { Loading, Notify } from 'quasar'
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

  const tableData = ref('')
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

  axios.get(`${process.env.API_URL}/api/orders`).then(({ data }) => {
    tableData.value = data
  })

  function handleAction(row) {
    selectedRow.value = row
    editItem.value = !editItem.value
  }

  function updateItem(row) {
    Loading.show()
    const body = row
    body.status = statusSelect
    axios.put(`${process.env.API_URL}/api/orders/${row.id}`, body).then(({ data }) => {
      if (data.status === 'error') {
        Notify.create({
          message: data.message,
          color: 'red'
        })
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
      status: "Pending"
    }

    if (customerName.value === '' || destiny.value === '' || startDateC.value === '' || returnDate.value === '') {
      Notify.create({
        message: 'You must fulfill the form!',
        color: 'red'
      })
      return
    }

    axios.post(`${process.env.API_URL}/api/orders`, body).then(({ data }) => {
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

    const body = {
      destination: destination.value,
      start_date: startDate.value,
      end_date: endDate.value
    }

    axios.post(`${process.env.API_URL}/api/filterOrders`, body).then(({ data }) => {
      tableData.value = data
      Loading.hide()
    }).catch(() => {
      Loading.hide()
    })
  }

  function clearFilters() {
    axios.get(`${process.env.API_URL}/api/orders`).then(({ data }) => {
      tableData.value = data
    })
  }
</script>
