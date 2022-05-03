/**
 * This is an override for unity.
 *
 * This application communicates with backend api on different domain. Sending cookies to different domain is not
 * enabled by default.
 *
 * Unity web build does not bundle any kind of http client inside, instead it proxies http requests to web native
 * `XMLHttpRequest` class. This override is global, and all requests using `XMLHttpRequest` class will always send
 * cookies. Do not use it for webapp requests, instead use the `axios` client.
 */
import { ref } from 'vue';

type BufferSource = ArrayBufferView | ArrayBuffer;
type XMLHttpRequestBodyInit = Blob | BufferSource | FormData | URLSearchParams | string;

let statisticsRequestSent = false;

export const requests = ref<Map<Date, string>>(new Map<Date, string>());
export const lastPayload = ref<string>('--[no payload]--');

window.XMLHttpRequest = class extends XMLHttpRequest {
  public open(method: string, url: string | URL) {
    requests.value.set(new Date(), `${method} ${url}`);
    if (method.toUpperCase() === 'POST' && url.toString().includes('/statistics/')) {
      statisticsRequestSent = true;
    }
    super.open(method, url);
  }

  send(body?: Document | XMLHttpRequestBodyInit | null) {
    super.send(body);
    if (statisticsRequestSent && body instanceof Uint8Array) {
      lastPayload.value = body ? String.fromCharCode(...body) : '--[no payload]--';
    }
  }

  public static get statisticsRequestSent() : boolean {
    const tmp = statisticsRequestSent;
    statisticsRequestSent = false;
    return tmp;
  }
};
