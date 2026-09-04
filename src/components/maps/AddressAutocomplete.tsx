import React, { useEffect, useRef, useState } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (val: string) => void;
}

export function AddressAutocomplete({ onPlaceSelect, placeholder = "Enter address...", className = "", value, onChange }: Props) {
  const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;
    
    // Note: The classic Autocomplete is deprecated as of Mar 2025. 
    // This uses the legacy Autocomplete for simplicity in demo if Places API New is not enabled, 
    // but ideally we should migrate to google.maps.places.Place (New).
    // Let's use the older one but specify fields to minimize cost.
    const options = {
      fields: ['geometry', 'name', 'formatted_address', 'address_components'],
      componentRestrictions: { country: 'IN' } // India focus
    };

    const autocomplete = new places.Autocomplete(inputRef.current, options);
    setPlaceAutocomplete(autocomplete);
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    const listener = placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
    
    return () => {
      if (listener) {
         google.maps.event.removeListener(listener);
      }
    }
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <input 
      ref={inputRef} 
      className={className} 
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
