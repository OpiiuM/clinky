<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useVuelidate } from '@vuelidate/core';
import { required, email } from '@vuelidate/validators';
import { useAuthStore } from '@/stores';

// TODO: module - auth
const router = useRouter();

const authStore = useAuthStore();

const rules = {
  email: { required, email },
  password: { required },
};

const data = reactive({
  email: '',
  password: '',
});

const formBlock = ref(false);

const v$ = useVuelidate(rules, data);

const handleSubmit = async () => {
  try {
    const isValid = await v$.value.$validate();

    if (!isValid) return;

    formBlock.value = true;
    const responce = await authStore.register(data);

    if (responce !== 'Success') {
      console.error(responce);
    } else {
      router.push('/app');
    }
  } catch (error) {
    console.error(error);
  } finally {
    formBlock.value = false;
  }
};
</script>

<template>
  <div class="page__container">
    <div class="auth">
      <div class="auth__block auth__block--banner"></div>
      <div class="auth__block">
        <div class="auth__content">
          <form
            class="auth__form form"
            @submit.prevent="handleSubmit"
          >
            <div class="form__block">
              <h2 class="form__title">Зарегистрироваться | SignUp</h2>
            </div>
            <div class="form__block">
              <div class="form__field">
                <app-input
                  v-model.trim="data.email"
                  label="Email"
                  type="text"
                  :hasError="!!v$.email.$errors.length"
                  :errorText="v$.email.$errors[0]?.$message"
                />
              </div>
              <div class="form__field">
                <app-input
                  v-model.trim="data.password"
                  label="Password"
                  type="password"
                  :hasError="!!v$.password.$errors.length"
                  :errorText="v$.password.$errors[0]?.$message"
                />
              </div>
            </div>
            <div class="form__block">
              <app-button
                type="submit"
                :disabled="formBlock"
                class="form__action"
              >
                Регистрация
              </app-button>
              <app-button
                tag="router-link"
                to="/"
                color="green"
                class="form__action"
              >
                Вернуться на главную
              </app-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth {
  @media #{$screen-laptop} {
    display: flex;

    min-height: 100vh;
  }

  &__block {
    position: relative;

    @media #{$screen-laptop} {
      flex: 1;
    }

    &--banner {
      overflow: hidden;

      max-height: rem(360px);
      margin-bottom: rem($gap-small);

      background: linear-gradient(45deg, $boston-blue, $green);

      @media (max-width: 1023px) {
        border-bottom-right-radius: rem($border-radius);
        border-bottom-left-radius: rem($border-radius);
      }

      @media #{$screen-laptop} {
        max-height: none;
        margin-bottom: 0;
      }

      &::before {
        @media (max-width: 1023px) {
          display: block;

          padding-bottom: 100%;

          content: '';
        }
      }
    }
  }

  &__image {
    @include position-stretching(absolute);

    width: 100%;
    height: 100%;

    @include object-fit(cover);
  }

  &__content {
    max-width: rem(600px);
    margin-right: auto;
    margin-left: auto;
    padding: 0 rem($gap-small);

    @media #{$screen-laptop} {
      max-width: rem(800px);
      margin-top: rem($gap);
    }
  }

  &__form {
  }
}
</style>
