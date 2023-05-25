<script setup>
import { reactive } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { useLinksStore } from '@/stores';

import CardButton from '@/modules/app/card/CardButton.vue';
import CardLink from '@/modules/app/card/CardLink.vue';
import FormCreateLink from '@/modules/app/form/FormCreateLink.vue';
import FormEditLink from '@/modules/app/form/FormEditLink.vue';

const linksStore = useLinksStore();

const modals = reactive({
  creation: false,
  edit: false,
});

let editLinkId;

const modalAction = (modalType, status) => {
  modals[modalType] = status;
};

const handleEdit = (id) => {
  editLinkId = id;
  modalAction('edit', true);
};

const handleChange = useDebounceFn((link, status) => {
  const { id, title, category, href, dateCreate } = link;

  const data = {
    id,
    title,
    category,
    href,
    dateCreate,
    isFavorite: status,
  };

  linksStore.editLink(data);
}, 1000);
</script>

<template>
  <section class="card-box">
    <div class="card-box__item">
      <card-button @click="modalAction('creation', true)" />
    </div>
    <div
      v-for="link in linksStore.getApplicationLinks"
      :key="link.id"
      class="card-box__item"
    >
      <card-link
        :id="link.id"
        :category="link.category"
        :title="link.title"
        :href="link.href"
        :is-favorite="link.isFavorite"
        @favorite="handleChange(link, $event)"
        @edit="handleEdit"
      />
    </div>
  </section>

  <app-modal
    v-if="modals.creation"
    @close="modalAction('creation', false)"
  >
    <form-create-link @submit="modalAction('creation', false)" />
  </app-modal>

  <app-modal
    v-if="modals.edit"
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
