import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Download, RefreshCw } from 'react-feather';
import { toast } from 'react-hot-toast';
import { paymentAPI } from '../services/api';

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
      case 'succeeded':
      case 'paid':
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
      case 'failed':
      case 'cancelled':
        return `
          background: #FEE2E2;
          color: #EF4444;
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

const NoDataMessage = styled.div`
  background: #f9f9f9;
  padding: 2rem;
  text-align: center;
  color: #666;
  border-radius: 8px;
`;

const PaymentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchPaymentDetails();
  }, [id]);
  
  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      const response = await paymentAPI.getPayment(id);
      if (response.data && response.data.data && response.data.data.payment) {
        setPayment(response.data.data.payment);
        
        // If there's an associated order, fetch that too
        if (response.data.data.payment.orderId) {
          const orderResponse = await paymentAPI.getPaymentByOrder(response.data.data.payment.orderId);
          if (orderResponse.data && orderResponse.data.data && orderResponse.data.data.order) {
            setOrder(orderResponse.data.data.order);
          }
        }
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching payment details:', err);
      setError('Failed to load payment details. Please try again later.');
      toast.error('Failed to load payment details');
    } finally {
      setLoading(false);
    }
  };
  
  const downloadInvoice = async () => {
    try {
      const response = await paymentAPI.downloadInvoice(id);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };
  
  const handleRefund = async () => {
    // This would be implemented with a modal confirmation and form for refund amount
    toast.error('Refund functionality not yet implemented');
  };
  
  if (loading) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/payments')}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>Loading Payment Details...</Title>
        </Header>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/payments')}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>Payment Details</Title>
        </Header>
        <NoDataMessage>{error}</NoDataMessage>
      </Container>
    );
  }
  
  if (!payment) {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => navigate('/payments')}>
            <ArrowLeft size={20} />
          </BackButton>
          <Title>Payment Details</Title>
        </Header>
        <NoDataMessage>No payment information found for this ID.</NoDataMessage>
      </Container>
    );
  }
  
  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate('/payments')}>
          <ArrowLeft size={20} />
        </BackButton>
        <Title>Payment {payment.id || payment._id}</Title>
      </Header>
      
      <Card>
        <CardTitle>Payment Information</CardTitle>
        <InfoGrid>
          <InfoItem>
            <Label>Payment ID</Label>
            <Value>{payment.id || payment._id}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Order ID</Label>
            <Value>{payment.orderId || 'N/A'}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Amount</Label>
            <Value>${payment.amount ? payment.amount.toFixed(2) : '0.00'}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Currency</Label>
            <Value>{payment.currency || 'USD'}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Payment Method</Label>
            <Value>{payment.paymentMethod || 'N/A'}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Date</Label>
            <Value>{payment.createdAt ? new Date(payment.createdAt).toLocaleString() : 'N/A'}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Status</Label>
            <Value>
              <StatusBadge status={payment.status || 'unknown'}>
                {payment.status || 'Unknown'}
              </StatusBadge>
            </Value>
          </InfoItem>
        </InfoGrid>
        
        <ActionButtons>
          <ActionButton onClick={downloadInvoice}>
            <Download size={16} />
            Download Invoice
          </ActionButton>
          <ActionButton 
            primary
            onClick={handleRefund}
            disabled={!['succeeded', 'paid', 'completed'].includes(payment.status?.toLowerCase())}
          >
            <RefreshCw size={16} />
            Process Refund
          </ActionButton>
        </ActionButtons>
      </Card>
      
      {order && (
        <Card>
          <CardTitle>Order Information</CardTitle>
          <InfoGrid>
            <InfoItem>
              <Label>Order Number</Label>
              <Value>{order.orderNumber || 'N/A'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Customer</Label>
              <Value>{order.user?.firstName ? `${order.user.firstName} ${order.user.lastName || ''}` : 'N/A'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Order Date</Label>
              <Value>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Order Status</Label>
              <Value>
                <StatusBadge status={order.orderStatus || 'unknown'}>
                  {order.orderStatus || 'Unknown'}
                </StatusBadge>
              </Value>
            </InfoItem>
          </InfoGrid>
          
          {order.items && order.items.length > 0 && (
            <OrderItems>
              <CardTitle>Order Items</CardTitle>
              <ItemTable>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.product?.name || 'Unknown Product'}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price ? item.price.toFixed(2) : '0.00'}</td>
                      <td>${item.total ? item.total.toFixed(2) : '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2"></td>
                    <td><strong>Subtotal</strong></td>
                    <td><strong>${order.subtotal ? order.subtotal.toFixed(2) : '0.00'}</strong></td>
                  </tr>
                  {order.couponCode && order.discount > 0 && (
                    <tr>
                      <td colSpan="2"></td>
                      <td>Discount ({order.couponCode})</td>
                      <td style={{ color: '#10B981' }}>-${order.discount.toFixed(2)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="2"></td>
                    <td>Shipping</td>
                    <td>${order.shippingCost ? order.shippingCost.toFixed(2) : '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="2"></td>
                    <td>Tax</td>
                    <td>${order.tax ? order.tax.toFixed(2) : '0.00'}</td>
                  </tr>
                  <tr>
                    <td colSpan="2"></td>
                    <td><strong>Total</strong></td>
                    <td><strong>${order.total ? order.total.toFixed(2) : '0.00'}</strong></td>
                  </tr>
                </tfoot>
              </ItemTable>
              
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
            </OrderItems>
          )}
        </Card>
      )}
    </Container>
  );
};

export default PaymentDetail; 