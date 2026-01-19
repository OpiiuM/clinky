<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import lodash from 'lodash';

import { useLinksStore } from '@/stores';

const emit = defineEmits(['submit']);

const linksStore = useLinksStore();
const { bufferCards } = storeToRefs(linksStore);
const { editBufferedLinks } = linksStore;

const currentTags = ref([]);
const currentTagsOptions = ref([]);
const newTags = ref([]);

onMounted(() => {
  const uniqueTags = [];

  bufferCards.value.forEach((card) => {
    uniqueTags.push(...card.category);
  });

  const tempTags = [...new Set(uniqueTags)];

  currentTags.value = [...tempTags];
  currentTagsOptions.value = [...tempTags];
});

const addRemovableTag = (value) => {
  if (!currentTags.value.includes(value)) {
    currentTags.value.push(value);
  }
};

const addEditableTag = (value) => {
  if (!newTags.value.includes(value)) {
    newTags.value.push(value);
  }
};

const removeRemovableTag = (value) => {
  const index = currentTags.value.findIndex((el) => el === value);
  index !== -1 && currentTags.value.splice(index, 1);
};

const removeEditableTag = (value) => {
  const index = newTags.value.findIndex((el) => el === value);
  index !== -1 && newTags.value.splice(index, 1);
};

const handleSubmit = async () => {
  const differenceTags = lodash.difference(currentTagsOptions.value, currentTags.value);

  await editBufferedLinks(differenceTags, newTags.value);

  emit('submit');
};
</script>

<template>
  <form
    class="form"
    @submit.prevent="handleSubmit"
  >
    <div class="form__block">
      <h2 class="form__title">Редактировать тэги выбранных ссылок:</h2>
    </div>

    <div class="form__block">
      <!-- Тэги для удаления -->
      <div class="form__field">
        <app-select
          v-model="currentTags"
          multiple
          label="Текущие тэги"
          :options="currentTagsOptions"
          color-tags="blue"
          removable
          @add-value="addRemovableTag"
          @remove-value="removeRemovableTag"
        />
      </div>
      <!-- Тэги для добавления -->
      <div class="form__field">
        <app-select
          v-model="newTags"
          multiple
          label="Новые тэги"
          :options="linksStore.getCats"
          color-tags="orange"
          has-input
          removable
          @add-value="addEditableTag"
          @remove-value="removeEditableTag"
        />
      </div>
    </div>
    <div class="form__block">
      <app-button
        type="submit"
        color="green"
        class="form__action"
      >
        Изменить
      </app-button>
    </div>
  </form>
</template>
