<script setup>
import { ref } from 'vue';
import { storage, auth, songsCollection } from '@/includes/firebase';

const isDragOver = ref(false);
const uploads = ref([]);

const upload = ($event) => {
  isDragOver.value = false;

  const files = [...$event.dataTransfer.files];

  files.forEach((file) => {
    if (file.type !== 'audio/mpeg') {
      return;
    }

    const storageRef = storage.ref();
    const songsRef = storageRef.child(`songs/${file.name}`);
    const task = songsRef.put(file);

    const uploadIndex =
      uploads.value.push({
        task,
        currentProgress: 0,
        name: file.name,
        variant: 'bg-blue-400',
        icon: 'fas fa-spinner fa-spin',
        testClass: '',
      }) - 1;

    task.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploads.value[uploadIndex].currentProgress = progress;
      },
      (error) => {
        uploads.value[uploadIndex].variant = 'bg-red-400';
        uploads.value[uploadIndex].icon = 'fas fa-times';
        uploads.value[uploadIndex].testClass = 'text-red-400';
        console.log(error);
      },
      async () => {
        const song = {
          uid: auth.currentUser.uid,
          displayName: auth.currentUser.displayName,
          origanName: task.snapshot.ref.name,
          modifiedName: task.snapshot.ref.name,
          genre: '',
          commentCount: 0,
        };

        song.url = await task.snapshot.ref.getDownloadURL();
        await songsCollection.add(song);

        uploads.value[uploadIndex].variant = 'bg-green-400';
        uploads.value[uploadIndex].icon = 'fas fa-check';
        uploads.value[uploadIndex].testClass = 'text-green-400';
      },
    );
  });

  console.log(files);
};
</script>

<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="isDragOver = false"
        @dragover.prevent.stop="isDragOver = true"
        @dragenter.prevent.stop="isDragOver = true"
        @dragleave.prevent.stop="isDragOver = false"
        @drop.prevent.stop="upload($event)"
        :class="{
          'bg-green-400 border-green-400 border-solid': isDragOver,
        }"
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
      >
        <h5>Drop your files here</h5>
      </div>
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div v-for="upload in uploads" :key="upload.name" class="mb-4">
        <!-- File Name -->
        <div :class="upload.testClass" class="font-bold text-sm">
          <i :class="upload.icon"></i> {{ upload.name }}
        </div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div
            :style="{ width: `${upload.currentProgress}%` }"
            :class="upload.variant"
            class="transition-all progress-bar"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
