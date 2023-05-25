<script setup>
import { ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, maxLength } from '@vuelidate/validators';

import { useLinksStore } from '@/stores';
import { useCategory } from '@/common/composables';
import { RULES } from '@/common/constants';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const emits = defineEmits(['submit']);

const linksStore = useLinksStore();
const { setCategory } = useCategory();

const rules = computed(() => ({
  link: {
    title: {
      required,
      maxLength: maxLength(RULES.maxLength.title),
    },
    href: {
      required,
      maxLength: maxLength(RULES.maxLength.href),
    },
  },
}));

const linkToEdit = { ...linksStore.getLinkById(props.id) };
const link = ref(linkToEdit);

const v$ = useVuelidate(rules, { link });

const handleAddTag = (value) => {
  if (!link.value.category.includes(value)) {
    link.value.category.push(value);
  }
};

const handleRemoveTag = (value) => {
  const index = link.value.category.findIndex((el) => el === value);
  index !== -1 && link.value.category.splice(index, 1);
};

const handleRemove = (id) => {
  linksStore.deleteLink(id);
  emits('submit');
};

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();

  if (!isValid) return;

  const { id, title, category, href, dateCreate, isFavorite } = link.value;
  const data = {
    id,
    title,
    category: setCategory(category),
    href,
    dateCreate,
    isFavorite,
  };

  linksStore.editLink(data);
  emits('submit');
};
</script>

<template>
  <form
    class="form"
    @submit.prevent="handleSubmit"
  >
    <div class="form__block">
      <h2 class="form__title">Ссылка "{{ link.id }}"</h2>
    </div>
    <div class="form__block">
      <div class="form__field">
        <app-input
          v-model.trim="link.title"
          label="Название"
          :hasError="!!v$.link.title.$errors.length"
          :errorText="v$.link.title.$errors[0]?.$message"
        />
      </div>
      <div class="form__field">
        <app-select
          v-model="link.category"
          multiple
          label="Тэги"
          :options="linksStore.getCats"
          color-tags="orange"
          has-input
          removable
          @add-value="handleAddTag"
          @remove-value="handleRemoveTag"
        />
      </div>
      <div class="form__field">
        <app-input
          v-model.trim="link.href"
          label="Ссылка"
          :hasError="!!v$.link.href.$errors.length"
          :errorText="v$.link.href.$errors[0]?.$message"
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
      <app-button
        type="button"
        class="form__action"
        color="red"
        @click="handleRemove(link.id)"
      >
        Удалить
      </app-button>
    </div>
  </form>
</template>
