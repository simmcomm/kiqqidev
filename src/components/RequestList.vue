<template>
  <div class="q-mt-md">
    <div class="text-h6">
      Requests
      <q-btn @click="requests.clear()">clear</q-btn>
    </div>
    <div v-for="[date, request] in requests" :key="date"><code>{{ formatDate(date) }} - {{ request }}</code></div>
  </div>
</template>

<script lang="ts" setup>
import { date } from 'quasar';
import { requests } from '../util/xmlhttprequest-override';

const { formatDate } = date;
</script>
