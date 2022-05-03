<template>
  <q-page class="container">
    <div class="q-pa-md row items-center justify-evenly content-start q-gutter-md">
      <q-card v-for="game in games" :key="game.id">
        <q-img :src="`${CONTENT_ENDPOINT}${game.img}`" :ratio="3/2" width="200px"/>
        <q-card-section>
          <router-link v-if="game.available" class="text-h6" :to="`/game/${game.id}`">{{ game.name }}</router-link>
          <span v-else class="text-h6 text-strike">{{ game.name }}</span>
          <div class="text-subtitle2">{{ game.category }}</div>
        </q-card-section>
      </q-card>
    </div>
    <!--    <code><pre>{{ games }}</pre></code>-->
  </q-page>
</template>

<script lang="ts" setup>
import { games, CONTENT_ENDPOINT } from 'boot/app';
</script>
