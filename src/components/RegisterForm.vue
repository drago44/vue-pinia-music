<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores';

const userStore = useUserStore();
const { registerUser } = userStore;

const regSchema = ref({
  name: 'required|min:2|max:100|alpha_spaces',
  email: 'required|min:2|max:100|email',
  age: 'required|min_value:18|max_value:100',
  password: 'required|min:6|max:100',
  confirm_password: 'password_mismatch:@password',
  country: 'required',
  tos: 'tos',
});
const regInSubmission = ref(false);
const regShowAlert = ref(false);
const regAlertVariant = ref('bg-blue-500');
const regAlertMsg = ref('Please wait! Your account is being created.');

const register = async (values) => {
  regShowAlert.value = true;
  regInSubmission.value = true;
  regAlertVariant.value = 'bg-blue-500';
  regAlertMsg.value = 'Please wait! Your account is being created.';

  try {
    await registerUser(values);
  } catch (error) {
    regInSubmission.value = false;
    regAlertVariant.value = 'bg-red-500';
    regAlertMsg.value = 'An unexpected error occured. Please try again later.';
    return;
  }

  regAlertVariant.value = 'bg-green-500';
  regAlertMsg.value = 'Success! Your account has been created';

  window.location.reload();
};
</script>

<template>
  <!-- Registration Form -->
  <div
    v-if="regShowAlert"
    :class="regAlertVariant"
    class="text-white text-center font-bold p-4 rounded mb-4"
  >
    {{ regAlertMsg }}
  </div>
  <VeeForm :validation-schema="regSchema" @submit="register">
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <VeeField
        name="name"
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
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
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <VeeField
        name="age"
        type="number"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="18"
      />
      <ErrorMessage class="text-red-600" name="age" />
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
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <VeeField
        name="confirm_password"
        type="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <VeeField
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
        <option value="Ukraine">Ukraine</option>
      </VeeField>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <VeeField
        name="tos"
        value="1"
        type="checkbox"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <i18n-t class="block" keypath="register.accept" tag="label"
        ><a href="#">{{ $t('register.tos') }}</a></i18n-t
      >
      <ErrorMessage class="text-red-600" name="tos" />
    </div>
    <button
      :disabled="regInSubmission"
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </VeeForm>
</template>
