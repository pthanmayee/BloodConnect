import { useState, useCallback } from 'react'

export interface LocationState {
  latitude: number | null
  longitude: number | null
  city: string
  loading: boolean
  error: string | null
  permissionGranted: boolean
}

export function useGeolocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    city: 'Mumbai, Maharashtra',
    loading: false,
    error: null,
    permissionGranted: false,
  })

  const requestGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: 'Browser geolocation is not supported on your device.',
        loading: false,
      }))
      return
    }

    setLocation((prev) => ({ ...prev, loading: true, error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: `Near ${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`,
          loading: false,
          error: null,
          permissionGranted: true,
        })
      },
      (error) => {
        let msg = 'Unable to retrieve location.'
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. You can manually enter your city or area below.'
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.'
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please try again or search manually.'
        }

        setLocation((prev) => ({
          ...prev,
          loading: false,
          error: msg,
          permissionGranted: false,
        }))
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [])

  const setManualLocation = useCallback((city: string, lat?: number, lng?: number) => {
    setLocation((prev) => ({
      ...prev,
      city,
      latitude: lat ?? prev.latitude,
      longitude: lng ?? prev.longitude,
      error: null,
    }))
  }, [])

  return {
    location,
    requestGeolocation,
    setManualLocation,
  }
}
