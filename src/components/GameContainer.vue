<template>
  <div :style="{ height: `${height}px` }">
    <q-img v-show="progress < 1"
           :fit="gameData.loadingImgFit"
           :height="`${height}px`"
           :src="backgroundImage"
           :width="`${width}px`"
           class="q-ma-none q-pa-none bg-secondary"
    >
      <div class="full-height full-width bg-transparent flex justify-evenly items-center column">
        <div class="column flex justify-center">
          <span
            :style="{ color: gameData.colors?.title ?? 'white' }"
            class="game-loader-title font-montserrat-alternates text-center"
          >{{ gameData.title ?? gameData.name }}</span>
        </div>
        <div class="row q-px-xl full-width">
          <q-linear-progress
            :color="gameData.colors?.loadingBar ?? undefined"
            :style="{ border: gameData.colors?.loadingBarBorder }"
            :track-color="gameData.colors?.loadingBarTrack ?? undefined"
            :value="progress"
            rounded
            size="xl"
          />
        </div>
      </div>
    </q-img>
    <canvas
      v-show="progress >= 1"
      ref="canvas"
      :style="{ height: `${height}px`, width: `${width}px` }"
    ></canvas>
  </div>
</template>

<style lang="scss">
.q-markdown p {
  margin-bottom: 0;
}
</style>

<style lang="scss" scoped>
.game-loader-title {
  font-weight: 500;
  font-size: 40px;
}

.game-loader-tips {
  font-size: 15.5px;
}
</style>

<script lang="ts" setup>
import {
  onBeforeMount, onMounted, onUnmounted, ref,
} from 'vue';
import { clamp } from 'src/util/clamp';
import { CONTENT_ENDPOINT, Game } from 'boot/app';
import { assetPath } from '../util/asset-path';

// <editor-fold desc="Unity Loader declarations" defaultstate="collapsed">
declare interface UnityModule<E extends Element = Element> {
  canvas: E;

  webglContextAttributes: {
    preserveDrawingBuffer: boolean,
  };

  streamingAssetsUrl: string;

  downloadProgress: Record<string, {
    started: boolean;
    finished: boolean;
    lengthComputable: boolean;
    total: number;
    loaded: number;
  }>;

  deinitializers: (() => void)[];

  intervals: Record<number, true>;
  preRun: (() => void)[];
  postRun: (() => void)[];

  disabledCanvasEvents: string[];

  SystemInfo: {
    width: number;
    height: number;
    userAgent: string;
    browser: string;
    browserVersion: string;
    mobile: boolean;
    os: string;
    osVersion: string;
    gpu: string;
    language: string;
    hasWebGL: string;
    hasCursorLock: boolean;
    hasFullscreen: boolean;
    hasThreads: boolean;
    hasWasm: boolean;
    hasWasmThreads: boolean;
  };

  cacheControl(url: string): string;

  print(message: string): void;

  printErr(message: string): void;

  locateFile(url: string): string;

  setInterval(func: () => void, ms: number): number;

  clearInterval(id: number): void;

  errorHandler(message: string, filename: string, lineno: number): void;

  startupErrorHandler?(message: string, filename: string, lineno: number): void;

  abortHandler(message: string): boolean;

  XMLHttpRequest: new () => XMLHttpRequest;

  onQuit?: () => void;
}

declare interface UnityConfig<E extends Element = Element> extends Partial<UnityModule<E>> {
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;

  companyName?: string;
  productName?: string;
  productVersion?: string;

  matchWebGLToCanvasSize?: boolean;
  devicePixelRatio?: number;
}

declare interface UnityInstance<E extends Element = Element> {
  Module: UnityModule<E>;

  SetFullscreen(): void;

  // eslint-disable-next-line no-unused-vars
  SendMessage(gameObject: string, method: string, parameter?: string | number): void;

  Quit(): Promise<void>;
}

// eslint-disable-next-line no-unused-vars
declare type OnProgress = (progress: number) => void;

declare function createUnityInstance<E extends Element = Element>(
  // eslint-disable-next-line no-unused-vars
  canvas: E,
  // eslint-disable-next-line no-unused-vars
  config: UnityConfig<E>,
  // eslint-disable-next-line no-unused-vars
  onProgress?: OnProgress,
): Promise<UnityInstance<E>>;

// </editor-fold>

let unityInstance: UnityInstance;

const props = withDefaults(defineProps<{
  staticRoot: string;
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  width?: number;
  height?: number;
  companyName?: string;
  productName?: string;
  productVersion?: string;
  matchWebGLToCanvasSize?: boolean;
  devicePixelRatio?: number;
  loadingImg?: string;
  gameData: Game;
}>(), {
  width: 960,
  height: 600,
  companyName: 'DefaultCompany',
  productName: 'MissingProductName',
  productVersion: '1.0',
  matchWebGLToCanvasSize: true,
  devicePixelRatio: window.devicePixelRatio,
});

const emit = defineEmits<{(e: 'unity-loaded'): void
  (e: 'unity-unloaded', gameFinished: boolean): void
}>();

const progress = ref(0);
const canvas = ref<HTMLCanvasElement>();
const backgroundImage = props.loadingImg ? assetPath(props.loadingImg) : undefined;
const loaderUrl = assetPath(props.staticRoot, props.frameworkUrl.replace('framework.js', 'loader.js'));

onBeforeMount(() => {
  const scripts = document.body.querySelectorAll<HTMLScriptElement>(`script[src^="${CONTENT_ENDPOINT}"]`);
  scripts.forEach((script) => {
    script.remove();
  });
});

onMounted(() => {
  const loader = document.createElement('script');
  loader.setAttribute('src', loaderUrl);
  loader.setAttribute('async', '');
  loader.setAttribute('defer', '');
  document.body.appendChild(loader);

  const { value: canvasElement } = canvas;
  if (!canvasElement) {
    return;
  }

  loader.onload = async () => {
    unityInstance = await createUnityInstance(canvasElement, {
      dataUrl: assetPath(props.staticRoot, props.dataUrl),
      frameworkUrl: assetPath(props.staticRoot, props.frameworkUrl),
      codeUrl: assetPath(props.staticRoot, props.codeUrl),
      companyName: props.companyName,
      productName: props.productName,
      productVersion: props.productVersion,
      // Uncomment this to separately control WebGL canvas render size and DOM element size.
      matchWebGLToCanvasSize: props.matchWebGLToCanvasSize,
      // Uncomment this to override low DPI rendering on high DPI displays.
      devicePixelRatio: clamp(props.devicePixelRatio, 1.5, 3),
    }, (currentProgress: number) => {
      progress.value = currentProgress;
    });

    setTimeout(() => {
      unityInstance.SendMessage('ScoringApi', 'Init', ['dummy.com', props.gameData.id].join(','));
      unityInstance.Module.onQuit = () => {
        const xhr = window.XMLHttpRequest as unknown as XMLHttpRequest & { statisticsRequestSent?: boolean };
        emit('unity-unloaded', xhr?.statisticsRequestSent || false);
      };
    }, 250);

    emit('unity-loaded');
  };
});

onUnmounted(() => {
  setTimeout(() => {
    if (unityInstance) {
      void unityInstance.Quit();
    }
  });
});
</script>
