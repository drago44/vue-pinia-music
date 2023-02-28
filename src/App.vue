<script setup>
import { storeToRefs } from 'pinia';
import { auth } from '@/includes/firebase';

import { Header, Auth, Player } from '@/components';
import { useUserStore } from './stores';

const userStore = useUserStore();
const { userLoggedIn } = storeToRefs(userStore);

const created = () => {
  if (auth.currentUser) {
    userLoggedIn.value = true;
  }
};

created();
</script>

<template>
  <Header />
  <RouterView></RouterView>
  <Player />
  <Auth />
</template>
