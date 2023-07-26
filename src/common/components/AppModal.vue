<script setup>
import { toRef, watch } from 'vue';
import { useScrollLock } from '@vueuse/core';
import IconClose from '@/assets/icons/close.svg';

defineEmits(['close']);

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const isOpen = toRef(props, 'isOpen');

const $html = document.documentElement;
const isLocked = useScrollLock($html);

watch(isOpen, () => {
  isLocked.value = isOpen.value;
}, {
  immediate: true,
});
</script>

<template>
  <teleport to="#popup">
    <transition name="fade">
      <div
        v-if="isOpen"
        class="modal-overlay"
        @mousedown.self="$emit('close')"
      >
        <div class="modal">
          <icon-close
            class="modal__close icon icon--button icon--medium"
            @click="$emit('close')"
          />
          <div class="modal__content">
            <div class="modal__container">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity $transition-duration ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.modal {
  position: relative;

  width: 100%;
  max-width: rem(700px);

  color: $white;
  border-radius: rem($border-radius-micro);
  background-color: $mine-shaft;

  &-overlay {
    @include position-stretching(fixed, $z-index-popup);

    display: flex;
    align-items: center;
    justify-content: center;

    transition: opacity $transition-duration ease-in-out;

    background-color: rgba($black, 0.55);
    backdrop-filter: blur($gap-micro);
  }

  &__close {
    position: absolute;
    top: rem(-$gap);
    right: 0;

    color: $white;
  }

  &__content {
    // overflow-y: auto;

    max-height: 90vh;
    padding: rem($gap-medium);
  }
}
</style>
