<script setup>
import TheGoals from '@/modules/goals/TheGoals.vue';
import TheGallery from '@/modules/gallery/TheGallery.vue';

const gallery = [
  {
    src: 'version-1.jpg',
    alt: 'version #1',
  },
  {
    src: 'version-2.jpg',
    alt: 'version #2',
  },
  {
    src: 'version-3.jpg',
    alt: 'version #3',
  },
  {
    src: 'version-4.jpg',
    alt: 'version #4',
  },
];
</script>

<template>
  <div class="page__content">
    <div class="page__container container">
      <h1 style="margin-top: 30px">Clinky - link manager</h1>

      <app-tabs-wrapper style="margin-bottom: 40px">
        <app-tabs-item title="Project Goals">
          <TheGoals />
        </app-tabs-item>
        <app-tabs-item title="Chronic">
          <TheGallery :gallery="gallery" />
        </app-tabs-item>
      </app-tabs-wrapper>

      <app-button
        tag="router-link"
        to="signup"
      >
        Зарегистрироваться
      </app-button>

      <app-button
        tag="router-link"
        to="auth"
        color="green"
      >
        Войти
      </app-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.button {
  & + & {
    margin-left: rem($gap-micro);
  }
}
</style>
