//@ts-nocheck
import "../../index.scss";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { latLngBounds } from "leaflet";
import { useEffect, useMemo } from "react";
import './Map.scss';
import { useAppSelector } from "../../utils/hooks";

const MapMarkers = ({ setVisibleCards }) => {
  const { rentItems } = useAppSelector(state => state.rentItems);
  const map = useMap();

  useEffect(() => {
    const eventHandler = () => {
      const bounds = map.getBounds();
      const visibleItems = rentItems.filter(item => bounds.contains(item.latLng));
      setVisibleCards(visibleItems);
    };

    map.addEventListener("zoomend", eventHandler);
    map.addEventListener("moveend", eventHandler);

    return () => {
      map.removeEventListener("zoomend", eventHandler);
      map.removeEventListener("moveend", eventHandler);
    };
  }, [map, rentItems, setVisibleCards]);

  const calculateMapZoom = () => {
    const latLngArr = rentItems
      .filter((rentItem) => rentItem.latLng)
      .map((rentItem) => rentItem.latLng);

    const markerBounds = latLngBounds(
      latLngArr.map(([lat, lng]) => [isNaN(lat) ? 1 : lat, isNaN(lng) ? 1 : lng])
    );

    map.fitBounds(markerBounds);
  };

  useEffect(() => {
    calculateMapZoom();
  }, [rentItems, map]);

  return (
    <MarkerClusterGroup
      chunkedLoading
    >
      {rentItems.map((rentItem) => (
        <Marker key={rentItem.id} position={rentItem.latLng} eventHandlers={{
          click: () => setVisibleCards(rentItems.filter(item => item.id === rentItem.id))
        }} />
      ))}
    </MarkerClusterGroup>
  )
};

const Map = ({ setVisibleCards }) => {
  const { rentItems } = useAppSelector(state => state.rentItems);

  const center = useMemo(() => {
    const latLngArr = rentItems
      .filter((rentItem) => rentItem.latLng)
      .map((rentItem) => rentItem.latLng);

    const latitudes = latLngArr.map(([lat]) => lat);
    const longitudes = latLngArr.map(([, lng]) => lng);

    const centerLat = (Math.max(...latitudes) + Math.min(...latitudes)) / 2;
    const centerLng = (Math.max(...longitudes) + Math.min(...longitudes)) / 2;

    return [centerLat, centerLng];
  }, [rentItems]);

  useEffect(() => {
    setVisibleCards(rentItems);
  }, [rentItems, setVisibleCards]);

  return (
    rentItems[0].latLng[0] !== 0
      ? (
        <section className="map">
          <MapContainer center={center} zoom={10}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
              <MapMarkers setVisibleCards={setVisibleCards} />
          </MapContainer>
        </section>
      )
      : (
        <section className="map">
          <h4>Map Not Found</h4>
        </section>
      )
  );
};

export default Map;

