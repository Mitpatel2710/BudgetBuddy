import React, { useState } from 'react';
import { User, Loader } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile';
import { ProfileService } from '../../services/profile';
import { StyledInput } from '../form/StyledInput';
import toast from 'react-hot-toast';

export function ProfileForm() {
  const { profile } = useProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSubmitting(true);
    try {
      await ProfileService.updateProfile({
        id: profile.id,
        first_name: formData.firstName,
        last_name: formData.lastName
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <StyledInput
          label="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          icon={<User className="h-5 w-5 text-gray-400" />}
          required
        />

        <StyledInput
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          icon={<User className="h-5 w-5 text-gray-400" />}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isSubmitting ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          'Update Profile'
        )}
      </button>
    </form>
  );
}