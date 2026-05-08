import axios from 'axios';
import type { ISSPosition, Astronaut } from '../types';

// Vercel (in production) and Vite (in dev) both proxy /api/iss -> http://api.open-notify.org
// This seamlessly bypasses all CORS issues without relying on external unreliable proxies.
const API_BASE = '/api/iss';

export async function fetchISSPosition(): Promise<{ lat: number; lng: number; timestamp: number }> {
  const { data } = await axios.get(`${API_BASE}/iss-now.json`);
  const { iss_position, timestamp } = data;
  return {
    lat: parseFloat(iss_position.latitude),
    lng: parseFloat(iss_position.longitude),
    timestamp: timestamp * 1000,
  };
}

export async function fetchPeopleInSpace(): Promise<{ number: number; people: Astronaut[] }> {
  const { data } = await axios.get(`${API_BASE}/astros.json`);
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
