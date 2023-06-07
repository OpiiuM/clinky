import { defineStore } from 'pinia';
import { useFilterStore } from '@/stores';

import { linksService } from '@/services';
import { getToken } from '@/services/token-manager';

import { useData, useSort } from '@/common/composables';

// TODO: add notifier
export const useLinksStore = defineStore('links', {
  state: () => ({
    links: [],
  }),

  getters: {
    getCats: (state) => {
      const arr = [];

      state.links.forEach((link) => {
        arr.push(...link.category);
      });

      return [...new Set(arr)];
    },

    getLinkById: (state) => (id) => {
      return state.links.find((link) => link.id === id);
    },

    getFilteredLinks: (state) => {
      const filterStore = useFilterStore();
      const filtersAreEmpty = Object.values(filterStore.filters).every((value) => !value.length);

      if (filtersAreEmpty) return state.links;

      const searchFilter = ({ title }) =>
        title.toLowerCase().includes(filterStore.filters.search.toLowerCase().trim());

      const tagsFilter = ({ category }) => {
        return category.some((cat) => filterStore.filters.tags.includes(cat));
      };

      const favoriteFilter = ({ isFavorite }) => isFavorite;

      return state.links.filter((link) => {
        let result = {
          search: searchFilter,
          tags: tagsFilter,
          types: favoriteFilter,
        };

        return Object.entries(result).every(
          ([key, callback]) => !filterStore.filters[key].length || callback(link),
        );
      });
    },

    getApplicationLinks: (state) => {
      const filterStore = useFilterStore();
      const sortsAreEmpty = !filterStore.sorts.length;

      if (sortsAreEmpty) return state.getFilteredLinks;

      const { sortAlphabetic } = useSort();

      return [...state.getFilteredLinks].sort((a, b) => {
        if (filterStore.sortTypes.includes('alphabetic')) {
          return sortAlphabetic(a, b);
        }
      });
    },
  },

  actions: {
    async fetchLinks() {
      const userId = getToken();
      const data = await linksService.fetchLinks(userId);

      if (!Object.values(data).length) return;

      const { normalizeLinks } = useData();
      this.links = normalizeLinks(data);
    },

    async addLink(data) {
      const userId = getToken();
      const link = await linksService.createLink(userId, data);

      this.links.push({
        id: link.key,
        ...data,
      });
    },

    async deleteLink(id) {
      const userId = getToken();
      await linksService.removeLink(userId, id);

      const index = this.links.findIndex((el) => el.id === id);
      this.links.splice(index, 1);
    },

    async editLink(link) {
      const { removeProperty } = useData();
      const userId = getToken();
      const data = removeProperty(link, (name) => name === 'id');
      await linksService.updateLink(userId, link.id, data);

      const index = this.links.findIndex((el) => el.id === link.id);
      this.links.splice(index, 1, link);
    },
  },
});
