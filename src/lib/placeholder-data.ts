import type { Service, ServiceRequest, Opportunity } from './types';

const services: Service[] = [
  {
    id: '1',
    title: 'Reparación de dispositivos electrónicos',
    description: 'Equipos electrónicos que no funcionan correctamente. Diagnosticar y reparar el dispositivo electrónico.',
    category: 'Reparaciones y mantenimiento',
    price: 75,
    priceType: 'hourly',
    rating: 4.9,
    reviewCount: 132,
    location: 'Bogotá, Colombia',
    expert: {
      id: 'expert1',
      name: 'Mario Rossi',
      avatarUrl: 'https://picsum.photos/seed/avatar2/200/200',
    },
    imageUrl: 'https://picsum.photos/seed/electronics/600/400',
    imageHint: 'técnico reparando dispositivo'
  },
  {
    id: '2',
    title: 'Reparación de puertas',
    description: 'Puertas que no cierran o abren correctamente, bisagras dañadas. Reparar o reemplazar la puerta y sus componentes.',
    category: 'Reparaciones y mantenimiento',
    price: 80,
    priceType: 'fixed',
    rating: 4.8,
    reviewCount: 89,
    location: 'Medellín, Colombia',
    expert: {
      id: 'expert2',
      name: 'Carlos Martínez',
      avatarUrl: 'https://picsum.photos/seed/avatar3/200/200',
    },
    imageUrl: 'https://picsum.photos/seed/doors/600/400',
    imageHint: 'carpintero reparando puerta'
  },
  {
    id: '3',
    title: 'Reparación de muebles',
    description: 'Muebles con partes dañadas, desgastadas o rotas. Reparar o restaurar el mueble dañado.',
    category: 'Reparaciones y mantenimiento',
    price: 120,
    priceType: 'fixed',
    rating: 4.7,
    reviewCount: 67,
    location: 'Cali, Colombia',
    expert: {
      id: 'expert3',
      name: 'Ana López',
      avatarUrl: 'https://picsum.photos/seed/avatar4/200/200',
    },
    imageUrl: 'https://picsum.photos/seed/furniture/600/400',
    imageHint: 'carpintero restaurando mueble'
  },
  {
    id: '4',
    title: 'Reparación de sistemas de plomería',
    description: 'Fugas de agua, tuberías obstruidas, problemas con grifería. Reparar las tuberías, desatascar desagües, instalar o reparar grifería.',
    category: 'Reparaciones y mantenimiento',
    price: 65,
    priceType: 'hourly',
    rating: 4.9,
    reviewCount: 156,
    location: 'Barranquilla, Colombia',
    expert: {
      id: 'expert4',
      name: 'José García',
      avatarUrl: 'https://picsum.photos/seed/avatar5/200/200',
    },
    imageUrl: 'https://picsum.photos/seed/plumbing/600/400',
    imageHint: 'plomero trabajando'
  },
  {
    id: '5',
    title: 'Reparación de sistemas eléctricos',
    description: 'Cortocircuitos, enchufes o interruptores dañados, problemas con el cableado. Diagnosticar y solucionar el problema eléctrico, reparar el cableado.',
    category: 'Reparaciones y mantenimiento',
    price: 70,
    priceType: 'hourly',
    rating: 4.8,
    reviewCount: 134,
    location: 'Cartagena, Colombia',
    expert: {
      id: 'expert5',
      name: 'María Rodríguez',
      avatarUrl: 'https://picsum.photos/seed/avatar6/200/200',
    },
    imageUrl: 'https://picsum.photos/seed/electricity/600/400',
    imageHint: 'electricista trabajando'
  },
  {
    id: '6',
    title: 'Cuidado de mascotas',
    description: 'Pasear, alimentar, bañar y brindar atención veterinaria a las mascotas. Pasear, alimentar y cuidar a la mascota según las indicaciones del dueño.',
    category: 'Cuidado de animales y personas',
    price: 25,
    priceType: 'hourly',
    rating: 4.9,
    reviewCount: 203,
    location: 'Bogotá, Colombia',
    expert: {
      id: 'expert6',
      name: 'Laura Sánchez',
      avatarUrl: 'https://picsum.photos/seed/avatar7/200/200',
    },
    imageUrl: 'https://picsum.photos/seed/petcare/600/400',
    imageHint: 'cuidador paseando perro'
  },
  {
    id: '7',
    title: 'Cuidado de personas mayores',
    description: 'Asistir en actividades diarias como higiene personal, alimentación, movilidad y medicación. Asistir a la persona mayor en sus necesidades básicas.',
    category: 'Cuidado de animales y personas',
    price: 35,
    priceType: 'hourly',
    rating: 4.9,
    reviewCount: 112,
    location: 'Medellín, Colombia',
    expert: {
      id: 'expert7',
      name: 'Carmen Díaz',
      avatarUrl: 'https://picsum.photos/seed/avatar8/200/200',
    },
    imageUrl: 'https://picsum.photos/seed/elderlycare/600/400',
    imageHint: 'asistente cuidando persona mayor'
  },
  {
    id: '8',
    title: 'Cuidado de niños',
    description: 'Cuidado y atención de niños en ausencia de los padres, incluyendo actividades educativas y recreativas. Cuidar a los niños, jugar con ellos, ayudarlos con sus tareas.',
    category: 'Cuidado de animales y personas',
    price: 20,
    priceType: 'hourly',
    rating: 4.8,
    reviewCount: 178,
    location: 'Cali, Colombia',
    expert: {
      id: 'expert8',
      name: 'Isabel Torres',
      avatarUrl: 'https://picsum.photos/seed/avatar9/200/200',
    },
    imageUrl: 'https://picsum.photos/seed/childcare/600/400',
    imageHint: 'niñera cuidando niños'
  },
  {
    id: '9',
    title: 'Limpieza general del hogar',
    description: 'Limpiar y desinfectar el hogar, incluyendo pisos, baños, cocina y habitaciones. Limpiar y desinfectar las diferentes áreas del hogar.',
    category: 'Limpieza y mantenimiento del hogar',
    price: 80,
    priceType: 'fixed',
    rating: 4.7,
    reviewCount: 267,
    location: 'Barranquilla, Colombia',
    expert: {
      id: 'expert9',
      name: 'Patricia Ramírez',
      avatarUrl: 'https://picsum.photos/seed/avatar10/200/200',
    },
    imageUrl: 'https://picsum.photos/seed/homecleaning/600/400',
    imageHint: 'personal de limpieza trabajando'
  },
  {
    id: '10',
    title: 'Limpieza de exteriores',
    description: 'Limpiar patios, jardines, fachadas y otras áreas exteriores. Limpiar y mantener las áreas exteriores del hogar.',
    category: 'Limpieza y mantenimiento del hogar',
    price: 60,
    priceType: 'fixed',
    rating: 4.6,
    reviewCount: 145,
    location: 'Cartagena, Colombia',
    expert: {
      id: 'expert10',
      name: 'Roberto Morales',
      avatarUrl: 'https://picsum.photos/seed/avatar11/200/200',
    },
    imageUrl: 'https://picsum.photos/seed/exteriorcleaning/600/400',
    imageHint: 'limpieza de jardín'
  },
  {
    id: '11',
    title: 'Mantenimiento del jardín',
    description: 'Podar el césped, cortar setos, regar las plantas y realizar otras tareas de jardinería. Mantener el jardín en buen estado.',
    category: 'Limpieza y mantenimiento del hogar',
    price: 90,
    priceType: 'fixed',
    rating: 4.8,
    reviewCount: 98,
    location: 'Pereira, Colombia',
    expert: {
      id: 'expert11',
      name: 'Fernando Castillo',
      avatarUrl: 'https://picsum.photos/seed/avatar12/200/200',
    },
    imageUrl: 'https://picsum.photos/seed/garden/600/400',
    imageHint: 'jardinero trabajando'
  },
  {
    id: '12',
    title: 'Instalación de ventanas',
    description: 'Instalar ventanas nuevas o reemplazar las existentes. Instalar o reemplazar las ventanas del hogar.',
    category: 'Instalaciones y colocaciones',
    price: 150,
    priceType: 'fixed',
    rating: 4.9,
    reviewCount: 76,
    location: 'Manizales, Colombia',
    expert: {
      id: 'expert12',
      name: 'Gabriela Vargas',
      avatarUrl: 'https://picsum.photos/seed/avatar13/200/200',
    },
    imageUrl: 'https://picsum.photos/seed/windows/600/400',
    imageHint: 'instalador de ventanas trabajando'
  },
  {
    id: '13',
    title: 'Instalación de estanterías',
    description: 'Instalar estanterías para organizar el hogar. Instalar estanterías en las diferentes áreas del hogar.',
    category: 'Instalaciones y colocaciones',
    price: 100,
    priceType: 'fixed',
    rating: 4.7,
    reviewCount: 89,
    location: 'Bucaramanga, Colombia',
    expert: {
      id: 'expert13',
      name: 'Andrés Herrera',
      avatarUrl: 'https://picsum.photos/seed/avatar14/200/200',
    },
    imageUrl: 'https://picsum.photos/seed/shelves/600/400',
    imageHint: 'carpintero instalando estanterías'
  },
  {
    id: '14',
    title: 'Instalación de electrodomésticos',
    description: 'Instalar electrodomésticos como lavadoras, refrigeradores, hornos, etc. Instalar y configurar los electrodomésticos del hogar.',
    category: 'Instalaciones y colocaciones',
    price: 50,
    priceType: 'hourly',
    rating: 4.8,
    reviewCount: 112,
    location: 'Cúcuta, Colombia',
    expert: {
      id: 'expert14',
      name: 'Diana Gutiérrez',
      avatarUrl: 'https://picsum.photos/seed/avatar15/200/200',
    },
    imageUrl: 'https://picsum.photos/seed/appliances/600/400',
    imageHint: 'técnico instalando electrodomésticos'
  },
  {
    id: '15',
    title: 'Hacer compras',
    description: 'Comprar alimentos, ropa, medicamentos u otros productos. Realizar las compras según las indicaciones del cliente.',
    category: 'Compras y recados',
    price: 15,
    priceType: 'hourly',
    rating: 4.6,
    reviewCount: 203,
    location: 'Ibagué, Colombia',
    expert: {
      id: 'expert15',
      name: 'Luis Mendoza',
      avatarUrl: 'https://picsum.photos/seed/avatar16/200/200',
    },
    imageUrl: 'https://picsum.photos/seed/shopping/600/400',
    imageHint: 'asistente haciendo compras'
  },
];

const requests: ServiceRequest[] = [
  { id: 'req1', serviceTitle: 'Modern & Minimalist Graphic Design', expertName: 'Emily Chen', status: 'pending', date: '2023-10-26', offeredPrice: 450 },
  { id: 'req2', serviceTitle: 'Residential & Commercial Cleaning', expertName: 'Carlos Gomez', status: 'accepted', date: '2023-10-25', offeredPrice: 150 },
  { id: 'req3', serviceTitle: 'Expert Plumbing & Drain Services', expertName: 'Mario Rossi', status: 'completed', date: '2023-09-15', offeredPrice: 200 },
  { id: 'req4', serviceTitle: 'Math & Science Tutoring (K-12)', expertName: 'Sarah Jenkins', status: 'rejected', date: '2023-10-20', offeredPrice: 40 },
];

const opportunities: Opportunity[] = [
  { id: 'opp1', serviceTitle: 'Expert Plumbing & Drain Services', clientName: 'Alex Doe', status: 'pending', date: '2023-10-27', offeredPrice: 80 },
  { id: 'opp2', serviceTitle: 'Expert Plumbing & Drain Services', clientName: 'Samantha Ray', status: 'accepted', date: '2023-10-26', offeredPrice: 75 },
  { id: 'opp3', serviceTitle: 'Modern & Minimalist Graphic Design', clientName: 'Tech Innovators Inc.', status: 'rejected', date: '2023-10-22', offeredPrice: 400 },
];

export function getServices(): Service[] {
  return services;
}

export function getServiceById(id: string): Service | undefined {
  return services.find(s => s.id === id);
}

export function getClientRequests(): ServiceRequest[] {
  return requests;
}

export function getExpertOpportunities(): Opportunity[] {
  return opportunities;
}
