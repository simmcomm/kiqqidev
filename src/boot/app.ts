import { boot } from 'quasar/wrappers';
import { ref } from 'vue';
import '../util/xmlhttprequest-override';
import { api } from 'boot/axios';

export interface Game {
  id: string;
  name: string;
  description: string;
  category: string;
  root: string;
  mobileRoot: string;
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  img: string;
  loadingImg: string;
  tips: string;
  colors: string;
  loadingImgFit: string;
  mobileLoadingImg: string;
  visible: boolean;
  available: boolean;
  heroImg: string;
}

const games = ref<Game[]>([]);
// const CONTENT_ENDPOINT = 'https://brain-teacher-cdn.flowly.com';
const CONTENT_ENDPOINT = 'https://localhost:3000';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app } */) => {
  const response = await api.get<Game[]>('/games.json');
  games.value = response.data;
});

const findGame = (id: string): Game | undefined => games.value.find((g) => g.id === id);

export { CONTENT_ENDPOINT, games, findGame };
