import { describe, test, expect } from '@jest/globals';

describe('GeoJSON Data Analysis', () => {
  test('should fetch and analyze real GeoJSON data structure', async () => {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson'
      );
      const data = await response.json();
      
      console.log('GeoJSON data loaded, feature count:', data.features.length);
      
      // Analyze first few features
      const sampleFeatures = data.features.slice(0, 10);
      
      sampleFeatures.forEach((feature: any, index: number) => {
        const props = feature.properties;
        console.log(`\nFeature ${index + 1}:`, {
          name: props?.name,
          'ISO3166-1-Alpha-3': props?.['ISO3166-1-Alpha-3'],
          'ISO3166-1-Alpha-2': props?.['ISO3166-1-Alpha-2'],
          ADMIN: props?.ADMIN,
          NAME: props?.NAME,
          ISO_A3: props?.ISO_A3,
          allKeys: Object.keys(props || {})
        });
      });

      // Check for features with missing critical properties
      const problematicFeatures = data.features.filter((feature: any) => {
        const props = feature.properties || {};
        return !props.name && !props['ISO3166-1-Alpha-3'] && !props.ADMIN && !props.NAME && !props.ISO_A3;
      });

      console.log('\nProblematic features count:', problematicFeatures.length);
      
      if (problematicFeatures.length > 0) {
        console.log('Sample problematic features:');
        problematicFeatures.slice(0, 5).forEach((feature: any, index: number) => {
          console.log(`Problematic ${index + 1}:`, {
            id: feature.id,
            properties: feature.properties,
            allKeys: Object.keys(feature.properties || {})
          });
        });
      }

      // Verify data structure
      expect(data).toHaveProperty('features');
      expect(Array.isArray(data.features)).toBe(true);
      expect(data.features.length).toBeGreaterThan(0);
      
      // Most features should have proper names
      const validFeatures = data.features.filter((feature: any) => {
        const props = feature.properties || {};
        return props.name || props['ISO3166-1-Alpha-3'] || props.ADMIN || props.NAME || props.ISO_A3;
      });
      
      const validRatio = validFeatures.length / data.features.length;
      console.log(`\nValid features ratio: ${validRatio.toFixed(2)} (${validFeatures.length}/${data.features.length})`);
      
      expect(validRatio).toBeGreaterThan(0.9); // At least 90% should have valid names
      
    } catch (error) {
      console.error('Failed to fetch GeoJSON data:', error);
      throw error;
    }
  }, 30000); // 30 second timeout for network request
}); 