import { defineStore } from 'pinia';
import { auth, usersCollection } from '@/includes/firebase';
import router from '@/router';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    userLoggedIn: false,
  }),
  actions: {
    async registerUser(values) {
      const userCred = await auth.createUserWithEmailAndPassword(
        values.email,
        values.password
      );

      await usersCollection.doc(userCred.user.uid).set({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country,
      });

      await userCred.user.updateProfile({
        displayName: values.name,
      });

      this.userLoggedIn = true;
    },
    async authenticate(values) {
      await auth.signInWithEmailAndPassword(values.email, values.password);

      this.userLoggedIn = true;
    },
    async signOut() {
      await auth.signOut();

      this.userLoggedIn = false;
      router.push({ name: 'home' });
    },
  },
});
