import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Download, Upload, Plus, Pencil, Trash2, X } from 'lucide-react';
import { fetchTags, createTag, updateTag, deleteTag, updateTagStatus, bulkDeleteTags } from '../features/tags/tagSlice';
import { toast } from 'react-hot-toast';

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
  background: ${props => props.primary ? '#000' : 'white'};
  color: ${props => props.primary ? 'white' : '#1a202c'};
  font-size: 0.875rem;

  &:hover {
    background: ${props => props.primary ? '#1a1a1a' : '#f7fafc'};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
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
  z-index: 50;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a202c;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4a5568;
    font-size: 0.875rem;
    font-weight: 500;
  }

  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    font-size: 0.875rem;

    &:focus {
      outline: none;
      border-color: #4299e1;
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const TagsProduct = () => {
  const dispatch = useDispatch();
  const { tags, loading } = useSelector((state) => state.tag);
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [selectedTags, setSelectedTags] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
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

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await dispatch(updateTagStatus({ id, status: !currentStatus })).unwrap();
      toast.success('Tag status updated successfully');
    } catch (error) {
      toast.error('Failed to update tag status');
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
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      try {
        await dispatch(deleteTag(id)).unwrap();
        toast.success('Tag deleted successfully');
      } catch (error) {
        toast.error('Failed to delete tag');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTags.length === 0) {
      toast.error('Please select tags to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedTags.length} tags?`)) {
      try {
        await dispatch(bulkDeleteTags(selectedTags)).unwrap();
        setSelectedTags([]);
        toast.success('Tags deleted successfully');
      } catch (error) {
        toast.error('Failed to delete tags');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tagData = {
      ...formData,
      metaKeywords: formData.metaKeywords.split(',').map(k => k.trim())
    };

    try {
      if (editingTag) {
        await dispatch(updateTag({ id: editingTag._id, tagData })).unwrap();
        toast.success('Tag updated successfully');
      } else {
        await dispatch(createTag(tagData)).unwrap();
        toast.success('Tag created successfully');
      }
      setModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(editingTag ? 'Failed to update tag' : 'Failed to create tag');
    }
  };

  const handleSelectAll = (e) => {
    setSelectedTags(e.target.checked ? tags.map(tag => tag._id) : []);
  };

  const handleSelectTag = (id) => {
    setSelectedTags(prev => 
      prev.includes(id) 
        ? prev.filter(tagId => tagId !== id)
        : [...prev, id]
    );
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Header>
        <h1>Tags</h1>
        <div className="button-group">
          <Button onClick={handleBulkDelete} disabled={selectedTags.length === 0}>
            <Trash2 size={16} />
            Delete Selected
          </Button>
          <Button onClick={() => { resetForm(); setModalOpen(true); }}>
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
                checked={selectedTags.length === tags.length}
                onChange={handleSelectAll}
              />
            </Th>
            <Th>Name</Th>
            <Th>Created At</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </tr>
        </thead>
        <tbody>
          {filteredTags.map(tag => (
            <tr key={tag._id}>
              <Td>
                <CheckboxInput
                  type="checkbox"
                  checked={selectedTags.includes(tag._id)}
                  onChange={() => handleSelectTag(tag._id)}
                />
              </Td>
              <Td>{tag.name}</Td>
              <Td>{new Date(tag.createdAt).toLocaleString()}</Td>
              <Td>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={tag.isActive}
                    onChange={() => handleToggleStatus(tag._id, tag.isActive)}
                  />
                  <span className="slider" />
                </ToggleSwitch>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <ActionButton onClick={() => handleEdit(tag)}>
                    <Pencil size={16} />
                  </ActionButton>
                  <ActionButton delete onClick={() => handleDelete(tag._id)}>
                    <Trash2 size={16} />
                  </ActionButton>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {modalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h2>{editingTag ? 'Edit Tag' : 'Add Tag'}</h2>
              <Button onClick={() => { setModalOpen(false); resetForm(); }}>
                <X size={16} />
              </Button>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <label>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </FormGroup>
              <FormGroup>
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </FormGroup>
              <FormGroup>
                <label>Meta Title</label>
                <input
                  type="text"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                />
              </FormGroup>
              <FormGroup>
                <label>Meta Description</label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                />
              </FormGroup>
              <FormGroup>
                <label>Meta Keywords</label>
                <input
                  type="text"
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaKeywords: e.target.value }))}
                  placeholder="Enter keywords separated by commas"
                />
              </FormGroup>
              <FormGroup>
                <label>Status</label>
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <span className="slider" />
                </ToggleSwitch>
              </FormGroup>
              <ButtonGroup>
                <Button type="button" onClick={() => { setModalOpen(false); resetForm(); }}>
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
    </Container>
  );
};

export default TagsProduct;