<script setup>
import { ref } from 'vue';
import TheSidebar from '@/modules/app/TheSidebar.vue';
import TheNavigation from '@/modules/navigation/TheNavigation.vue';
import NewsCard from '@/modules/news/NewsCard.vue';
import { setupNews } from '@/mocks/news';

const news = ref(setupNews());
</script>

<template>
  <div class="page__container">
    <the-sidebar class="page__sidebar">
      <the-navigation />
    </the-sidebar>

    <main class="page__content news-page">
      <header class="news-page__header">
        <h1 class="news-page__title">Новости</h1>
        <p class="news-page__subtitle">
          Актуальные новости из мира технологий
        </p>
      </header>

      <div class="news-page__grid">
        <news-card
          v-for="(item, index) in news"
          :key="index"
          :item="item"
        />
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.news-page {
  display: flex;
  flex-direction: column;
  gap: rem(16px);
  padding: rem(16px);

  @media #{$screen-tablet} {
    gap: rem(24px);
    padding: rem(32px);
  }

  &__header {
    margin-bottom: rem(4px);

    @media #{$screen-tablet} {
      margin-bottom: rem(8px);
    }
  }

  &__title {
    margin: 0 0 rem(8px);
    font-size: rem(22px);
    font-weight: $font-weight-bold;
    color: $white;

    @media #{$screen-tablet} {
      font-size: rem(28px);
    }
  }

  &__subtitle {
    margin: 0;
    font-size: rem(13px);
    color: $silver-chalice;
    line-height: 1.5;

    @media #{$screen-tablet} {
      font-size: rem(14px);
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: rem(16px);

    @media #{$screen-tablet} {
      grid-template-columns: repeat(2, 1fr);
    }

    @media #{$screen-desktop} {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
