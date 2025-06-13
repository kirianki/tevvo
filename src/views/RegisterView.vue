<template>
  <AuthLayout>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Header Section -->
        <div class="text-center">
          <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
            <svg class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          </div>
          <h2 class="mt-6 text-3xl font-bold text-white tracking-tight">
            Create your account
          </h2>
          <p class="mt-2 text-sm text-white/70">
            Or
            <router-link 
              to="/login" 
              class="font-medium text-white hover:text-white/80 transition-colors duration-200 underline underline-offset-4 decoration-white/50 hover:decoration-white/80"
            >
              sign in to your existing account
            </router-link>
          </p>
        </div>
        
        <!-- Registration Form -->
        <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
          <!-- Form Fields Container -->
          <div class="space-y-5 rounded-xl bg-white/5 backdrop-blur-md p-6 border border-white/10 shadow-xl">
            <!-- Email Field -->
            <div class="space-y-1">
              <label for="email-address" class="block text-sm font-medium text-white/90">
                Email address
              </label>
              <input
                id="email-address"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="w-full px-4 py-3 bg-white/8 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white/10 transition-all duration-200 shadow-sm"
                placeholder="Enter your email"
              />
            </div>
            
            <!-- Password Field -->
            <div class="space-y-1">
              <label for="password" class="block text-sm font-medium text-white/90">
                Password
              </label>
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                class="w-full px-4 py-3 bg-white/8 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white/10 transition-all duration-200 shadow-sm"
                placeholder="Enter your password"
              />
            </div>
            
            <!-- Confirm Password Field -->
            <div class="space-y-1">
              <label for="confirm-password" class="block text-sm font-medium text-white/90">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                v-model="form.confirmPassword"
                name="confirm-password"
                type="password"
                autocomplete="new-password"
                required
                class="w-full px-4 py-3 bg-white/8 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white/10 transition-all duration-200 shadow-sm"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <!-- Terms Checkbox -->
          <div class="flex items-start space-x-3">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="form.acceptTerms"
                name="terms"
                type="checkbox"
                required
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-transparent border-white/30 rounded bg-white/10 transition-colors duration-200"
              />
            </div>
            <label for="terms" class="text-sm text-white/80 leading-5">
              I accept the 
              <a href="#" class="text-white font-medium hover:text-white/80 transition-colors duration-200 underline underline-offset-2 decoration-white/50 hover:decoration-white/80">
                Terms of Service
              </a>
              and 
              <a href="#" class="text-white font-medium hover:text-white/80 transition-colors duration-200 underline underline-offset-2 decoration-white/50 hover:decoration-white/80">
                Privacy Policy
              </a>
            </label>
          </div>

          <!-- Error Message -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div v-if="errorMessage" class="rounded-lg bg-red-500/20 p-4 border border-red-500/30 backdrop-blur-sm shadow-lg">
              <div class="flex items-center text-sm text-white">
                <svg class="h-5 w-5 mr-3 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ errorMessage }}
              </div>
            </div>
          </Transition>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-indigo-500/25 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span v-if="loading" class="absolute left-4">
                <LoadingSpinner class="h-5 w-5 text-white" />
              </span>
              <span :class="{ 'ml-6': loading }">
                {{ loading ? 'Creating account...' : 'Create account' }}
              </span>
            </button>
          </div>

          <!-- Divider -->
          <div class="relative my-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/20" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-transparent text-white/60 font-medium">Or continue with</span>
            </div>
          </div>

          <!-- Google Sign Up -->
          <div>
            <button
              type="button"
              @click="handleGoogleRegister"
              :disabled="loading"
              class="w-full inline-flex justify-center items-center py-3 px-4 border border-white/20 rounded-lg shadow-sm bg-white/5 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/10 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg class="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  </AuthLayout>
</template>
  
<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const isFormValid = computed(() => {
  return form.email && 
         form.password && 
         form.confirmPassword && 
         form.password === form.confirmPassword && 
         form.acceptTerms
})

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  loading.value = true
  errorMessage.value = ''
  
  try {
    await authStore.register(form.email, form.password)
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

const handleGoogleRegister = async () => {
  loading.value = true
  errorMessage.value = ''
  
  try {
    await authStore.loginWithGoogle()
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}
</script>