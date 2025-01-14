import React, { useState } from 'react';
import styled from 'styled-components';
import { Edit, Trash2, Plus, Download, Upload } from 'lucide-react';

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
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
  
  ${props => props.variant === 'primary' ? `
    background: #1a237e;
    color: white;
    border: none;
    
    &:hover {
      background: #151b4f;
    }
  ` : `
    background: white;
    color: #1a237e;
    border: 1px solid #1a237e;
    
    &:hover {
      background: #f5f7fb;
    }
  `}
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
`;

const Td = styled.td`
  padding: 12px;
  font-size: 14px;
  color: #334155;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #1a237e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
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

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: #1a237e;
  }
  
  &:checked + span:before {
    transform: translateX(20px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e2e8f0;
  transition: 0.4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

const mockUsers = [
  {
    id: 1,
    name: "Rhoda Mayer",
    email: "rhoda@gmail.com",
    role: "consumer",
    createdAt: "24/6/2024 12:56 pm",
    status: true
  },
  {
    id: 2,
    name: "Jack Doe",
    email: "jack.customer@gmail.com",
    role: "consumer",
    createdAt: "21/6/2024 6:18 pm",
    status: true
  },
  {
    id: 3,
    name: "Rhoda Mayer",
    email: "syzufizogo@mailinator.com",
    role: "consumer",
    createdAt: "15/6/2024 12:30 pm",
    status: true
  },
  {
    id: 4,
    name: "john due",
    email: "john.customer@example.com",
    role: "consumer",
    createdAt: "2/5/2024 2:04 pm",
    status: true
  }
];

const AddUser = () => {
  const [users, setUsers] = useState(mockUsers);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusToggle = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: !user.status } : user
    ));
  };

  const handleAddUser = () => {
    console.log('Add new user');
  };

  const handleImport = () => {
    console.log('Import users');
  };

  const handleExport = () => {
    console.log('Export users');
  };

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
  };

  const handleDelete = (userId) => {
    console.log('Delete user:', userId);
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <Title>Users</Title>
        <ButtonGroup>
          <Button onClick={handleImport}>
            <Upload size={16} />
            Import
          </Button>
          <Button onClick={handleExport}>
            <Download size={16} />
            Export
          </Button>
          <Button variant="primary" onClick={handleAddUser}>
            <Plus size={16} />
            Add User
          </Button>
        </ButtonGroup>
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
            placeholder="Search users..."
          />
        </div>
      </FilterSection>

      <Table>
        <thead>
          <tr>
            <Th>
              <input type="checkbox" />
            </Th>
            <Th>Avatar</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Create At</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <Td>
                <input type="checkbox" />
              </Td>
              <Td>
                <Avatar>{getInitials(user.name)}</Avatar>
              </Td>
              <Td>{user.name}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role}</Td>
              <Td>{user.createdAt}</Td>
              <Td>
                <Toggle>
                  <ToggleInput
                    type="checkbox"
                    checked={user.status}
                    onChange={() => handleStatusToggle(user.id)}
                  />
                  <ToggleSlider />
                </Toggle>
              </Td>
              <Td>
                <ButtonGroup>
                  <ActionButton onClick={() => handleEdit(user.id)}>
                    <Edit size={16} />
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(user.id)}>
                    <Trash2 size={16} />
                  </ActionButton>
                </ButtonGroup>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AddUser;