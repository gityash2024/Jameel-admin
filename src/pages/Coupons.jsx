import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Edit, Trash, Plus, Check, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { couponAPI } from '../services/api';

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

const Button = styled.button`
  padding: 0.75rem 1rem;
  background: ${props => props.secondary ? 'white' : '#3B82F6'};
  color: ${props => props.secondary ? '#333' : 'white'};
  border: 1px solid ${props => props.secondary ? '#E5E7EB' : '#3B82F6'};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.secondary ? '#F9FAFB' : '#2563EB'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  color: #4B5563;
  background: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #E5E7EB;
  font-size: 0.875rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: ${props => props.delete ? '#EF4444' : '#3B82F6'};
  margin-right: 0.5rem;

  &:hover {
    opacity: 0.7;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => props.active ? '#ECFDF5' : '#FEF2F2'};
  color: ${props => props.active ? '#10B981' : '#EF4444'};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 600px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6B7280;
  position: absolute;
  right: 0;
  top: 0;
  
  &:hover {
    color: #111827;
  }
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.cols || 1}, 1fr);
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.75rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #D1D5DB;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  resize: none;
  height: 100px;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6B7280;
`;

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderAmount: 0,
    maxDiscount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    isActive: true,
    usageLimit: '',
    description: ''
  });
  
  useEffect(() => {
    fetchCoupons();
  }, []);
  
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await couponAPI.getAllCoupons();
      if (response.data && response.data.data) {
        setCoupons(response.data.data.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleOpenModal = (mode, coupon = null) => {
    setFormMode(mode);
    
    if (mode === 'edit' && coupon) {
      setSelectedCoupon(coupon);
      setFormData({
        code: coupon.code || '',
        type: coupon.type || 'percentage',
        value: coupon.value || '',
        minOrderAmount: coupon.minOrderAmount || 0,
        maxDiscount: coupon.maxDiscount || '',
        startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
        endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : '',
        isActive: coupon.isActive !== undefined ? coupon.isActive : true,
        usageLimit: coupon.usageLimit || '',
        description: coupon.description || ''
      });
    } else {
      setSelectedCoupon(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        minOrderAmount: 0,
        maxDiscount: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
        isActive: true,
        usageLimit: '',
        description: ''
      });
    }
    
    setModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCoupon(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        value: Number(formData.value),
        minOrderAmount: Number(formData.minOrderAmount || 0),
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null
      };
      
      if (formMode === 'add') {
        await couponAPI.createCoupon(payload);
        toast.success('Coupon created successfully');
      } else {
        await couponAPI.updateCoupon(selectedCoupon._id, payload);
        toast.success('Coupon updated successfully');
      }
      
      handleCloseModal();
      fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error(error.response?.data?.message || 'Failed to save coupon');
    }
  };
  
  const handleToggleStatus = async (id) => {
    try {
      await couponAPI.toggleCouponStatus(id);
      fetchCoupons();
      toast.success('Coupon status updated');
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      toast.error('Failed to update coupon status');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await couponAPI.deleteCoupon(id);
        fetchCoupons();
        toast.success('Coupon deleted successfully');
      } catch (error) {
        console.error('Error deleting coupon:', error);
        toast.error('Failed to delete coupon');
      }
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container>
      <Header>
        <Title>Coupons & Discounts</Title>
        <Button onClick={() => handleOpenModal('add')}>
          <Plus size={16} />
          Add New Coupon
        </Button>
      </Header>

      {loading ? (
        <p>Loading coupons...</p>
      ) : coupons.length === 0 ? (
        <EmptyState>
          <h3>No coupons found</h3>
          <p>Create your first coupon by clicking the "Add New Coupon" button.</p>
        </EmptyState>
      ) : (
      <Table>
        <thead>
          <tr>
            <Th>Code</Th>
            <Th>Type</Th>
            <Th>Value</Th>
            <Th>Min Order</Th>
            <Th>Valid Until</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <Td style={{ fontWeight: '500' }}>{coupon.code}</Td>
                <Td>
                  {coupon.type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                </Td>
                <Td>
                  {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value.toFixed(2)}`}
                </Td>
                <Td>${coupon.minOrderAmount ? coupon.minOrderAmount.toFixed(2) : '0.00'}</Td>
                <Td>{formatDate(coupon.endDate)}</Td>
                <Td>
                  <StatusBadge active={coupon.isActive}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </StatusBadge>
                </Td>
                <Td>
                  <ActionButton onClick={() => handleOpenModal('edit', coupon)}>
                    <Edit size={16} />
                  </ActionButton>
                  <ActionButton delete onClick={() => handleDelete(coupon._id)}>
                    <Trash size={16} />
                  </ActionButton>
                  <ActionButton onClick={() => handleToggleStatus(coupon._id)}>
                    {coupon.isActive ? <X size={16} /> : <Check size={16} />}
                  </ActionButton>
                </Td>
              </tr>
            ))}
        </tbody>
      </Table>
      )}
      
      {modalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{formMode === 'add' ? 'Add New Coupon' : 'Edit Coupon'}</ModalTitle>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormRow cols={2}>
                <FormGroup>
                  <Label htmlFor="code">Coupon Code*</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="e.g. SUMMER50"
                    value={formData.code}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="type">Discount Type*</Label>
                  <Select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </Select>
                </FormGroup>
              </FormRow>
              
              <FormRow cols={2}>
                <FormGroup>
                  <Label htmlFor="value">
                    {formData.type === 'percentage' ? 'Percentage Value*' : 'Discount Amount*'}
                  </Label>
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    min="0"
                    step={formData.type === 'percentage' ? '1' : '0.01'}
                    placeholder={formData.type === 'percentage' ? '10' : '15.00'}
                    value={formData.value}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="minOrderAmount">Min Order</Label>
                  <Input
                    id="minOrderAmount"
                    name="minOrderAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.minOrderAmount}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow cols={2}>
                <FormGroup>
                  <Label htmlFor="maxDiscount">Max Discount</Label>
                  <Input
                    id="maxDiscount"
                    name="maxDiscount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="100.00"
                    value={formData.maxDiscount}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="usageLimit">Usage Limit</Label>
                  <Input
                    id="usageLimit"
                    name="usageLimit"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="100"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow cols={2}>
                <FormGroup>
                  <Label htmlFor="startDate">Start Date*</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="endDate">End Date*</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow cols={1}>
                <FormGroup>
                  <Label htmlFor="isActive">Status</Label>
                  <Select
                    id="isActive"
                    name="isActive"
                    value={formData.isActive}
                    onChange={handleInputChange}
                  >
                    <option value={true}>Active</option>
                    <option value={false}>Inactive</option>
                  </Select>
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter coupon description and terms..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <FormActions>
                <Button secondary type="button" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {formMode === 'add' ? 'Create Coupon' : 'Update Coupon'}
                </Button>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Coupons;