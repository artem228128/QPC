import React, { useState } from 'react';
import { GlassCard, GlassButton } from '../glass';

interface RegistrationFormProps {
  onSubmit: (data: { username: string; referralCode?: string }) => Promise<void>;
  isLoading?: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, isLoading = false }) => {
  const [username, setUsername] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    if (referralCode && referralCode.length > 0 && referralCode.length < 6) {
      newErrors.referralCode = 'Referral code must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit({
        username: username.trim(),
        referralCode: referralCode.trim() || undefined,
      });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <GlassCard title="Join Quantum Profit Chain" className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Username *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="glass-input"
              placeholder="Enter your username"
              disabled={isLoading}
            />
            {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username}</p>}
          </div>

          {/* Referral Code Field */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Referral Code (Optional)
            </label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="glass-input"
              placeholder="Enter referral code"
              disabled={isLoading}
            />
            {errors.referralCode && (
              <p className="text-red-400 text-xs mt-1">{errors.referralCode}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              Get bonus rewards with a valid referral code
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="glass-panel p-4 space-y-2">
          <h4 className="text-sm font-semibold text-cyan-400">What you get:</h4>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Access to all matrix levels</li>
            <li>• Earn crypto from referrals</li>
            <li>• Real-time earnings tracking</li>
            <li>• Secure smart contract system</li>
          </ul>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{ width: '100%', background: 'none', border: 'none', padding: 0 }}
        >
          <GlassButton
            variant="primary"
            size="lg"
            className="w-full"
            glow
            loading={isLoading}
            disabled={!username.trim() || isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Start Playing'}
          </GlassButton>
        </button>

        {/* Terms */}
        <p className="text-xs text-gray-400 text-center">
          By registering, you agree to our{' '}
          <button className="text-cyan-400 hover:underline bg-transparent border-none p-0 cursor-pointer">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="text-cyan-400 hover:underline bg-transparent border-none p-0 cursor-pointer">
            Privacy Policy
          </button>
        </p>
      </form>
    </GlassCard>
  );
};

export default RegistrationForm;
