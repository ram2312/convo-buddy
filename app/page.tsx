"use client"; // Mark this as a Client Component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, []);

  return null;
}