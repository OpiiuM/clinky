<template>
  <div class="tag">
    <span class="tag__text">
      <slot />
    </span>
  </div>
</template>

<style lang="scss" scoped>
.tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  padding: rem($gap-micro) rem($gap-mini);

  border-radius: rem(12px);

  background-color: $mirage;

  &__text {
    @include text-size(14px, 16px);

    color: lighten($dodger-blue, 15%);
  }
}
</style>
