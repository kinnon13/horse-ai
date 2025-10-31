// ServiceDirectory.view.tsx (50 lines)
'use client'

import { useState, useEffect } from 'react';
import { HorseDataRepository, type ServiceProvider } from '@/lib/HorseData.repo';
import { ServiceDirectorySearchBar } from './ServiceDirectorySearchBar'
import { ServiceDirectoryResultsList } from './ServiceDirectoryResultsList'

export function ServiceDirectory() {
  const [location, setLocation] = useState('');
  const [vets, setVets] = useState<ServiceProvider[]>([]);
  const [services, setServices] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!location) return;
    
    setLoading(true);
    try {
      const [city, state] = location.split(',').map(s => s.trim());
      const [vetsData, servicesData] = await Promise.all([
        HorseDataRepository.getNearbyVets(city, state),
        HorseDataRepository.searchServices('vet', location)
      ]);
      setVets(vetsData);
      setServices(servicesData);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ServiceDirectorySearchBar 
        location={location}
        setLocation={setLocation}
        onSearch={search}
        loading={loading}
      />
      <ServiceDirectoryResultsList vets={vets} />
    </div>
  );
}