import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

export default defineNuxtPlugin((nuxtApp) => {
  library.add(fab, fas);
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon);
});