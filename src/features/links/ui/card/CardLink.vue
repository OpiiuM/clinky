<script setup>
import { computed } from 'vue';

import IconEdit from '@/assets/icons/edit.svg';
import IconStar from '@/assets/icons/star.svg';
import IconStarChecked from '@/assets/icons/star-checked.svg';
// import IconPlus from '@/assets/icons/plus.svg';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  category: {
    type: Array,
    default: () => ['no-sort'],
  },
  title: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true,
  },
  // elo: {
  //   type: Number,
  //   default: 0,
  // },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  isSelectMode: {
    type: Boolean,
    default: false,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['favorite', 'edit', 'addToBuffer']);

const sortByLengthTags = computed(() => {
  return props.category.toSorted((a, b) => a.length - b.length);
});

const computedClasses = computed(() => ({
  'card-link--select': props.isSelectMode,
  'card-link--selected': props.isSelected,
}));

// const handleAddToStorage = () => {
//   emits('addStorage', {
//     id: props.id,
//     title: props.title,
//     href: props.href,
//     category: props.category,
//     isFavorite: props.isFavorite,
//   });
// };

const handleClick = () => {
  if (!props.isSelectMode) return;

  emit('addToBuffer', props.id);
};
</script>

<template>
  <article
    class="card-link"
    :class="computedClasses"
    @click="handleClick"
  >
    <a
      target="_blank"
      :href="props.href"
      class="card-link__link"
    />

    <div class="card-link__inner">
      <h2 class="card-link__title">
        {{ props.title }}
      </h2>

      <ul class="card-link__tags">
        <li
          v-for="(cat, index) in sortByLengthTags"
          :key="index"
          class="card-link__tags-item"
        >
          <app-tag> #{{ cat }} </app-tag>
        </li>
      </ul>
    </div>

    <div class="card-link__actions">
      <icon-star
        v-if="!isFavorite"
        class="card-link__actions-icon card-link__actions-icon--favorite icon icon--button"
        @click="$emit('favorite', true)"
      />
      <icon-star-checked
        v-else
        class="card-link__actions-icon card-link__actions-icon--favorite icon icon--button"
        @click="$emit('favorite', false)"
      />
      <!-- <icon-plus
        class="card-link__actions-icon card-link__actions-icon--edit icon icon--button"
        @click="handleAddToStorage"
      /> -->
      <icon-edit
        class="card-link__actions-icon card-link__actions-icon--edit icon icon--button"
        @click="$emit('edit', id)"
      />
    </div>
  </article>
</template>

<style lang="scss" scoped>
// TODO: скин давно некликнутой ссылки

.card-link {
  position: relative;

  width: 100%;
  height: 100%;

  user-select: none;

  border-radius: rem($border-radius-micro);
  background-color: $white;

  &--select {
    cursor: pointer;
  }

  &--select & {
    &__link {
      display: none;
    }
  }

  &--selected {
    outline: rem(4px) solid orange;
  }

  &__link {
    @include position-stretching(absolute);

    text-decoration: none;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    height: 100%;
    padding: rem($gap-small) rem($gap) rem($gap-small) rem($gap-small);
  }

  &__title {
    @include text-size(20px, 26px, $font-weight-average);

    @include text-truncate-by-row(3);

    margin-bottom: rem($gap-small);

    word-break: break-word;

    color: $black;

    @media #{$screen-laptop} {
      margin-bottom: rem($gap-medium);
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;

    margin: 0 rem(-$gap-micro) rem(-$gap-micro);

    &-item {
      margin: 0 rem($gap-micro) rem($gap-micro);
    }
  }

  &__actions {
    position: absolute;
    top: rem($gap-small);
    right: rem(6px);
    bottom: rem($gap-small);

    display: flex;
    flex-direction: column;

    &-icon {
      &--favorite {
        margin-top: rem(2px);

        color: $mustard;
      }

      &--edit {
        margin-top: auto;

        transition: color $transition-duration $transition-function;

        color: rgba($tundora, 0.5);
      }

      &--edit:hover,
      &--edit#{&}--active {
        color: $black;
      }
    }
  }
}
</style>
