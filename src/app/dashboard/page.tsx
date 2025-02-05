'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });

    if (response.ok) {
      // Redirect to the login page after successful logout
      router.push('/login');
    } else {
      // Handle error (e.g., show a notification)
      console.error('Failed to log out');
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      console.log("Session Data:", data); // Log session data

      if (!data.session) {
        // Redirect to login if not authenticated
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Other dashboard content */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
