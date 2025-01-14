import React, { useState } from 'react';
import styled from 'styled-components';
import { Pencil, Trash2, Plus } from 'lucide-react';

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
  transition: all 0.2s;

  &:hover {
    background: #f7fafc;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
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

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  outline: none;
  width: 240px;

  &:focus {
    border-color: #4299e1;
    box-shadow: 0 0 0 1px #4299e1;
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

const ActionButton = styled.button`
  padding: 0.25rem;
  color: ${props => props.delete ? '#EF4444' : '#3B82F6'};
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
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

const Coupons = () => {
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      title: "Special Alert Saving 10% Off",
      code: "SPECIAL10",
      createdAt: "14/5/2024 10:27 am",
      status: true
    },
    {
      id: 2,
      title: "Summer Sale",
      code: "SUMMER20",
      createdAt: "8/6/2024 12:30 pm",
      status: true
    },
    {
      id: 3,
      title: "New Year Discount",
      code: "NY2024",
      createdAt: "8/6/2024 12:31 pm",
      status: true
    },
    {
      id: 4,
      title: "Welcome Offer",
      code: "WELCOME15",
      createdAt: "8/6/2024 12:32 pm",
      status: true
    },
    {
      id: 5,
      title: "Free Shipping",
      code: "FREESHIP50",
      createdAt: "8/6/2024 12:33 pm",
      status: true
    },
    {
      id: 6,
      title: "Holiday Savings",
      code: "HOLIDAY40",
      createdAt: "8/6/2024 12:34 pm",
      status: true
    }
  ]);

  const handleToggleStatus = (id) => {
    setCoupons(coupons.map(coupon => 
      coupon.id === id ? { ...coupon, status: !coupon.status } : coupon
    ));
  };

  const handleEdit = (id) => {
    console.log('Edit coupon:', id);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      setCoupons(coupons.filter(coupon => coupon.id !== id));
    }
  };

  const handleAddCoupon = () => {
    console.log('Add new coupon');
    // Implement add functionality
  };

  const filteredCoupons = coupons.filter(coupon =>
    coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <h1>Coupons</h1>
        <AddButton onClick={handleAddCoupon}>
          <Plus size={16} />
          Add Coupon
        </AddButton>
      </Header>

      <Controls>
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

        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Controls>

      <Table>
        <thead>
          <tr>
            <Th style={{ width: '40px' }}>
              <input type="checkbox" />
            </Th>
            <Th>Title</Th>
            <Th>Code</Th>
            <Th>Create At</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {filteredCoupons.map(coupon => (
            <tr key={coupon.id}>
              <Td>
                <input type="checkbox" />
              </Td>
              <Td>{coupon.title}</Td>
              <Td>{coupon.code}</Td>
              <Td>{coupon.createdAt}</Td>
              <Td>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={coupon.status}
                    onChange={() => handleToggleStatus(coupon.id)}
                  />
                  <span className="slider" />
                </ToggleSwitch>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <ActionButton onClick={() => handleEdit(coupon.id)}>
                    <Pencil size={16} />
                  </ActionButton>
                  <ActionButton delete onClick={() => handleDelete(coupon.id)}>
                    <Trash2 size={16} />
                  </ActionButton>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Coupons;