<script setup>
import { ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
import { useTimerStore } from '@/stores';
import { storeToRefs } from 'pinia';

const isDateFormat = (value) => /\d{2}-\d{2}-\d{4}/.test(value);

const emits = defineEmits(['submit']);

const timerStore = useTimerStore();
const { timer: storeTimer } = storeToRefs(timerStore);
const { updateTimer, removeTimer } = timerStore;

const rules = computed(() => ({
  timer: {
    required,
    isDateFormat: helpers.withMessage('Incorrect date', isDateFormat),
  },
}));

const timer = ref('');
const v$ = useVuelidate(rules, { timer });

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();

  if (!isValid) return;

  await updateTimer(timer.value);

  emits('submit');
};

const handleRemoveClick = async () => {
  await removeTimer();
  emits('submit');
};
</script>

<template>
  <form
    class="form"
    @submit.prevent="handleSubmit"
  >
    <div class="form__block">
      <h2 class="form__title">Изменить таймер</h2>
    </div>

    <div class="form__block">
      <div class="form__field">
        <app-input
          v-model.trim="timer"
          label="Дата окончания"
          placeholder="MM-DD-YYYY"
          :hasError="!!v$.timer.$errors.length"
          :errorText="v$.timer.$errors[0]?.$message"
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
        v-if="storeTimer"
        type="button"
        class="form__action"
        color="red"
        @click="handleRemoveClick"
      >
        Удалить
      </app-button>
    </div>
  </form>
</template>
