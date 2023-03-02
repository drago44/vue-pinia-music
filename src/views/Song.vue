<script setup>
import { ref, computed, watch } from 'vue';
import { songsCollection, auth, commentsCollection } from '@/includes/firebase';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore, usePlayerStore } from '@/stores';

const userStore = useUserStore();
const playerStore = usePlayerStore();

const { userLoggedIn } = storeToRefs(userStore);
const { playing } = storeToRefs(playerStore);
const { newSong } = playerStore;

const router = useRouter();
const route = useRoute();

const song = ref({});
const commentSchema = {
  comment: 'required|min:3',
};
const commentInSubmission = ref(false);
const commentShowAlert = ref(false);
const commentAlertVariant = ref('bg-blue-500');
const commentAlertMessage = ref('Please wait! Your comment is being submitted');
const comments = ref([]);
const sort = ref('1');

const sortedComments = computed(() => {
  return comments.value.slice().sort((a, b) => {
    if (sort.value === '1') {
      return new Date(b.datePosted) - new Date(a.datePosted);
    }

    return new Date(a.datePosted) - new Date(b.datePosted);
  });
});

const addComment = async (values, { resetForm }) => {
  commentInSubmission.value = true;
  commentShowAlert.value = true;
  commentAlertVariant.value = 'bg-blue-500';
  commentAlertMessage.value = 'Please wait! Your comment is being submitted';

  const comment = {
    content: values.comment,
    datePosted: new Date().toString(),
    sid: route.params.id,
    name: auth.currentUser.displayName,
    uid: auth.currentUser.uid,
  };

  await commentsCollection.add(comment);

  song.value.commentCount += 1;
  await songsCollection.doc(route.params.id).update({
    commentCount: song.value.commentCount,
  });

  getComments();

  commentInSubmission.value = false;
  commentAlertVariant.value = 'bg-green-500';
  commentAlertMessage.value = 'Comment added!';

  resetForm();
};

const getComments = async () => {
  const snapshots = await commentsCollection
    .where('sid', '==', route.params.id)
    .get();

  comments.value = [];

  snapshots.forEach((doc) => {
    comments.value.push({
      docId: doc.id,
      ...doc.data(),
    });
  });
};

const created = async () => {
  const docSnapshot = await songsCollection.doc(route.params.id).get();

  if (!docSnapshot.exists) {
    router.push({ name: 'home' });
    return;
  }

  const { sort: querySort } = route.query;

  sort.value = querySort === '1' || querySort === '2' ? querySort : '1';

  song.value = docSnapshot.data();
  getComments();
};

created();

watch(sort, (newVal) => {
  if (newVal === route.query.sort) {
    return;
  }

  router.push({
    query: {
      sort: newVal,
    },
  });
});
</script>

<template>
  <main>
    <!-- Music Header -->
    <section class="w-full mb-8 py-14 text-center text-white relative">
      <div
        class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
        style="background-image: url(/assets/img/song-header.png)"
      ></div>
      <div class="container mx-auto flex items-center">
        <!-- Play/Pause Button -->
        <button
          @click.prevent="newSong(song)"
          type="button"
          class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none"
        >
          <i
            class="fas"
            :class="{ 'fa-play': !playing, 'fa-pause': playing }"
          ></i>
        </button>
        <div class="z-50 text-left ml-8">
          <!-- Song Info -->
          <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
          <div>{{ song.genre }}</div>
          <div class="song-price">{{ $n(1, 'currency', 'ja') }}</div>
        </div>
      </div>
    </section>
    <!-- Form -->
    <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <!-- Comment Count -->
          <span class="card-title">
            {{
              $t('song.commentCount', song.commentCount, {
                count: song.commentCount,
              })
            }}
          </span>
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <div
            class="text-white text-center font-bold p-4 mb-4"
            v-if="commentShowAlert"
            :class="commentAlertVariant"
          >
            {{ commentAlertMessage }}
          </div>
          <VeeForm
            :validation-schema="commentSchema"
            @submit="addComment"
            v-if="userLoggedIn"
          >
            <VeeField
              as="textarea"
              name="comment"
              class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
              placeholder="Your comment here..."
            ></VeeField>
            <ErrorMessage class="text-red-600" name="comment" />
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
              :disabled="commentInSubmission"
            >
              Submit
            </button>
          </VeeForm>
          <!-- Sort Comments -->
          <select
            v-model="sort"
            class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
    <!-- Comments -->
    <ul class="container mx-auto">
      <li
        class="p-6 bg-gray-50 border border-gray-200"
        v-for="comment in sortedComments"
        :key="comment.docID"
      >
        <!-- Comment Author -->
        <div class="mb-5">
          <div class="font-bold">{{ comment.name }}</div>
          <time>{{ comment.datePosted }}</time>
        </div>

        <p>{{ comment.content }}</p>
      </li>
    </ul>
  </main>
</template>
