<script setup>
import { useModalStore } from '@/stores';
import AppButton from './AppButton.vue';

const props = defineProps({
  modalKey: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: 'blue',
  },
  outline: {
    type: Boolean,
    default: false,
  },
  tag: {
    type: String,
    default: 'button',
  },
});

const modalStore = useModalStore();

const handleClick = () => {
  modalStore.handleOpenModal(props.modalKey);
};
</script>

<template>
  <app-button
    :tag="tag"
    :color="color"
    :outline="outline"
    @click="handleClick"
  >
    <slot />
  </app-button>
</template>
