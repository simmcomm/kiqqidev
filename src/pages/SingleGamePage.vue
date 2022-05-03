<template>
  <q-page class="column items-start content-start no-wrap justify-start container" :padding="$q.platform.is.desktop">
    <div class="row no-wrap">
      <div v-if="$q.platform.is.desktop" :class="`description-block col-${12 - gameCols}`">
        <div v-if="game" class="text-h5 title">
          {{ game.name }}
        </div>
        <div v-if="game" class="game-description">
          {{ game.description }}
        </div>
      </div>
      <game-container
        v-if="game"
        :code-url="game.codeUrl"
        :data-url="game.dataUrl"
        :framework-url="game.frameworkUrl"
        :game-data="game"
        :loading-img="$q.platform.is.desktop ? game.loadingImg : game.mobileLoadingImg"
        :product-name="game.name"
        :static-root="$q.platform.is.mobile ? game.mobileRoot : game.root"
        match-web-g-l-to-canvas-size
        v-bind="dimensions"
        @unity-unloaded="unloadedHandler"
      />
    </div>
    <request-list />
  </q-page>
</template>

<style lang="scss" scoped>
.title {
  font-weight: bold;
  font-size: 25px;
}

.description-block {
  max-width: 256px;
}

.game-description {
  font-size: 16px;
  padding-top: 30px;
}
</style>

<script lang="ts" setup>
import {
  onBeforeMount, reactive, ref, watch,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Platform, Screen } from 'quasar';
import { findGame, Game } from 'boot/app';
import { clamp } from '../util/clamp';
import GameContainer from '../components/GameContainer.vue';
import RequestList from '../components/RequestList.vue';

const router = useRouter();
const route = useRoute();

const dimensions = reactive({ height: Screen.height, width: Screen.width });
const gameCols = 9;
if (Platform.is.desktop) {
  const ratio = 3 / 4;
  const colWidth = gameCols / 12;
  dimensions.width = clamp(dimensions.width, Screen.sizes.sm, Screen.sizes.md) * colWidth;
  dimensions.height = dimensions.width * ratio;
}
if (Platform.is.mobile) {
  watch(() => Screen.height, (height) => {
    dimensions.height = height;
  });
}

const game = ref<Game>();
onBeforeMount(() => {
  game.value = findGame(route.params.id as string);
});

const unloadedHandler = (played: boolean) => {
  if (played) {
    if (game.value) {
      void router.push('/endgame');
    }
  } else {
    router.back();
  }
};
</script>
