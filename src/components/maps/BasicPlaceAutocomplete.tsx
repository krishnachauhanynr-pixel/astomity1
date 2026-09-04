import { useMapsLibrary } from '@vis.gl/react-google-maps';
import React, { Children, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type BasicPlaceAutocompleteElementProps = PropsWithChildren<{
  className?: string;
  style?: React.CSSProperties;
  includedPrimaryTypes?: Array<string> | null;
  includedRegionCodes?: Array<string> | null;
  locationBias?: google.maps.places.LocationBias | null;
  locationRestriction?: google.maps.places.LocationRestriction | null;
  name?: string | null;
  origin?: google.maps.LatLng | google.maps.LatLngLiteral | google.maps.LatLngAltitude | google.maps.LatLngAltitudeLiteral | null;
  requestedLanguage?: string | null;
  requestedRegion?: string | null;
  unitSystem?: google.maps.UnitSystem;
  onSelect?: ({place}: {place: google.maps.places.Place}) => void;
  onError?: (e: google.maps.places.PlaceAutocompleteRequestErrorEvent) => void;
}>;

export const BasicPlaceAutocomplete: React.FC<BasicPlaceAutocompleteElementProps> = props => {
  const placesLibrary = useMapsLibrary('places');

  const {
    children, className, style, includedPrimaryTypes, includedRegionCodes,
    locationBias, locationRestriction, name, origin, requestedLanguage,
    requestedRegion, unitSystem, onSelect, onError
  } = props;

  const numChildren = Children.count(children);
  const [templateElement, setTemplateElement] = useState<HTMLTemplateElement | null>(null);
  const ref = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);
  const autocomplete = ref.current as any;

  // Bind properties safely
  useEffect(() => {
    if (!autocomplete) return;
    if (includedPrimaryTypes !== undefined) autocomplete.includedPrimaryTypes = includedPrimaryTypes;
    if (includedRegionCodes !== undefined) autocomplete.includedRegionCodes = includedRegionCodes;
    if (locationBias !== undefined) autocomplete.locationBias = locationBias;
    if (locationRestriction !== undefined) autocomplete.locationRestriction = locationRestriction;
    if (name !== undefined) autocomplete.name = name;
    if (origin !== undefined) autocomplete.origin = origin;
    if (requestedLanguage !== undefined) autocomplete.requestedLanguage = requestedLanguage;
    if (requestedRegion !== undefined) autocomplete.requestedRegion = requestedRegion;
    if (unitSystem !== undefined) autocomplete.unitSystem = unitSystem;
  }, [autocomplete, includedPrimaryTypes, includedRegionCodes, locationBias, locationRestriction, name, origin, requestedLanguage, requestedRegion, unitSystem]);

  // Bind events safely
  useEffect(() => {
    if (!autocomplete) return;
    const selectListener = onSelect ? autocomplete.addEventListener('gmp-placeselect', (e: any) => onSelect(e)) : null;
    const errorListener = onError ? autocomplete.addEventListener('gmp-error', (e: any) => onError(e)) : null;
    return () => {
      if (selectListener && onSelect) autocomplete.removeEventListener('gmp-placeselect', onSelect);
      if (errorListener && onError) autocomplete.removeEventListener('gmp-error', onError);
    }
  }, [autocomplete, onSelect, onError]);

  useEffect(() => {
    if (numChildren === 0) return;
    if (!placesLibrary || !autocomplete || !children) return;

    const template = document.createElement('template');
    template.setAttribute('slot', 'prediction-item-icon');

    autocomplete.appendChild(template);
    setTemplateElement(template);

    return () => {
      setTemplateElement(null);
      if (autocomplete.contains(template)) {
        autocomplete.removeChild(template);
      }
    };
  }, [placesLibrary, numChildren, autocomplete]);

  if (!placesLibrary) return null;

  return (
    <gmp-place-autocomplete ref={ref} class={className} style={style}>
      {templateElement && createPortal(children, templateElement.content)}
    </gmp-place-autocomplete>
  );
};

BasicPlaceAutocomplete.displayName = 'BasicPlaceAutocomplete';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-place-autocomplete': any;
    }
  }
}
