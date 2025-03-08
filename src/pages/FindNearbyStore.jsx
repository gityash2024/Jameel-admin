import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { Plus, X, MapPin, Phone, Clock, Star, ArrowRight, Trash, Edit, Search, Home, Info } from 'lucide-react';
import { fetchStores, createStore, updateStore, deleteStore, setSelectedStore } from '../features/store/storeSlice';
import { toast } from 'react-hot-toast';
import GoogleMapReact from 'google-map-react';

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const Container = styled.div`
  padding: 2rem;
`;
const LoadingIndicator = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  border-top-color: #000;
  animation: spin 1s ease-in-out infinite;
  margin-left: 10px;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active ? '#f7fafc' : 'transparent'};
  color: ${props => props.active ? '#2d3748' : '#718096'};
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#000' : 'transparent'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #2d3748;
  }
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  font-size: 0.875rem;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const Td = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #1a202c;
  border-bottom: 1px solid #e2e8f0;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.primary ? '#000' : 'white'};
  color: ${props => props.primary ? 'white' : '#1a202c'};
  border: 1px solid ${props => props.primary ? '#000' : '#e2e8f0'};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.primary ? '#1a1a1a' : '#f7fafc'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  background: transparent;
  color: ${props => props.danger ? '#e53e3e' : '#4a5568'};
  border: 1px solid ${props => props.danger ? '#fed7d7' : '#e2e8f0'};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.danger ? '#fed7d7' : '#f7fafc'};
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
`;

const ModalText = styled.p`
  color: #4a5568;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #4a5568;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.cols || 2}, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
  }

  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background: #f8fafc;
    outline: none;

    &:focus {
      border-color: #4299e1;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const FormDivider = styled.div`
  margin: 2rem 0;
  border-top: 1px solid #e2e8f0;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #CBD5E0;
    transition: .4s;
    border-radius: 34px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: #48BB78;
  }

  input:checked + .slider:before {
    transform: translateX(22px);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const StoreCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }

  ${props => props.active && `
    border-color: #2563EB;
    box-shadow: 0 0 0 1px #2563EB;
  `}
`;

const StoreTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.75rem;
`;

const StoreDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0.5rem;

  svg {
    flex-shrink: 0;
    width: 16px;
    height: 16px;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 500px;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
`;

const MapMarker = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  transform: translate(-50%, -100%);
  cursor: pointer;
`;

const ImageUploadContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const ImagePreview = styled.div`
  width: 100%;
  padding-top: 56.25%;
  border-radius: 0.375rem;
  background-size: cover;
  background-position: center;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  position: relative;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ImageUploadButton = styled.label`
  display: inline-block;
  padding: 0.5rem 1rem;
  background: white;
  color: #1a202c;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f7fafc;
  }

  input {
    display: none;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4a5568;
  cursor: pointer;

  input {
    width: auto;
  }
`;

const SkeletonRow = styled.tr`
  td {
    position: relative;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #f0f0f0 25%, #f7f7f7 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: ${shimmer} 1.5s infinite;
    }
  }
`;

const SkeletonCell = styled.div`
  height: 20px;
  width: ${props => props.width || '100%'};
  background: #f0f0f0;
  border-radius: 4px;
  margin: 0.5rem 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  color: #a0aec0;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: #4a5568;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

const Marker = ({ children }) => <div>{children}</div>;

const InfoWindow = styled.div`
  background: white;
  border-radius: 0.375rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 0.75rem;
  width: 200px;
  transform: translate(-50%, -100%);
  margin-top: -10px;
  z-index: 10;
  position: absolute;
`;

const FindNearbyStore = () => {
  const dispatch = useDispatch();
  const { stores: { stores = [] } = {}, loading } = useSelector((state) => state.store);  console.log(stores)
  const [isUploading, setIsUploading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [editingStore, setEditingStore] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 });
  const [mapZoom, setMapZoom] = useState(12);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [image, setImage] = useState(null);
  const mapRef = useRef(null);
  // Add this near your other useEffect hooks
useEffect(() => {
  if (stores && stores.length > 0) {
    // Calculate the center of all store locations
    const totalLat = stores.reduce((sum, store) => 
      sum + (store.location?.coordinates[1] || 0), 0);
    const totalLng = stores.reduce((sum, store) => 
      sum + (store.location?.coordinates[0] || 0), 0);
    
    const avgLat = totalLat / stores.length;
    const avgLng = totalLng / stores.length;
    
    // Only update if we have valid coordinates
    if (avgLat && avgLng) {
      setMapCenter({ lat: avgLat, lng: avgLng });
      
      // If we have map reference, explicitly center it
      if (mapRef.current) {
        mapRef.current.setCenter({ lat: avgLat, lng: avgLng });
      }
    }
  }
}, [stores]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    hours: '',
    features: [],
    coordinates: [0, 0],
    isActive: true,
    image: '',
    rating: 4.5,
    reviews: 0,
    branchCode: '' 
  });

  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: '',
      hours: '',
      features: [],
      coordinates: [0, 0],
      isActive: true,
      image: '',
      rating: 4.5,
      reviews: 0,
      branchCode: '' // Add this line

    });
    setEditingStore(null);
    setImage(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(
        "https://chirag-backend.onrender.com/api/files/upload",
        {
          method: "POST",
          body: formData
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to upload file: ${response.statusText}`);
      }
      const responseData = await response.json();
      setImage({
        preview: responseData.fileUrl,
        url: responseData.fileUrl
      });
      setFormData(prev => ({
        ...prev,
        image: responseData.fileUrl
      }));
    } catch (error) {
      toast.error(`Error uploading file: ${error.message}`);
    }finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingStore) {
        await dispatch(updateStore({
          id: editingStore._id,
          storeData: formData
        })).unwrap();
        toast.success('Store updated successfully');
      } else {
        await dispatch(createStore(formData)).unwrap();
        toast.success('Store created successfully');
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.message || (editingStore ? 'Failed to update store' : 'Failed to create store'));
    }
  };
  const handleEdit = (store) => {
    setEditingStore(store);
    setFormData({
      name: store.name,
      address: store.address,
      city: store.city,
      state: store.state,
      zipCode: store.zipCode,
      phone: store.phone,
      email: store.email,
      hours: store.hours,
      features: store.features || [],
      coordinates: store.location?.coordinates || [0, 0],
      isActive: store.isActive,
      image: store.image || '',
      rating: store.rating || 4.5,
      reviews: store.reviews || 0,
      branchCode: store.branchCode || '' // Add this line
    });
    setImage(store.image ? { preview: store.image, url: store.image } : null);
    setIsModalOpen(true);
  };
  const handleDeleteClick = (store) => {
    setConfirmAction({
      type: 'delete',
      store,
      message: `Are you sure you want to delete ${store.name}?`
    });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmAction.type === 'delete') {
        await dispatch(deleteStore(confirmAction.store._id)).unwrap();
        toast.success('Store deleted successfully');
      }
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
  };

  const handleMapClick = ({ lat, lng }) => {
    if (isModalOpen) {
      setFormData(prev => ({
        ...prev,
        coordinates: [lng, lat]
      }));
    }
  };

  const handleMarkerClick = (store) => {
    setSelectedMarker(store);
  };

  const handleFeatureChange = (feature) => {
    setFormData(prev => {
      const features = [...prev.features];
      if (features.includes(feature)) {
        return {
          ...prev,
          features: features.filter(f => f !== feature)
        };
      } else {
        return {
          ...prev,
          features: [...features, feature]
        };
      }
    });
  };

  const renderSkeletonLoader = () => (
    <Table>
      <thead>
        <tr>
          <Th>Name</Th>
          <Th>Address</Th>
          <Th>Phone</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3].map((index) => (
          <SkeletonRow key={index}>
            <Td><SkeletonCell width="150px" /></Td>
            <Td><SkeletonCell /></Td>
            <Td><SkeletonCell width="120px" /></Td>
            <Td><SkeletonCell width="44px" /></Td>
            <Td><SkeletonCell width="100px" /></Td>
          </SkeletonRow>
        ))}
      </tbody>
    </Table>
  );

  const renderListView = () => {
    if (loading) {
      return renderSkeletonLoader();
    }

    if (!Array.isArray(stores) || stores.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <MapPin size={48} />
          </EmptyStateIcon>
          <EmptyStateText>No stores found</EmptyStateText>
          <Button primary onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}>
            <Plus size={16} />
            Add Your First Store
          </Button>
        </EmptyState>
      );
    }

    return (
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Address</Th>
            <Th>Phone</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store._id}>
              <Td>{store.name}</Td>
              <Td>{`${store.address}, ${store.city}, ${store.state} ${store.zipCode}`}</Td>
              <Td>{store.phone}</Td>
              <Td>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={store.isActive}
                    onChange={(e) => {
                      dispatch(updateStore({
                        id: store._id,
                        storeData: { ...store, isActive: e.target.checked }
                      }));
                    }}
                  />
                  <span className="slider" />
                </ToggleSwitch>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <ActionButton onClick={() => handleEdit(store)}>
                    <Edit size={16} />
                  </ActionButton>
                  <ActionButton danger onClick={() => handleDeleteClick(store)}>
                    <Trash size={16} />
                  </ActionButton>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const renderMapView = () => {
    if (!Array.isArray(stores) || stores.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <MapPin size={48} />
          </EmptyStateIcon>
          <EmptyStateText>No stores found to display on map</EmptyStateText>
          <Button primary onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}>
            <Plus size={16} />
            Add Your First Store
          </Button>
        </EmptyState>
      );
    }

    return (
      <>
        <MapContainer>
        <GoogleMapReact
  bootstrapURLKeys={{ key:'AIzaSyCdj_dOlzxfE-I9dcSOz4RJj27nmzeFlH4'|| '' }}
  center={mapCenter}  // Change from defaultCenter to center
  defaultZoom={mapZoom}
  onClick={handleMapClick}
  yesIWantToUseGoogleMapApiInternals
  onGoogleApiLoaded={({ map }) => {
    mapRef.current = map;
  }}
>
            {stores.map((store) => (
              <Marker
                key={store._id}
                lat={store.location?.coordinates[1]}
                lng={store.location?.coordinates[0]}
                onClick={() => handleMarkerClick(store)}
              >
                <MapMarker>
                  <MapPin
                    size={36}
                    color={selectedMarker?._id === store._id ? '#2563EB' : '#000'}
                    fill={selectedMarker?._id === store._id ? '#2563EB' : '#000'}
                  />
                </MapMarker>
                {selectedMarker?._id === store._id && (
                  <InfoWindow>
                    <StoreTitle>{store.name}</StoreTitle>
                    <StoreDetail>
                      <MapPin size={14} />
                      {`${store.address}, ${store.city}, ${store.state} ${store.zipCode}`}
                    </StoreDetail>
                    <StoreDetail>
                      <Phone size={14} />
                      {store.phone}
                    </StoreDetail>
                    <StoreDetail>
                      <Clock size={14} />
                      {store.hours}
                    </StoreDetail>
                    <Button 
                      style={{marginTop: '0.5rem', width: '100%'}} 
                      onClick={() => handleEdit(store)}
                    >
                      Edit
                    </Button>
                  </InfoWindow>
                )}
              </Marker>
            ))}
          </GoogleMapReact>
        </MapContainer>
      </>
    );
  };

  const renderContent = () => {
    if (activeTab === 'list') {
      return renderListView();
    } else {
      return renderMapView();
    }
  };

  return (
    <Container>
      <Header>
        <Title>Store Locations</Title>
        <Button primary onClick={() => {
          resetForm();
          setIsModalOpen(true);
        }}>
          <Plus size={16} />
          Add New Store
        </Button>
      </Header>

      <TabContainer>
        <Tab 
          active={activeTab === 'list'} 
          onClick={() => setActiveTab('list')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Home size={16} />
            List View
          </div>
        </Tab>
        <Tab 
          active={activeTab === 'map'} 
          onClick={() => setActiveTab('map')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={16} />
            Map View
          </div>
        </Tab>
      </TabContainer>

      {renderContent()}

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                {editingStore ? `Edit Store: ${editingStore.name}` : 'Add New Store'}
              </ModalTitle>
              <CloseButton onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <form onSubmit={handleSubmit}>
              <FormDivider />
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '500' }}>Store Information</h3>
              
              <FormRow>
                <FormGroup>
                  <label>Store Name*</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="Enter store name"
                    required
                  />
                </FormGroup>

                <FormGroup>
  <label>Branch Code*</label>
  <input
    type="text"
    value={formData.branchCode}
    onChange={(e) => setFormData(prev => ({
      ...prev,
      branchCode: e.target.value
    }))}
    placeholder="Enter unique branch code"
    required
  />
</FormGroup>

                <FormGroup>
                  <label>Phone Number*</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      phone: e.target.value
                    }))}
                    placeholder="(123) 456-7890"
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <label>Email Address*</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      email: e.target.value
                    }))}
                    placeholder="store@example.com"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Store Hours*</label>
                  <input
                    type="text"
                    value={formData.hours}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      hours: e.target.value
                    }))}
                    placeholder="Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormDivider />
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '500' }}>Store Address</h3>

              <FormGroup>
                <label>Street Address*</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: e.target.value
                  }))}
                  placeholder="123 Main St"
                  required
                />
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <label>City*</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      city: e.target.value
                    }))}
                    placeholder="New York"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>State*</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      state: e.target.value
                    }))}
                    placeholder="NY"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Zip Code*</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      zipCode: e.target.value
                    }))}
                    placeholder="10001"
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <label>Longitude*</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.coordinates[0]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      coordinates: [parseFloat(e.target.value), prev.coordinates[1]]
                    }))}
                    placeholder="-73.9857"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>Latitude*</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.coordinates[1]}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      coordinates: [prev.coordinates[0], parseFloat(e.target.value)]
                    }))}
                    placeholder="40.7484"
                    required
                  />

</FormGroup>
              </FormRow>

              <p style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '1rem' }}>
                Tip: Click on the map in Map View to set coordinates automatically
              </p>

              <FormDivider />
              <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '500' }}>Store Features & Settings</h3>

              <FormGroup>
                <label>Store Features</label>
                <CheckboxGroup>
                  {['Parking', 'Wheelchair Access', 'Private Viewing Room', 'Custom Design', 'Repairs'].map(feature => (
                    <Checkbox key={feature}>
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => handleFeatureChange(feature)}
                      />
                      {feature}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <label>Rating (0-5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      rating: parseFloat(e.target.value)
                    }))}
                  />
                </FormGroup>

                <FormGroup>
                  <label>Number of Reviews</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.reviews}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      reviews: parseInt(e.target.value)
                    }))}
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <label>Store Image</label>
                <ImageUploadContainer>
                  {image && (
                    <ImagePreview style={{ backgroundImage: `url(${image.preview})` }} />
                  )}
                  <ImageUploadButton>
                    {image ? 'Change Image' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </ImageUploadButton>
                </ImageUploadContainer>
              </FormGroup>
      {isUploading && <LoadingIndicator/>}

              <FormDivider />

              <FormGroup>
                <label>Status</label>
                <div style={{ marginTop: '0.5rem' }}>
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        isActive: e.target.checked
                      }))}
                    />
                    <span className="slider" />
                  </ToggleSwitch>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                    {formData.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </FormGroup>

              <ButtonGroup>
                <Button type="button" onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button type="submit" primary disabled={loading}>
                  {loading ? 'Saving...' : editingStore ? 'Update Store' : 'Add Store'}
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </Modal>
      )}

      {isConfirmModalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Confirm Action</ModalTitle>
              <CloseButton onClick={() => {
                setIsConfirmModalOpen(false);
                setConfirmAction(null);
              }}>
                <X size={20} />
              </CloseButton>
            </ModalHeader>

            <ModalText>{confirmAction?.message}</ModalText>

            <ButtonGroup>
              <Button onClick={() => {
                setIsConfirmModalOpen(false);
                setConfirmAction(null);
              }}>
                Cancel
              </Button>
              <Button primary onClick={handleConfirmAction} danger={confirmAction?.type === 'delete'}>
                {confirmAction?.type === 'delete' ? 'Delete' : 'Confirm'}
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}

    </Container>
  );
};

export default FindNearbyStore;