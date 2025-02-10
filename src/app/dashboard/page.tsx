'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  // Logout handler (manual logout only)
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login'); // Redirect after logout
  };

  useEffect(() => {
    // Function to check user authentication on component mount
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          throw new Error(`Failed to fetch session: ${response.status}`);
        }

        const data = await response.json();
        console.log('Session Data:', data);

        // If there is no session, redirect to login
        if (!data.session) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/login');
      }
    };

    checkAuth();

    // Removed auto-logout on page unload events
  }, [router]);

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Other dashboard content */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
