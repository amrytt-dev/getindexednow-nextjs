// Environment variable checker utility
export const checkEnvironmentVariables = () => {
  const envVars = {
    VITE_RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
    VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    VITE_API_URL: import.meta.env.VITE_API_URL,
    MODE: import.meta.env.MODE,
  };

  console.log('=== Environment Variables Check ===');
  console.log('Environment:', envVars.MODE);
  console.log('API URL:', envVars.VITE_API_URL ? 'SET' : 'NOT SET');
  console.log('reCAPTCHA Site Key:', envVars.VITE_RECAPTCHA_SITE_KEY ? 'SET' : 'NOT SET');
  console.log('Google Client ID:', envVars.VITE_GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET');

  // Check if reCAPTCHA key looks valid
  if (envVars.VITE_RECAPTCHA_SITE_KEY) {
    const key = envVars.VITE_RECAPTCHA_SITE_KEY;
    console.log('reCAPTCHA Key Length:', key.length);
    console.log('reCAPTCHA Key starts with:', key.substring(0, 3));
    
    // Check if it's a placeholder
    if (key === 'your_recaptcha_site_key_here' || key.includes('placeholder')) {
      console.error('❌ reCAPTCHA key appears to be a placeholder value');
    } else {
      console.log('✅ reCAPTCHA key appears to be configured');
    }
  } else {
    console.error('❌ reCAPTCHA site key is not set');
  }

  // Check if Google Client ID looks valid
  if (envVars.VITE_GOOGLE_CLIENT_ID) {
    const clientId = envVars.VITE_GOOGLE_CLIENT_ID;
    console.log('Google Client ID Length:', clientId.length);
    console.log('Google Client ID ends with:', clientId.substring(clientId.length - 4));
    
    // Check if it's a placeholder
    if (clientId === 'your_google_client_id_here' || clientId.includes('placeholder')) {
      console.error('❌ Google Client ID appears to be a placeholder value');
    } else {
      console.log('✅ Google Client ID appears to be configured');
    }
  } else {
    console.warn('⚠️ Google Client ID is not set (Google Sign-In will be disabled)');
  }

  console.log('=== End Environment Check ===');

  return {
    recaptchaConfigured: !!envVars.VITE_RECAPTCHA_SITE_KEY && envVars.VITE_RECAPTCHA_SITE_KEY !== 'your_recaptcha_site_key_here',
    googleConfigured: !!envVars.VITE_GOOGLE_CLIENT_ID && envVars.VITE_GOOGLE_CLIENT_ID !== 'your_google_client_id_here',
    apiConfigured: !!envVars.VITE_API_URL,
  };
};

// Test function to verify environment variables are accessible
export const testEnvironmentVariables = () => {
  console.log('=== Testing Environment Variables ===');
  
  try {
    const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const apiUrl = import.meta.env.VITE_API_URL;
    
    console.log('✅ Environment variables are accessible');
    console.log('reCAPTCHA Key accessible:', !!recaptchaKey);
    console.log('Google Client ID accessible:', !!googleClientId);
    console.log('API URL accessible:', !!apiUrl);
    
    return true;
  } catch (error) {
    console.error('❌ Error accessing environment variables:', error);
    return false;
  }
};
