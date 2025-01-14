import React, { useState } from 'react';
import styled from 'styled-components';
import { Download, Upload, Plus, Pencil, Trash2 } from 'lucide-react';

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

  .button-group {
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
  color: ${props => props.primary ? '#F97316' : '#1a202c'};
  border-color: ${props => props.primary ? '#F97316' : '#e2e8f0'};

  &:hover {
    background: ${props => props.primary ? '#FFF7ED' : '#f7fafc'};
  }

  svg {
    width: 16px;
    height: 16px;
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

const AttributeProduct = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [selectedAttributes, setSelectedAttributes] = useState([]);

  const [attributes, setAttributes] = useState([
    { id: 1, name: 'Number', createdAt: '9/6/2024 12:05 pm' },
    { id: 2, name: 'ML', createdAt: '17/5/2024 9:01 am' },
    { id: 3, name: 'GB', createdAt: '16/5/2024 9:36 am' },
    { id: 4, name: 'License', createdAt: '4/5/2024 11:13 am' },
    { id: 5, name: 'Litre', createdAt: '4/5/2024 11:13 am' },
    { id: 6, name: 'Color', createdAt: '4/5/2024 11:13 am' },
    { id: 7, name: 'Chest', createdAt: '4/5/2024 11:13 am' },
    { id: 8, name: 'Colour', createdAt: '4/5/2024 11:13 am' },
    { id: 9, name: 'Size', createdAt: '4/5/2024 11:13 am' },
    { id: 10, name: 'Weight', createdAt: '4/5/2024 11:13 am' }
  ]);

  const handleSelectAttribute = (id) => {
    setSelectedAttributes(prev => 
      prev.includes(id) 
        ? prev.filter(attrId => attrId !== id)
        : [...prev, id]
    );
  };

  const handleEdit = (id) => {
    console.log('Edit attribute:', id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this attribute?')) {
      setAttributes(attributes.filter(attr => attr.id !== id));
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log('Import file:', file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    console.log('Export attributes');
    // Implement export functionality
  };

  const handleAddAttribute = () => {
    console.log('Add new attribute');
    // Implement add attribute functionality
  };

  const filteredAttributes = attributes.filter(attr =>
    attr.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <h1>Attributes</h1>
        <div className="button-group">
          <Button onClick={handleImport}>
            <Upload size={16} />
            Import
          </Button>
          <Button onClick={handleExport}>
            <Download size={16} />
            Export
          </Button>
          <Button primary onClick={handleAddAttribute}>
            <Plus size={16} />
            Add Attribute
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
              <input 
                type="checkbox"
                checked={selectedAttributes.length === attributes.length}
                onChange={(e) => {
                  setSelectedAttributes(
                    e.target.checked 
                      ? attributes.map(attr => attr.id)
                      : []
                  );
                }}
              />
            </Th>
            <Th>Name</Th>
            <Th>Create At</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {filteredAttributes.map(attribute => (
            <tr key={attribute.id}>
              <Td>
                <input 
                  type="checkbox"
                  checked={selectedAttributes.includes(attribute.id)}
                  onChange={() => handleSelectAttribute(attribute.id)}
                />
              </Td>
              <Td>{attribute.name}</Td>
              <Td>{attribute.createdAt}</Td>
              <Td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <ActionButton onClick={() => handleEdit(attribute.id)}>
                    <Pencil size={16} />
                  </ActionButton>
                  <ActionButton delete onClick={() => handleDelete(attribute.id)}>
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

export default AttributeProduct;