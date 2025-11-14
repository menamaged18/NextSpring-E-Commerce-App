'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function SearchParamsMessage() {
  const params = useSearchParams();
  const message = params.get('message') ?? '';

  if (!message) return null;
  return (
    <div className="text-center text-red-600">
      {message}
    </div>
  );
}
