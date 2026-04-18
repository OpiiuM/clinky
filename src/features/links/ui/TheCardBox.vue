<script setup>
import { ref, reactive } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { storeToRefs } from 'pinia';

import { useLinksStore } from '@/stores';

import CardLink from '@/modules/app/card/CardLink.vue';
import FormEditLink from '@/modules/app/form/FormEditLink.vue';

const linksStore = useLinksStore();
const { getApplicationLinks, hasCardInBuffer, isSelectMode } = storeToRefs(linksStore);

const modals = reactive({
  edit: false,
});

const editLinkId = ref(null);

const modalAction = (modalType, status) => {
  modals[modalType] = status;
};

const handleEdit = (id) => {
  editLinkId.value = id;
  modalAction('edit', true);
};

const handleChange = useDebounceFn((link, status) => {
  const data = {
    ...link,
    isFavorite: status,
  };

  linksStore.editLink(data);
}, 1000);
</script>

<template>
  <section class="card-box">
    <div
      v-for="link in getApplicationLinks"
      :key="link.id"
      class="card-box__item"
    >
    <card-link
      :id="link.id"
      :category="link.category"
      :title="link.title"
      :href="link.href"
      :is-favorite="link.isFavorite"
      :is-select-mode="isSelectMode"
      :is-selected="hasCardInBuffer(link.id)"
      @favorite="handleChange(link, $event)"
      @edit="handleEdit"
      @add-to-buffer="() => linksStore.addCardToBuffer(link)"
    />
    </div>
  </section>

  <app-modal
    :is-open="modals.edit"
    @close="modalAction('edit', false)"
  >
    <form-edit-link
      :id="editLinkId"
      @submit="modalAction('edit', false)"
    />
  </app-modal>
</template>

<style lang="scss" scoped>
.card-box {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: minmax(rem(120px), 1fr);
  grid-gap: rem($gap-mini);

  @media #{$screen-tablet} {
    grid-template-columns: repeat(3, 1fr);
    grid-gap: rem($gap-small);
  }

  @media #{$screen-laptop} {
    grid-template-columns: repeat(4, 1fr);
  }

  @media #{$screen-desktop} {
    grid-template-columns: repeat(5, 1fr);
  }

  @media (min-width: 1600px) {
    grid-template-columns: repeat(6, 1fr);
  }

  &__item {
    display: flex;
  }
}
</style>
