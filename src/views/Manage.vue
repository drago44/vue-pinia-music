<script setup>
import { ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { Upload, CompositionItem } from '@/components';
import { songsCollection, auth } from '@/includes/firebase';

const songs = ref([]);
const unsavedFlag = ref(false);

const created = async () => {
  const snapshot = await songsCollection
    .where('uid', '==', auth.currentUser.uid)
    .get();

  snapshot.forEach(addSong);
};

const addSong = (document) => {
  const song = {
    ...document.data(),
    docId: document.id,
  };

  songs.value.push(song);
};

const updateSong = (i, values) => {
  songs.value[i].modifiedName = values.modifiedName;
  songs.value[i].genre = values.genre;
};

const removeSong = (i) => {
  songs.value.splice(i, 1);
};

const updateUnsavedFlag = (value) => {
  unsavedFlag.value = value;
};

const handleBeforeLeave = (to, from, next) => {
  if (!unsavedFlag.value) {
    next();
  } else {
    const leave = window.confirm(
      'You have unsaved changes. Are you shure you want to leave?',
    );

    next(leave);
  }
};

created();
onBeforeRouteLeave(handleBeforeLeave);
</script>

<template>
  <main>
    <!-- Main Content -->
    <section class="container mx-auto mt-6">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <Upload ref="upload" :addSong="addSong" />
        </div>
        <div class="col-span-2">
          <div
            class="bg-white rounded border border-gray-200 relative flex flex-col"
          >
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
              <span class="card-title">My Songs</span>
              <i
                class="fa fa-compact-disc float-right text-green-400 text-2xl"
              ></i>
            </div>
            <div class="p-6">
              <!-- Composition Items -->
              <CompositionItem
                v-for="(song, i) in songs"
                :key="song.docId"
                :song="song"
                :updateSong="updateSong"
                :index="i"
                :removeSong="removeSong"
                :updateUnsavedFlag="updateUnsavedFlag"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
