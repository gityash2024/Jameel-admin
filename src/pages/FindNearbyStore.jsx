import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Search, MapPin, Phone, Clock, Star, ArrowRight } from 'lucide-react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const Header = styled.div`
  margin-bottom: 32px;
  text-align: center;

  h1 {
    font-size: 32px;
    color: #111827;
    margin-bottom: 12px;
    font-weight: 600;
  }

  p {
    color: #6B7280;
    font-size: 16px;
  }
`;

const SearchSection = styled.div`
  max-width: 600px;
  margin: 0 auto 40px;
`;

const SearchBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  input {
    flex: 1;
    padding: 14px 16px;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    font-size: 15px;

    &:focus {
      outline: none;
      border-color: #2563EB;
    }
  }
`;

const SearchButton = styled.button`
  padding: 14px 24px;
  background: #2563EB;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #1D4ED8;
  }
`;

const FiltersSection = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  background: ${props => props.active ? '#EFF6FF' : 'white'};
  border: 1px solid ${props => props.active ? '#2563EB' : '#E5E7EB'};
  color: ${props => props.active ? '#2563EB' : '#374151'};
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #2563EB;
  }
`;

const Content = styled.div`
  margin-bottom: 32px;
`;

const StoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StoreCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  border: 1px solid #E5E7EB;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transform: translateY(-2px);
  }
`;

const StoreName = styled.h3`
  font-size: 18px;
  color: #111827;
  margin-bottom: 12px;
  font-weight: 600;
`;

const StoreInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6B7280;
  font-size: 14px;
  margin-bottom: 8px;

  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }
`;

const StoreRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;

  .stars {
    color: #F59E0B;
    display: flex;
    gap: 2px;
  }

  .rating {
    color: #111827;
    font-weight: 500;
  }

  .reviews {
    color: #6B7280;
  }
`;

const ViewDetailsButton = styled.button`
  width: 100%;
  padding: 12px;
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  color: #2563EB;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 16px;

  &:hover {
    background: #F9FAFB;
  }
`;

const MapSection = styled.div`
  width: 100%;
  height: 400px;
  background: #F3F4F6;
  border-radius: 12px;
  overflow: hidden;
`;

const MapFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F3F4F6;
  color: #6B7280;
  font-size: 14px;
`;

const MapComponent = ({ center, stores, selectedStore, setSelectedStore, userLocation }) => {
  const mapRef = React.useRef();
  const options = {
    disableDefaultUI: true,
    zoomControl: true,
  };

  const onLoad = useCallback(map => {
    mapRef.current = map;
  }, []);

  return (
    <GoogleMap
      zoom={12}
      center={center}
      mapContainerStyle={{ width: '100%', height: '100%' }}
      options={options}
      onLoad={onLoad}
    >
      {/* Store markers */}
      {stores.map((store) => (
        <Marker
          key={store.id}
          position={store.coordinates}
          onClick={() => setSelectedStore(store)}
        />
      ))}

      {/* User location marker */}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: "#2563EB",
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: "#ffffff",
          }}
        />
      )}

      {/* Info window for selected store */}
      {selectedStore && (
        <InfoWindow
          position={selectedStore.coordinates}
          onCloseClick={() => setSelectedStore(null)}
        >
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
              {selectedStore.name}
            </h4>
            <p style={{ fontSize: '12px', color: '#6B7280' }}>{selectedStore.address}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

const FindNearbyStore = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedStore, setSelectedStore] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });

    const { isLoaded, loadError } = useLoadScript({
        // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE"
      });
  const stores = [
    {
      id: 1,
      name: "JSK Jewelry Downtown",
      address: "123 Main Street, New York, NY 10001",
      phone: "(212) 555-0123",
      hours: "10:00 AM - 7:00 PM",
      rating: 4.8,
      reviews: 128,
      distance: "0.5 miles"
    },
    {
      id: 2,
      name: "JSK Jewelry Brooklyn",
      address: "456 Park Avenue, Brooklyn, NY 11201",
      phone: "(718) 555-0124",
      hours: "11:00 AM - 8:00 PM",
      rating: 4.6,
      reviews: 96,
      distance: "1.2 miles"
    },
    {
      id: 3,
      name: "JSK Jewelry Queens",
      address: "789 Queens Blvd, Queens, NY 11375",
      phone: "(718) 555-0125",
      hours: "10:00 AM - 6:00 PM",
      rating: 4.7,
      reviews: 112,
      distance: "2.8 miles"
    }
  ];

  const filters = ['All', 'Within 5 miles', 'Open Now', 'Highest Rated'];

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          setMapCenter(userPos);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleStoreSelect = (store) => {
    setSelectedStore(store);
    setMapCenter(store.coordinates);
  };

  const renderMap = () => {
    if (loadError) {
      return (
        <MapFallback>
          Error loading maps
        </MapFallback>
      );
    }

    if (!isLoaded) {
      return (
        <MapFallback>
          Loading maps...
        </MapFallback>
      );
    }

    return (
      <MapComponent
        center={mapCenter}
        stores={stores}
        selectedStore={selectedStore}
        setSelectedStore={setSelectedStore}
        userLocation={userLocation}
      />
    );
  };

  return (
    <Container>
     <Header>
        <h1>Find a Store Near You</h1>
        <p>Locate your nearest JSK Jewelry store and visit us today</p>
      </Header>

      <SearchSection>
        <SearchBar>
          <input
            type="text"
            placeholder="Enter your location or zip code"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton>
            <Search size={20} />
            Search
          </SearchButton>
        </SearchBar>

        <FiltersSection>
          {filters.map((filter) => (
            <FilterButton
              key={filter}
              active={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </FilterButton>
          ))}
        </FiltersSection>
      </SearchSection>

      <Content>
        <StoreGrid>
          {stores.map((store) => (
            <StoreCard 
              key={store.id}
              onClick={() => handleStoreSelect(store)}
              style={{
                borderColor: selectedStore?.id === store.id ? '#2563EB' : '#E5E7EB',
                borderWidth: selectedStore?.id === store.id ? '2px' : '1px'
              }}
            >
              <StoreName>{store.name}</StoreName>
              
              <StoreRating>
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.floor(store.rating) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="rating">{store.rating}</span>
                <span className="reviews">({store.reviews} reviews)</span>
              </StoreRating>

              <StoreInfo>
                <MapPin size={16} />
                {store.address}
              </StoreInfo>

              <StoreInfo>
                <Phone size={16} />
                {store.phone}
              </StoreInfo>

              <StoreInfo>
                <Clock size={16} />
                {store.hours}
              </StoreInfo>

              <ViewDetailsButton>
                View Details
                <ArrowRight size={16} />
              </ViewDetailsButton>
            </StoreCard>
          ))}
        </StoreGrid>
      </Content>
      <MapSection>
          {renderMap()}
        </MapSection>

    </Container>
  );
};

export default FindNearbyStore;