import React, { useState } from 'react';
import styled from 'styled-components';
import { Lock, Plus, Search } from 'lucide-react';

const Container = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a237e;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  background: #1a237e;
  color: white;
  border: none;
  
  &:hover {
    background: #151b4f;
  }
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
`;

const ItemsPerPage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 14px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #1a237e;
  }
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #1a237e;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #f8fafc;
  color: #1a237e;
  font-weight: 500;
  font-size: 14px;
  border-bottom: 1px solid #e2e8f0;
  
  &:first-child {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  
  &:last-child {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const Td = styled.td`
  padding: 12px;
  font-size: 14px;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
`;

const ActionButton = styled.button`
  padding: 6px;
  border: none;
  background: none;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #1a237e;
  }
`;

const mockRoles = [
  {
    id: 1,
    name: 'admin',
    createdAt: '2/5/2024 2:04 pm'
  },
  {
    id: 2,
    name: 'consumer',
    createdAt: '2/5/2024 2:04 pm'
  },
];

const RoleUser = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddRole = () => {
    // Handle add role action
    console.log('Add new role');
  };

  const handleLockRole = (roleId) => {
    // Handle lock role action
    console.log('Lock role:', roleId);
  };

  // Filter roles based on search term
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <Title>Roles</Title>
        <Button onClick={handleAddRole}>
          <Plus size={16} />
          Add Role
        </Button>
      </Header>

      <FilterSection>
        <ItemsPerPage>
          Show:
          <Select 
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </Select>
          Items Per Page
        </ItemsPerPage>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          Search:
          <SearchInput
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search roles..."
          />
        </div>
      </FilterSection>

      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Create At</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {filteredRoles.map(role => (
            <tr key={role.id}>
              <Td>{role.name}</Td>
              <Td>{role.createdAt}</Td>
              <Td>
                <ActionButton onClick={() => handleLockRole(role.id)}>
                  <Lock size={16} />
                </ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default RoleUser;