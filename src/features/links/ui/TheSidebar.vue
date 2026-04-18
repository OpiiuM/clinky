<script setup>
import { ref, computed, useAttrs } from 'vue';
import IconAngle from '@/shared/assets/icons/angle-down.svg';
import { useResponsive } from '@/shared/lib';

const { isDesktop } = useResponsive();
const attrs = useAttrs();

const isOpenMobileMenu = ref(false);

const handleCloseMobileMenu = () => {
  isOpenMobileMenu.value = false;
};

const isOpenCondition = computed(() => !isDesktop.value && isOpenMobileMenu.value);

const computedClass = computed(() => ({
  'sidebar--open': isOpenCondition.value,
}));

defineExpose({
  handleCloseMobileMenu,
});
</script>

<template>
  <transition name="appear">
    <div
      v-if="isOpenCondition"
      class="sidebar-overlay"
      @click="isOpenMobileMenu = !isOpenMobileMenu"
    />
  </transition>

  <aside
    v-bind="attrs"
    class="sidebar"
    :class="computedClass"
  >
    <div
      v-if="!isDesktop"
      class="sidebar__toggle"
    >
      <icon-angle
        class="sidebar__icon icon icon--button"
        @click="isOpenMobileMenu = !isOpenMobileMenu"
      />
    </div>

    <div class="sidebar__content">
      <slot />
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.appear-enter-active,
.appear-leave-active {
  transition: opacity 0.3s ease;
}

.appear-enter-from {
  opacity: 0;
}

.appear-leave-to {
  opacity: 0;
}
</style>
