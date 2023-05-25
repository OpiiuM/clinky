<template>
  <div class="card-button">+</div>
</template>

<style lang="scss" scoped>
.card-button {
  @include text-size(30px, 30px, $font-weight-bold);

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  cursor: pointer;
  user-select: none;

  border-radius: rem($border-radius-micro);
  background-color: $white;
}
</style>
