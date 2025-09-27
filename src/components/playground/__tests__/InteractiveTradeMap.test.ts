import { describe, test, expect } from '@jest/globals';

// Manual country name mapping (copied from component)
const MANUAL_COUNTRY_NAMES: Record<string, string> = {
  'USA': 'United States',
  'RUS': 'Russia', 
  'CHN': 'China',
  'GBR': 'United Kingdom',
  'FRA': 'France',
  'DEU': 'Germany',
  'JPN': 'Japan',
  'IND': 'India',
  'BRA': 'Brazil',
  'CAN': 'Canada',
  'AUS': 'Australia',
  'MEX': 'Mexico',
  'ARG': 'Argentina',
  'ZAF': 'South Africa',
  'EGY': 'Egypt',
  'TUR': 'Turkey',
  'IRN': 'Iran',
  'SAU': 'Saudi Arabia',
  'THA': 'Thailand',
  'VNM': 'Vietnam',
  'MYS': 'Malaysia',
  'SGP': 'Singapore',
  'PHL': 'Philippines',
  'KOR': 'South Korea',
  'PRK': 'North Korea',
  'NOR': 'Norway',
  'SWE': 'Sweden',
  'FIN': 'Finland',
  'DNK': 'Denmark',
  'NLD': 'Netherlands',
  'BEL': 'Belgium',
  'CHE': 'Switzerland',
  'AUT': 'Austria',
  'ITA': 'Italy',
  'ESP': 'Spain',
  'PRT': 'Portugal',
  'POL': 'Poland',
  'UKR': 'Ukraine',
  'IDN': 'Indonesia',
};

// Mock i18n-iso-countries
const mockGetNameFromIso = (isoCode?: string): string => {
  if (!isoCode) return '';
  
  // Simple mock implementation
  const isoToName: Record<string, string> = {
    'USA': 'United States',
    'CHN': 'China',
    'RUS': 'Russia',
    'GBR': 'United Kingdom',
    'FRA': 'France',
    'DEU': 'Germany',
    'JPN': 'Japan',
    'IND': 'India',
    'BRA': 'Brazil',
    'CAN': 'Canada',
  };
  
  return isoToName[isoCode] || '';
};

// Function to test (extracted from component logic)
function resolveCountryDisplayName(feature: any): string {
  const countryName =
    feature.properties?.name ||
    feature.properties?.ADMIN ||
    feature.properties?.NAME ||
    feature.properties?.NAME_EN ||
    feature.properties?.NAME_LONG ||
    feature.properties?.GEOUNIT ||
    feature.properties?.BRK_NAME ||
    feature.properties?.FORMAL_EN ||
    feature.properties?.SOVEREIGNT ||
    feature.properties?.['name:en'] ||
    feature.properties?.int_name ||
    feature.properties?.official_name ||
    feature.properties?.['official_name:en'];

  const countryCode =
    feature.properties?.['ISO3166-1-Alpha-3'] ||
    feature.properties?.ISO_A3 ||
    feature.properties?.ADM0_A3 ||
    feature.properties?.SOV_A3 ||
    feature.properties?.ISO_A3_EH;

  const countryCodeA2 =
    feature.properties?.['ISO3166-1-Alpha-2'] ||
    feature.properties?.ISO_A2 ||
    (countryCode && countryCode.length === 3 ? undefined : countryCode); // Simple mock conversion

  let displayName =
    (countryName && String(countryName).trim()) ||
    (countryCode && MANUAL_COUNTRY_NAMES[countryCode]) ||
    (countryCodeA2 && MANUAL_COUNTRY_NAMES[countryCodeA2]) ||
    mockGetNameFromIso(countryCode) ||
    mockGetNameFromIso(countryCodeA2) ||
    (countryCode && `Country (${String(countryCode).trim()})`) ||
    (countryCodeA2 && `Country (${String(countryCodeA2).trim()})`) ||
    'Unknown Region';

  return displayName;
}

describe('InteractiveTradeMap Country Name Resolution', () => {
  test('should resolve country name from ADMIN property', () => {
    const feature = {
      properties: {
        ADMIN: 'United States',
        ISO_A3: 'USA'
      }
    };
    
    const result = resolveCountryDisplayName(feature);
    expect(result).toBe('United States');
  });

  test('should fallback to manual mapping when no name properties exist', () => {
    const feature = {
      properties: {
        ISO_A3: 'CHN'
      }
    };
    
    const result = resolveCountryDisplayName(feature);
    expect(result).toBe('China');
  });

  test('should fallback to NAME property when ADMIN is missing', () => {
    const feature = {
      properties: {
        NAME: 'Germany',
        ISO_A3: 'DEU'
      }
    };
    
    const result = resolveCountryDisplayName(feature);
    expect(result).toBe('Germany');
  });

  test('should use GEOUNIT when other name properties are missing', () => {
    const feature = {
      properties: {
        GEOUNIT: 'France',
        ISO_A3: 'FRA'
      }
    };
    
    const result = resolveCountryDisplayName(feature);
    expect(result).toBe('France');
  });

  test('should fallback to ISO code with label when no name found', () => {
    const feature = {
      properties: {
        ISO_A3: 'XYZ' // Non-existent country code
      }
    };
    
    const result = resolveCountryDisplayName(feature);
    expect(result).toBe('Country (XYZ)');
  });

  test('should return Unknown Region only when no identifiable data exists', () => {
    const feature = {
      properties: {}
    };
    
    const result = resolveCountryDisplayName(feature);
    expect(result).toBe('Unknown Region');
  });

  test('should prioritize ADMIN over manual mapping', () => {
    const feature = {
      properties: {
        ADMIN: 'Custom Country Name',
        ISO_A3: 'USA' // Would normally map to "United States"
      }
    };
    
    const result = resolveCountryDisplayName(feature);
    expect(result).toBe('Custom Country Name');
  });

  test('should handle alternative ISO fields', () => {
    const feature = {
      properties: {
        ADM0_A3: 'BRA' // Alternative ISO field
      }
    };
    
    const result = resolveCountryDisplayName(feature);
    expect(result).toBe('Brazil');
  });

  test('should handle empty string properties correctly', () => {
    const feature = {
      properties: {
        ADMIN: '',
        NAME: null,
        ISO_A3: 'IND'
      }
    };
    
    const result = resolveCountryDisplayName(feature);
    expect(result).toBe('India');
  });

  test('should verify manual mapping coverage for major countries', () => {
    const majorCountries = ['USA', 'CHN', 'RUS', 'GBR', 'FRA', 'DEU', 'JPN', 'IND', 'BRA', 'CAN'];
    
    majorCountries.forEach(iso => {
      expect(MANUAL_COUNTRY_NAMES[iso]).toBeDefined();
      expect(MANUAL_COUNTRY_NAMES[iso]).not.toBe('');
    });
  });

  test('should handle real GeoJSON property structure', () => {
    const realGeoJSONFeature = {
      properties: {
        name: 'Indonesia',
        'ISO3166-1-Alpha-3': 'IDN',
        'ISO3166-1-Alpha-2': 'ID'
      }
    };
    
    const result = resolveCountryDisplayName(realGeoJSONFeature);
    expect(result).toBe('Indonesia');
  });

  test('should handle real GeoJSON with ISO codes only', () => {
    const realGeoJSONFeature = {
      properties: {
        'ISO3166-1-Alpha-3': 'USA',
        'ISO3166-1-Alpha-2': 'US'
      }
    };
    
    const result = resolveCountryDisplayName(realGeoJSONFeature);
    expect(result).toBe('United States'); // Should fallback to manual mapping
  });
});

export { resolveCountryDisplayName, MANUAL_COUNTRY_NAMES }; 