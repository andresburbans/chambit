'use client';
import type { Service } from '@/lib/types';
import { ServiceCard } from './service-card';

type ServiceListProps = {
  services: Service[];
  onSelectService: (service: Service) => void;
  selectedServiceId: string | null | undefined;
};

export function ServiceList({ services, onSelectService, selectedServiceId }: ServiceListProps) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">
        {services.length} servicios disponibles
      </h2>
      <div className="space-y-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onSelect={onSelectService}
            isSelected={service.id === selectedServiceId}
          />
        ))}
        {services.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No services match your search.</p>
            <p className="text-muted-foreground">Try different keywords or a broader location.</p>
          </div>
        )}
      </div>
    </div>
  );
}
