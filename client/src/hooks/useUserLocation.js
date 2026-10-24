import { useEffect, useState } from "react";

export default function useUserLocation() {
  const [location, setLocation] = useState({
    city: null,
    country: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const saved = localStorage.getItem("user_location");
    if (saved) {
      setLocation({ ...JSON.parse(saved), loading: false });
      return;
    }

    if (!navigator.geolocation) {
      setLocation({
        city: null,
        country: null,
        loading: false,
        error: "Geolocation not supported",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // 🔹 Reverse Geocoding (OpenStreetMap - free)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();

          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Unknown";

          const country = data.address.country || "Unknown";

          const result = { city, country };
          localStorage.setItem("user_location", JSON.stringify(result));

          setLocation({
            city,
            country,
            loading: false,
            error: null,
          });
        } catch (err) {
          console.log(err);
          setLocation({
            city: null,
            country: null,
            loading: false,
            error: "Failed to fetch location name",
          });
        }
      },
      (error) => {
        setLocation({
          city: null,
          country: null,
          loading: false,
          error: error.message,
        });
      }
    );
  }, []);

  return location;
}