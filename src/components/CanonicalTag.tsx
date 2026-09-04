import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function CanonicalTag() {
  const location = useLocation();

  useEffect(() => {
    // Generate the canonical URL based on the current origin and path
    const baseUrl = window.location.origin;
    const canonicalUrl = `${baseUrl}${location.pathname}`;
    
    // Find or create the canonical link tag in the document head
    let link = document.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    
    // Update the href attribute
    link.href = canonicalUrl;
  }, [location.pathname]);

  return null; // This component does not render anything visible
}
