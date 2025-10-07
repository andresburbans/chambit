import Image from 'next/image';
import type { Service } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

type ServiceCardProps = {
  service: Service;
  onSelect: (service: Service) => void;
  isSelected: boolean;
};

export function ServiceCard({ service, onSelect, isSelected }: ServiceCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 w-full max-w-[480px]',
        isSelected ? 'border-primary shadow-lg' : 'border-border'
      )}
      onClick={() => onSelect(service)}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
            <Image
              src={service.imageUrl}
              alt={service.title}
              fill
              data-ai-hint={service.imageHint}
              className="rounded-md object-cover"
            />
          </div>
          <div className="flex flex-col justify-between flex-grow min-w-0">
            <div>
              <p className="text-sm text-muted-foreground">{service.category}</p>
              <h3 className="font-semibold text-lg leading-tight truncate">{service.title}</h3>
              <p className="text-sm text-muted-foreground">by {service.expert.name}</p>
            </div>
            <div className="flex items-center gap-4 text-sm mt-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-semibold">{service.rating}</span>
                <span className="text-muted-foreground">({service.reviewCount})</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground truncate">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{service.location}</span>
              </div>
            </div>
            <div className="mt-2">
              <Badge variant="secondary" className="text-base font-bold text-primary bg-primary/10 py-1 px-3">
                ${service.price}
                <span className="font-normal text-sm text-muted-foreground ml-1">/{service.priceType === 'hourly' ? 'hr' : 'project'}</span>
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
