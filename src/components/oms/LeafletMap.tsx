'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OutageEvent } from '@/types/oms';

// Fix Leaflet default marker icons for Next.js bundler
const DefaultIcon = L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: string };
delete DefaultIcon._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LeafletMapProps {
  events: OutageEvent[];
  selectedEvent: OutageEvent | null;
  onSelectEvent: (event: OutageEvent) => void;
  mapCenter?: [number, number];
  zoomLevel?: number;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  mapCenter = [13.8505, 100.5590], // Bangkok PEA HQ / Chatuchak as in screenshot
  zoomLevel = 14
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create Leaflet Map Instance
      const map = L.map(mapContainerRef.current, {
        center: mapCenter,
        zoom: zoomLevel,
        zoomControl: false, // Custom placed zoom controls
      });

      // Add Tile Layer with clean enterprise GIS map aesthetic matching the screenshot
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; Nostra, Esri, HERE, Garmin, USGS, METI/NASA | Powered by Esri',
        maxZoom: 19,
      }).addTo(map);

      // Add Zoom Control at top-left
      L.control.zoom({ position: 'topleft' }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      // cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Markers when events or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    events.forEach((ev) => {
      // No real GIS/GPS match — skip the pin instead of guessing a location
      if (ev.location.lat == null || ev.location.lng == null) return;
      const isSelected = selectedEvent?.eventId === ev.eventId;

      // Determine marker color and icon style
      let markerBg = '#dc2626'; // Red for Feeder
      let levelLabel = 'FEEDER';
      if (ev.level === 'TRANSFORMER') {
        markerBg = '#d97706'; // Amber
        levelLabel = 'TR';
      } else if (ev.level === 'METER') {
        markerBg = '#2563eb'; // Blue
        levelLabel = 'MTR';
      }

      if (ev.status === 'RESTORED') {
        markerBg = '#16a34a'; // Green
      }

      // Create Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-oms-marker',
        html: `
          <div class="relative flex items-center justify-center transform transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
            <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-[10px]" style="background-color: ${markerBg};">
              ${levelLabel}
            </div>
            ${ev.status === 'IN_PROGRESS' ? '<span class="absolute -inset-1 rounded-full animate-ping opacity-40" style="background-color: ' + markerBg + '"></span>' : ''}
            <div class="absolute -bottom-1 w-2 h-2 rotate-45 border-r border-b border-white" style="background-color: ${markerBg};"></div>
          </div>
        `,
        iconSize: [32, 36],
        iconAnchor: [16, 36],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([ev.location.lat, ev.location.lng], { icon: customIcon }).addTo(map);

      // Bind Popup
      const popupHtml = `
        <div style="font-family: sans-serif; font-size: 11.5px; line-height: 1.4; color: #222; min-width: 220px; padding: 2px;">
          <div style="font-weight: bold; font-size: 12.5px; color: #1e3a8a; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-bottom: 6px; display: flex; justify-content: space-between;">
            <span>⚡ ${ev.eventId}</span>
            <span style="font-size: 10px; padding: 1px 4px; border-radius: 3px; background: ${markerBg}; color: white;">${ev.statusLabel}</span>
          </div>
          <div style="margin-bottom: 3px;"><strong>อุปกรณ์:</strong> <span style="font-family: monospace; font-weight: bold;">${ev.device}</span></div>
          <div style="margin-bottom: 3px;"><strong>ระดับ:</strong> ${ev.level} (${ev.type})</div>
          <div style="margin-bottom: 3px;"><strong>สาเหตุ:</strong> ${ev.cause}</div>
          <div style="margin-bottom: 3px;"><strong>ผชฟ. กระทบ:</strong> <span style="color: #dc2626; font-weight: bold;">${ev.impact.currentAffected} ราย</span></div>
          <div style="margin-bottom: 3px; font-size: 10.5px; color: #555;">📍 ${ev.location.address}</div>
          <div style="margin-top: 6px; padding-top: 4px; border-top: 1px dashed #ccc; font-size: 10px; color: #666;">
            เริ่มเมื่อ: ${ev.startedAt}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        onSelectEvent(ev);
      });

      markersRef.current[ev.eventId] = marker;
    });
  }, [events, selectedEvent, onSelectEvent]);

  // On first load, fit the view to show every pin instead of the hardcoded
  // Bangkok default (real events can be anywhere, e.g. Narathiwat).
  const hasFitBoundsRef = useRef(false);
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || hasFitBoundsRef.current) return;
    const located = events.filter((ev) => ev.location.lat != null && ev.location.lng != null);
    if (located.length === 0) return;
    hasFitBoundsRef.current = true;
    const bounds = L.latLngBounds(located.map((ev) => [ev.location.lat as number, ev.location.lng as number]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 16 });
  }, [events]);

  // Center + zoom to the selected event's marker on click
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedEvent || selectedEvent.location.lat == null || selectedEvent.location.lng == null) return;

    map.flyTo([selectedEvent.location.lat, selectedEvent.location.lng], Math.max(map.getZoom(), 14), {
      animate: true,
      duration: 0.8,
    });

    const marker = markersRef.current[selectedEvent.eventId];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedEvent]);

  return <div ref={mapContainerRef} className="w-full h-full relative" />;
};

export default LeafletMap;
