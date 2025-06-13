import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth, googleProvider } from '../firebase'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', () => {
  // State variables
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)
  const redirectInProgress = ref(false) // Track redirect state
  const isAuthenticated = computed(() => !!user.value)
  let unsubscribeAuth = null

  /**
   * Initialize Firebase Auth state listener
   * This ensures we track authentication state changes across the app
   */
  const initializeAuth = () => {
    if (unsubscribeAuth) {
      console.log('🔄 Auth listener already initialized, skipping')
      return Promise.resolve()
    }

    console.log('🚀 Initializing Firebase auth state listener')
    
    return new Promise((resolve) => {
      unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
        console.log('🔄 Auth state changed:', firebaseUser ? 
          `✅ User authenticated: ${firebaseUser.email} (${firebaseUser.uid})` : 
          '❌ No user authenticated')
        
        // Update user state
        user.value = firebaseUser
        
        // Mark as initialized only after first auth check
        if (!initialized.value) {
          initialized.value = true
          console.log('✅ Auth initialization complete')
          resolve()
        }
      }, (err) => {
        console.error('❌ Auth state listener error:', err)
        error.value = getFriendlyErrorMessage(err.code)
        
        if (!initialized.value) {
          initialized.value = true
          resolve()
        }
      })
    })
  }

  /**
   * Login with email and password
   */
  const loginWithEmail = async (email, password) => {
    if (loading.value) {
      console.warn('⚠️ Login already in progress, ignoring duplicate request')
      return
    }

    loading.value = true
    error.value = null
    console.log('📧 Attempting email/password login for:', email)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ Email login successful:', {
        email: userCredential.user.email,
        uid: userCredential.user.uid,
        displayName: userCredential.user.displayName
      })
      
      // User state will be updated by onAuthStateChanged listener
      return userCredential.user
    } catch (err) {
      console.error('❌ Email login failed:', {
        code: err.code,
        message: err.message,
        email: email
      })
      
      error.value = getFriendlyErrorMessage(err.code)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Login with Google using redirect method
   * Note: This will redirect the user away from the current page
   */
  const loginWithGoogle = async () => {
    if (loading.value) {
      console.warn('⚠️ Login already in progress, ignoring duplicate request')
      return
    }

    loading.value = true
    error.value = null
    redirectInProgress.value = true
    
    console.log('🔍 Initiating Google login via redirect')
    console.log('📍 Current URL before redirect:', window.location.href)

    try {
      // Store redirect state in sessionStorage for persistence across redirect
      sessionStorage.setItem('google_login_initiated', 'true')
      sessionStorage.setItem('login_timestamp', Date.now().toString())
      
      await signInWithRedirect(auth, googleProvider)
      console.log('🔄 Google redirect initiated successfully')
      
      // Note: Code execution stops here as user is redirected to Google
    } catch (err) {
      console.error('❌ Google login redirect failed:', {
        code: err.code,
        message: err.message,
        stack: err.stack
      })
      
      error.value = getFriendlyErrorMessage(err.code)
      redirectInProgress.value = false
      
      // Clean up sessionStorage on error
      sessionStorage.removeItem('google_login_initiated')
      sessionStorage.removeItem('login_timestamp')
      
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Check for Google login redirect result
   * This should be called when the app loads to handle returning users
   */
  const checkRedirectResult = async () => {
    const wasRedirectInitiated = sessionStorage.getItem('google_login_initiated')
    const loginTimestamp = sessionStorage.getItem('login_timestamp')
    
    console.log('🔍 Checking for Google redirect result:', {
      wasRedirectInitiated: !!wasRedirectInitiated,
      loginTimestamp: loginTimestamp ? new Date(parseInt(loginTimestamp)).toISOString() : null,
      currentUrl: window.location.href
    })

    try {
      const result = await getRedirectResult(auth)
      
      if (result?.user) {
        console.log('✅ Google login successful (redirect result):', {
          email: result.user.email,
          uid: result.user.uid,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          isNewUser: result._tokenResponse?.isNewUser || false
        })
        
        // Clear redirect tracking
        sessionStorage.removeItem('google_login_initiated')
        sessionStorage.removeItem('login_timestamp')
        redirectInProgress.value = false
        
        // User state will be updated by onAuthStateChanged listener
        return result.user
      } else if (wasRedirectInitiated) {
        // Redirect was initiated but no result - possible error or user canceled
        console.log('⚠️ Google redirect was initiated but no result received')
        console.log('🔍 Possible reasons: user canceled, popup blocked, or network error')
        
        // Clean up after a timeout to avoid stale state
        setTimeout(() => {
          sessionStorage.removeItem('google_login_initiated')
          sessionStorage.removeItem('login_timestamp')
          redirectInProgress.value = false
        }, 5000)
      } else {
        console.log('ℹ️ No Google redirect result and none was expected')
      }
    } catch (err) {
      console.error('❌ Error checking redirect result:', {
        code: err.code,
        message: err.message,
        wasRedirectInitiated: !!wasRedirectInitiated
      })
      
      error.value = getFriendlyErrorMessage(err.code)
      
      // Clean up on error
      sessionStorage.removeItem('google_login_initiated')
      sessionStorage.removeItem('login_timestamp')
      redirectInProgress.value = false
      
      throw err
    }
  }

  /**
   * Register new user with email and password
   */
  const register = async (email, password) => {
    loading.value = true
    error.value = null
    console.log('📝 Attempting registration for:', email)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log('✅ Registration successful:', {
        email: userCredential.user.email,
        uid: userCredential.user.uid
      })
      
      // User state will be updated by onAuthStateChanged listener
      return userCredential.user
    } catch (err) {
      console.error('❌ Registration failed:', {
        code: err.code,
        message: err.message,
        email: email
      })
      
      error.value = getFriendlyErrorMessage(err.code)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Logout current user
   */
  const logout = async () => {
    if (!user.value) {
      console.log('ℹ️ No user to logout')
      return
    }

    loading.value = true
    console.log('🚪 Attempting logout for user:', user.value.email)

    try {
      await signOut(auth)
      console.log('✅ Logout successful')
      
      // Clean up any stored state
      sessionStorage.removeItem('google_login_initiated')
      sessionStorage.removeItem('login_timestamp')
      redirectInProgress.value = false
      
      // User state will be updated by onAuthStateChanged listener
    } catch (err) {
      console.error('❌ Logout failed:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear current error state
   */
  const clearError = () => {
    console.log('🧹 Clearing error state')
    error.value = null
  }

  /**
   * Convert Firebase auth error codes to user-friendly messages
   */
  const getFriendlyErrorMessage = (code) => {
    const errorMessages = {
      'auth/invalid-email': 'Please enter a valid email address',
      'auth/user-disabled': 'This account has been disabled',
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'Email already in use',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/too-many-requests': 'Too many attempts. Please try again later',
      'auth/popup-closed-by-user': 'Login popup was closed',
      'auth/cancelled-popup-request': 'Login was cancelled',
      'auth/operation-not-allowed': 'Login method not allowed',
      'auth/account-exists-with-different-credential': 'Account exists with different credentials',
      'auth/credential-already-in-use': 'This credential is already associated with a different account',
      'auth/network-request-failed': 'Network error. Please check your connection and try again'
    }
    
    const message = errorMessages[code] || 'An error occurred. Please try again'
    console.log('🔄 Error code mapped:', { code, message })
    return message
  }

  /**
   * Reset store state (useful for testing or cleanup)
   */
  const $reset = () => {
    console.log('🔄 Resetting auth store')
    
    if (unsubscribeAuth) {
      unsubscribeAuth()
      unsubscribeAuth = null
    }
    
    user.value = null
    loading.value = false
    error.value = null
    initialized.value = false
    redirectInProgress.value = false
    
    // Clean up sessionStorage
    sessionStorage.removeItem('google_login_initiated')
    sessionStorage.removeItem('login_timestamp')
    
    console.log('✅ Auth store reset complete')
  }

  // Return all public methods and reactive state
  return {
    // Reactive state
    user,
    loading,
    error,
    initialized,
    redirectInProgress,
    isAuthenticated,
    
    // Methods
    loginWithEmail,
    loginWithGoogle,
    register,
    logout,
    clearError,
    initializeAuth,
    checkRedirectResult,
    $reset
  }
})