<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore, useFilterStore } from '@/stores';

const router = useRouter();
const authStore = useAuthStore();
const filterStore = useFilterStore();

const handleLogout = async () => {
  const response = await authStore.logout();

  if (response === 'Error') {
    router.push('/');
    filterStore.$reset();
  } else {
    console.error('logout Error');
  }
};
</script>

<template>
  <nav class="navigation">
    <router-link to="/app" class="navigation__link" title="Главная">
      <span class="navigation__icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </span>
    </router-link>

    <router-link to="/attention" class="navigation__link navigation__link--attention" title="Внимание">
      <span class="navigation__icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </span>
    </router-link>

    <!-- <router-link to="/news" class="navigation__link navigation__link--news" title="Новости">
      <span class="navigation__icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
          <path d="M18 14h-8"/>
          <path d="M15 18h-5"/>
          <path d="M10 6h8v4h-8z"/>
        </svg>
      </span>
    </router-link> -->

    <button type="button" class="navigation__link navigation__link--logout" title="Выход" @click="handleLogout">
      <span class="navigation__icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </span>
    </button>
  </nav>
</template>

<style lang="scss" scoped>
.navigation {
  display: flex;
  align-items: stretch;
  gap: rem(8px);
  margin-top: auto;
  padding-top: rem(20px);
  border-top: rem(1px) solid rgba($white, 0.08);

  &__link {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: rem(6px);
    padding: rem(12px) rem(8px);
    border: none;
    border-radius: $border-radius;
    background: linear-gradient(135deg, $mine-shaft-3 0%, $mine-shaft 100%);
    color: $silver-chalice;
    font-family: inherit;
    font-size: rem(11px);
    font-weight: $font-weight-medium;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    text-decoration: none;
    cursor: pointer;
    transition:
      transform $transition-duration $transition-function,
      background $transition-duration $transition-function,
      color $transition-duration $transition-function,
      box-shadow $transition-duration $transition-function;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: linear-gradient(135deg, rgba($accent, 0.15) 0%, rgba($accent, 0.05) 100%);
      opacity: 0;
      transition: opacity $transition-duration $transition-function;
    }

    &:hover {
      color: $white;
      background: linear-gradient(135deg, $mine-shaft-4 0%, $mine-shaft-1 100%);
      transform: translateY(-2px);
      box-shadow: 0 rem(4px) rem(12px) rgba($black, 0.3);

      &::before {
        opacity: 1;
      }

      .navigation__icon {
        transform: scale(1.1);
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 rem(2px) rem(6px) rgba($black, 0.2);
    }

    // Активная ссылка
    &.router-link-exact-active {
      color: $white;
      background: linear-gradient(135deg, $accent 0%, darken($accent, 10%) 100%);
      box-shadow: 0 rem(4px) rem(16px) rgba($accent, 0.3);

      &::before {
        opacity: 0;
      }

      .navigation__icon {
        color: $white;
      }
    }

    // Модификатор для "Внимание"
    &--attention {
      &.router-link-exact-active {
        background: linear-gradient(135deg, $mustard 0%, $orange 100%);
        box-shadow: 0 rem(4px) rem(16px) rgba($orange, 0.3);
      }

      &:hover:not(.router-link-exact-active) {
        &::before {
          background: linear-gradient(135deg, rgba($mustard, 0.15) 0%, rgba($orange, 0.05) 100%);
        }
      }
    }

    // Модификатор для "Новости"
    &--news {
      &.router-link-exact-active {
        background: linear-gradient(135deg, $purple 0%, darken($purple, 15%) 100%);
        box-shadow: 0 rem(4px) rem(16px) rgba($purple, 0.3);
      }

      &:hover:not(.router-link-exact-active) {
        &::before {
          background: linear-gradient(135deg, rgba($purple, 0.15) 0%, rgba($purple, 0.05) 100%);
        }
      }
    }

    // Модификатор для "Выход"
    &--logout {
      &:hover {
        &::before {
          background: linear-gradient(135deg, rgba($red, 0.15) 0%, rgba($red, 0.05) 100%);
        }
      }

      &:active {
        background: linear-gradient(135deg, $red 0%, darken($red, 10%) 100%);
        color: $white;
      }
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(20px);
    height: rem(20px);
    transition: transform $transition-duration $transition-function;

    svg {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
