import { defineStore } from 'pinia';
import filterService from '@/services/filter-service';
import { getToken } from '@/services/token-manager';

const getDefaultFilters = () => ({
  search: '',
  tags: [],
  matchAnyTag: false,
  types: [],
  sortTypes: [],
});

const normalizeStringArray = (value) => {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : [];
};

const normalizeFilters = (filters = {}) => ({
  search: typeof filters.search === 'string' ? filters.search : '',
  tags: normalizeStringArray(filters.tags),
  matchAnyTag: Boolean(filters.matchAnyTag),
  types: normalizeStringArray(filters.types),
  sortTypes: normalizeStringArray(filters.sortTypes),
});

// TODO: sort
export const useFilterStore = defineStore('filters', {
  state: getDefaultFilters,

  getters: {
    filters: (state) => {
      const { search, tags, matchAnyTag, types } = state;

      return {
        search,
        tags,
        matchAnyTag,
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

    async saveFilters() {
      try {
        const userId = getToken();

        if (!userId) return;

        await filterService.saveFilters(userId, normalizeFilters(this.$state));
      } catch (e) {
        console.error(e);
      }
    },

    async initFilters() {
      try {
        const userId = getToken();

        if (!userId) return;

        const filters = await filterService.getFilters(userId);

        this.$patch({
          ...getDefaultFilters(),
          ...normalizeFilters(filters),
        });
      } catch (e) {
        console.error(e);
      }
    },

    async resetFilters() {
      try {
        const userId = getToken();

        if (userId) {
          await filterService.removeFilters(userId);
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.$reset();
      }
    },
  },
});
