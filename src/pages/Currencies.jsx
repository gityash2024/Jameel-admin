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

const Currencies = () => {
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');
  const [currencies, setCurrencies] = useState([
    {
      id: 1,
      code: "USD",
      symbol: "$",
      exchangeRate: "1",
      createdAt: "2/5/2024 2:04 pm",
      status: true
    },
    {
      id: 2,
      code: "INR",
      symbol: "₹",
      exchangeRate: "83",
      createdAt: "2/5/2024 2:04 pm",
      status: true
    },
    {
      id: 3,
      code: "GBP",
      symbol: "£",
      exchangeRate: "100",
      createdAt: "2/5/2024 2:04 pm",
      status: true
    },
    {
      id: 4,
      code: "EUR",
      symbol: "€",
      exchangeRate: "56",
      createdAt: "2/5/2024 2:04 pm",
      status: true
    }
  ]);

  const handleToggleStatus = (id) => {
    setCurrencies(currencies.map(currency => 
      currency.id === id ? { ...currency, status: !currency.status } : currency
    ));
  };

  const handleEdit = (id) => {
    console.log('Edit currency:', id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this currency?')) {
      setCurrencies(currencies.filter(currency => currency.id !== id));
    }
  };

  const handleAddCurrency = () => {
    console.log('Add new currency');
  };

  const filteredCurrencies = currencies.filter(currency =>
    currency.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <h1>Currencies</h1>
        <AddButton onClick={handleAddCurrency}>
          <Plus size={16} />
          Add Currency
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
            <Th>Code</Th>
            <Th>Symbol</Th>
            <Th>Exchange Rate</Th>
            <Th>Create At</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {filteredCurrencies.map(currency => (
            <tr key={currency.id}>
              <Td>
                <input type="checkbox" />
              </Td>
              <Td>{currency.code}</Td>
              <Td>{currency.symbol}</Td>
              <Td>{currency.exchangeRate}</Td>
              <Td>{currency.createdAt}</Td>
              <Td>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={currency.status}
                    onChange={() => handleToggleStatus(currency.id)}
                  />
                  <span className="slider" />
                </ToggleSwitch>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <ActionButton onClick={() => handleEdit(currency.id)}>
                    <Pencil size={16} />
                  </ActionButton>
                  <ActionButton delete onClick={() => handleDelete(currency.id)}>
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

export default Currencies;