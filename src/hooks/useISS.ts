import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchISSPosition, fetchPeopleInSpace, calculateSpeed, reverseGeocode } from '../services/issApi';
import type { ISSPosition, ISSData, PeopleInSpaceData } from '../types';

const MAX_TRAJECTORY = 15;
const MAX_SPEED_HISTORY = 30;
const POLL_INTERVAL = 15000;

export function useISS() {
  const [data, setData] = useState<ISSData>({
    position: { lat: 0, lng: 0, timestamp: 0 },
    speed: 0,
    altitude: 408,
    trajectory: [],
    speedHistory: [],
    locationName: 'Loading...',
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const [people, setPeople] = useState<PeopleInSpaceData>({
    number: 0,
    people: [],
    loading: true,
    error: null,
  });

  const trajectoryRef = useRef<ISSPosition[]>([]);
  const speedHistoryRef = useRef<{ time: string; speed: number }[]>([]);
  const lastPositionRef = useRef<ISSPosition | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  const fetchPosition = useCallback(async () => {
    try {
      const pos = await fetchISSPosition();
      let speed = 0;

      if (lastPositionRef.current && lastTimestampRef.current) {
        const timeDiff = (pos.timestamp - lastTimestampRef.current) / 1000;
        if (timeDiff > 0) {
          speed = calculateSpeed(lastPositionRef.current, pos, timeDiff);
          // ISS typically travels ~27,600 km/h; clamp wild values
          if (speed > 35000 || speed < 0) speed = 27600;
        }
      }

      lastPositionRef.current = pos;
      lastTimestampRef.current = pos.timestamp;

      trajectoryRef.current = [...trajectoryRef.current, pos].slice(-MAX_TRAJECTORY);

      const timeLabel = new Date().toLocaleTimeString();
      if (speed > 0) {
        speedHistoryRef.current = [
          ...speedHistoryRef.current,
          { time: timeLabel, speed: Math.round(speed) },
        ].slice(-MAX_SPEED_HISTORY);
      }

      // Reverse geocode every 3 fetches to avoid rate limits
      const shouldGeocode = trajectoryRef.current.length % 3 === 1;
      let locationName = data.locationName;
      if (shouldGeocode) {
        locationName = await reverseGeocode(pos.lat, pos.lng);
      }

      setData((prev) => ({
        ...prev,
        position: pos,
        speed: speed || prev.speed,
        trajectory: [...trajectoryRef.current],
        speedHistory: [...speedHistoryRef.current],
        locationName,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      }));
    } catch (err: any) {
      setData((prev) => ({
        ...prev,
        loading: false,
        error: err.message || 'Failed to fetch ISS position',
      }));
    }
  }, [data.locationName]);

  const fetchPeople = useCallback(async () => {
    try {
      const res = await fetchPeopleInSpace();
      setPeople({ ...res, loading: false, error: null });
    } catch (err: any) {
      setPeople((prev) => ({ ...prev, loading: false, error: err.message }));
    }
  }, []);

  useEffect(() => {
    fetchPosition();
    fetchPeople();
    const interval = setInterval(fetchPosition, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return { data, people, refresh: fetchPosition };
}
