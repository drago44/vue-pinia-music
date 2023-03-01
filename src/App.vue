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
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </Transition>
  </RouterView>
  <Player />
  <Auth />
</template>

<style>
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: all 0.5s linear;
}

.fade-leave-to {
  transition: all 0s lienar;
  opacity: 0;
}
</style>
