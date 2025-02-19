import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled, { keyframes } from 'styled-components';
import { Plus, X, Package, Trash2, Pencil } from 'lucide-react';
import { fetchTags, createTag, updateTag, deleteTag, updateTagStatus, bulkDeleteTags } from '../features/tags/tagSlice';
import { toast } from 'react-hot-toast';

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
`;

const Table = styled.table`
  width: 100%;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  font-size: 0.875rem;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
`;

const Td = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #1a202c;
  border-bottom: 1px solid #e2e8f0;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.primary ? '#000' : 'white'};
  color: ${props => props.primary ? 'white' : '#1a202c'};
  border: 1px solid ${props => props.primary ? '#000' : '#e2e8f0'};
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.primary ? '#1a1a1a' : '#f7fafc'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
`;

const ModalText = styled.p`
  color: #4a5568;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #718096;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #4a5568;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
  }

  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    background: #f8fafc;
    outline: none;

    &:focus {
      border-color: #4299e1;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  color: #a0aec0;
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: #4a5568;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

const SkeletonRow = styled.tr`
  td {
    position: relative;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #f0f0f0 25%, #f7f7f7 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: ${shimmer} 1.5s infinite;
    }
  }
`;

const SkeletonCell = styled.div`
  height: 20px;
  width: ${props => props.width || '100%'};
  background: #f0f0f0;
  border-radius: 4px;
  margin: 0.5rem 0;
`;

const SearchInput = styled.input`
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  outline: none;
  width: 240px;
  margin-bottom: 1rem;

  &:focus {
    border-color: #4299e1;
  }
`;

const TagsProduct = () => {
  const dispatch = useDispatch();
  const { tags, loading } = useSelector((state) => state.tag);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    isActive: true
  });

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
      isActive: true
    });
    setEditingTag(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagData = {
        ...formData,
        metaKeywords: formData.metaKeywords.split(',').map(k => k.trim()).filter(Boolean)
      };

      if (editingTag) {
        await dispatch(updateTag({
          id: editingTag._id,
          tagData
        })).unwrap();
        toast.success('Tag updated successfully');
        dispatch(fetchTags());
      } else {
        await dispatch(createTag(tagData)).unwrap();
        toast.success('Tag created successfully');
        dispatch(fetchTags());
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.message || (editingTag ? 'Failed to update tag' : 'Failed to create tag'));
    }
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      description: tag.description || '',
      metaTitle: tag.metaTitle || '',
      metaDescription: tag.metaDescription || '',
      metaKeywords: tag.metaKeywords?.join(', ') || '',
      isActive: tag.isActive
    });
    setIsModalOpen(true);
  };

  const handleStatusChange = (tag, newStatus) => {
    setConfirmAction({
      type: 'status',
      tag,
      newStatus,
      message: `Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this tag?`
    });
    setIsConfirmModalOpen(true);
  };

  const handleDeleteClick = (tag) => {
    setConfirmAction({
      type: 'delete',
      tag,
      message: 'Are you sure you want to delete this tag?'
    });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmAction.type === 'delete') {
        await dispatch(deleteTag(confirmAction.tag._id)).unwrap();
        toast.success('Tag deleted successfully');
      } else if (confirmAction.type === 'status') {
        await dispatch(updateTagStatus({
          id: confirmAction.tag._id,
          status: confirmAction.newStatus
        })).unwrap();
        toast.success('Tag status updated successfully');
      }
      dispatch(fetchTags());
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
  };

  const renderSkeletonLoader = () => (
    <Table>
      <thead>
        <tr>
          <Th>Name</Th>
          <Th>Description</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3].map((index) => (
          <SkeletonRow key={index}>
            <Td><SkeletonCell width="150px" /></Td>
            <Td><SkeletonCell /></Td>
            <Td><SkeletonCell width="44px" /></Td>
            <Td><SkeletonCell width="120px" /></Td>
          </SkeletonRow>
        ))}
      </tbody>
    </Table>
  );

  const filteredTags = tags.filter(tag => 
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (tag.description && tag.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderContent = () => {
    if (loading) {
      return renderSkeletonLoader();
    }

    if (!Array.isArray(tags) || tags.length === 0) {
      return (
        <EmptyState>
          <EmptyStateIcon>
            <Package size={48} />
          </EmptyStateIcon>
          <EmptyStateText>No tags found</EmptyStateText>
          <Button primary onClick={() => setIsModalOpen(true)}>
            <Plus size={16} />
            Add Your First Tag
          </Button>
        </EmptyState>
      );
    }

    return (
      <>
        <SearchInput
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredTags.map((tag) => (
              <tr key={tag._id}>
                <Td>{tag.name}</Td>
                <Td>{tag.description}</Td>
                <Td>
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      checked={tag.isActive}
                      onChange={(e) => handleStatusChange(tag, e.target.checked)}
                    />
                    <span className="slider" />
                  </ToggleSwitch>
                </Td>
                <Td>
                  <ButtonGroup>
                    <Button onClick={() => handleEdit(tag)}>
                      <Pencil size={16} />
                      Edit
                    </Button>
                    <Button onClick={() => handleDeleteClick(tag)}>
                      <Trash2 size={16} />
                      Delete
                    </Button>
                  </ButtonGroup>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  };

  return (
    <Container>
      <Header>
        <Title>Tags</Title>
        <Button primary onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          Add Tag
        </Button>
      </Header>

      {renderContent()}

      {isModalOpen && (
        <Modal>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingTag ? 'Edit Tag' : 'Add Tag'}
            </ModalTitle>
            <CloseButton onClick={() => {
              setIsModalOpen(false);
              resetForm();
            }}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Enter tag name"
                required
              />
            </FormGroup>

            <FormGroup>
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
                placeholder="Enter tag description"
              />
            </FormGroup>

            <FormGroup>
              <label>Meta Title</label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metaTitle: e.target.value
                }))}
                placeholder="Enter meta title"
              />
            </FormGroup>

            <FormGroup>
              <label>Meta Description</label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metaDescription: e.target.value
                }))}
                placeholder="Enter meta description"
              />
            </FormGroup>

            <FormGroup>
              <label>Meta Keywords</label>
              <input
                type="text"
                value={formData.metaKeywords}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  metaKeywords: e.target.value
                }))}
                placeholder="Enter keywords separated by commas"
              />
            </FormGroup>

            <FormGroup>
              <label>Status</label>
              <div style={{ marginTop: '0.5rem' }}>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      isActive: e.target.checked
                    }))}
                  />
                  <span className="slider" />
                </ToggleSwitch>
              </div>
            </FormGroup>

            <ButtonGroup>
              <Button type="button" onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button type="submit" primary disabled={loading}>
                {loading ? 'Saving...' : editingTag ? 'Update' : 'Save'}
              </Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
    )}

    {isConfirmModalOpen && (
      <Modal>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Confirm Action</ModalTitle>
            <CloseButton onClick={() => {
              setIsConfirmModalOpen(false);
              setConfirmAction(null);
            }}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>

          <ModalText>{confirmAction?.message}</ModalText>

          <ButtonGroup>
            <Button onClick={() => {
              setIsConfirmModalOpen(false);
              setConfirmAction(null);
            }}>
              Cancel
            </Button>
            <Button primary onClick={handleConfirmAction}>
              Confirm
            </Button>
          </ButtonGroup>
        </ModalContent>
      </Modal>
    )}
  </Container>
);
};

export default TagsProduct;