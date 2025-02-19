import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Edit, Trash2, Search, Download, Plus, Eye } from 'lucide-react';
import { fetchUsers, deleteUser, updateUser } from '../features/users/userSlice';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ExportButton = styled(Button)`
  &.MuiButton-root {
    background-color: #1a237e !important;
    color: white !important;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: none !important;
    padding: 8px 16px !important;
    border-radius: 8px !important;
  }
  
  &:hover {
    background-color: #0d1c5e !important;
  }
`;

const AddButton = styled(Button)`
  &.MuiButton-root {
    background-color: #4caf50 !important;
    color: white !important;
    display: flex;
    align-items: center;
    gap: 8px;
    text-transform: none !important;
    padding: 8px 16px !important;
    border-radius: 8px !important;
  }
  
  &:hover {
    background-color: #388e3c !important;
  }
`;

const ViewModal = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 15px rgba(0,0,0,0.1);
  z-index: 1000;
  padding: 24px;
  overflow-y: auto;
`;

const UserDetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
`;

const UserDetailLabel = styled.span`
  color: #64748b;
  font-weight: 500;
`;

const UserDetailValue = styled.span`
  color: #1a237e;
  font-weight: 600;
`;

const AllUser = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleStatusToggle = async (userId, isActive) => {
    setSelectedUser({ id: userId, isActive });
    setStatusConfirmOpen(true);
  };

  const confirmStatusToggle = async () => {
    try {
      await dispatch(updateUser({ 
        id: selectedUser.id, 
        userData: { isActive: !selectedUser.isActive } 
      })).unwrap();
      dispatch(fetchUsers());
      toast.success(`User status ${selectedUser.isActive ? 'deactivated' : 'activated'} successfully`);
      setStatusConfirmOpen(false);
    } catch (error) {
      toast.error('Error updating user status');
      console.error('Error updating user status:', error);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleDelete = (userId) => {
    setSelectedUser({ id: userId });
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteUser(selectedUser.id)).unwrap();
      dispatch(fetchUsers());
      toast.success('User deleted successfully');
      setDeleteConfirmOpen(false);
    } catch (error) {
      toast.error('Error deleting user');
      console.error('Error deleting user:', error);
    }
  };

  const handleAddUser = () => {
    navigate('/users/add');
  };

  const handleExport = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Email", "Role", "Created At", "Status"];
    const tableRows = filteredUsers.map(user => [
      `${user.firstName} ${user.lastName}`,
      user.email,
      user.role.name,
      new Date(user.createdAt).toLocaleString(),
      user.isActive ? 'Active' : 'Inactive'
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'striped',
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 50 },
        2: { cellWidth: 30 },
        3: { cellWidth: 40 },
        4: { cellWidth: 30 }
      },
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [26, 35, 126],
        textColor: 255
      }
    });

    doc.text("Users Report", 14, 15);
    doc.save(`users_export_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return 'Loading...';
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={statusConfirmOpen}
        onClose={() => setStatusConfirmOpen(false)}
      >
        <DialogTitle>Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure you want to ${selectedUser?.isActive ? 'deactivate' : 'activate'} this user?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusConfirmOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmStatusToggle} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {viewModalOpen && selectedUser && (
        <ViewModal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, color: '#1a237e' }}>User Details</h2>
            <Button onClick={() => setViewModalOpen(false)} style={{ color: '#64748b' }}>
              Close
            </Button>
          </div>
          <Avatar style={{ width: '100px', height: '100px', fontSize: '32px', margin: '0 auto 24px' }}>
            {getInitials(`${selectedUser.firstName} ${selectedUser.lastName}`)}
          </Avatar>
          <UserDetailRow>
            <UserDetailLabel>First Name</UserDetailLabel>
            <UserDetailValue>{`${selectedUser.firstName}`}</UserDetailValue>
          </UserDetailRow>
          <UserDetailRow>
            <UserDetailLabel>Last Name</UserDetailLabel>
            <UserDetailValue>{`${selectedUser.lastName}`}</UserDetailValue>
          </UserDetailRow>
          <UserDetailRow>
            <UserDetailLabel>Phone</UserDetailLabel>
            <UserDetailValue>{`${selectedUser.phone}`}</UserDetailValue>
          </UserDetailRow>
          <UserDetailRow>
            <UserDetailLabel>Email</UserDetailLabel>
            <UserDetailValue>{selectedUser.email}</UserDetailValue>
          </UserDetailRow>
          <UserDetailRow>
            <UserDetailLabel>Role</UserDetailLabel>
            <UserDetailValue>{selectedUser.role.name}</UserDetailValue>
          </UserDetailRow>
          <UserDetailRow>
            <UserDetailLabel>Status</UserDetailLabel>
            <UserDetailValue>{selectedUser.isActive ? 'Active' : 'Inactive'}</UserDetailValue>
          </UserDetailRow>
          <UserDetailRow>
            <UserDetailLabel>Created At</UserDetailLabel>
            <UserDetailValue>{new Date(selectedUser.createdAt).toLocaleString()}</UserDetailValue>
          </UserDetailRow>
        </ViewModal>
      )}

      <Header>
        <Title>Users</Title>
        <ButtonGroup>
          <ExportButton onClick={handleExport}>
            <Download size={16} />
            Export
          </ExportButton>
          <AddButton onClick={handleAddUser}>
            <Plus size={16} />
            Add User
          </AddButton>
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
            onChange={(e) =>             setSearchTerm(e.target.value)}
            placeholder="Search users..."
          />
        </div>
      </FilterSection>

      <Table>
        <thead>
          <tr>
            <Th>Avatar</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Created At</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user._id}>
              <Td>
                <Avatar>{getInitials(`${user.firstName} ${user.lastName}`)}</Avatar>
              </Td>
              <Td>{`${user.firstName} ${user.lastName}`}</Td>
              <Td>{user.email}</Td>
              <Td>{user.role.name}</Td>
              <Td>{new Date(user.createdAt).toLocaleString()}</Td>
              <Td>
                <Toggle>
                  <ToggleInput
                    type="checkbox"
                    checked={user.isActive}
                    onChange={() => handleStatusToggle(user._id, user.isActive)}
                  />
                  <ToggleSlider />
                </Toggle>
              </Td>
              <Td>
                <ButtonGroup>
                  <ActionButton onClick={() => handleView(user)}>
                    <Eye size={16} />
                  </ActionButton>
                  <ActionButton onClick={() => handleDelete(user._id)}>
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

export default AllUser;