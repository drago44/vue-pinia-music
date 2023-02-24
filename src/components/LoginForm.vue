<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores';

const userStore = useUserStore();
const { authenticate } = userStore;

const loginSchema = ref({
  email: 'required|email',
  password: 'required|min:6|max:100',
});
const loginInSubmission = ref(false);
const loginShowAlert = ref(false);
const loginAlertVariant = ref('bg-blue-500');
const loginAlertMsg = ref('Please wait! We are logging you in.');

const login = async (values) => {
  loginShowAlert.value = true;
  loginInSubmission.value = true;
  loginAlertVariant.value = 'bg-blue-500';
  loginAlertMsg.value = 'Please wait! We are logging you in.';

  try {
    await authenticate(values);
  } catch (error) {
    loginInSubmission.value = false;
    loginAlertVariant.value = 'bg-red-500';
    loginAlertMsg.value = 'Invalid login details.';
    return;
  }

  loginAlertVariant.value = 'bg-green-500';
  loginAlertMsg.value = 'Success! You are now logged in';
  console.log(values);
};
</script>
<template>
  <!-- Login Form -->
  <div
    v-if="loginShowAlert"
    :class="loginAlertVariant"
    class="text-white text-center font-bold p-4 rounded mb-4"
  >
    {{ loginAlertMsg }}
  </div>
  <VeeForm :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <VeeField
        name="email"
        type="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <VeeField
        name="password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button
      :disabled="loginInSubmission"
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </VeeForm>
</template>
