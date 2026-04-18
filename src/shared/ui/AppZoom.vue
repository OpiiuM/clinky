<script setup>
import { ref, onMounted } from 'vue';
import { useZoomImageWheel } from '@zoom-image/vue';

defineProps({
  src: {
    type: String,
    required: true,
    validator(val) {
      return !!val.trim();
    },
  },
});

const { createZoomImage } = useZoomImageWheel();
const $imageWheelContainerRef = ref(null);

onMounted(() => {
  createZoomImage($imageWheelContainerRef.value);
});
</script>

<template>
  <div class="zoom">
    <div class="zoom__content">
      <div
        ref="$imageWheelContainerRef"
        class="zoom__box"
      >
        <img
          :src="src"
          width="652"
          height="522"
          class="zoom__image"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.zoom {
  &__box {
    max-width: 100%;
  }

  &__image {
    width: 100%;
    height: 100%;

    user-select: none;
    user-drag: none;
    -webkit-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;

    object-fit: contain;
  }
}
</style>
