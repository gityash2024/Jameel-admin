import React, { useState } from 'react';
import styled from 'styled-components';
import { Pencil, Trash2, Plus, Upload } from 'lucide-react';

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

  .buttons {
    display: flex;
    gap: 1rem;
  }
`;

const Button = styled.button`
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input {
    padding: 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Taxies = () => {
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taxes, setTaxes] = useState([
    {
      id: 1,
      name: 'Sales Tax',
      createdAt: '17/6/2024 2:13 pm',
      status: true
    }
  ]);
  const [newTax, setNewTax] = useState({ name: '' });

  const handleToggleStatus = (id) => {
    setTaxes(taxes.map(tax => 
      tax.id === id ? { ...tax, status: !tax.status } : tax
    ));
  };

  const handleEdit = (id) => {
    console.log('Edit tax:', id);
    // Implement edit functionality
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tax?')) {
      setTaxes(taxes.filter(tax => tax.id !== id));
    }
  };

  const handleAddTax = (e) => {
    e.preventDefault();
    if (newTax.name) {
      const tax = {
        id: Date.now(),
        name: newTax.name,
        createdAt: new Date().toLocaleString(),
        status: true
      };
      setTaxes([...taxes, tax]);
      setNewTax({ name: '' });
      setIsModalOpen(false);
    }
  };

  const handleImport = () => {
    console.log('Import taxes');
    // Implement import functionality
  };

  const filteredTaxes = taxes.filter(tax =>
    tax.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <h1>Taxes</h1>
        <div className="buttons">
          <Button onClick={handleImport}>
            <Upload size={16} />
            Import
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            Add Tag
          </Button>
        </div>
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
            <Th>Name</Th>
            <Th>Create At</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {filteredTaxes.map(tax => (
            <tr key={tax.id}>
              <Td>
                <input type="checkbox" />
              </Td>
              <Td>{tax.name}</Td>
              <Td>{tax.createdAt}</Td>
              <Td>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={tax.status}
                    onChange={() => handleToggleStatus(tax.id)}
                  />
                  <span className="slider" />
                </ToggleSwitch>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <ActionButton onClick={() => handleEdit(tax.id)}>
                    <Pencil size={16} />
                  </ActionButton>
                  <ActionButton delete onClick={() => handleDelete(tax.id)}>
                    <Trash2 size={16} />
                  </ActionButton>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {isModalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h2>Add Tax</h2>
              <Button onClick={() => setIsModalOpen(false)}>×</Button>
            </ModalHeader>
            <Form onSubmit={handleAddTax}>
              <input
                type="text"
                placeholder="Tax Name"
                value={newTax.name}
                onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
                required
              />
              <ModalButtons>
                <Button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" style={{ background: '#3B82F6', color: 'white' }}>
                  Add
                </Button>
              </ModalButtons>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Taxies;