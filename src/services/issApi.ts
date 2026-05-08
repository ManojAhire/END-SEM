import axios from 'axios';
import type { ISSPosition, Astronaut } from '../types';

const ISS_BASE = 'https://api.open-notify.org';

// In dev, Vite proxies /api/iss/* → http://api.open-notify.org/*
// In production we fall back to public CORS proxies
function getISSUrl(path: string): string {
  // Check if we can use Vite's local proxy
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `/api/iss${path}`;
  }
  // Production: use corsproxy.io
  return `https://corsproxy.io/?${encodeURIComponent(`${ISS_BASE}${path}`)}`;
}

async function fetchWithFallback(path: string): Promise<any> {
  // Try the environment-appropriate URL first
  try {
    const res = await axios.get(getISSUrl(path), { timeout: 8000 });
    return res.data;
  } catch {
    // Final fallback: allorigins
    try {
      const res = await axios.get(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`${ISS_BASE}${path}`)}`,
        { timeout: 10000 }
      );
      return res.data;
    } catch {
      throw new Error(`Failed to fetch ISS data: ${path}`);
    }
  }
}


export async function fetchISSPosition(): Promise<{ lat: number; lng: number; timestamp: number }> {
  const data = await fetchWithFallback('/iss-now.json');
  const { iss_position, timestamp } = data;
  return {
    lat: parseFloat(iss_position.latitude),
    lng: parseFloat(iss_position.longitude),
    timestamp: timestamp * 1000,
  };
}

export async function fetchPeopleInSpace(): Promise<{ number: number; people: Astronaut[] }> {
  const data = await fetchWithFallback('/astros.json');
  return { number: data.number, people: data.people };
}

// Haversine formula — exactly as specified
export function calculateSpeed(
  pos1: ISSPosition,
  pos2: ISSPosition,
  timeDiffSeconds: number
): number {
  const R = 6371;
  const toRad = (deg: number) => deg * (Math.PI / 180);
  const dLat = toRad(pos2.lat - pos1.lat);
  const dLon = toRad(pos2.lng - pos1.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pos1.lat)) *
      Math.cos(toRad(pos2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  const speedKmh = (distance / timeDiffSeconds) * 3600;
  return speedKmh;
}

export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=5`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const addr = res.data.address;
    return (
      addr?.city ||
      addr?.county ||
      addr?.state ||
      addr?.country ||
      addr?.ocean ||
      addr?.sea ||
      `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`
    );
  } catch {
    return `${lat.toFixed(2)}°, ${lng.toFixed(2)}°`;
  }
}
