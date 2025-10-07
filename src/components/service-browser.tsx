"use client";

import { useState, useEffect, useRef } from 'react';
import type { Service } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { ServiceList } from '@/components/services/service-list';
import { ServiceDetail } from '@/components/services/service-detail';
import { ServiceSearchBar } from '@/components/services/service-search-bar';
import { ServiceFilters } from '@/components/services/service-filters';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Skeleton } from './ui/skeleton';

export function ServiceBrowser({ services }: { services: Service[] }) {
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);
  const [displayedServices, setDisplayedServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isClient, setIsClient] = useState(false)
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const servicesPerLoad = 8;

  useEffect(() => {
    setIsClient(true)
    // Initialize displayed services
    setDisplayedServices(services.slice(0, servicesPerLoad));
    setHasMore(services.length > servicesPerLoad);

    if (services.length > 0 && !isMobile) {
      setSelectedService(services[0]);
    }
  }, [services, isMobile, servicesPerLoad]);

  const loadMoreServices = () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);

    // Simulate API delay
    setTimeout(() => {
      const currentLength = displayedServices.length;
      const nextBatch = filteredServices.slice(currentLength, currentLength + servicesPerLoad);

      if (nextBatch.length > 0) {
        setDisplayedServices(prev => [...prev, ...nextBatch]);
        setHasMore(currentLength + nextBatch.length < filteredServices.length);
      } else {
        setHasMore(false);
      }

      setIsLoadingMore(false);
    }, 500);
  };

  useEffect(() => {
    if (!isMobile && isClient) {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        const scrollThreshold = 50;

        if (Math.abs(currentScrollY - lastScrollY.current) < scrollThreshold) {
          return;
        }

        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
          // Scrolling down
          setIsSearchBarVisible(false);
        } else {
          // Scrolling up
          setIsSearchBarVisible(true);
        }

        lastScrollY.current = currentScrollY;
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isMobile, isClient]);

  useEffect(() => {
    if (!isMobile && isClient) {
      const handleScroll = () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Check if user is near bottom of page (100px threshold)
        const isNearBottom = scrollTop + windowHeight >= documentHeight - 100;

        if (isNearBottom && hasMore && !isLoadingMore) {
          loadMoreServices();
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isMobile, isClient, hasMore, isLoadingMore, displayedServices.length, filteredServices.length]);

  const handleSearch = (searchTerm: string, location: string) => {
    setHasSearched(true);
    const lowerSearchTerm = searchTerm.toLowerCase();
    const lowerLocation = location.toLowerCase();

    const results = services.filter(service => {
      const matchSearch = lowerSearchTerm ?
        service.title.toLowerCase().includes(lowerSearchTerm) ||
        service.category.toLowerCase().includes(lowerSearchTerm) ||
        service.description.toLowerCase().includes(lowerSearchTerm) : true;

      const matchLocation = lowerLocation ?
        service.location.toLowerCase().includes(lowerLocation) : true;

      return matchSearch && matchLocation;
    });
    setFilteredServices(results);
    setDisplayedServices(results.slice(0, servicesPerLoad));
    setHasMore(results.length > servicesPerLoad);
    setIsLoadingMore(false);
    if (results.length > 0 && !isMobile) {
      setSelectedService(results[0]);
    } else {
      setSelectedService(null);
    }
  };

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
  };

  if (!isClient) {
    return (
      <div className="container mx-auto">
        <div className="py-8">
          <Skeleton className="h-16 w-full max-w-3xl mx-auto" />
        </div>
        <div className="grid md:grid-cols-12 gap-4">
          <div className="md:col-span-5 lg:col-span-4 space-y-4 p-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div className="hidden md:block md:col-span-7 lg:col-span-8 p-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-16 w-full mt-4" />
            <Skeleton className="h-32 w-full mt-4" />
          </div>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-[calc(100vh-var(--header-height))]">
        <div className="p-4 bg-background border-b z-10 flex-shrink-0">
          <div className="flex flex-col gap-4">
            <ServiceSearchBar onSearch={handleSearch} />
            {hasSearched && <ServiceFilters />}
          </div>
        </div>
        <div className="flex-grow overflow-y-auto min-h-0" ref={scrollContainerRef}>
          <ServiceList services={displayedServices} onSelectService={handleSelectService} selectedServiceId={selectedService?.id} />
          {isLoadingMore && (
            <div className="p-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground mt-2">Loading more services...</p>
            </div>
          )}
        </div>
        <Sheet open={!!selectedService && isMobile} onOpenChange={(isOpen) => !isOpen && setSelectedService(null)}>
          <SheetContent side="bottom" className="h-[90dvh] p-0 border-t-4 border-primary overflow-y-auto">
            {selectedService && <ServiceDetail service={selectedService} />}
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className={`p-4 border-b bg-background transition-transform duration-300 ${isSearchBarVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="flex flex-col gap-4 max-w-7xl mx-auto">
          <ServiceSearchBar onSearch={handleSearch} />
          {hasSearched && <ServiceFilters />}
        </div>
      </div>

      {/*contenedor principal: dos columnas (lista servicios + detalle servicio) */}
      <div className="flex-grow overflow-visible">

        {/*contenedor de la columna izquierda de serviceCars */}
        <div className="grid md:grid-cols-12 max-w-7xl mx-auto gap-6">
          <div className="md:col-span-6 lg:col-span-5">
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]" ref={scrollContainerRef}>
              <ServiceList services={displayedServices} onSelectService={handleSelectService} selectedServiceId={selectedService?.id} />
              {isLoadingMore && (
                <div className="p-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading more services...</p>
                </div>
              )}
            </div>
          </div>
          {/*contenedor de la columna derecha de serviceDetails */}

          <div className="hidden md:block md:col-span-6 lg:col-span-7">
            <div className="sticky top-24 overflow-y-auto max-h-[calc(100vh-200px)]">
              {selectedService ? <ServiceDetail service={selectedService} /> :
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <p className="text-lg font-medium">No service selected</p>
                    <p>Select a service from the list to see its details.</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
