'use client';

const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://newsthetruth.com';

export default function FacebookLoginButton() {
  const handleFacebookLogin = () => {
    if (!FACEBOOK_APP_ID) {
      console.warn('Facebook OAuth not configured');
      return;
    }

    const redirectUri = `${SITE_URL}/auth/facebook/callback`;
    const scope = 'public_profile,email';
    const responseType = 'token'; // Using implicit grant to get accessToken directly
    
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=${responseType}`;
    
    window.location.href = url;
  };

  if (!FACEBOOK_APP_ID) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleFacebookLogin}
      className="w-full py-4 bg-[#1877F2] border border-[#1877F2] rounded-2xl flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-[#166fe5] hover:shadow-lg transition-all duration-300 transform active:scale-95 group shadow-sm mt-3"
    >
      <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      Sign in with Facebook
    </button>
  );
}
