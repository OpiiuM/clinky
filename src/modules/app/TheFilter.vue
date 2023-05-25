<script setup>
import { storeToRefs } from 'pinia';
import { useLinksStore, useFilterStore } from '@/stores';

import { CARD_TYPES, SORT_TYPES } from '@/common/constants';

const linksStore = useLinksStore();
const filtersStore = useFilterStore();

const { search, tags, types, sortTypes } = storeToRefs(filtersStore);
</script>

<template>
  <div class="filter">
    <div class="filter__group">
      <div class="filter__row">
        <app-input
          v-model.trim="search"
          placeholder="Name"
        />
      </div>
      <div class="filter__row">
        <app-select
          v-model="tags"
          multiple
          :options="linksStore.getCats"
          placeholder="Tags"
        />
      </div>
      <div class="filter__row">
        <app-select
          v-model="types"
          multiple
          :options="CARD_TYPES"
          placeholder="Card Types"
          color-tags="orange"
        />
      </div>
      <div class="filter__row">
        <app-select
          v-model="sortTypes"
          multiple
          :options="SORT_TYPES"
          placeholder="Sort Types"
          color-tags="green"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter {
  &__group {
    margin-bottom: rem($gap);

    @include resetting-vertical-indentation-of-last;
  }

  &__row {
    margin-bottom: rem($gap-small);

    @include resetting-vertical-indentation-of-last;
  }
}
</style>
