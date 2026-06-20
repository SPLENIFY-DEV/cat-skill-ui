import { useState } from 'react'
import AuthLayout from './AuthLayout'
import GoogleButton from './GoogleButton'
import TabSwitcher from './TabSwitcher'
import PhoneForm, { defaultCountry, type Country } from './PhoneForm'
import EmailForm from './EmailForm'
import OtpVerify from './OtpVerify'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


const API_BASE_URL = 'http://localhost:8000/api/v1';

type Tab = 'phone' | 'email'

export default function SignIn() {
  const [tab, setTab] = useState<Tab>('phone')
  const [country, setCountry] = useState<Country>(defaultCountry)
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [showOtp, setShowOtp] = useState(false)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  if (showOtp) {
    return <OtpVerify onBack={() => setShowOtp(false)} />
  }
  const handleLogin = async () => {
    // Determine identifier
    const identifier = tab === 'phone' ? phone : email;
    if (!identifier) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${API_BASE_URL}/customer/auth/login`,
        { identifier: identifier },
        { withCredentials: true }
      );

      // On success – cookies are set automatically
      console.log('Login success', response.data);
      navigate('/customer/dashboard'); // adjust route
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold text-gray-900 text-center mb-1">
        Welcome Back
      </h1>
      <p className="text-md text-center mb-6" style={{ color: '#69686D' }}>
        Welcome back, please enter your details.
      </p>

      <GoogleButton />

      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <TabSwitcher tab={tab} onChange={setTab} />

      {tab === 'phone' ? (
        <PhoneForm
          country={country}
          phone={phone}
          onCountrySelect={setCountry}
          onPhoneChange={setPhone}
        />
      ) : (
        <EmailForm email={email} onChange={setEmail} />
      )}

      {error && <div className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className="w-full mt-5 py-3 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      {/* <button
        type="button"
        onClick={() => setShowOtp(true)}
        className="w-full mt-5 py-3 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg transition-colors"
      >
        Continue
      </button> */}

      <p className="text-center text-md text-gray-500 mt-5">
        Don&apos;t have an account?{' '}
        <a href="/register" className="text-[#0167FF] font-semibold hover:underline">
          Register
        </a>
      </p>
    </AuthLayout>
  )
}
