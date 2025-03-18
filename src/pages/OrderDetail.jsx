import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Truck, Download, Edit, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { orderAPI } from '../services/api';

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

const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
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

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  
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
  
  const handleDownloadInvoice = () => {
    toast.error('Invoice download functionality not yet implemented');
  };
  
  const handlePrintShipping = () => {
    toast.error('Print shipping label functionality not yet implemented');
  };
  
  const handleEditOrder = () => {
    navigate(`/orders/edit/${id}`);
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
      
      <Card>
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
      
      <Card>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardTitle>Shipping Address</CardTitle>
          {order.shippingAddress ? (
            <div>
              <Value>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</Value>
              <Value>{order.shippingAddress.addressLine1}</Value>
              {order.shippingAddress.addressLine2 && <Value>{order.shippingAddress.addressLine2}</Value>}
              <Value>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</Value>
              <Value>{order.shippingAddress.country}</Value>
              <Value>{order.shippingAddress.phone}</Value>
            </div>
          ) : (
            <p>No shipping address provided</p>
          )}
        </Card>
        
        <Card>
          <CardTitle>Billing Address</CardTitle>
          {order.billingAddress ? (
            <div>
              <Value>{order.billingAddress.firstName} {order.billingAddress.lastName}</Value>
              <Value>{order.billingAddress.addressLine1}</Value>
              {order.billingAddress.addressLine2 && <Value>{order.billingAddress.addressLine2}</Value>}
              <Value>{order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postalCode}</Value>
              <Value>{order.billingAddress.country}</Value>
              <Value>{order.billingAddress.phone}</Value>
            </div>
          ) : (
            <p>Same as shipping address</p>
          )}
        </Card>
      </div>
      
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