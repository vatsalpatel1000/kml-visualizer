import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Polygon, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import { DOMParser } from 'xmldom';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Helper function to process coordinates
const processCoordinates = (coordinatesText) => {
  return coordinatesText
    .trim()
    .split(/\s+/)
    .map(coord => {
      const [lon, lat] = coord.split(',').map(Number);
      if (!isNaN(lon) && !isNaN(lat)) {
        return [lat, lon];
      }
      return null;
    })
    .filter(Boolean);
};

const App = () => {
  const [kmlData, setKmlData] = useState(null);
  const [elementCounts, setElementCounts] = useState(null);
  const [parsedElements, setParsedElements] = useState({ points: [], lines: [], polygons: [] });
  const [bounds, setBounds] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const parser = new DOMParser();
        const kml = parser.parseFromString(text, 'text/xml');
        setKmlData(kml);
        processKML(kml);
      };
      reader.readAsText(file);
    }
  };

  const processKML = (kml) => {
    const elements = ['Point', 'LineString', 'Polygon', 'MultiGeometry'];
    const counts = {};
    elements.forEach((element) => {
      counts[element] = kml.getElementsByTagName(element).length;
    });
    setElementCounts(counts);

    const points = [];
    const lines = [];
    const polygons = [];
    const newBounds = [];

    const pointElements = kml.getElementsByTagName('Point');
    for (let i = 0; i < pointElements.length; i++) {
      const coordText = pointElements[i].getElementsByTagName('coordinates')[0]?.textContent?.trim();
      if (coordText) {
        const [lon, lat] = coordText.split(',').map(Number);
        if (!isNaN(lon) && !isNaN(lat)) {
          const position = [lat, lon];
          points.push(position);
          newBounds.push(position);
        }
      }
    }

    const lineElements = kml.getElementsByTagName('LineString');
    for (let i = 0; i < lineElements.length; i++) {
      const coordText = lineElements[i].getElementsByTagName('coordinates')[0]?.textContent;
      if (coordText) {
        const line = processCoordinates(coordText);
        if (line.length > 0) {
          lines.push(line);
          newBounds.push(...line);
        }
      }
    }

    const polygonElements = kml.getElementsByTagName('Polygon');
    for (let i = 0; i < polygonElements.length; i++) {
      const coordText = polygonElements[i].getElementsByTagName('coordinates')[0]?.textContent;
      if (coordText) {
        const polygon = processCoordinates(coordText);
        if (polygon.length > 0) {
          polygons.push(polygon);
          newBounds.push(...polygon);
        }
      }
    }

    setParsedElements({ points, lines, polygons });
    setBounds(newBounds);
  };

  const handleSummary = () => {
    if (elementCounts) {
      alert(JSON.stringify(elementCounts, null, 2));
    }
  };

  const handleDetailed = () => {
    if (kmlData) {
      const lineStrings = kmlData.getElementsByTagName('LineString');
      let totalLength = 0;

      for (let i = 0; i < lineStrings.length; i++) {
        const coordinatesText = lineStrings[i].getElementsByTagName('coordinates')[0]?.textContent.trim();
        
        if (!coordinatesText) continue;

        const coordinates = coordinatesText.split(/\s+/);
        
        for (let j = 0; j < coordinates.length - 1; j++) {
          const [lon1, lat1] = coordinates[j].split(',').map(Number);
          const [lon2, lat2] = coordinates[j + 1].split(',').map(Number);

          if (!isNaN(lon1) && !isNaN(lat1) && !isNaN(lon2) && !isNaN(lat2)) {
            const dist = L.latLng(lat1, lon1).distanceTo(L.latLng(lat2, lon2));
            totalLength += dist;
          }
        }
      }
      alert(`Total Line Length: ${totalLength.toFixed(2)} meters`);
    }
  };

  const FitBoundsComponent = () => {
    const map = useMap();

    useEffect(() => {
      if (bounds && bounds.length > 0) {
        map.fitBounds(bounds);
      }
    }, [bounds, map]);

    return null;
  };

  return (
    <div className="p-4">
      <input type="file" accept=".kml" onChange={handleFileUpload} />
      <div className="flex gap-2 mt-4">
        <button onClick={handleSummary} className="bg-blue-500 text-white px-4 py-2 rounded">Summary</button>
        <button onClick={handleDetailed} className="bg-green-500 text-white px-4 py-2 rounded">Detailed</button>
      </div>
      <MapContainer center={[0, 0]} zoom={2} className="h-96 mt-4">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBoundsComponent />
        {parsedElements.points.map((point, idx) => (
          <Marker key={idx} position={point} />
        ))}
        {parsedElements.lines.map((line, idx) => (
          <Polyline key={idx} positions={line} color="blue" />
        ))}
        {parsedElements.polygons.map((polygon, idx) => (
          <Polygon key={idx} positions={polygon} color="red" />
        ))}
      </MapContainer>
    </div>
  );
};

export default App;
