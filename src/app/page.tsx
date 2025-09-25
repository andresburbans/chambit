import { ServiceBrowser } from '@/components/service-browser';
import { getServices } from '@/lib/placeholder-data';

export default function Home() {
  // In a real application, you would fetch this data from your API
  const services = getServices();

  return (
    <div className="h-[calc(100vh-var(--header-height))] overflow-y-auto">
      <ServiceBrowser services={services} />
    </div>
  );
}
