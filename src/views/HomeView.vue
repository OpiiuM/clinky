<script setup>
import TheGoals from '@/modules/goals/TheGoals.vue';
</script>

<template>
  <div class="page">
    <div class="page__content">
      <div
        class="page__container container"
        style="color: white"
      >
        <h1 style="margin-top: 30px">Clinky - link manager</h1>

        <app-tabs-wrapper style="margin-bottom: 40px">
          <app-tabs-item title="Project Goals">
            <the-goals />
          </app-tabs-item>
          <app-tabs-item title="Guide"> content tab 1 </app-tabs-item>
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
  </div>
</template>

<style lang="scss" scoped>
.button {
  & + & {
    margin-left: rem($gap-micro);
  }
}
</style>
