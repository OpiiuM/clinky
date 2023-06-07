<script setup>
</script>

<template>
  <div class="gui-block">
    <h3 class="gui-block__title">Кнопки</h3>

    <ul class="gui-block__list">
      <li class="gui-block__item">
        <app-button>
          blue
        </app-button>
      </li>
      <li class="gui-block__item">
        <app-button color="orange">
          orange
        </app-button>
      </li>
      <li class="gui-block__item">
        <app-button color="green">
          green
        </app-button>
      </li>
      <li class="gui-block__item">
        <app-button color="red">
          red
        </app-button>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.gui-block {
  &__title {
    margin-bottom: rem($gap-small);
  }

  &__list {
    display: flex;
    flex-wrap: wrap;

    margin: 0 rem(-$gap-micro);
  }

  &__item {
    margin-bottom: rem($gap-mini);
    padding: 0 rem($gap-micro);
  }
}
</style>
