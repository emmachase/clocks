import { useEffect, useState } from 'react';

interface DayNightTerminatorProps {
  width: number;
  height: number;
  time?: Date;
  resolution?: number;
  longitudeRange?: number;
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWidth?: number;
}

function julian(date: Date): number {
  /* Calculate the present UTC Julian Date. Function is valid after
   * the beginning of the UNIX epoch 1970-01-01 and ignores leap
   * seconds. */
  return (date.getTime() / 86400000) + 2440587.5;
}

function GMST(julianDay: number): number {
  /* Calculate Greenwich Mean Sidereal Time according to 
     http://aa.usno.navy.mil/faq/docs/GAST.php */
  const d = julianDay - 2451545.0;
  // Low precision equation is good enough for our purposes.
  return (18.697374558 + 24.06570982441908 * d) % 24;
}

const DayNightTerminator = ({
  width,
  height,
  time,
  resolution = 2,
  longitudeRange = 360,
  fillColor = '#000',
  fillOpacity = 0.3,
  strokeColor = '#000',
  strokeOpacity = 0.5,
  strokeWidth = 1,
  ...props
}: DayNightTerminatorProps & React.SVGProps<SVGSVGElement>) => {
  const [pathData, setPathData] = useState<string>('');
  
  // Constants
  const R2D = 180 / Math.PI;
  const D2R = Math.PI / 180;

  // Helper functions from the original code
  const sunEclipticPosition = (julianDay: number) => {
    /* Compute the position of the Sun in ecliptic coordinates at
       julianDay. Following
       http://en.wikipedia.org/wiki/Position_of_the_Sun */
    // Days since start of J2000.0
    const n = julianDay - 2451545.0;
    // mean longitude of the Sun
    let L = 280.460 + 0.9856474 * n;
    L %= 360;
    // mean anomaly of the Sun
    let g = 357.528 + 0.9856003 * n;
    g %= 360;
    // ecliptic longitude of Sun
    const lambda = L + 1.915 * Math.sin(g * D2R) +
      0.02 * Math.sin(2 * g * D2R);
    // distance from Sun in AU
    const R = 1.00014 - 0.01671 * Math.cos(g * D2R) -
      0.0014 * Math.cos(2 * g * D2R);
    return { lambda, R };
  };

  const eclipticObliquity = (julianDay: number) => {
    // Following the short term expression in
    // http://en.wikipedia.org/wiki/Axial_tilt#Obliquity_of_the_ecliptic_.28Earth.27s_axial_tilt.29
    const n = julianDay - 2451545.0;
    // Julian centuries since J2000.0
    const T = n / 36525;
    const epsilon = 23.43929111 -
      T * (46.836769 / 3600
        - T * (0.0001831 / 3600
          + T * (0.00200340 / 3600
            - T * (0.576e-6 / 3600
              - T * 4.34e-8 / 3600))));
    return epsilon;
  };

  const sunEquatorialPosition = (sunEclLng: number, eclObliq: number) => {
    /* Compute the Sun's equatorial position from its ecliptic
     * position. Inputs are expected in degrees. Outputs are in
     * degrees as well. */
    let alpha = Math.atan(Math.cos(eclObliq * D2R)
      * Math.tan(sunEclLng * D2R)) * R2D;
    const delta = Math.asin(Math.sin(eclObliq * D2R)
      * Math.sin(sunEclLng * D2R)) * R2D;

    const lQuadrant = Math.floor(sunEclLng / 90) * 90;
    const raQuadrant = Math.floor(alpha / 90) * 90;
    alpha = alpha + (lQuadrant - raQuadrant);

    return { alpha, delta };
  };

  const hourAngle = (lng: number, sunPos: { alpha: number, delta: number }, gst: number) => {
    /* Compute the hour angle of the sun for a longitude on
     * Earth. Return the hour angle in degrees. */
    const lst = gst + lng / 15;
    return lst * 15 - sunPos.alpha;
  };

  const latitude = (ha: number, sunPos: { alpha: number, delta: number }) => {
    /* For a given hour angle and sun position, compute the
     * latitude of the terminator in degrees. */
    const lat = Math.atan(-Math.cos(ha * D2R) /
      Math.tan(sunPos.delta * D2R)) * R2D;
    return lat;
  };

  const computeTerminatorPoints = (currentTime: Date) => {
    const today = currentTime || new Date();
    const julianDay = julian(today);
    const gst = GMST(julianDay);
    const points: [number, number][] = [];

    const sunEclPos = sunEclipticPosition(julianDay);
    const eclObliq = eclipticObliquity(julianDay);
    const sunEqPos = sunEquatorialPosition(sunEclPos.lambda, eclObliq);
    
    for (let i = 0; i <= longitudeRange * resolution; i++) {
      const lng = -longitudeRange / 2 + i / resolution;
      const ha = hourAngle(lng, sunEqPos, gst);
      points[i + 1] = [latitude(ha, sunEqPos), lng];
    }
    
    if (sunEqPos.delta < 0) {
      points[0] = [90, -longitudeRange / 2];
      points[points.length] = [90, longitudeRange / 2];
    } else {
      points[0] = [-90, -longitudeRange / 2];
      points[points.length] = [-90, longitudeRange / 2];
    }
    
    return points;
  };

  // Convert lat/lng to SVG coordinates
  const latLngToSvgPoint = (lat: number, lng: number): [number, number] => {
    // Map longitude from [-180, 180] to [0, width]
    const x = (lng + 180) * (width / 360);
    
    // Map latitude from [90, -90] to [0, height]
    const y = (90 - lat) * (height / 180);
    
    return [x, y];
  };

  // Generate SVG path from terminator points
  const generateSvgPath = (points: [number, number][]) => {
    if (points.length === 0) return '';
    
    const svgPoints = points.map(([lat, lng]) => latLngToSvgPoint(lat, lng));
    
    let path = `M ${svgPoints[0][0]},${svgPoints[0][1]}`;
    
    for (let i = 1; i < svgPoints.length; i++) {
      path += ` L ${svgPoints[i][0]},${svgPoints[i][1]}`;
    }
    
    // Close the path
    path += ' Z';
    
    return path;
  };

  useEffect(() => {
    const currentTime = time || new Date();
    const terminatorPoints = computeTerminatorPoints(currentTime);
    const svgPath = generateSvgPath(terminatorPoints);
    setPathData(svgPath);
  }, [time, width, height, resolution, longitudeRange]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} {...props}>
      <path
        d={pathData}
        fill={fillColor}
        fillOpacity={fillOpacity}
        stroke={strokeColor}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default DayNightTerminator; 