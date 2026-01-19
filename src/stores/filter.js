import { defineStore } from 'pinia';
import { setFilters, getFilters, removeFilters } from '@/services/filter-manager';

// TODO: sort
export const useFilterStore = defineStore('filters', {
  state: () => ({
    search: '',
    tags: [],
    types: [],
    sortTypes: [],
  }),

  getters: {
    filters: (state) => {
      const { search, tags, types } = state;

      return {
        search,
        tags,
        types,
      };
    },

    sorts: (state) => {
      const { sortTypes } = state;

      return sortTypes;
    },
  },

  actions: {
    applyFilters(entity, data) {
      if (entity === 'search') {
        this.search = data;
      } else {
        const resultValues = [...this[entity]];
        const itemIndex = resultValues.findIndex((el) => el === data);

        ~itemIndex
          ? resultValues.splice(itemIndex, 1)
          : Array.isArray(data)
            ? resultValues.push(...data)
            : resultValues.push(data);

        this.$patch({ [entity]: resultValues });
      }
    },

    saveFilters() {
      try {
        setFilters(this.$state);
      } catch (e) {
        console.error(e);
      }
    },

    initFilters() {
      this.$state = { ...getFilters() };
    },

    resetFilters() {
      removeFilters();
      this.$reset();
    },
  },
});
