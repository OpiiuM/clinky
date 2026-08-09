<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import TheSidebar from '@/features/links/ui/TheSidebar.vue';
import TheNavigation from '@/features/navigation/ui/TheNavigation.vue';
import {
  CurrenciesConverter,
  CurrenciesMonthlyStats,
  CurrencyCard,
} from '@/features/currencies';
import { AppButton } from '@/shared/ui';
import { currenciesService } from '@/shared/api';

const fetchers = {
  usd: () => currenciesService.fetchUsd(),
  ecurrency: () => currenciesService.fetchEcurrency(),
};

const currencies = reactive({
  usd: {
    id: 'usd',
    label: 'Доллар',
    unit: 'RUB',
    rate: null,
    previous: null,
    change: null,
    changePercent: null,
    fetchedAt: null,
    error: null,
    isLoading: false,
  },
  ecurrency: {
    id: 'ecurrency',
    label: 'Ecurrency',
    unit: 'USDT',
    rate: null,
    previous: null,
    change: null,
    changePercent: null,
    fetchedAt: null,
    error: null,
    isLoading: false,
  },
});

const monthlyStatsRef = ref(null);
const converterRef = ref(null);
const currencyList = computed(() => Object.values(currencies));
const isAnyLoading = computed(() => currencyList.value.some((item) => item.isLoading));

const applyStatsRate = (rate) => {
  converterRef.value?.applyEcurrencyPrice(rate);
};

const fetchCurrency = async (id) => {
  const item = currencies[id];
  const fetcher = fetchers[id];

  if (!item || !fetcher || item.isLoading) {
    return;
  }

  item.isLoading = true;
  item.error = null;

  try {
    const data = await fetcher();
    item.rate = data.rate;
    item.previous = data.previous ?? null;
    item.change = data.change ?? null;
    item.changePercent = data.changePercent ?? null;
    item.fetchedAt = data.fetchedAt;

    if (id === 'ecurrency') {
      await monthlyStatsRef.value?.recordRate(data.rate);
    }
  } catch (error) {
    item.error = error?.message || 'Ошибка запроса';
  } finally {
    item.isLoading = false;
  }
};

const fetchAll = async () => {
  await Promise.all(currencyList.value.map((item) => fetchCurrency(item.id)));
};

onMounted(() => {
  fetchAll();
});
</script>

<template>
  <div class="page__container">
    <the-sidebar class="page__sidebar">
      <currencies-converter
        ref="converterRef"
        :usd-rate="currencies.usd.rate"
        :ecurrency-rate="currencies.ecurrency.rate"
      />

      <currencies-monthly-stats
        ref="monthlyStatsRef"
        @select-rate="applyStatsRate"
      />

      <the-navigation />
    </the-sidebar>

    <main class="page__content">
      <div class="currencies-page">
        <header class="currencies-page__header">
          <div class="currencies-page__heading">
            <h1 class="currencies-page__title">Валюты</h1>
            <p class="currencies-page__subtitle">
              Курсы запрашиваются вручную. Доступны доллар (ЦБ) и ecurrency.
            </p>
          </div>

          <app-button
            color="green"
            :disabled="isAnyLoading"
            @click="fetchAll"
          >
            {{ isAnyLoading ? 'Загрузка...' : 'Обновить все' }}
          </app-button>
        </header>

        <div class="currencies-page__grid">
          <currency-card
            v-for="item in currencyList"
            :key="item.id"
            :item="item"
            @refresh="fetchCurrency"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.currencies-page {
  display: flex;
  flex-direction: column;
  gap: rem(16px);
  padding: rem(16px);

  @media #{$screen-tablet} {
    gap: rem(24px);
    padding: rem(32px);
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: rem(16px);
    align-items: flex-start;

    @media #{$screen-tablet} {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
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
