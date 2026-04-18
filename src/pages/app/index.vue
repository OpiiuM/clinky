<script setup>
import { ref, onMounted, computed } from 'vue';
// import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useLinksStore, useFilterStore, useModalStore } from '@/stores';

import { FormCreateLink, TheFilter, TheCardBox, CountdownTimer, FormEditMultipleLinks } from '@/features/links';
import { AppModal, ModalTrigger, AppButton } from '@/shared/ui';
import { useDates, useResponsive } from '@/shared/lib';
import TheSidebar from '@/features/links/ui/TheSidebar.vue';
import TheNavigation from '@/features/navigation/ui/TheNavigation.vue';

// const router = useRouter();

const linksStore = useLinksStore();
const { isSelectMode, bufferCards } = storeToRefs(linksStore);
const { fetchLinks, toggleSelectMode, deleteBufferedLinks } = linksStore;

const filterStore = useFilterStore();
// const { logout } = useAuthStore();
const modalStore = useModalStore();
const { modalCreate, modalMultipleEdit, modalConfirmRemoveLinks } = storeToRefs(modalStore);
const { handleCloseModal } = modalStore;

onMounted(async () => {
  await fetchLinks();
  filterStore.initFilters();
});

// const handleLogout = async () => {
//   const response = await logout();

//   if (response === 'Error') {
//     router.push('/');
//     filterStore.$reset();
//   } else {
//     console.error('logout Error');
//   }
// };

const sidebarRef = ref(null);


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
      <!-- TODO: move to sidebar -->
      <the-filter class="sidebar__filter" />

      <app-button
        style="margin-top: 16px;"
        @click="toggleSelectMode"
      >
        {{ editCardsTitle }}
      </app-button>

      <template v-if="bufferCards.length > 0">
        <modal-trigger
          modal-key="modalConfirmRemoveLinks"
          color="red"
          style="margin-top: 10px;"
        >
          Удалить ссылки
        </modal-trigger>

        <modal-trigger
          modal-key="modalMultipleEdit"
          color="orange"
          style="margin-top: 10px;"
        >
          Редактировать ссылки
        </modal-trigger>
      </template>

      <app-button
        style="margin-top: 10px;"
        color="purple"
        @click="handleClickSaveFilters"
      >
        {{ saveFiltersTitle }}
      </app-button>

      <modal-trigger
        modal-key="modalCreate"
        color="blue"
        style="margin-top: 10px; margin-bottom: auto"
      >
        Создать ссылку
      </modal-trigger>

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
      </div>
      <!-- TODO: move to sidebar -->

      <the-navigation />
    </the-sidebar>

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
