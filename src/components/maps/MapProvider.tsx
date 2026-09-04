import React, { ReactNode } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

export function MapProvider({ children }: { children: ReactNode }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return <>{children}</>;
  }

  return (
    <APIProvider apiKey={apiKey} libraries={['places', 'geometry']}>
      {children}
    </APIProvider>
  );
}
