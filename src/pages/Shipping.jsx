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

const SelectCountryButton = styled.button`
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

const CountryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`;

const CountryCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CountryName = styled.div`
  font-size: 0.875rem;
  color: #1a202c;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
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
  z-index: 50;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h2 {
    font-size: 1.125rem;
    font-weight: 600;
  }
`;

const CountrySelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;

  ${props => props.primary ? `
    background: #3B82F6;
    color: white;
    &:hover {
      background: #2563EB;
    }
  ` : `
    border: 1px solid #e2e8f0;
    background: white;
    &:hover {
      background: #f7fafc;
    }
  `}
`;

const Shipping = () => {
  const [selectedCountries, setSelectedCountries] = useState([
    { id: 1, name: 'Afghanistan' },
    { id: 2, name: 'Afghanistan' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');

  const availableCountries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Australia',
    'Austria', 'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'China', 'Denmark', 'Egypt',
    'Finland', 'France', 'Germany', 'Greece', 'India', 'Indonesia', 'Italy', 'Japan'
  ];

  const handleAddCountry = () => {
    if (selectedCountry) {
      const newCountry = {
        id: Date.now(),
        name: selectedCountry
      };
      setSelectedCountries([...selectedCountries, newCountry]);
      setSelectedCountry('');
      setIsModalOpen(false);
    }
  };

  const handleDeleteCountry = (id) => {
    if (window.confirm('Are you sure you want to delete this shipping location?')) {
      setSelectedCountries(selectedCountries.filter(country => country.id !== id));
    }
  };

  const handleEditCountry = (id) => {
    console.log('Edit country:', id);
    // Implement edit functionality
  };

  return (
    <Container>
      <Header>
        <h1>Shipping</h1>
        <SelectCountryButton onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          Select Country
        </SelectCountryButton>
      </Header>

      <CountryGrid>
        {selectedCountries.map(country => (
          <CountryCard key={country.id}>
            <CountryName>{country.name}</CountryName>
            <ActionButtons>
              <ActionButton onClick={() => handleEditCountry(country.id)}>
                <Pencil size={16} />
              </ActionButton>
              <ActionButton delete onClick={() => handleDeleteCountry(country.id)}>
                <Trash2 size={16} />
              </ActionButton>
            </ActionButtons>
          </CountryCard>
        ))}
      </CountryGrid>

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h2>Select Country</h2>
              <Button onClick={() => setIsModalOpen(false)}>×</Button>
            </ModalHeader>
            <CountrySelect
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              <option value="">Select a country</option>
              {availableCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </CountrySelect>
            <ModalButtons>
              <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button primary onClick={handleAddCountry}>Add</Button>
            </ModalButtons>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Shipping;