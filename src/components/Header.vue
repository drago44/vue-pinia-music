<script setup>
import { storeToRefs } from 'pinia';
import { useModalStore, useUserStore } from '@/stores';
import { RouterLink } from 'vue-router';

const modalStore = useModalStore();
const userStore = useUserStore();
const { toggleAuthModal } = modalStore;
const { userLoggedIn } = storeToRefs(userStore);
const { signOut } = userStore;
</script>

<template>
  <!-- Header -->
  <header id="header" class="bg-purple-800">
    <nav class="container mx-auto flex justify-start items-center py-5 px-4">
      <!-- App Name -->
      <RouterLink
        :to="{ name: 'home' }"
        exact-active-class="no-active"
        class="text-white font-bold uppercase text-2xl mr-4"
        >Music</RouterLink
      >

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li>
            <RouterLink :to="{ name: 'about' }" class="px-2 text-white"
              >About</RouterLink
            >
          </li>
          <li v-if="!userLoggedIn">
            <RouterLink
              class="px-2 text-white"
              to="#"
              @click.prevent="toggleAuthModal"
            >
              Login / Register</RouterLink
            >
          </li>
          <template v-else>
            <li>
              <RouterLink :to="{ name: 'manage' }" class="px-2 text-white"
                >Manage</RouterLink
              >
            </li>
            <li>
              <RouterLink
                to="/"
                exact-active-class="no-active"
                @click.prevent="signOut"
                class="px-2 text-white"
                >Logout</RouterLink
              >
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>
