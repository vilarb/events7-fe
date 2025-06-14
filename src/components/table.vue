<script lang="ts" setup>
import DataTable, { type DataTablePageEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import { useEventsStore } from '@/stores/event'
import AppTableHeader from './table/header.vue'
import AppEventType from './ui/eventType.vue'

defineOptions({
  name: 'AppHeader',
})

const eventsStore = useEventsStore()

const changePage = (event: DataTablePageEvent) => {
  eventsStore.pagination.page = event.page + 1
  eventsStore.pagination.perPage = event.rows
  eventsStore.fetchEvents()
}
</script>

<template>
  <div class="flex w-full flex-col gap-6 p-6">
    <div class="text-xl font-medium">Event management</div>
    <div class="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <DataTable
        :value="eventsStore.events"
        stripedRows
        scrollable
        lazy
        rowHover
        scrollHeight="flex"
        :loading="eventsStore.loading"
        @page="changePage"
        paginator
        class="!text-sm max-h-[calc(100vh-162px)]"
        alwaysShowPaginator
        :rows="eventsStore.pagination.perPage"
        :page="eventsStore.pagination.page"
        :rowsPerPageOptions="[25, 50, 100]"
        :totalRecords="eventsStore.pagination.totalResults"
        :totalPages="eventsStore.pagination.totalPages"
      >
        <template #header>
          <AppTableHeader />
        </template>

        <Column field="id" header="ID"></Column>
        <Column field="title" header="Title"></Column>
        <Column field="description" header="Description"></Column>
        <Column field="type" header="Type">
          <template #body="slotProps">
            <div class="flex items-center">
              <AppEventType :type="slotProps.data.type" />
            </div>
          </template>
        </Column>
        <Column field="priority" header="Priority"></Column>
        <Column header="Created">
          <template #body="slotProps">
            {{
              new Date(slotProps.data.createdAt).toLocaleString('si-SL', {
                timeStyle: 'short',
                dateStyle: 'medium',
              })
            }}
          </template>
        </Column>
        <Column header="Last updated">
          <template #body="slotProps">
            {{
              new Date(slotProps.data.createdAt).toLocaleString('si-SL', {
                timeStyle: 'short',
                dateStyle: 'medium',
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              })
            }}
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>
