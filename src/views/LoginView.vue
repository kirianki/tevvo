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
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <h2 class="text-4xl font-bold text-white tracking-tight mb-3 bg-gradient-to-r from-white via-cyan-200 to-blue-300 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p class="text-lg text-cyan-200 mb-4 font-medium">
            Sign in to your PokéDex Pro account
          </p>
          <div class="inline-flex items-center gap-2 text-sm text-slate-300 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <span>Don't have an account?</span>
            <router-link 
              to="/register" 
              class="font-semibold text-cyan-400 hover:text-cyan-300 transition-all duration-200 hover:underline underline-offset-2 decoration-cyan-400/50"
            >
              Create one here
            </router-link>
          </div>
        </div>

        <!-- Show redirect loading state for Google login (commented out but kept for potential future use) -->
        <!-- <div v-if="authStore.redirectInProgress" class="rounded-lg bg-blue-500/20 p-4 border border-blue-500/30 backdrop-blur-sm">
          <div class="flex items-center">
            <LoadingSpinner class="h-5 w-5 text-blue-300 mr-3" />
            <div class="text-sm text-white">
              Redirecting to Google for authentication...
            </div>
          </div>
        </div> -->

        <!-- Login Form -->
        <form class="mt-8 space-y-6 animate-fade-in-up animation-delay-200" @submit.prevent="handleEmailLogin">
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
                :disabled="authStore.loading"
                class="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20 hover:border-white/40 hover:bg-white/8 disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder="Enter your email address"
              />
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
                  autocomplete="current-password"
                  required
                  :disabled="authStore.loading"
                  class="w-full px-4 py-4 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/20 hover:border-white/40 hover:bg-white/8 disabled:opacity-60 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  :disabled="authStore.loading"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors duration-200 disabled:opacity-50"
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
            </div>
            
            <!-- Forgot Password Link -->
            <div class="flex justify-end">
              <a href="#" class="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium hover:underline underline-offset-2 decoration-cyan-400/50">
                Forgot your password?
              </a>
            </div>
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
            <div v-if="authStore.error" class="rounded-xl bg-red-500/10 p-4 border border-red-500/30 backdrop-blur-sm shadow-lg">
              <div class="flex items-center text-sm text-red-200">
                <div class="flex-shrink-0 mr-3">
                  <div class="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                    <svg class="h-4 w-4 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p class="font-medium text-red-200">Authentication Error</p>
                  <p class="text-red-300">{{ authStore.error }}</p>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="authStore.loading || !form.email || !form.password"
              class="group relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-cyan-500/25 transform hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100 overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              
              <span v-if="authStore.loading" class="absolute left-4">
                <LoadingSpinner class="h-5 w-5 text-white" />
              </span>
              <span :class="{ 'ml-6': authStore.loading }" class="relative z-10 flex items-center gap-2">
                <span>{{ getEmailButtonText() }}</span>
                <svg v-if="!authStore.loading" class="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </span>
            </button>
          </div>

          <!-- Google login section (commented out) -->
          <!--
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-white/20" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-transparent text-white/60">Or continue with</span>
              </div>
            </div>

            <div class="mt-6">
              <button
                type="button"
                @click="handleGoogleLogin"
                :disabled="authStore.loading || authStore.redirectInProgress"
                class="w-full inline-flex justify-center items-center py-2.5 px-4 border border-white/20 rounded-lg shadow-sm bg-white/5 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg class="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span class="ml-2">{{ getGoogleButtonText() }}</span>
              </button>
            </div>
          </div>
          -->

          <!-- Additional Features Info -->
          <div class="mt-8 text-center">
            <div class="inline-flex items-center justify-center space-x-6 text-xs text-white/60">
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                Secure Login
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
                Instant Access
              </div>
              <div class="flex items-center gap-1">
                <svg class="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Free Features
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { reactive, ref, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)

// Form reactive data
const form = reactive({
  email: '',
  password: ''
})

/**
 * Component initialization
 * Handles both fresh page loads and returns from Google OAuth redirect (commented out)
 */
onMounted(async () => {
  console.log('🚀 LoginView mounted')
  console.log('📍 Current route:', router.currentRoute.value.fullPath)
  console.log('🔍 URL parameters:', router.currentRoute.value.query)
  
  try {
    // Initialize Firebase auth state listener
    console.log('⚙️ Initializing auth state listener...')
    await authStore.initializeAuth()
    
    // Check for Google OAuth redirect result (commented out)
    // console.log('🔍 Checking for Google redirect result...')
    // await authStore.checkRedirectResult()
    
    // If user is already authenticated, redirect immediately
    if (authStore.user) {
      console.log('✅ User already authenticated, redirecting to dashboard')
      await navigateToDashboard()
    } else {
      console.log('ℹ️ No authenticated user found, staying on login page')
    }
  } catch (error) {
    console.error('❌ Error during LoginView initialization:', error)
    // Don't throw - let user try to login manually
  }
})

/**
 * Handle email/password login form submission
 */
const handleEmailLogin = async () => {
  console.log('📧 Email login form submitted')
  console.log('📝 Form data:', { 
    email: form.email, 
    passwordLength: form.password.length 
  })

  // Clear any previous errors
  authStore.clearError()

  try {
    const user = await authStore.loginWithEmail(form.email, form.password)
    
    if (user) {
      console.log('✅ Email login successful, navigating to dashboard')
      await navigateToDashboard()
    } else {
      console.warn('⚠️ Email login returned no user but no error')
    }
  } catch (error) {
    console.error('❌ Email login failed:', error)
    // Error is already set in the store, just log it here
  }
}

/**
 * Handle Google OAuth login initiation (commented out but kept for potential future use)
 */
/*
const handleGoogleLogin = async () => {
  console.log('🔍 Google login button clicked')
  
  // Clear any previous errors
  authStore.clearError()

  try {
    // This will redirect the user to Google
    await authStore.loginWithGoogle()
    console.log('🔄 Google login redirect initiated')
    // Note: User will be redirected, so code after this won't execute
  } catch (error) {
    console.error('❌ Google login failed:', error)
    // Error is already set in the store
  }
}
*/

/**
 * Navigate to dashboard with proper error handling
 */
const navigateToDashboard = async () => {
  try {
    console.log('🧭 Navigating to dashboard...')
    await router.push('/dashboard')
    console.log('✅ Navigation to dashboard successful')
  } catch (error) {
    console.error('❌ Navigation to dashboard failed:', error)
    // Fallback: try replacing current route
    try {
      await router.replace('/dashboard')
      console.log('✅ Fallback navigation successful')
    } catch (fallbackError) {
      console.error('❌ Fallback navigation also failed:', fallbackError)
    }
  }
}

/**
 * Get dynamic text for email login button
 */
const getEmailButtonText = () => {
  if (authStore.loading) {
    return 'Signing in...'
  }
  return 'Sign In'
}

/**
 * Get dynamic text for Google login button (commented out)
 */
/*
const getGoogleButtonText = () => {
  if (authStore.redirectInProgress) {
    return 'Redirecting to Google...'
  }
  if (authStore.loading) {
    return 'Signing in...'
  }
  return 'Sign in with Google'
}
*/

/**
 * Watch for authentication state changes
 * This handles email login success (Google OAuth callback commented out)
 */
watch(() => authStore.user, async (newUser, oldUser) => {
  console.log('👀 Auth user state changed:', {
    from: oldUser?.email || 'null',
    to: newUser?.email || 'null',
    hasUser: !!newUser
  })

  if (newUser && authStore.initialized) {
    console.log('✅ User authenticated, preparing to navigate to dashboard')
    
    // Use nextTick to ensure DOM updates are complete
    await nextTick()
    await navigateToDashboard()
  }
}, { immediate: false })

/**
 * Watch for initialization completion
 * This ensures we redirect if user was already authenticated
 */
watch(() => authStore.initialized, async (isInitialized) => {
  console.log('👀 Auth initialization state changed:', isInitialized)
  
  if (isInitialized && authStore.user) {
    console.log('✅ Auth initialized with existing user, navigating to dashboard')
    await nextTick()
    await navigateToDashboard()
  }
}, { immediate: false })

/**
 * Watch for errors and log them
 */
watch(() => authStore.error, (error) => {
  if (error) {
    console.error('👀 Auth error state changed:', error)
  }
}, { immediate: false })
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
