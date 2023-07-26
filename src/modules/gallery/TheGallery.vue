<script setup>
import { ref, reactive } from 'vue';
import { getImageUrl } from '@/common/composables';

defineProps({
  gallery: {
    type: Array,
    required: true,
  },
});

const modals = reactive({
  img: false,
});

const modalAction = (modalType, status) => {
  modals[modalType] = status;
};

const modalImage = ref('');

const handleClick = (img) => {
  modalImage.value = getImageUrl(img);
  modalAction('img', true);
};
</script>

<template>
  <div class="gallery">
    <div class="gallery__grid">
      <div
        v-for="(image, index) in gallery"
        :key="index"
        class="gallery__item"
      >
        <img
          :src="getImageUrl(image.src)"
          :alt="image.alt"
          class="gallery__image"
          @click="handleClick(image.src)"
        />
      </div>
    </div>
  </div>

  <app-modal
    :is-open="!!modals.img"
    @close="modalAction('img', false)"
  >
    <app-zoom
      :src="modalImage"
    />
  </app-modal>
</template>

<style lang="scss" scoped>
.gallery {
  &__grid {
    display: flex;
    flex-wrap: wrap;

    margin: 0 rem(-$gap-micro) rem(-$gap-mini);
    
    @media #{$screen-desktop} {
      margin: 0 rem(-$gap-mini) rem(-$gap-small);
    }
  }

  &__item {
    flex-basis: math.percentage(math.div(1, 2));

    margin-bottom: rem($gap-mini);
    padding: 0 rem($gap-micro);

    @media #{$screen-tablet} {
      flex-basis: math.percentage(math.div(1, 3));

      margin-bottom: rem($gap-small);
      padding: 0 rem($gap-mini);
    }

    @media #{$screen-desktop} {
      flex-basis: math.percentage(math.div(1, 4));
    }
  }

  &__image {
    max-width: 100%;

    transition: border-color $transition-duration $transition-function;
    cursor: pointer;
    user-select: none;

    border: rem(2px) solid #eee;
    border-radius: rem($border-radius);

    &:hover {
      border-color: $blue;
    }
  }
}
</style>
