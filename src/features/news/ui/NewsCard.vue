<script setup>
import { computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const formattedDate = computed(() => {
  const date = new Date(props.item.publishedAt);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
});
</script>

<template>
  <a
    :href="item.url"
    target="_blank"
    rel="noopener noreferrer"
    class="news-card"
  >
    <div class="news-card__image">
      <img
        v-if="item.urlToImage"
        :src="item.urlToImage"
        :alt="item.title"
        loading="lazy"
      />
      <div v-else class="news-card__placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
      </div>
    </div>

    <div class="news-card__content">
      <div class="news-card__meta">
        <span class="news-card__source">{{ item.source.name }}</span>
        <span class="news-card__date">{{ formattedDate }}</span>
      </div>

      <h3 class="news-card__title">{{ item.title }}</h3>

      <p v-if="item.description" class="news-card__description">
        {{ item.description }}
      </p>

      <span v-if="item.author" class="news-card__author">{{ item.author }}</span>
    </div>
  </a>
</template>

<style lang="scss" scoped>
.news-card {
  display: flex;
  flex-direction: column;
  background: linear-gradient(145deg, $mine-shaft-3 0%, $mine-shaft 100%);
  border-radius: $border-radius;
  border: rem(1px) solid rgba($white, 0.05);
  overflow: hidden;
  text-decoration: none;
  transition: transform $transition-duration $transition-function,
              box-shadow $transition-duration $transition-function,
              border-color $transition-duration $transition-function;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 rem(12px) rem(32px) rgba($black, 0.4);
    border-color: rgba($purple, 0.3);

    .news-card__image img {
      transform: scale(1.05);
    }

    .news-card__title {
      color: $purple;
    }
  }

  &__image {
    position: relative;
    width: 100%;
    height: rem(160px);
    overflow: hidden;
    background: $mine-shaft-4;

    @media #{$screen-tablet} {
      height: rem(180px);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform $transition-duration $transition-function;
    }
  }

  &__placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: $scorpion;

    svg {
      width: rem(48px);
      height: rem(48px);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: rem(10px);
    padding: rem(16px);
    flex: 1;

    @media #{$screen-tablet} {
      padding: rem(20px);
      gap: rem(12px);
    }
  }

  &__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: rem(12px);
    font-size: rem(11px);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__source {
    color: $purple;
    font-weight: $font-weight-medium;
  }

  &__date {
    color: $scorpion;
  }

  &__title {
    margin: 0;
    font-size: rem(15px);
    font-weight: $font-weight-medium;
    color: $white;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color $transition-duration $transition-function;

    @media #{$screen-tablet} {
      font-size: rem(16px);
    }
  }

  &__description {
    margin: 0;
    font-size: rem(13px);
    color: $silver-chalice;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__author {
    margin-top: auto;
    font-size: rem(12px);
    color: $scorpion;

    &::before {
      content: '— ';
    }
  }
}
</style>
