<script setup>
import { useTempStorage } from '@/stores';
import { storeToRefs } from 'pinia';
import IconClose from '@/assets/icons/close.svg';

const tempStorage = useTempStorage();
const { storage } = storeToRefs(tempStorage);
const { openTempStorageLinks, removeLinkFromTempStorage } = tempStorage;
</script>

<template>
  <div class="temp-storage">
    <ul class="temp-storage__list">
      <li
        v-for="link in storage"
        :key="link.id"
        class="temp-storage__list-item"
      >
        <div class="storage-item">
          <div class="storage-item__value">
            {{ link.title }}
          </div>

          <button
            class="storage-item__remove-button"
            @click="removeLinkFromTempStorage(link.id)"
          >
            <icon-close class="icon" />
          </button>
        </div>
      </li>
    </ul>

    <app-button
      style="margin-top: auto"
      @click="openTempStorageLinks"
    >
      Открыть ссылки
    </app-button>
  </div>
</template>

<style lang="scss" scoped>
.temp-storage {
  display: flex;
  flex-direction: column;

  height: 100%;

  &__list {
  }

  &__list-item {
  }
}

.storage-item {
  display: flex;

  &__value {
    flex-grow: 1;
  }

  &__remove-button {
    flex-shrink: 0;

    cursor: pointer;
  }
}

</style>