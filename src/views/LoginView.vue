<template>
  <AuthLayout>
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-purple-800 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <svg class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
          </div>
          <h2 class="mt-6 text-center text-3xl font-bold text-white">
            Sign in to PokéDex Pro
          </h2>
          <p class="mt-2 text-center text-sm text-indigo-200">
            Or
            <router-link to="/register" class="font-medium text-white hover:text-indigo-100 transition-colors">
              create a new account
            </router-link>
          </p>
        </div>

        <!-- Show redirect loading state for Google login -->
        <div v-if="authStore.redirectInProgress" class="rounded-lg bg-blue-500/20 p-4 border border-blue-500/30 backdrop-blur-sm">
          <div class="flex items-center">
            <LoadingSpinner class="h-5 w-5 text-blue-300 mr-3" />
            <div class="text-sm text-white">
              Redirecting to Google for authentication...
            </div>
          </div>
        </div>

        <form class="mt-8 space-y-6" @submit.prevent="handleEmailLogin">
          <div class="space-y-4 rounded-xl bg-white/5 backdrop-blur-sm p-6 border border-white/10">
            <div>
              <label for="email-address" class="block text-sm font-medium text-white/80 mb-1">Email address</label>
              <input
                id="email-address"
                v-model="form.email"
                name="email"
                type="email"
                autocomplete="email"
                required
                :disabled="authStore.loading || authStore.redirectInProgress"
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Email address"
              />
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-white/80 mb-1">Password</label>
              <input
                id="password"
                v-model="form.password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                :disabled="authStore.loading || authStore.redirectInProgress"
                class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Password"
              />
            </div>
          </div>

          <!-- Error display -->
          <div v-if="authStore.error" class="rounded-lg bg-red-500/20 p-4 border border-red-500/30 backdrop-blur-sm">
            <div class="flex items-center text-sm text-white">
              <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ authStore.error }}
            </div>
          </div>

          <!-- Email login submit button -->
          <div>
            <button
              type="submit"
              :disabled="authStore.loading || authStore.redirectInProgress || !form.email || !form.password"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-indigo-500/20"
            >
              <span v-if="authStore.loading && !authStore.redirectInProgress" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <LoadingSpinner class="h-5 w-5 text-white" />
              </span>
              {{ getEmailButtonText() }}
            </button>
          </div>

          <!-- Divider -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-white/20" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-transparent text-white/60">Or continue with</span>
              </div>
            </div>

            <!-- Google login button -->
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
        </form>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { reactive, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/layouts/AuthLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()

// Form reactive data
const form = reactive({
  email: '',
  password: ''
})

/**
 * Component initialization
 * Handles both fresh page loads and returns from Google OAuth redirect
 */
onMounted(async () => {
  console.log('🚀 LoginView mounted')
  console.log('📍 Current route:', router.currentRoute.value.fullPath)
  console.log('🔍 URL parameters:', router.currentRoute.value.query)
  
  try {
    // Initialize Firebase auth state listener
    console.log('⚙️ Initializing auth state listener...')
    await authStore.initializeAuth()
    
    // Check for Google OAuth redirect result
    console.log('🔍 Checking for Google redirect result...')
    await authStore.checkRedirectResult()
    
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
 * Handle Google OAuth login initiation
 */
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
  if (authStore.redirectInProgress) {
    return 'Redirecting...'
  }
  if (authStore.loading) {
    return 'Signing in...'
  }
  return 'Sign in'
}

/**
 * Get dynamic text for Google login button
 */
const getGoogleButtonText = () => {
  if (authStore.redirectInProgress) {
    return 'Redirecting to Google...'
  }
  if (authStore.loading) {
    return 'Signing in...'
  }
  return 'Sign in with Google'
}

/**
 * Watch for authentication state changes
 * This handles both email login success and Google OAuth callback
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