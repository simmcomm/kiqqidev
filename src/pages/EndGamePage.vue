<template>
  <q-page padding class="container">
    <div class="text-h3">End game</div>
    <hr>
    <div>Score request payload:</div>
    <div><code><pre>{{ lastPayload }}</pre></code></div>
    <hr>
    <request-list/>
  </q-page>
</template>

<script lang="ts" setup>
import { lastPayload } from 'src/util/xmlhttprequest-override';
import RequestList from '../components/RequestList.vue';
</script>
