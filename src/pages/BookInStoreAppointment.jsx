import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Filter, Eye, CheckCircle, XCircle, Calendar, Clock, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { API_URL } from '../config/constants';

const Container = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 24px;
    color: #111827;
    font-weight: 600;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 300px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
    width: 100%;
  padding: 10px 16px 10px 40px;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: #2563EB;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
    }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
      color: #9CA3AF;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #2563EB;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  border-bottom: 1px solid #E5E7EB;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
`;

const Td = styled.td`
  padding: 16px;
  font-size: 14px;
  color: #6B7280;
  border-bottom: 1px solid #F3F4F6;
  vertical-align: top;
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 500;
  
  ${props => {
    if (props.status === 'pending') {
      return `
        background-color: #FEF3C7;
        color: #92400E;
      `;
    } else if (props.status === 'confirmed') {
      return `
        background-color: #D1FAE5;
        color: #065F46;
      `;
    } else if (props.status === 'completed') {
      return `
        background-color: #DBEAFE;
        color: #1E40AF;
      `;
    } else if (props.status === 'cancelled') {
      return `
        background-color: #FEE2E2;
        color: #B91C1C;
      `;
    }
  }}
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  background: white;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #D1D5DB;
    background: #F9FAFB;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6B7280;
  transition: color 0.2s;

  &:hover {
    color: #111827;
  }
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const DetailItem = styled.div`
  margin-bottom: 24px;
`;

const DetailLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const DetailValue = styled.div`
  font-size: 15px;
  color: #4B5563;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 24px;
`;

const StatusUpdateButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 8px;
  
  ${props => {
    if (props.status === 'confirm') {
      return `
        background-color: #10B981;
        color: white;
        
        &:hover {
          background-color: #059669;
        }
      `;
    } else if (props.status === 'cancel') {
      return `
        background-color: #EF4444;
        color: white;

  &:hover {
          background-color: #DC2626;
        }
      `;
    } else if (props.status === 'complete') {
      return `
        background-color: #3B82F6;
        color: white;
        
        &:hover {
          background-color: #2563EB;
        }
      `;
    }
  }}
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #6B7280;
  font-size: 15px;
`;

const MakeWithJSKRequests = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/v1/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // All appointments from this endpoint are custom design requests
      // We can identify them by checking for product-related fields
      const customDesignAppointments = (response.data.data.appointments || [])
        .filter(app => 
          // Check if the appointment has the custom design fields
          app.productType && 
          (app.stoneType || app.metalType)
        );
      
      setAppointments(customDesignAppointments);
      console.log('Found custom design appointments:', customDesignAppointments.length);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointment data');
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAppointments();
  }, []);
  
  const handleStatusUpdate = async (id, status) => {
    console.log(`Updating appointment status: ID=${id}, status=${status}`);
    try {
      const token = localStorage.getItem('token');
      console.log(`Token: ${token ? 'Present' : 'Missing'}`);
      console.log(`Request URL: ${API_URL}/api/v1/appointments/${id}/status`);
      console.log(`Request data:`, { status });
      
      await axios.put(`${API_URL}/api/v1/appointments/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success(`Appointment ${status === 'confirmed' ? 'confirmed' : status === 'cancelled' ? 'cancelled' : 'completed'} successfully`);
      
      // Update the appointment status locally
      setAppointments(prev => prev.map(app => 
        app._id === id ? { ...app, status } : app
      ));
      
      // Update current appointment if open in modal
      if (currentAppointment && currentAppointment._id === id) {
        setCurrentAppointment({ ...currentAppointment, status });
      }
    } catch (err) {
      console.error('Error updating appointment status:', err);
      console.error('Error response:', err.response?.data);
      toast.error(`Failed to update appointment status: ${err.response?.data?.message || err.message}`);
    }
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Filter appointments based on search term and filters
  const filteredAppointments = appointments.filter(app => {
    const searchMatch = 
      app.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone?.includes(searchTerm);
      
    const statusMatch = statusFilter === 'all' || app.status === statusFilter;
    const productMatch = productFilter === 'all' || app.productType === productFilter;
    
    return searchMatch && statusMatch && productMatch;
  });
  
  // Get unique product types for filter dropdown
  const productTypes = [...new Set(appointments.map(app => app.productType))].filter(Boolean);
  
  const viewAppointmentDetails = (appointment) => {
    setCurrentAppointment(appointment);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };
  
  const NoDataSvg = () => (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="#F9FAFB" />
      <path d="M100 60V100L130 115" stroke="#6B7280" strokeWidth="8" strokeLinecap="round" />
      <path d="M160 100C160 133.137 133.137 160 100 160C66.8629 160 40 133.137 40 100C40 66.8629 66.8629 40 100 40C133.137 40 160 66.8629 160 100Z" stroke="#E5E7EB" strokeWidth="8" />
      <path d="M65 135L135 65" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
      <path d="M65 65L135 135" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
  
  if (loading) {
    return (
      <Container>
        <Header>
          <Title>Create with JSK Requests</Title>
        </Header>
        <LoadingContainer>
          <div>Loading...</div>
        </LoadingContainer>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <Header>
          <Title>Create with JSK Requests</Title>
        </Header>
        <div style={{ textAlign: 'center', padding: '40px', color: '#EF4444' }}>
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>Create with JSK Requests</Title>
        <SearchContainer>
          <SearchIcon>
            <Search size={18} />
          </SearchIcon>
          <SearchInput 
            type="text" 
            placeholder="Search by name, email, phone..." 
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchContainer>
      </Header>

      <FiltersContainer>
        <FilterSelect 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </FilterSelect>
        
        <FilterSelect 
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
        >
          <option value="all">All Product Types</option>
          {productTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </FilterSelect>
      </FiltersContainer>
      
      {filteredAppointments.length === 0 ? (
        <EmptyState>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
            <NoDataSvg />
            <h3 style={{ marginTop: '24px', fontSize: '18px', fontWeight: '600', color: '#374151' }}>
              No Create with JSK Requests Found
            </h3>
            <p style={{ marginTop: '8px', color: '#6B7280', maxWidth: '400px', textAlign: 'center' }}>
              There are currently no custom design requests. Check back later or adjust your filters.
            </p>
          </div>
        </EmptyState>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Customer</Th>
                <Th>Product Info</Th>
                <Th>Appointment</Th>
                <Th>Store</Th>
                <Th>Status</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map(appointment => (
                <tr key={appointment._id}>
                  <Td>
                    <div style={{ fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                      {appointment.firstName} {appointment.lastName}
                    </div>
                    <div>{appointment.email}</div>
                    <div>{appointment.phone}</div>
                  </Td>
                  <Td>
                    <div style={{ fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                      {appointment.productType}
                    </div>
                    {appointment.stoneType && (
                      <div>Stone: {appointment.stoneType}</div>
                    )}
                    {appointment.metalType && (
                      <div>Metal: {appointment.metalType}</div>
                    )}
                  </Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Calendar size={14} />
                      <span>{formatDate(appointment.appointmentDate)}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} />
                      <span>{appointment.appointmentTime}</span>
                    </div>
                  </Td>
                  <Td>
                    {appointment.store ? (
                      <div>
                        <div style={{ fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                          {appointment.store.name}
                        </div>
                        <div style={{ fontSize: '13px' }}>
                          {appointment.store.address?.city}, {appointment.store.address?.state}
                        </div>
                      </div>
                    ) : (
                      <div style={{ color: '#9CA3AF' }}>No store selected</div>
                    )}
                  </Td>
                  <Td>
                    <Status status={appointment.status}>
                      {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                    </Status>
                  </Td>
                  <Td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <ActionButton onClick={() => viewAppointmentDetails(appointment)}>
                        <Eye size={14} />
                        View Details
                      </ActionButton>
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
      
      {showModal && currentAppointment && (
        <Modal onClick={closeModal}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Custom Design Request Details</ModalTitle>
              <CloseButton onClick={closeModal}>
                <XCircle size={24} />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <div style={{ marginBottom: '24px' }}>
                <Status status={currentAppointment.status} style={{ fontWeight: 600 }}>
                  {currentAppointment.status?.charAt(0).toUpperCase() + currentAppointment.status?.slice(1)}
                </Status>
              </div>
              
              <DetailItem>
                <DetailLabel>Customer Information</DetailLabel>
                <Grid>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Name</div>
                    <DetailValue>{currentAppointment.firstName} {currentAppointment.lastName}</DetailValue>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Email</div>
                    <DetailValue>{currentAppointment.email}</DetailValue>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Phone</div>
                    <DetailValue>{currentAppointment.phone}</DetailValue>
                  </div>
                </Grid>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Appointment Details</DetailLabel>
                <Grid>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Date</div>
                    <DetailValue>{formatDate(currentAppointment.appointmentDate)}</DetailValue>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Time</div>
                    <DetailValue>{currentAppointment.appointmentTime}</DetailValue>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Store Location</div>
                    <DetailValue>
                      {currentAppointment.store ? (
                        currentAppointment.store.name ? 
                        `${currentAppointment.store.name} - ${currentAppointment.store.address?.city || ''}, ${currentAppointment.store.address?.state || ''}` 
                        : currentAppointment.store
                      ) : 'N/A'}
                    </DetailValue>
                  </div>
                </Grid>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Product Details</DetailLabel>
                <Grid>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Product Type</div>
                    <DetailValue>{currentAppointment.productType}</DetailValue>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Stone Type</div>
                    <DetailValue>{currentAppointment.stoneType || 'N/A'}</DetailValue>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Stone Color</div>
                    <DetailValue>
                      {currentAppointment.stoneColor ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ 
                            width: '24px', 
                            height: '24px', 
                            borderRadius: '4px', 
                            background: currentAppointment.stoneColor,
                            border: '1px solid #E5E7EB'
                          }}></div>
                          {currentAppointment.stoneColor}
                        </div>
                      ) : 'N/A'}
                    </DetailValue>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Carat Weight</div>
                    <DetailValue>{currentAppointment.carat || 'N/A'}</DetailValue>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Metal Type</div>
                    <DetailValue>{currentAppointment.metalType || 'N/A'}</DetailValue>
                  </div>
                </Grid>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Additional Information</DetailLabel>
                <Grid style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Shopping For</div>
                    <DetailValue>{currentAppointment.shoppingFor ? (
                      currentAppointment.shoppingFor === 'myself' ? 'Myself' : 'Someone Else'
                    ) : 'N/A'}</DetailValue>
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', color: '#6B7280' }}>Special Occasion</div>
                    <DetailValue>{currentAppointment.isSpecialOccasion ? 'Yes' : 'No'}</DetailValue>
                  </div>
                </Grid>
              </DetailItem>
              
              {currentAppointment.message && (
                <DetailItem>
                  <DetailLabel>Design Ideas & Requirements</DetailLabel>
                  <DetailValue style={{ 
                    padding: '16px', 
                    background: '#F9FAFB', 
                    borderRadius: '8px', 
                    whiteSpace: 'pre-wrap' 
                  }}>
                    {currentAppointment.message}
                  </DetailValue>
                </DetailItem>
              )}
              
              {currentAppointment.status === 'pending' && (
                <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                  <StatusUpdateButton 
                    status="confirm"
                    onClick={() => handleStatusUpdate(currentAppointment._id, 'confirmed')}
                  >
                    <CheckCircle size={16} style={{ marginRight: '8px' }} />
                    Confirm Appointment
                  </StatusUpdateButton>
                  <StatusUpdateButton 
                    status="cancel"
                    onClick={() => handleStatusUpdate(currentAppointment._id, 'cancelled')}
                  >
                    <XCircle size={16} style={{ marginRight: '8px' }} />
                    Cancel Appointment
                  </StatusUpdateButton>
                </div>
              )}
              
              {currentAppointment.status === 'confirmed' && (
                <div style={{ marginTop: '32px' }}>
                  <StatusUpdateButton 
                    status="complete"
                    onClick={() => handleStatusUpdate(currentAppointment._id, 'completed')}
                  >
                    <CheckCircle size={16} style={{ marginRight: '8px' }} />
                    Mark as Completed
                  </StatusUpdateButton>
                </div>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default MakeWithJSKRequests;