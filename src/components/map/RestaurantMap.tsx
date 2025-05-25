import { useState, useEffect, useRef } from "react";
import { Card, Input, Button, Typography, Space } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

// Declare google as a global variable for TypeScript
declare global {
  interface Window {
    google: typeof google;
  }
  var google: any;
}

interface RestaurantMapProps {
  location: {
    lat: number;
    lng: number;
  };
  onLocationChange?: (lat: number, lng: number) => void;
}

const RestaurantMap = ({ location, onLocationChange }: RestaurantMapProps) => {
  const [mapKey, setMapKey] = useState<string>("");
  const [inputKey, setInputKey] = useState<string>("");
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const initializeMap = () => {
    if (!mapKey || !mapContainerRef.current) return;

    const googleMapsScript = document.createElement("script");
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey}&libraries=places`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;
    googleMapsScript.onload = () => {
      setIsMapReady(true);
    };
    document.head.appendChild(googleMapsScript);

    return () => {
      document.head.removeChild(googleMapsScript);
    };
  };

  useEffect(() => {
    return initializeMap();
  }, [mapKey]);

  useEffect(() => {
    if (!isMapReady || !mapContainerRef.current) return;

    mapRef.current = new google.maps.Map(mapContainerRef.current, {
      center: { lat: location.lat, lng: location.lng },
      zoom: 15,
      mapTypeControl: false,
    });

    markerRef.current = new google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: mapRef.current,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });

    mapRef.current.addListener("click", (e: any) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      if (markerRef.current) {
        markerRef.current.setPosition({ lat, lng });
      }

      onLocationChange?.(lat, lng);
    });

    if (markerRef.current) {
      markerRef.current.addListener("dragend", () => {
        const position = markerRef.current?.getPosition();
        if (position) {
          onLocationChange?.(position.lat(), position.lng());
        }
      });
    }
  }, [isMapReady, location.lat, location.lng]);

  const handleSetApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setMapKey(inputKey);
    localStorage.setItem("google_maps_api_key", inputKey);
  };

  useEffect(() => {
    const savedKey = localStorage.getItem("google_maps_api_key");
    if (savedKey) {
      setMapKey(savedKey);
      setInputKey(savedKey);
    }
  }, []);

  if (!mapKey) {
    return (
      <Card style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <EnvironmentOutlined style={{ fontSize: 48, color: "#999" }} />
          <Typography.Title level={4}>Google Maps API Key Required</Typography.Title>
          <Typography.Paragraph type="secondary">
            To display the restaurant location map, please enter your Google Maps API key.
          </Typography.Paragraph>
          <form onSubmit={handleSetApiKey}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input
                placeholder="Enter Google Maps API Key"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
              />
              <Button type="primary" htmlType="submit">
                Save API Key
              </Button>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                You can get an API key from the{" "}
                <a
                  href="https://developers.google.com/maps/documentation/javascript/get-api-key"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Cloud Console
                </a>.
              </Typography.Text>
            </Space>
          </form>
        </div>
      </Card>
    );
  }

  return <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />;
};

export default RestaurantMap;
