<script lang="ts" setup>
import DataTable, {
  type DataTablePageEvent,
  type DataTableRowClickEvent,
  type DataTableSortEvent,
} from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import { useEvents } from '@/composables/events'
import { useRouter } from 'vue-router'
import AppTableHeader from './table/header.vue'
import AppUiEventType from './ui/eventType.vue'
import AppUiDateDisplay from './ui/dateDisplay.vue'

defineOptions({
  name: 'AppHeader',
})

const { events, loading, createEventDialogOpen, fetchEvents, pagination, orderBy, orderDirection } =
  useEvents()
const router = useRouter()

/**
 * Change the page of the table and fetch the new events
 * @param event - The event data
 */
const changeTablePage = (event: DataTablePageEvent) => {
  pagination.page.value = event.page + 1
  pagination.perPage.value = event.rows
  fetchEvents()
}

/**
 * Navigate to the event details page
 * @param event - The event data
 */
const navigateToEvent = (event: DataTableRowClickEvent) => {
  router.push(`/event/${event.data.id}`)
}

const sortTable = (event: DataTableSortEvent) => {
  if (event.sortField) {
    orderBy.value = event.sortField as string
    orderDirection.value = event.sortOrder === 1 ? 'ASC' : 'DESC'
  } else {
    orderBy.value = 'id'
    orderDirection.value = 'DESC'
  }

  fetchEvents()
}
defineExpose({ changeTablePage, sortTable })
</script>

<template>
  <div class="flex w-full flex-col gap-6 p-6">
    <div class="flex items-center justify-between">
      <div class="text-xl font-medium">Event management</div>
      <Button
        data-test-id="create-event-button"
        label="Create event"
        size="small"
        @click="createEventDialogOpen = true"
      />
    </div>
    <div class="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <DataTable
        data-test-id="events-table"
        :value="events"
        stripedRows
        scrollable
        lazy
        @sort="sortTable"
        rowHover
        scrollHeight="flex"
        :loading="loading"
        @page="changeTablePage"
        paginator
        class="!text-sm max-h-[calc(100vh-165px)]"
        alwaysShowPaginator
        :rows="pagination.perPage.value"
        :page="pagination.page"
        :rowsPerPageOptions="[25, 50, 100]"
        :totalRecords="pagination.totalResults.value"
        :totalPages="pagination.totalPages"
        :rowClass="() => 'cursor-pointer'"
        @row-click="navigateToEvent"
      >
        <template #header>
          <AppTableHeader />
        </template>

        <template #empty>
          <div class="flex h-full flex-col items-center justify-center p-4">
            <p class="text-sm text-zinc-500 italic">No events found</p>
          </div>
        </template>

        <template #loading>
          <div class="flex h-full flex-col items-center justify-center p-4">
            <i class="pi pi-spin pi-spinner text-2xl text-zinc-500"></i>
          </div>
        </template>

        <Column field="id" header="#ID" sortable></Column>
        <Column field="title" header="Title" class="max-w-[150px] truncate"></Column>
        <Column field="description" header="Description" class="max-w-[300px] truncate"></Column>
        <Column field="type" header="Type">
          <template #body="slotProps">
            <div class="flex items-center">
              <AppUiEventType :type="slotProps.data.type" />
            </div>
          </template>
        </Column>
        <Column field="priority" header="Priority" sortable></Column>
        <Column field="createdAt" header="Created" sortable>
          <template #body="slotProps">
            <AppUiDateDisplay :date="slotProps.data.createdAt" />
          </template>
        </Column>
        <Column field="updatedAt" header="Last updated" sortable>
          <template #body="slotProps">
            <AppUiDateDisplay :date="slotProps.data.updatedAt" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
