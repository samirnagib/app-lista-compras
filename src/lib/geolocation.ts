// Serviço de geolocalização e busca de supermercados

export interface Supermarket {
  id: string;
  name: string;
  address: string;
  distance: number; // em km
  latitude: number;
  longitude: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

// Obter localização do usuário
export async function getUserLocation(): Promise<UserLocation | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.error('Geolocalização não suportada');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        resolve(null);
      }
    );
  });
}

// Calcular distância entre dois pontos (fórmula de Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Buscar supermercados próximos (simulado - em produção usar API real)
export async function findNearbySupermarkets(userLocation: UserLocation): Promise<Supermarket[]> {
  // Simulação de supermercados (em produção, usar API do Google Places ou similar)
  const mockSupermarkets: Omit<Supermarket, 'distance'>[] = [
    {
      id: '1',
      name: 'Carrefour',
      address: 'Av. Principal, 1000',
      latitude: userLocation.latitude + 0.01,
      longitude: userLocation.longitude + 0.01,
    },
    {
      id: '2',
      name: 'Pão de Açúcar',
      address: 'Rua Comercial, 500',
      latitude: userLocation.latitude + 0.02,
      longitude: userLocation.longitude - 0.01,
    },
    {
      id: '3',
      name: 'Extra',
      address: 'Av. Central, 2000',
      latitude: userLocation.latitude - 0.01,
      longitude: userLocation.longitude + 0.02,
    },
    {
      id: '4',
      name: 'Atacadão',
      address: 'Rua do Comércio, 300',
      latitude: userLocation.latitude + 0.03,
      longitude: userLocation.longitude + 0.03,
    },
  ];

  // Calcular distâncias
  const supermarketsWithDistance = mockSupermarkets.map(market => ({
    ...market,
    distance: calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      market.latitude,
      market.longitude
    ),
  }));

  // Ordenar por distância
  return supermarketsWithDistance.sort((a, b) => a.distance - b.distance);
}

// Buscar preços de produtos em supermercados (simulado)
export async function fetchProductPrices(
  productName: string,
  supermarketIds: string[]
): Promise<Map<string, number>> {
  // Simulação de preços (em produção, usar web scraping ou APIs de supermercados)
  const prices = new Map<string, number>();
  
  for (const id of supermarketIds) {
    // Gerar preço aleatório para simulação
    const basePrice = Math.random() * 20 + 5;
    const variation = (Math.random() - 0.5) * 4;
    prices.set(id, Math.max(1, basePrice + variation));
  }
  
  return prices;
}
