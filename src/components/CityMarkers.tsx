import React from 'react';

interface City {
  city: string;
  city_ascii: string;
  lat: number;
  lng: number;
  pop: number;
  country: string;
  iso2: string;
  iso3: string;
  province: string;
  timezone: string;
}

interface CityMarkersProps {
  cities: (City | undefined)[];
  width: number;
  height: number;
}

const CityMarkers: React.FC<CityMarkersProps & React.SVGProps<SVGSVGElement>> = ({
  cities,
  width,
  height,
  ...props
}) => {
  // Convert lat/lng to SVG coordinates
  const latLngToSvgPoint = (lat: number, lng: number): [number, number] => {
    // Map longitude from [-180, 180] to [0, width]
    const x = (lng + 180) * (width / 360);
    
    // Map latitude from [90, -90] to [0, height]
    const y = (90 - lat) * (height / 180);
    
    return [x, y];
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} {...props}>
      {cities.filter(city => city !== undefined).map((city, index) => {
        if (!city) return null;
        
        const [x, y] = latLngToSvgPoint(city.lat, city.lng);
        
        return (
          <g key={index}>
            <circle
              cx={x}
              cy={y}
              r={3}
              fill="oklch(0.645 0.246 16.439)"
              strokeWidth={1.5}
              opacity={0.8}
            />
            <text
              x={x + (x < width / 2 ? 8 : -8)}
              y={y}
              fontSize="12"
              fill="#FFF"
              fontWeight="bold"
              textAnchor={x < width / 2 ? "start" : "end"}
              dominantBaseline="middle"
              filter="drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.8))"
            >
              {city.city}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default CityMarkers; 