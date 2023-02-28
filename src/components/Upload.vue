<script setup>
import { ref, onBeforeUnmount, defineProps } from 'vue';
import { storage, auth, songsCollection } from '@/includes/firebase';

const props = defineProps({
  addSong: {
    type: Function,
    required: true,
  },
});

const isDragOver = ref(false);
const uploads = ref([]);

const upload = ($event) => {
  isDragOver.value = false;

  const files = $event.dataTransfer
    ? [...$event.dataTransfer.files]
    : [...$event.target.files];

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
          originalName: task.snapshot.ref.name,
          modifiedName: task.snapshot.ref.name,
          genre: '',
          commentCount: 0,
        };

        song.url = await task.snapshot.ref.getDownloadURL();
        const songRef = await songsCollection.add(song);
        const songSnapshot = await songRef.get();

        props.addSong(songSnapshot);

        uploads.value[uploadIndex].variant = 'bg-green-400';
        uploads.value[uploadIndex].icon = 'fas fa-check';
        uploads.value[uploadIndex].testClass = 'text-green-400';
      },
    );
  });

  console.log(files);
};

onBeforeUnmount(() => {
  uploads.value.forEach((upload) => {
    upload.task.cancel();
  });
});
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
        class="mb-6 w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
      >
        <h5>Drop your files here</h5>
      </div>
      <label>
        <div
          class="py-1.5 px-3 rounded text-white bg-green-600 mr-4 inline-block"
        >
          <span>Select File</span>
          <span
            v-for="(upload, i) in uploads"
            :key="upload.name"
            class="inline-block"
          >
            <span class="mr-2">{{ i + 1 }}</span
            >{{ upload.name }}</span
          >
        </div>
        <input type="file" multiple @change="upload($event)" class="hidden" />
      </label>
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
