// dependencies
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router';

// styles
import '@/assets/scss/index.scss';

// entry
import App from './App.vue';

// global components
import AppButton from '@/common/components/AppButton.vue';
import AppInput from '@/common/components/AppInput.vue';
import AppModal from '@/common/components/AppModal.vue';
import AppSelect from '@/common/components/AppSelect.vue';
import AppTag from '@/common/components/AppTag.vue';
import AppTabsItem from '@/common/components/AppTabs/AppTabsItem.vue';
import AppTabsWrapper from '@/common/components/AppTabs/AppTabsWrapper.vue';

// firebase
import '@/firebase';

// utils
import { getToken, removeToken } from '@/services/token-manager';

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
app.mount('#app');

const token = getToken();

if (token) {
  try {
    router.push('/app');
  } catch (error) {
    removeToken();
    console.error(error);
  }
}
