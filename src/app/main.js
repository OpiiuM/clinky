// dependencies
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';

// styles
import '@/app/styles/index.scss';

// entry
import App from '@/App.vue';

// global components
import {
  AppButton,
  AppInput,
  AppModal,
  AppSelect,
  AppTag,
  AppTabsItem,
  AppTabsWrapper,
  AppZoom,
  AppCheckbox,
} from '@/shared/ui';

// firebase
import '@/shared/config/firebase';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component('AppButton', AppButton);
app.component('AppInput', AppInput);
app.component('AppModal', AppModal);
app.component('AppSelect', AppSelect);
app.component('AppTag', AppTag);
app.component('AppTabsItem', AppTabsItem);
app.component('AppTabsWrapper', AppTabsWrapper);
app.component('AppZoom', AppZoom);
app.component('AppCheckbox', AppCheckbox);
app.mount('#app');
