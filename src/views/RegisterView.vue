<template>
  <AuthLayout>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <!-- Animated Background Elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div class="max-w-md w-full space-y-8 relative z-10">
        <!-- Header Section -->
        <div class="text-center animate-fade-in-up">
          <div class="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 backdrop-blur-sm border border-white/20 shadow-2xl mb-6 transform hover:scale-105 transition-all duration-300 hover:shadow-cyan-500/25">
            <div class="h-20 w-20 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
              <svg class="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </div>
          </div>
          <h2 class="text-4xl font-bold text-white tracking-tight mb-3 bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
            Join PokéDex Pro
          </h2>
          <p class="text-lg text-cyan-200 mb-4 font-medium">
            Create your account and start exploring
          </p>
          <div class="inline-flex items-center gap-2 text-sm text-slate-300 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <span>Already have an account?</span>
            <router-link 
              to="/login" 
              class="font-semibold text-cyan-400 hover:text-cyan-300 transition-all duration-200 hover:underline underline-offset-2 decoration-cyan-400/50"
            >
              Sign in here
            </router-link>
          </div>
        </div>
        
        <!-- Registration Form -->
        <form class="mt-8 space-y-6 animate-fade-in-up animation-delay-200" @submit.prevent="handleRegister">
          <!-- Form Fields Container -->
          <div class="space-y-6 rounded-2xl bg-white/8 backdrop-blur-xl p-8 border border-white/20 shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 hover:border-white/30">
            <!-- Email Field -->
            <div class="space-y-2 group">
              <label for="email-address" class="block text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                Email Address
              </label>
              <input
                id="email-address"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                :class="[
                  'w-full px-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/50 transition-all duration-300 shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20',
                  'hover:border-white/40 hover:bg-white/8',
                  form.email && !isValidEmail(form.email) ? 'border-red-400/50 focus:ring-red-500' : 'border-white/20'
                ]"
                placeholder="Enter your email address"
              />
              <Transition name="fade">
                <p v-if="form.email && !isValidEmail(form.email)" class="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  Please enter a valid email address
                </p>
              </Transition>
            </div>
            
            <!-- Password Field -->
            <div class="space-y-2 group">
              <label for="password" class="block text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Password
              </label>
              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  name="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  required
                  :class="[
                    'w-full px-4 py-4 pr-12 bg-white/5 border rounded-xl text-white placeholder-white/50 transition-all duration-300 shadow-sm',
                    'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20',
                    'hover:border-white/40 hover:bg-white/8',
                    getPasswordStrength(form.password).color
                  ]"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-200"
                >
                  <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.5 8.5m1.378 1.378l.85.85m4.242 4.242L15.5 15.5m-1.378-1.378l-.85-.85m0 0L8.5 8.5m4.242 4.242L15.5 15.5" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              
              <!-- Password Strength Indicator -->
              <Transition name="fade">
                <div v-if="form.password" class="mt-2">
                  <div class="flex items-center justify-between mb-1">
                    <span class="text-xs text-white/70">Password Strength</span>
                    <span :class="[
                      'text-xs font-medium',
                      getPasswordStrength(form.password).textColor
                    ]">
                      {{ getPasswordStrength(form.password).label }}
                    </span>
                  </div>
                  <div class="w-full bg-white/10 rounded-full h-2">
                    <div 
                      :class="[
                        'h-2 rounded-full transition-all duration-500',
                        getPasswordStrength(form.password).bgColor
                      ]"
                      :style="{ width: getPasswordStrength(form.password).width }"
                    ></div>
                  </div>
                </div>
              </Transition>
            </div>
            
            <!-- Confirm Password Field -->
            <div class="space-y-2 group">
              <label for="confirm-password" class="block text-sm font-semibold text-white/90 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Confirm Password
              </label>
              <input
                id="confirm-password"
                v-model="form.confirmPassword"
                name="confirm-password"
                type="password"
                autocomplete="new-password"
                required
                :class="[
                  'w-full px-4 py-4 bg-white/5 border rounded-xl text-white placeholder-white/50 transition-all duration-300 shadow-sm',
                  'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20',
                  'hover:border-white/40 hover:bg-white/8',
                  form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-400/50 focus:ring-red-500' : 'border-white/20',
                  form.confirmPassword && form.password === form.confirmPassword && form.password ? 'border-green-400/50' : ''
                ]"
                placeholder="Confirm your password"
              />
              <Transition name="fade">
                <p v-if="form.confirmPassword && form.password !== form.confirmPassword" class="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  Passwords do not match
                </p>
              </Transition>
              <Transition name="fade">
                <p v-if="form.confirmPassword && form.password === form.confirmPassword && form.password" class="text-green-400 text-xs mt-1 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Passwords match
                </p>
              </Transition>
            </div>
          </div>

          <!-- Terms Checkbox -->
          <div class="flex items-start space-x-3 px-1 group">
            <div class="flex items-center h-5 mt-1">
              <input
                id="terms"
                v-model="form.acceptTerms"
                name="terms"
                type="checkbox"
                required
                class="h-4 w-4 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-transparent border-white/30 rounded bg-white/10 transition-all duration-200 hover:border-white/50"
              />
            </div>
            <label for="terms" class="text-sm text-white/80 leading-relaxed group-hover:text-white/90 transition-colors duration-200">
              I agree to the 
              <a href="#" class="text-cyan-400 font-medium hover:text-cyan-300 transition-colors duration-200 underline underline-offset-2 decoration-cyan-400/50 hover:decoration-cyan-300">
                Terms of Service
              </a>
              and 
              <a href="#" class="text-cyan-400 font-medium hover:text-cyan-300 transition-colors duration-200 underline underline-offset-2 decoration-cyan-400/50 hover:decoration-cyan-300">
                Privacy Policy
              </a>
            </label>
          </div>

          <!-- Error Message -->
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform scale-95 opacity-0 -translate-y-2"
            enter-to-class="transform scale-100 opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100 translate-y-0"
            leave-to-class="transform scale-95 opacity-0 -translate-y-2"
          >
            <div v-if="errorMessage" class="rounded-xl bg-red-500/10 p-4 border border-red-500/30 backdrop-blur-sm shadow-lg">
              <div class="flex items-center text-sm text-red-200">
                <div class="flex-shrink-0 mr-3">
                  <div class="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg class="h-4 w-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="font-medium text-red-200">Registration Error</p>
                  <p class="text-red-300">{{ errorMessage }}</p>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="loading || !isFormValid"
              class="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-cyan-500/25 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              
              <span v-if="loading" class="absolute left-4">
                <LoadingSpinner class="h-5 w-5 text-white" />
              </span>
              <span :class="{ 'ml-6': loading }" class="relative z-10 flex items-center gap-2">
                <span>{{ loading ? 'Creating your account...' : 'Create Account' }}</span>
                <svg v-if="!loading" class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          </div>

          <!-- Additional Features Info -->
          <div class="mt-8 text-center">
            <div class="inline-flex items-center justify-center space-x-6 text-xs text-white/60">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Secure & Private
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Free Forever
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Instant Access
              </div>
            </div>
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
const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const getPasswordStrength = (password) => {
  if (!password) return { width: '0%', label: '', color: 'border-white/20', bgColor: '', textColor: '' }
  
  let score = 0
  let label = ''
  let color = 'border-white/20'
  let bgColor = ''
  let textColor = ''
  
  // Length check
  if (password.length >= 8) score += 1
  if (password.length >= 12) score += 1
  
  // Character variety checks
  if (/[a-z]/.test(password)) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  
  if (score <= 2) {
    label = 'Weak'
    color = 'border-red-400/50'
    bgColor = 'bg-red-500'
    textColor = 'text-red-400'
    return { width: '33%', label, color, bgColor, textColor }
  } else if (score <= 4) {
    label = 'Medium'
    color = 'border-yellow-400/50'
    bgColor = 'bg-yellow-500'
    textColor = 'text-yellow-400'
    return { width: '66%', label, color, bgColor, textColor }
  } else {
    label = 'Strong'
    color = 'border-green-400/50'
    bgColor = 'bg-green-500'
    textColor = 'text-green-400'
    return { width: '100%', label, color, bgColor, textColor }
  }
}

const isFormValid = computed(() => {
  return isValidEmail(form.email) && 
         form.password && 
         form.confirmPassword && 
         form.password === form.confirmPassword && 
         getPasswordStrength(form.password).width !== '0%' &&
         form.acceptTerms
})

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  if (!isValidEmail(form.email)) {
    errorMessage.value = 'Please enter a valid email address'
    return
  }

  loading.value = true
  errorMessage.value = ''
  
  try {
    await authStore.register(form.email, form.password)
    router.push('/dashboard')
  } catch (error) {
    errorMessage.value = error.message || 'An unexpected error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
