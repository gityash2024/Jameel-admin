import React, { useState } from 'react';
import styled from 'styled-components';
import { Download, Plus, Pencil, Trash2 } from 'lucide-react';

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

  &:hover {
    background: #f7fafc;
  }

  &.primary {
    background: white;
    color: #000;
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

const CheckboxInput = styled.input`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  cursor: pointer;
`;

const BlogTag = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const [tags, setTags] = useState([
    { id: 1, name: 'Urban Cycling', createdAt: '17/6/2024 2:13 pm', status: true },
    { id: 2, name: 'Pedal Power', createdAt: '17/6/2024 2:12 pm', status: true },
    { id: 3, name: 'Childhood Adventures', createdAt: '17/6/2024 2:11 pm', status: true },
    { id: 4, name: 'Sunset Soft Board', createdAt: '6/6/2024 4:29 pm', status: true },
    { id: 5, name: 'Eco Friendly Surfboard', createdAt: '6/6/2024 4:28 pm', status: true },
    { id: 6, name: 'Soft Top Surfboard', createdAt: '6/6/2024 4:27 pm', status: true },
    { id: 7, name: 'Simulation Games', createdAt: '29/5/2024 1:34 pm', status: true },
    { id: 8, name: 'Console Gaming', createdAt: '29/5/2024 1:33 pm', status: true },
    { id: 9, name: 'SciFi Games', createdAt: '29/5/2024 1:31 pm', status: true },
    { id: 10, name: 'Performance upgrades', createdAt: '29/5/2024 1:15 pm', status: true },
    { id: 11, name: 'Exterior accessories', createdAt: '29/5/2024 1:15 pm', status: true },
    { id: 12, name: 'Automotive parts', createdAt: '29/5/2024 1:14 pm', status: true },
    { id: 13, name: 'Slip-Resistant Shoes', createdAt: '25/5/2024 6:06 pm', status: true },
    { id: 14, name: 'Breathable Shoes', createdAt: '25/5/2024 6:05 pm', status: true },
    { id: 15, name: 'Vegan Footwear', createdAt: '25/5/2024 6:02 pm', status: true }
  ]);

  const handleToggleStatus = (id) => {
    setTags(tags.map(tag => 
      tag.id === id ? { ...tag, status: !tag.status } : tag
    ));
  };

  const handleEdit = (id) => {
    console.log('Edit tag:', id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      setTags(tags.filter(tag => tag.id !== id));
    }
  };

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    setSelectedTags(e.target.checked ? tags.map(tag => tag.id) : []);
  };

  const handleSelectTag = (id) => {
    setSelectedTags(prev => 
      prev.includes(id) 
        ? prev.filter(tagId => tagId !== id)
        : [...prev, id]
    );
  };

  const handleImport = () => {
    console.log('Import clicked');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        console.log('File selected:', file);
      }
    };
    input.click();
  };

  const handleAddTag = () => {
    console.log('Add tag clicked');
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <h1>Tags</h1>
        <div className="button-group">
          <Button onClick={handleImport}>
            <Download size={16} />
            Import
          </Button>
          <Button className="primary" onClick={handleAddTag}>
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
              <CheckboxInput
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
            </Th>
            <Th>Name</Th>
            <Th>Create At</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {filteredTags.map(tag => (
            <tr key={tag.id}>
              <Td>
                <CheckboxInput
                  type="checkbox"
                  checked={selectedTags.includes(tag.id)}
                  onChange={() => handleSelectTag(tag.id)}
                />
              </Td>
              <Td>{tag.name}</Td>
              <Td>{tag.createdAt}</Td>
              <Td>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={tag.status}
                    onChange={() => handleToggleStatus(tag.id)}
                  />
                  <span className="slider" />
                </ToggleSwitch>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <ActionButton onClick={() => handleEdit(tag.id)}>
                    <Pencil size={16} />
                  </ActionButton>
                  <ActionButton delete onClick={() => handleDelete(tag.id)}>
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

export default BlogTag;