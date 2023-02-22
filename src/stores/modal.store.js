import { defineStore } from 'pinia';

export const useModalStore = defineStore({
  id: 'modal',
  state: () => ({
    isOpen: false,
  }),
  getters: {
    hiddenClass(state) {
      return !state.isOpen ? 'hidden' : '';
    },
  },
  actions: {
    toggleAuthModal() {
      this.isOpen = !this.isOpen;
    },
  },
});
