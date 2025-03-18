import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search, Download, Eye } from 'react-feather';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { paymentAPI } from '../services/api';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #333;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #f5f5f5;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  width: 300px;

  input {
    border: none;
    background: none;
    margin-left: 0.5rem;
    width: 100%;
    outline: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background: #f9f9f9;
    font-weight: 600;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-right: 1rem;
  color: #666;

  &:hover {
    color: #333;
  }
`;

const Status = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'completed':
        return 'background: #e6f4ea; color: #1e8e3e;';
      case 'pending':
        return 'background: #fef7e6; color: #b06000;';
      case 'failed':
        return 'background: #fce8e8; color: #d93025;';
      default:
        return 'background: #f1f3f4; color: #5f6368;';
    }
  }}
`;

const PaymentInfo = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentAPI.getAllPayments();
      if (response.data && response.data.data && response.data.data.payments) {
        setPayments(response.data.data.payments);
      } else {
        setPayments([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payment data. Please try again later.');
      toast.error('Failed to load payment data');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPayments = payments.filter(payment =>
    (payment.orderId && payment.orderId.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
    (payment.customer && payment.customer.name && payment.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const downloadInvoice = async (paymentId) => {
    try {
      const response = await paymentAPI.downloadInvoice(paymentId);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error('Failed to download invoice');
    }
  };

  const viewPaymentDetails = (paymentId) => {
    navigate(`/payments/details/${paymentId}`);
  };

  return (
    <Container>
      <Header>
        <Title>Payment Information</Title>
        <SearchBar>
          <Search size={18} color="#666" />
          <input
            type="text"
            placeholder="Search by Order ID or Customer"
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchBar>
      </Header>

      {loading ? (
        <p>Loading payments...</p>
      ) : error ? (
        <p>{error}</p>
      ) : payments.length === 0 ? (
        <p>No payment records found.</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map(payment => (
              <tr key={payment._id}>
                <td>{payment.orderId || 'N/A'}</td>
                <td>{payment.customer?.name || 'N/A'}</td>
                <td>${payment.amount ? payment.amount.toFixed(2) : '0.00'}</td>
                <td>{payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <Status status={payment.status || 'unknown'}>{payment.status || 'Unknown'}</Status>
                </td>
                <td>
                  <ActionButton onClick={() => viewPaymentDetails(payment._id)}>
                    <Eye size={18} />
                  </ActionButton>
                  <ActionButton onClick={() => downloadInvoice(payment._id)}>
                    <Download size={18} />
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default PaymentInfo; 