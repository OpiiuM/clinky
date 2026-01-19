<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useLinksStore, useFilterStore, useAuthStore, useModalStore } from '@/stores';

import TheSidebar from '@/modules/app/TheSidebar.vue';
import FormCreateLink from '@/modules/app/form/FormCreateLink.vue';
import TheFilter from '@/modules/app/TheFilter.vue';
import TheCardBox from '@/modules/app/TheCardBox.vue';
import CountdownTimer from '@/modules/app/CountdownTimer.vue';

import { useDates } from '@/common/composables';
import { useResponsive } from '@/common/composables/useResponsive';
import FormEditMultipleLinks from '@/modules/app/form/FormEditMultipleLinks.vue';

const router = useRouter();

const linksStore = useLinksStore();
const { isSelectMode, bufferCards } = storeToRefs(linksStore);
const { fetchLinks, toggleSelectMode, deleteBufferedLinks } = linksStore;

const filterStore = useFilterStore();
const { logout } = useAuthStore();
const modalStore = useModalStore();
const { modalCreate, modalMultipleEdit, modalConfirmRemoveLinks } = storeToRefs(modalStore);
const { handleOpenModal, handleCloseModal } = modalStore;

onMounted(async () => {
  await fetchLinks();
  filterStore.initFilters();
});

const handleLogout = async () => {
  const response = await logout();

  if (response === 'Error') {
    router.push('/');
    filterStore.$reset();
  } else {
    console.error('logout Error');
  }
};

const { convert } = useDates();

const handleImportBookmarks = () => {
  const $input = document.createElement('input');
  $input.setAttribute('class', 'hidden');
  $input.setAttribute('type', 'file');
  $input.setAttribute('name', 'upload');
  $input.setAttribute('accept', '.html');
  $input.setAttribute('required', true);

  $input.addEventListener('cancel', () => console.error('Cancelled'));
  $input.addEventListener('change', () => {
    const file = $input.files[0];

    if (!file || file.type !== 'text/html') {
      console.error('Cancelled');
      return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', async (e) => {
      const html = e.target.result;

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const links = [...doc.querySelectorAll('a')];

      const result = links.map((a) => ({
        href: a.getAttribute('href') || '',
        title: (a.textContent.trim().slice(0, 96) + '...') || '',
        isFavorite: false,
        category: ['no-sort'],
        dateCreate: convert(new Date()),
      }));

      if (!result.length) return;

      for (const itemLink of result) {
        await linksStore.addLink(itemLink);
        await new Promise((resolve) => setTimeout(resolve, 250));
      }

      // TODO: result -> add Stack
      // TODO: check similar
    });

    reader.addEventListener('error', () => {
      console.error('error', reader.error);
    });

    reader.readAsText(file);
  });

  document.body.appendChild($input);
  $input.click();
  document.body.removeChild($input);
};

const { isMobile } = useResponsive();
const sidebarRef = ref(null);

const saveFiltersCount = ref(0);

const saveFiltersTitle = computed(() => {
  return saveFiltersCount.value
    ? `Сохранить фильтры ${saveFiltersCount.value}`
    : 'Сохранить фильтры';
});

const handleClickSaveFilters = () => {
  filterStore.saveFilters();
  saveFiltersCount.value += 1;
  sidebarRef.value?.handleCloseMobileMenu();
};

const handleReset = () => {
  filterStore.resetFilters();
  saveFiltersCount.value = 0;
};

const editCardsTitle = computed(() => {
  return isSelectMode.value ? 'Отменить' : 'Редактировать';
});
</script>

<template>
  <div class="page__container">
    <the-sidebar
      ref="sidebarRef"
      class="page__sidebar"
    >
      <the-filter class="sidebar__filter" />

      <app-button
        style="margin-top: 16px;"
        @click="toggleSelectMode"
      >
        {{ editCardsTitle }}
      </app-button>

      <template v-if="bufferCards.length > 0">
        <app-button
          color="red"
          style="margin-top: 10px;"
          @click="handleOpenModal('modalConfirmRemoveLinks')"
        >
          Удалить ссылки
        </app-button>

        <app-button
          color="orange"
          style="margin-top: 10px;"
          @click="handleOpenModal('modalMultipleEdit')"
        >
          Редактировать ссылки
        </app-button>
      </template>

      <app-button
        style="margin-top: 10px;"
        color="purple"
        @click="handleClickSaveFilters"
      >
        {{ saveFiltersTitle }}
      </app-button>

      <app-button
        style="margin-top: 10px; margin-bottom: auto"
        color="blue"
        @click="handleOpenModal('modalCreate')"
      >
        Создать ссылку
      </app-button>

      <div
        v-if="!isMobile"
        class="sidebar__countdown"
      >
        <countdown-timer class="sidebar__countdown-item" />
      </div>

      <div class="sidebar__actions">
        <app-button
          class="sidebar__actions-item"
          color="orange"
          @click="handleReset"
        >
          Сбросить фильтры
        </app-button>

        <app-button
          v-if="!isMobile"
          color="green"
          class="sidebar__actions-item"
          @click="handleImportBookmarks"
        >
          Импортировать
        </app-button>

        <app-button
          class="sidebar__actions-item"
          color="black"
          @click="handleLogout"
        >
          Разлогиниться
        </app-button>
      </div>
    </the-sidebar>

    <!-- TODO: создание категорий -->
    <main class="page__content">
      <the-card-box />
    </main>
  </div>

  <app-modal
    :is-open="modalCreate"
    @close="handleCloseModal('modalCreate')"
  >
    <form-create-link @submit="handleCloseModal('modalCreate')" />
  </app-modal>

  <app-modal
    :is-open="modalMultipleEdit"
    @close="handleCloseModal('modalMultipleEdit')"
  >
    <form-edit-multiple-links
      @submit="handleCloseModal('modalMultipleEdit')"
    />
  </app-modal>

  <app-modal
    :is-open="modalConfirmRemoveLinks"
    @close="handleCloseModal('modalConfirmRemoveLinks')"
  >
    <h2 style="text-align: center;">Удалить выбранные ссылки?</h2>

    <div style="display: flex; gap: 20px; align-items: center; justify-content: center;">
      <app-button
        color="green"
        @click="[deleteBufferedLinks(), handleCloseModal('modalConfirmRemoveLinks')]"
      >
        Подтвердить
      </app-button>

      <app-button
        color="red"
        @click="handleCloseModal('modalConfirmRemoveLinks')"
      >
        Отменить
      </app-button>
    </div>
  </app-modal>
</template>
