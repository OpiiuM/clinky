<script setup>
import { reactive } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, maxLength } from '@vuelidate/validators';

import { useLinksStore } from '@/stores';
import { useDates, useCategory } from '@/common/composables';
import { RULES } from '@/common/constants';

const emits = defineEmits(['submit']);

const linksStore = useLinksStore();
const { convert } = useDates();
const { setCategory } = useCategory();

const state = reactive({
  title: '',
  category: [],
  href: '',
});

const rules = {
  title: {
    required,
    maxLength: maxLength(RULES.maxLength.title),
  },
  href: {
    required,
    maxLength: maxLength(RULES.maxLength.href),
  },
};

const v$ = useVuelidate(rules, state);

const handleAdd = (value) => {
  if (!state.category.includes(value)) {
    state.category.push(value);
  }
};

const handleRemove = (value) => {
  const index = state.category.findIndex((el) => el === value);
  index !== -1 && state.category.splice(index, 1);
};

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();

  if (!isValid) return;

  const data = {
    title: state.title,
    category: setCategory(state.category),
    href: state.href,
    dateCreate: convert(new Date()),
    isFavorite: false,
  };

  linksStore.addLink(data);
  emits('submit');
};
</script>

<template>
  <form
    class="form"
    @submit.prevent="handleSubmit"
  >
    <div class="form__block">
      <h2 class="form__title">Новая ссылка</h2>
    </div>
    <div class="form__block">
      <div class="form__field">
        <app-input
          v-model.trim="state.title"
          label="Название"
          :hasError="!!v$.title.$errors.length"
          :errorText="v$.title.$errors[0]?.$message"
        />
      </div>
      <div class="form__field">
        <app-select
          v-model="state.category"
          multiple
          label="Тэги"
          :options="linksStore.getCats"
          has-input
          removable
          @add-value="handleAdd"
          @remove-value="handleRemove"
        />
      </div>
      <div class="form__field">
        <app-input
          v-model.trim="state.href"
          label="Ссылка"
          placeholder="https://google.com"
          :hasError="!!v$.href.$errors.length"
          :errorText="v$.href.$errors[0]?.$message"
        />
      </div>
    </div>
    <div class="form__block">
      <app-button type="submit"> Создать </app-button>
    </div>
  </form>
</template>
