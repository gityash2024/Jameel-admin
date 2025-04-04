import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Truck, Download, Edit, CheckCircle, XCircle, Package, Clipboard, MapPin, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { orderAPI } from '../services/api';
import { Box, Grid, Typography, Card, CardContent, Button, TextField, MenuItem, Chip, Divider, Paper } from '@mui/material';
import { LoadingButton, Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #000;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #333;
  margin: 0;
`;

const CardTitle = styled.h2`
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.25rem;
`;

const Value = styled.div`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  
  ${props => {
    switch(props.status.toLowerCase()) {
      case 'delivered':
      case 'completed':
        return `
          background: #ECFDF5;
          color: #10B981;
        `;
      case 'pending':
      case 'processing':
        return `
          background: #FEF3C7;
          color: #F59E0B;
        `;
      case 'cancelled':
        return `
          background: #FEE2E2;
          color: #EF4444;
        `;
      case 'shipped':
        return `
          background: #E0F2FF;
          color: #3B82F6;
        `;
      default:
        return `
          background: #E5E7EB;
          color: #6B7280;
        `;
    }
  }}
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  background: ${props => props.primary ? '#3B82F6' : 'white'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: 1px solid ${props => props.primary ? '#3B82F6' : '#E5E7EB'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.primary ? '#2563EB' : '#F9FAFB'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const OrderItems = styled.div`
  margin-top: 1.5rem;
`;

const ItemTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    font-weight: 500;
    color: #666;
    font-size: 0.875rem;
  }
  
  td {
    color: #333;
  }
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #eee;
`;

const NoDataMessage = styled.div`
  background: #f9f9f9;
  padding: 2rem;
  text-align: center;
  color: #666;
  border-radius: 8px;
`;

const StatusSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #eee;
  border-radius: 4px;
  font-size: 0.875rem;
  background: white;
  margin-left: 1rem;
`;

const StatusActions = styled.div`
  display: flex;
  align-items: center;
`;

const TrackingHistory = styled.div`
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eee;
`;

const TrackingEvent = styled.div`
  display: flex;
  margin-bottom: 16px;
  
  .timestamp {
    width: 180px;
    font-size: 14px;
    color: #666;
  }
  
  .content {
    flex: 1;
    
    .status {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .details {
      font-size: 14px;
      color: #666;
    }
  }
  
  .location {
    width: 200px;
    font-size: 14px;
    color: #666;
    text-align: right;
  }
`;

const PackageDetailsBox = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
  
  h4 {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 500;
    color: #333;
  }
  
  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .detail-item {
    .label {
      font-size: 13px;
      color: #666;
      margin-bottom: 4px;
    }
    
    .value {
      font-size: 15px;
      font-weight: 500;
      color: #333;
    }
  }
`;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    fetchOrderDetails();
  }, [id]);
  
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrder(id);
      if (response.data && response.data.data && response.data.data.order) {
        setOrder(response.data.data.order);
        setNewStatus(response.data.data.order.orderStatus || '');
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Failed to load order details. Please try again later.');
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };
  
  const updateOrderStatus = async () => {
    try {
      if (newStatus === order.orderStatus) {
        return;
      }
      
      await orderAPI.updateOrderStatus(id, newStatus);
      setOrder(prev => ({ ...prev, orderStatus: newStatus }));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };
  
  const handlePrintShipping = async () => {
    try {
      if (!order.shipping || !order.shipping.trackingNumber) {
        // If no shipping information exists, create a new shipping label
        setIsSubmitting(true);
        const response = await orderAPI.createShippingLabel(id, 'FEDEX_GROUND');
        
        if (response.data && response.data.success) {
          // Refresh order details to get the new shipping information
          await fetchOrderDetails();
          
          // Check if we have label URL and open it in a new tab
          if (response.data.data && response.data.data.labelUrl) {
            window.open(response.data.data.labelUrl, '_blank');
          } else {
            toast.success('Shipping label created successfully.');
          }
        }
      } else if (order.shipping.labelUrl) {
        // If label URL exists, open it in a new tab
        window.open(order.shipping.labelUrl, '_blank');
      } else {
        // If shipping exists but no label URL, try to create a new one
        const response = await orderAPI.createShippingLabel(id, order.shipping.serviceType || 'FEDEX_GROUND');
        
        if (response.data && response.data.success && response.data.data && response.data.data.labelUrl) {
          window.open(response.data.data.labelUrl, '_blank');
        } else {
          toast.error('Could not generate shipping label. Please try again later.');
        }
      }
    } catch (error) {
      console.error('Error handling shipping label:', error);
      toast.error('Failed to generate shipping label. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDownloadInvoice = async () => {
    try {
      const response = await orderAPI.generateInvoice(id);
      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a link and click it to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${order.orderNumber || id}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };
  
  const handleEditOrder = () => {
    navigate(`/orders/edit/${id}`);
  };
  
  const handleShippingUpdate = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(event.currentTarget);
      const trackingNumber = formData.get('trackingNumber');
      const serviceType = formData.get('serviceType');
      const estimatedDeliveryDate = formData.get('estimatedDeliveryDate');
      const carrierValue = formData.get('carrierInfo');
      
      // Prepare carrier information
      const carrierInfo = {
        carrier: carrierValue
      };
      
      // Create package details
      const packageDetails = {
        packageType: 'Your Packaging',
        weight: 1, // Default weight
        dimensions: {
          length: 10,
          width: 10,
          height: 5,
          unit: 'IN'
        }
      };
      
      await orderAPI.updateShipping(id, { 
        trackingNumber, 
        serviceType, 
        estimatedDeliveryDate,
        carrierInfo,
        packageDetails,
        status: 'pending'
      });
      
      fetchOrderDetails();
      toast.success('Shipping information updated successfully');
    } catch (error) {
      console.error('Error updating shipping information:', error);
      toast.error('Failed to update shipping information');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRefreshTracking = async () => {
    try {
      const response = await orderAPI.trackShipment(id);
      if (response.data && response.data.success) {
        fetchOrderDetails();
        toast.success('Tracking information updated successfully');
      }
    } catch (error) {
      console.error('Error refreshing tracking information:', error);
      toast.error('Failed to refresh tracking information');
    }
  };
  
  if (loading) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/orders/all')}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>Loading Order Details...</Title>
        </Header>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/orders/all')}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>Order Details</Title>
        </Header>
        <NoDataMessage>{error}</NoDataMessage>
      </Container>
    );
  }
  
  if (!order) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/orders/all')}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>Order Details</Title>
        </Header>
        <NoDataMessage>No order information found for this ID.</NoDataMessage>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/orders/all')}>
          <ArrowLeft size={20} />
        </BackButton>
        <Title>Order {order.orderNumber || id}</Title>
      </Header>
      
      <Card className='p-4'>
        <CardTitle>
          <span>Order Information</span>
          <StatusActions>
            <StatusBadge status={order.orderStatus || 'pending'}>
              {order.orderStatus ? order.orderStatus.toUpperCase() : 'PENDING'}
            </StatusBadge>
            <StatusSelect 
              value={newStatus} 
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </StatusSelect>
            <ActionButton 
              onClick={updateOrderStatus}
              disabled={newStatus === order.orderStatus}
              style={{ marginLeft: '1rem' }}
            >
              Update Status
            </ActionButton>
          </StatusActions>
        </CardTitle>
        <InfoGrid>
          <InfoItem>
            <Label>Order Number</Label>
            <Value>{order.orderNumber || 'N/A'}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Order Date</Label>
            <Value>{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Payment Method</Label>
            <Value>{order.paymentMethod || 'N/A'}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Payment Status</Label>
            <Value>
              <StatusBadge status={order.paymentStatus || 'pending'}>
                {order.paymentStatus ? order.paymentStatus.toUpperCase() : 'PENDING'}
              </StatusBadge>
            </Value>
          </InfoItem>
          <InfoItem>
            <Label>Shipping Method</Label>
            <Value>{order.shippingMethod || 'Standard'}</Value>
          </InfoItem>
        </InfoGrid>
        
        <ActionButtons>
          <ActionButton onClick={handleDownloadInvoice}>
            <Download size={16} />
            Download Invoice
          </ActionButton>
          <ActionButton onClick={handlePrintShipping}>
            <Truck size={16} />
            Print Shipping Label
          </ActionButton>
          <ActionButton onClick={handleEditOrder}>
            <Edit size={16} />
            Edit Order
          </ActionButton>
        </ActionButtons>
      </Card>
      
      <Card className='p-4'>
        <CardTitle>Customer Information</CardTitle>
        <InfoGrid>
          <InfoItem>
            <Label>Customer Name</Label>
            <Value>
              {order.user ? 
                `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email : 
                'Guest User'}
            </Value>
          </InfoItem>
          <InfoItem>
            <Label>Email</Label>
            <Value>{order.user?.email || 'N/A'}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Phone</Label>
            <Value>{order.shippingAddress?.phone || 'N/A'}</Value>
          </InfoItem>
        </InfoGrid>
      </Card>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom component="div">
          Shipping Information
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
        <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Shipping Address
                </Typography>
                
                <Typography variant="body2">
                  {order?.shippingAddress?.firstName} {order?.shippingAddress?.lastName}
                </Typography>
                <Typography variant="body2">
                  {order?.shippingAddress?.addressLine1}
                </Typography>
                {order?.shippingAddress?.addressLine2 && (
                  <Typography variant="body2">
                    {order?.shippingAddress?.addressLine2}
                  </Typography>
                )}
                <Typography variant="body2">
                  {order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.postalCode}
                </Typography>
                <Typography variant="body2">
                  {order?.shippingAddress?.country}
                </Typography>
                <Typography variant="body2">
                  {order?.shippingAddress?.phone}
                </Typography>
                {order?.message && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Customer Message
                    </Typography>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', p: 1, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                      {order?.message}
                    </Typography>
                  </>
                )}
              </CardContent>
        </Card>
          </Grid>
        
          <Grid item xs={12}>
        <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    FedEx Shipping Details
                  </Typography>
                  {order?.shipping?.trackingNumber && (
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<RefreshCw size={16} />}
                      onClick={handleRefreshTracking}
                    >
                      Refresh Tracking
                    </Button>
                  )}
                </Box>
                
                {order?.shipping?.trackingNumber ? (
                  <Box>
                    <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
                      <Box flexGrow={1}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Tracking Number:
                        </Typography>
                        <Typography variant="body2">
                          {order.shipping.trackingNumber}
                        </Typography>
                      </Box>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        component="a" 
                        href={order.shipping.trackingUrl || `https://www.fedex.com/fedextrack/?trknbr=${order.shipping.trackingNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Track Package
                      </Button>
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Service Type:
                        </Typography>
                        <Typography variant="body2">
                          {order.shipping.serviceType || "Standard"}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Estimated Delivery:
                        </Typography>
                        <Typography variant="body2">
                          {order.shipping.estimatedDeliveryDate 
                            ? new Date(order.shipping.estimatedDeliveryDate).toLocaleDateString() 
                            : "Not available"}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Shipped Date:
                        </Typography>
                        <Typography variant="body2">
                          {order.shipping.shippedAt 
                            ? new Date(order.shipping.shippedAt).toLocaleDateString() 
                            : "Not shipped yet"}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Shipping Status:
                        </Typography>
                        <Chip 
                          label={order.shipping.status?.replace('_', ' ').toUpperCase() || "PROCESSING"} 
                          color={
                            order.shipping.status === 'delivered' ? 'success' :
                            order.shipping.status === 'in_transit' ? 'info' :
                            order.shipping.status === 'out_for_delivery' ? 'warning' :
                            order.shipping.status === 'exception' ? 'error' :
                            'default'
                          }
                          size="small"
                        />
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Carrier:
                        </Typography>
                        <Typography variant="body2">
                          {order.shipping.carrier || "FedEx"}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          Last Updated:
                        </Typography>
                        <Typography variant="body2">
                          {order.shipping.lastUpdated 
                            ? new Date(order.shipping.lastUpdated).toLocaleString() 
                            : "N/A"}
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    {order.shipping.packageDetails && (
                      <PackageDetailsBox>
                        <h4>Package Details</h4>
                        <div className="details-grid">
                          {order.shipping.packageDetails.weight && (
                            <div className="detail-item">
                              <div className="label">Weight</div>
                              <div className="value">{order.shipping.packageDetails.weight} lbs</div>
                            </div>
                          )}
                          
                          {order.shipping.packageDetails.dimensions && (
                            <>
                              <div className="detail-item">
                                <div className="label">Dimensions</div>
                                <div className="value">
                                  {order.shipping.packageDetails.dimensions.length} x {order.shipping.packageDetails.dimensions.width} x {order.shipping.packageDetails.dimensions.height} {order.shipping.packageDetails.dimensions.unit || "IN"}
                                </div>
                              </div>
                              
                              <div className="detail-item">
                                <div className="label">Package Type</div>
                                <div className="value">{order.shipping.packageDetails.packageType || "Your Packaging"}</div>
                              </div>
                            </>
                          )}
                          
                          <div className="detail-item">
                            <div className="label">Package Count</div>
                            <div className="value">{order.shipping.packageCount || 1}</div>
                          </div>
            </div>
                      </PackageDetailsBox>
                    )}
                    
                    {order.shipping.trackingHistory && order.shipping.trackingHistory.length > 0 && (
                      <TrackingHistory>
                        <Typography variant="subtitle2" gutterBottom>
                          Tracking History
                        </Typography>
                        <Timeline>
                          {order.shipping.trackingHistory.map((event, index) => (
                            <TimelineItem key={index}>
                              <TimelineOppositeContent color="text.secondary">
                                {new Date(event.timestamp).toLocaleString()}
                              </TimelineOppositeContent>
                              <TimelineSeparator>
                                <TimelineDot color={event.isException ? "error" : "primary"} />
                                {index < order.shipping.trackingHistory.length - 1 && <TimelineConnector />}
                              </TimelineSeparator>
                              <TimelineContent>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                  {event.status}
                                </Typography>
                                <Typography variant="body2">
                                  {event.statusDetails}
                                </Typography>
                                {event.location && (
                                  <Typography variant="body2" color="text.secondary">
                                    {event.location}
                                  </Typography>
                                )}
                              </TimelineContent>
                            </TimelineItem>
                          ))}
                        </Timeline>
                      </TrackingHistory>
                    )}
                    
                    {/* Delivery Proof Section */}
                    {order.shipping.status === 'delivered' && (
                      <Box mt={3} p={2} bgcolor="#f8f8f8" borderRadius={1}>
                        <Typography variant="subtitle2" gutterBottom>
                          Delivery Information
                        </Typography>
                        <Grid container spacing={2}>
                          {order.shipping.deliveredAt && (
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Delivered On:
                              </Typography>
                              <Typography variant="body2">
                                {new Date(order.shipping.deliveredAt).toLocaleString()}
                              </Typography>
                            </Grid>
                          )}
                          
                          {order.shipping.receivedBy && (
                            <Grid item xs={6}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Received By:
                              </Typography>
                              <Typography variant="body2">
                                {order.shipping.receivedBy}
                              </Typography>
                            </Grid>
                          )}
                          
                          {order.shipping.signature && (
                            <Grid item xs={12}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                Signature:
                              </Typography>
                              <Box mt={1} p={1} border="1px solid #ddd" borderRadius={1} textAlign="center">
                                <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                  {order.shipping.signature}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      No shipping details available yet. Use the form below to add shipping information.
                    </Typography>
                    
                    <Box component="form" onSubmit={handleShippingUpdate} sx={{ mt: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Tracking Number"
                            name="trackingNumber"
                            size="small"
                            required
                          />
                        </Grid>
                        
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Service Type"
                            name="serviceType"
                            size="small"
                            select
                            defaultValue="FEDEX_GROUND"
                          >
                            <MenuItem value="FEDEX_GROUND">FedEx Ground</MenuItem>
                            <MenuItem value="FEDEX_EXPRESS_SAVER">FedEx Express Saver</MenuItem>
                            <MenuItem value="FEDEX_2DAY">FedEx 2Day</MenuItem>
                            <MenuItem value="PRIORITY_OVERNIGHT">Priority Overnight</MenuItem>
                          </TextField>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Estimated Delivery Date"
                            name="estimatedDeliveryDate"
                            type="date"
                            size="small"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Carrier"
                            name="carrierInfo"
                            size="small"
                            select
                            defaultValue="FedEx"
                          >
                            <MenuItem value="FedEx">FedEx</MenuItem>
                            <MenuItem value="UPS">UPS</MenuItem>
                            <MenuItem value="USPS">USPS</MenuItem>
                            <MenuItem value="DHL">DHL</MenuItem>
                          </TextField>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <LoadingButton
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}
                            fullWidth
                          >
                            Add Shipping Information
                          </LoadingButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                )}
              </CardContent>
        </Card>
          </Grid>
        </Grid>
      </Box>
      
      <Card>
        <CardTitle>Order Items</CardTitle>
        {order.items && order.items.length > 0 ? (
          <ItemTable>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="flex items-center gap-3">
                      {item.product?.images && item.product.images.length > 0 && (
                        <ProductImage src={item.product.images[0]} alt={item.product.name} />
                      )}
                      <div>{item.product?.name || 'Unknown Product'}</div>
                    </div>
                  </td>
                  <td>{item.product?.sku || 'N/A'}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price ? item.price.toFixed(2) : '0.00'}</td>
                  <td>${item.total ? item.total.toFixed(2) : '0.00'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"></td>
                <td><strong>Subtotal</strong></td>
                <td><strong>${order.subTotal ? order.subTotal.toFixed(2) : '0.00'}</strong></td>
              </tr>
              <tr>
                <td colSpan="3"></td>
                <td>Shipping</td>
                <td>${order.shippingCost ? order.shippingCost.toFixed(2) : '0.00'}</td>
              </tr>
              <tr>
                <td colSpan="3"></td>
                <td>Tax</td>
                <td>${order.tax ? order.tax.toFixed(2) : '0.00'}</td>
              </tr>
              <tr>
                <td colSpan="3"></td>
                <td>Discount</td>
                <td>-${order.discount ? order.discount.toFixed(2) : '0.00'}</td>
              </tr>
              <tr>
                <td colSpan="3"></td>
                <td><strong>Total</strong></td>
                <td><strong>${order.total ? order.total.toFixed(2) : '0.00'}</strong></td>
              </tr>
            </tfoot>
          </ItemTable>
        ) : (
          <p>No items in this order</p>
        )}
        
        {order.couponCode && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#f0f9ff', borderRadius: '8px', border: '1px dashed #3b82f6' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1e40af', fontSize: '1rem', fontWeight: '500' }}>
              Applied Coupon
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontWeight: 'bold', color: '#1e40af', padding: '3px 8px', background: '#dbeafe', borderRadius: '4px' }}>
                  {order.couponCode}
                </span>
                {order.discount > 0 && (
                  <span style={{ marginLeft: '10px', color: '#047857' }}>
                    Saved: ${order.discount.toFixed(2)}
                  </span>
                )}
              </div>
              <StatusBadge status="completed">
                APPLIED
              </StatusBadge>
            </div>
          </div>
        )}
      </Card>
      
      {order.notes && (
        <Card>
          <CardTitle>Order Notes</CardTitle>
          <p>{order.notes}</p>
        </Card>
      )}
    </Container>
  );
};

export default OrderDetail; 