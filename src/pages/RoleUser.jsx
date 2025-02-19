import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Lock, Plus, Search, Edit, Trash } from 'lucide-react'; 
import { useSelector, useDispatch } from 'react-redux';
import { fetchRoles, createRole, updateRole, deleteRole } from '../features/role/roleSlice';

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

const Input = styled.input`
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
`;

const ModalBody = styled.div`
  margin-bottom: 16px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  margin: 0;
`;

const permissions = ['read', 'write', 'update', 'delete', 'all'];

const RoleUser = () => {
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();
  const { roles, loading, error } = useSelector((state) => state.role);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleAddRole = () => {
    setSelectedRole(null);
    setName('');
    setSelectedPermissions([]);
    setOpen(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setName(role.name);
    setSelectedPermissions(role.permissions);
    setOpen(true);
  };

  const handleDeleteRole = (id) => {
    dispatch(deleteRole(id));
    setDeleteModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const roleData = { name, permissions: selectedPermissions };

    if (selectedRole) {
      dispatch(updateRole({ id: selectedRole._id, roleData }));
    } else {
      dispatch(createRole(roleData));
    }

    setOpen(false);
  };

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedPermissions.length === permissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissions);
    }
  };

  const isAllSelected = selectedPermissions.length === permissions.length;

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
          <Input
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
            <Th>Permissions</Th>
            <Th>Created At</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filteredRoles.map((role) => (
            <tr key={role._id}>
              <Td>{role.name}</Td>
              <Td>
                {role.permissions.includes('all')
                  ? 'All'
                  : role.permissions.join(', ')}
              </Td>
              <Td>{new Date(role.createdAt).toLocaleString()}</Td>
              <Td>
                <ActionButton onClick={() => handleEditRole(role)}>
                  <Edit size={16} />
                </ActionButton>
                <ActionButton onClick={() => {
                  setSelectedRole(role);
                  setDeleteModalOpen(true);
                }}>
                  <Trash size={16} />
                </ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {open && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{selectedRole ? 'Edit Role' : 'Create Role'}</ModalTitle>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <FormGroup>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Permissions</Label>
                  <CheckboxGroup>
                    <CheckboxLabel>
                      <Checkbox
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                      All
                    </CheckboxLabel>
                    {permissions.slice(0, -1).map((permission) => (
                      <CheckboxLabel key={permission}>
                        <Checkbox
                          checked={selectedPermissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions([
                                ...selectedPermissions,
                                permission,
                              ]);
                            } else {
                              setSelectedPermissions(
                                selectedPermissions.filter((p) => p !== permission)
                              );
                            }
                          }}
                          disabled={isAllSelected}
                        />
                        {permission}
                      </CheckboxLabel>
                    ))}
                  </CheckboxGroup>
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button type="button" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{selectedRole ? 'Update' : 'Create'}</Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      )}

      {deleteModalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Delete Role</ModalTitle>
              <Button onClick={() => setDeleteModalOpen(false)}>Close</Button>
            </ModalHeader>
            <ModalBody>
              Are you sure you want to delete the role "{selectedRole.name}"?
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
              <Button onClick={() => handleDeleteRole(selectedRole._id)}>Delete</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default RoleUser;