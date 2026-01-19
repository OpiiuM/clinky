import { defineStore } from 'pinia';
import lodash from 'lodash';
import { useFilterStore } from '@/stores';

import { linksService } from '@/services';
import { getToken } from '@/services/token-manager';

import { useData, useSort } from '@/common/composables';
import { LINK_ELO } from '@/common/constants';

const { removeProperty } = useData();

export const useLinksStore = defineStore('links', {
  state: () => ({
    links: [],
    bufferCards: [],
    isSelectMode: false,
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

      const searchFilter = ({ title, href }) => {
        const searchValue = filterStore.filters.search.toLowerCase().trim();

        if (searchValue.startsWith('site:')) {
          return href.toLowerCase().includes(searchValue.slice(5));
        }

        return title.toLowerCase().includes(searchValue);
      };

      const tagsFilter = ({ category }) => {
        return filterStore.filters.tags.every(
          (tag) => (category.includes(tag)),
        );
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

      return state.getFilteredLinks.toSorted((a, b) => {
        if (filterStore.sortTypes.includes('alphabetic')) {
          return sortAlphabetic(a, b);
        }

        // return a?.elo - b?.elo;
      });
    },

    hasCardInBuffer: (state) => (id) => {
      return state.bufferCards.some((card) => card.id === id);
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
      const transformData = {
        ...data,
        elo: LINK_ELO.startValue,
      };

      const userId = getToken();
      const link = await linksService.createLink(userId, transformData);

      this.links.push({
        id: link.key,
        ...transformData,
      });
    },

    async deleteLink(id) {
      const userId = getToken();
      await linksService.removeLink(userId, id);

      const index = this.links.findIndex((el) => el.id === id);
      this.links.splice(index, 1);
    },

    async deleteBufferedLinks() {
      const userId = getToken();

      this.bufferCards.forEach(async (card) => {
        await linksService.removeLink(userId, card.id);
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      await this.fetchLinks();
      this.toggleSelectMode();
    },

    async editLink(link) {
      const userId = getToken();
      const data = removeProperty(link, (name) => name === 'id');
      await linksService.updateLink(userId, link.id, data);

      const index = this.links.findIndex((el) => el.id === link.id);
      this.links.splice(index, 1, link);
    },

    async editBufferedLinks(arrayRemoveTags, arrayAddTags) {
      const editCardsData = [];

      this.bufferCards.forEach((card) => {
        const tempCard = { ...card };

        // TODO: убрать возможное пересечение сначала удалили тег "archive", потом его добавили
        lodash.pullAll(tempCard.category, arrayRemoveTags);
        tempCard.category = tempCard.category.concat(arrayAddTags);

        editCardsData.push(tempCard);
      });

      /** api */
      const userId = getToken();

      editCardsData.forEach(async (card) => {
        const data = removeProperty(card, (name) => name === 'id');

        await linksService.updateLink(userId, card.id, data);
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      await this.fetchLinks();
      this.toggleSelectMode();
    },

    toggleSelectMode() {
      if (this.isSelectMode) {
        this.bufferCards = [];
        this.isSelectMode = false;
      } else {
        this.isSelectMode = true;
      }
    },

    addCardToBuffer(id) {
      if (this.bufferCards.includes(id)) {
        this.bufferCards = this.bufferCards.filter((el) => el !== id);
      } else {
        this.bufferCards.push(id);
      }
    },


  },
});
