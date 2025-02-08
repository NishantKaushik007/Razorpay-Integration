'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  // Logout handler
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login'); // Redirect after logout
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) throw new Error(`Failed to fetch session: ${response.status}`);

        const data = await response.json();
        console.log('Session Data:', data);

        if (!data.session) router.push('/login');
      } catch (error) {
        console.error('Error checking session:', error);
        router.push('/login');
      }
    };

    checkAuth();

    // Logout only when the page is closed (not on refresh)
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ''; // Standard way to show a confirmation prompt
    };

    const handleUnload = async () => {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/auth/logout', JSON.stringify({ logout: true }));
      } else {
        await fetch('/api/auth/logout', { method: 'POST' });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleUnload); // Triggers only when the tab/window is closed

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, [router]);

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Other dashboard content */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
