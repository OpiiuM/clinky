<script setup>
import { ref, computed, useAttrs } from 'vue';
import IconAngle from '@/assets/icons/angle-down.svg';
import { useResponsive } from '@/common/composables/useResponsive';

const { isDesktop } = useResponsive();
const attrs = useAttrs();

const isOpenMobileMenu = ref(false);
// const touchStartY = ref(0);
// const touchEndY = ref(0);

const handleCloseMobileMenu = () => {
  isOpenMobileMenu.value = false;
};

const isOpenCondition = computed(() => !isDesktop.value && isOpenMobileMenu.value);

const computedClass = computed(() => ({
  'sidebar--open': isOpenCondition.value,
}));

// // Обработка начала касания
// const handleTouchStart = (e) => {
//   touchStartY.value = e.touches[0].clientY;
// };

// // Обработка движения пальца
// const handleTouchMove = (e) => {
//   touchEndY.value = e.touches[0].clientY;
// };

// // Обработка окончания касания — проверка свайпа
// const handleTouchEnd = () => {
//   if (!isOpenMobileMenu.value) return;

//   const deltaY = touchEndY.value - touchStartY.value;
//   const threshold = 50; // Минимальное расстояние свайпа

//   // Свайп вниз: touchEndY > touchStartY
//   if (deltaY > threshold) {
//     isOpenMobileMenu.value = false;
//   }
// };

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
