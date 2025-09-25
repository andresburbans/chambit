import Image from 'next/image';
import type { Service } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, MapPin, MessageSquare, Heart } from 'lucide-react';
import { OfferForm } from './offer-form';
import { useAuth } from '@/lib/auth.tsx';

type ServiceDetailProps = {
  service: Service;
};

export function ServiceDetail({ service }: ServiceDetailProps) {
  const { user } = useAuth();
  const expertInitials = service.expert.name.split(' ').map(n => n[0]).join('');

  return (
    <div className="h-full flex flex-col">
        <div className="relative h-48 md:h-64 w-full flex-shrink-0">
          <Image
            src={service.imageUrl}
            alt={service.title}
            fill
            data-ai-hint={service.imageHint}
            className="object-cover md:rounded-t-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <Badge variant="secondary" className="mb-2">{service.category}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold">{service.title}</h1>
          </div>
        </div>
      
      <div className="flex-grow overflow-y-auto p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-background">
              <AvatarImage src={service.expert.avatarUrl} alt={service.expert.name} />
              <AvatarFallback>{expertInitials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-semibold">{service.expert.name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                 <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-foreground">{service.rating}</span>
                    <span>({service.reviewCount} reviews)</span>
                 </div>
                 <span className="text-muted-foreground/50">|</span>
                 <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{service.location}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="outline" size="icon"><Heart className="w-4 h-4" /></Button>
            <Button variant="outline"><MessageSquare className="w-4 h-4 mr-2" /> Message</Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <h2 className="text-xl font-bold mb-2">About this service</h2>
          <p className="text-muted-foreground leading-relaxed">{service.description}</p>
        </div>
        
        <Separator className="my-6" />

        <div>
            { user?.role === 'client' ? (
                <>
                    <h2 className="text-xl font-bold mb-4">Make an Offer</h2>
                    <div className="bg-secondary/50 p-6 rounded-lg">
                        <OfferForm service={service} />
                    </div>
                </>
            ) : (
                <div className="bg-secondary/50 p-6 rounded-lg text-center">
                    <p className="font-medium">This is one of your service listings.</p>
                    <p className="text-sm text-muted-foreground">Clients can submit offers here.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
