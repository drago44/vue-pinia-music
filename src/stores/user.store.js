import { defineStore } from 'pinia';
import { auth, usersCollection } from '@/includes/firebase';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async registerUser(values) {
      await auth.createUserWithEmailAndPassword(values.email, values.password);

      await usersCollection.add({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country,
      });

      this.userLoggedIn = true;
    },
  },
});
