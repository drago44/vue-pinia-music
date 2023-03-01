<script setup>
const props = defineProps({
  song: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <li
    class="flex justify-between items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50"
  >
    <div>
      <RouterLink
        :to="{ name: 'song', params: { id: song.docId } }"
        class="font-bold block text-gray-600"
      >
        {{ props.song.modifiedName }}
      </RouterLink>
      <span class="text-gray-500 text-sm">
        {{ props.song.displayName }}
      </span>
    </div>

    <div class="text-gray-600 text-lg">
      <RouterLink
        :to="{ name: 'song', params: { id: song.docId }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600"></i>
          {{ props.song.commentCount }}
        </span>
      </RouterLink>
    </div>
  </li>
</template>
