<script setup>
import { storeToRefs } from 'pinia';
import { useModalStore, useUserStore } from '@/stores';

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
      <a class="text-white font-bold uppercase text-2xl mr-4" href="#">Music</a>

      <div class="flex flex-grow items-center">
        <!-- Primary Navigation -->
        <ul class="flex flex-row mt-1">
          <!-- Navigation Links -->
          <li v-if="!userLoggedIn">
            <a
              class="px-2 text-white"
              href="#"
              @click.prevent="toggleAuthModal"
            >
              Login / Register</a
            >
          </li>
          <template v-else>
            <li>
              <a class="px-2 text-white" href="#">Manage</a>
            </li>
            <li>
              <a @click.prevent="signOut" class="px-2 text-white" href="#"
                >Logout</a
              >
            </li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>
