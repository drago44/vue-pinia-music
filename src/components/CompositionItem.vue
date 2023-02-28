<script setup>
import { defineProps, ref } from 'vue';
import { songsCollection, storage } from '../includes/firebase';

const props = defineProps({
  song: {
    type: Object,
    required: true,
  },
  updateSong: {
    type: Function,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  removeSong: {
    type: Function,
    required: true,
  },
  updateUnsavedFlag: {
    type: Function,
    required: true,
  },
});

const showForm = ref(false);
const songSchema = ref({
  modifiedName: 'required',
  genre: 'alpha_spaces',
});
const songInSubmission = ref(false);
const songShowAlert = ref(false);
const songAlertVariant = ref('bg-blue-500');
const songAlertMsg = ref('Please wait! Updating song info.');

const edit = async (values) => {
  songShowAlert.value = true;
  songInSubmission.value = true;
  songAlertVariant.value = 'bg-blue-500';
  songAlertMsg.value = 'Please wait! Updating song info.';

  try {
    await songsCollection.doc(props.song.docId).update(values);
  } catch (error) {
    songInSubmission.value = false;
    songAlertVariant.value = 'bg-red-500';
    songAlertMsg.value = 'Something went wrong! Try again later.';
    return;
  }

  props.updateSong(props.index, values);
  props.updateUnsavedFlag(false);

  songInSubmission.value = false;
  songAlertVariant.value = 'bg-green-500';
  songAlertMsg.value = 'Success!';
};

const deleteSong = async () => {
  const storageRef = storage.ref();
  const songRef = storageRef.child(`songs/${props.song.originalName}`);

  await songRef.delete();
  await songsCollection.doc(props.song.docId).delete();

  props.removeSong(props.index);
};
</script>

<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
      <button
        @click.prevent="deleteSong()"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
      >
        <i class="fa fa-times"></i>
      </button>
      <button
        @click.prevent="showForm = !showForm"
        class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
      >
        <i class="fa fa-pencil-alt"></i>
      </button>
    </div>
    <div v-show="showForm">
      <div
        v-if="songShowAlert"
        :class="songAlertVariant"
        class="text-white text-center font-bold p-4 rounded mb-4"
      >
        {{ songAlertMsg }}
      </div>
      <VeeForm
        :validation-schema="songSchema"
        :initial-values="song"
        @submit="edit"
      >
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <VeeField
            name="modifiedName"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Song Title"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="modifiedName" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <VeeField
            name="genre"
            type="text"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Genre"
            @input="updateUnsavedFlag(true)"
          />
          <ErrorMessage class="text-red-600" name="genre" />
        </div>
        <button
          :disabled="songInSubmission"
          type="submit"
          class="py-1.5 px-3 rounded text-white bg-green-600"
        >
          Submit
        </button>
        <button
          @click.prevent="showForm = false"
          :disabled="songInSubmission"
          type="button"
          class="py-1.5 px-3 rounded text-white bg-gray-600"
        >
          Go Back
        </button>
      </VeeForm>
    </div>
  </div>
</template>
