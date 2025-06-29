import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiService, UserProfile } from '../../services/api';

const Profile: React.FC = () => {
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProfile();
      setProfile(response);
      setFormData({
        firstName: response.firstName || '',
        lastName: response.lastName || '',
      });
    } catch (err: any) {
      setError('Failed to load profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdating(true);
      setError('');
      setSuccess('');

      const response = await apiService.updateProfile(formData);
      setProfile(response);
      setUser(response);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      setError('');
      
      await apiService.deleteAccount();
      setSuccess('Account deleted successfully');
      
      // Logout and redirect after a short delay
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete account');
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-3">
            <Link
              to="/help"
              className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm md:text-base"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Help
            </Link>
          </div>
          <button onClick={handleLogout} 
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm md:text-base">
            Logout
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md">
            {success}
          </div>
        )}

        {profile && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-2xl text-blue-600 dark:text-blue-400">
                  {profile.firstName ? profile.firstName[0].toUpperCase() : profile.email[0].toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {profile.firstName && profile.lastName 
                    ? `${profile.firstName} ${profile.lastName}`
                    : 'User'
                  }
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
                <div className="flex items-center mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    profile.isVerified 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {profile.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {updating ? 'Updating...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profile.firstName || 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {profile.lastName || 'Not set'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white">{profile.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Member Since
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Update Profile
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-600 hover:text-red-700 underline text-sm"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 w-screen h-screen bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ marginTop: 0 }}>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Delete Account
                </h3>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to delete your account? This action cannot be undone. All your data, including domains and analysis history, will be permanently deleted.
              </p>
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                style={{ minWidth: 0 }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-3 py-1.5 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors disabled:opacity-50"
                style={{ minWidth: 0 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 