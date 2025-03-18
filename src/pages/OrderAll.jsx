import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { orderAPI } from '../services/api';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a202c;
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: white;
  font-size: 0.875rem;

  &:hover {
    background: #f7fafc;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ShowEntries = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;

  select {
    padding: 0.25rem 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    outline: none;
  }
`;

const DateInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  outline: none;
  font-size: 0.875rem;
  color: #4a5568;
  background: #f8fafc;

  &:focus {
    border-color: #4299e1;
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  outline: none;
  width: 240px;

  &:focus {
    border-color: #4299e1;
  }
`;

const StatusTabs = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
`;

const StatusTab = styled.button`
  padding: 0.75rem 0;
  color: ${props => props.active ? '#1a202c' : '#4a5568'};
  font-size: 0.875rem;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#4299e1' : 'transparent'};
  background: transparent;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  span.count {
    padding: 0.125rem 0.5rem;
    background: ${props => {
      switch(props.status) {
        case 'pending': return '#FEF3C7';
        case 'cancelled': return '#FEE2E2';
        case 'completed': return '#ECFDF5';
        default: return '#E5E7EB';
      }
    }};
    color: ${props => {
      switch(props.status) {
        case 'pending': return '#F59E0B';
        case 'cancelled': return '#EF4444';
        case 'completed': return '#10B981';
        default: return '#6B7280';
      }
    }};
    border-radius: 9999px;
    font-size: 0.75rem;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #f8fafc;
  color: #4a5568;
  font-weight: 500;
  font-size: 0.875rem;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;

  &:first-child {
    padding-left: 1.5rem;
  }

  &:last-child {
    padding-right: 1.5rem;
  }
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #1a202c;
  font-size: 0.875rem;

  &:first-child {
    padding-left: 1.5rem;
  }

  &:last-child {
    padding-right: 1.5rem;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  
  ${props => {
    switch(props.status.toLowerCase()) {
      case 'pending':
        return `
          background: #FEF3C7;
          color: #F59E0B;
        `;
      case 'completed':
        return `
          background: #ECFDF5;
          color: #10B981;
        `;
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
  padding: 0.25rem;
  color: #3B82F6;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const OrderAll = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeStatus, setActiveStatus] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllOrders();
      
      if (response?.data?.data?.orders) {
        setOrders(response.data.data.orders);
      } else {
        setOrders([]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(order => order.orderStatus?.toLowerCase() === 'pending').length,
    processing: orders.filter(order => order.orderStatus?.toLowerCase() === 'processing').length,
    cancelled: orders.filter(order => order.orderStatus?.toLowerCase() === 'cancelled').length,
    shipped: orders.filter(order => order.orderStatus?.toLowerCase() === 'shipped').length,
    outForDelivery: orders.filter(order => order.orderStatus?.toLowerCase() === 'out_for_delivery').length,
    delivered: orders.filter(order => order.orderStatus?.toLowerCase() === 'delivered').length
  };

  const handleViewOrder = (id) => {
    navigate(`/orders/${id}`);
  };

  const handleAddOrder = () => {
    navigate('/orders/create');
  };

  const filteredOrders = orders
    .filter(order => 
      (activeStatus === 'all' || order.orderStatus?.toLowerCase() === activeStatus) &&
      (
        (order.orderNumber && order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.user?.firstName && order.user.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.user?.lastName && order.user.lastName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (order.user?.email && order.user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    )
    .filter(order => {
      if (!startDate || !endDate) return true;
      const orderDate = new Date(order.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);
      // Set end date to end of day
      end.setHours(23, 59, 59, 999);
      return orderDate >= start && orderDate <= end;
    });

  return (
    <Container>
      <Header>
        <h1>Orders</h1>
        <AddButton onClick={handleAddOrder}>
          <Plus size={16} />
          Add Order
        </AddButton>
      </Header>

      <Controls>
        <FilterGroup>
          <ShowEntries>
            Show:
            <select 
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            items Per Page
          </ShowEntries>
          <DateInput
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="YYYY-MM-DD"
          />
          <DateInput
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="YYYY-MM-DD"
          />
        </FilterGroup>

        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Controls>

      <StatusTabs>
        <StatusTab 
          active={activeStatus === 'all'} 
          onClick={() => setActiveStatus('all')}
        >
          All <span className="count">{statusCounts.all}</span>
        </StatusTab>
        <StatusTab 
          active={activeStatus === 'pending'} 
          status="pending"
          onClick={() => setActiveStatus('pending')}
        >
          Pending <span className="count">{statusCounts.pending}</span>
        </StatusTab>
        <StatusTab 
          active={activeStatus === 'processing'}
          onClick={() => setActiveStatus('processing')}
        >
          Processing <span className="count">{statusCounts.processing}</span>
        </StatusTab>
        <StatusTab 
          active={activeStatus === 'cancelled'}
          status="cancelled"
          onClick={() => setActiveStatus('cancelled')}
        >
          Cancelled <span className="count">{statusCounts.cancelled}</span>
        </StatusTab>
        <StatusTab 
          active={activeStatus === 'shipped'}
          onClick={() => setActiveStatus('shipped')}
        >
          Shipped <span className="count">{statusCounts.shipped}</span>
        </StatusTab>
        <StatusTab 
          active={activeStatus === 'outForDelivery'}
          onClick={() => setActiveStatus('outForDelivery')}
        >
          Out For Delivery <span className="count">{statusCounts.outForDelivery}</span>
        </StatusTab>
        <StatusTab 
          active={activeStatus === 'delivered'}
          status="completed"
          onClick={() => setActiveStatus('delivered')}
        >
          Delivered <span className="count">{statusCounts.delivered}</span>
        </StatusTab>
      </StatusTabs>

      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p>{error}</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Order Number</Th>
              <Th>Order Date</Th>
              <Th>Customer Name</Th>
              <Th>Total Amount</Th>
              <Th>Order Status</Th>
              <Th>Payment Method</Th>
              <Th>Action</Th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.slice(0, itemsPerPage).map(order => (
              <tr key={order._id}>
                <Td>{order.orderNumber || 'N/A'}</Td>
                <Td>{order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</Td>
                <Td>
                  {order.user ? 
                    `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email : 
                    'Guest User'}
                </Td>
                <Td>${order.total ? order.total.toFixed(2) : '0.00'}</Td>
                <Td>
                  <StatusBadge status={order.orderStatus || 'PENDING'}>
                    {order.orderStatus ? order.orderStatus.toUpperCase() : 'PENDING'}
                  </StatusBadge>
                </Td>
                <Td>{order.paymentMethod || 'N/A'}</Td>
                <Td>
                  <ActionButton onClick={() => handleViewOrder(order._id)}>
                    <Eye size={16} />
                  </ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrderAll;