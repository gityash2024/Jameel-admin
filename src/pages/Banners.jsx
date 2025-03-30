import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Edit, Trash, Plus, Image as ImageIcon, Check, X, ArrowUp, ArrowDown, ExternalLink } from 'react-feather';
import LoadingSpinner from '../components/common/LoadingSpinner';

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
`;

const Button = styled.button`
  background-color: ${props => props.variant === 'outline' ? 'transparent' : '#000'};
  color: ${props => props.variant === 'outline' ? '#000' : '#fff'};
  border: ${props => props.variant === 'outline' ? '1px solid #000' : 'none'};
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
`;

const BannerCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: relative;
`;

const BannerImage = styled.div`
  height: 200px;
  background-color: #f1f5f9;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background-color: ${props => props.active ? '#10b981' : '#94a3b8'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
`;

const BannerContent = styled.div`
  padding: 16px;
`;

const BannerTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const BannerDescription = styled.p`
  color: #64748b;
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

const ActionButton = styled.button`
  background-color: ${props => props.variant === 'danger' ? '#ef4444' : '#f8fafc'};
  color: ${props => props.variant === 'danger' ? 'white' : '#64748b'};
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.variant === 'danger' ? '#dc2626' : '#f1f5f9'};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
`;

const ModalBody = styled.div`
  padding: 24px;
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  
  input {
    margin-right: 8px;
  }
`;

const ImagePreview = styled.div`
  margin-top: 12px;
  
  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 4px;
  }
`;

const ImageUploadContainer = styled.div`
  border: 2px dashed #e2e8f0;
  border-radius: 4px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  margin-bottom: 16px;
  
  &:hover {
    border-color: #cbd5e1;
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #64748b;
`;

const EmptyImage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 12px;
  color: #94a3b8;
`;

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentBanner, setCurrentBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    isActive: true,
    startDate: '',
    endDate: ''
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  
  useEffect(() => {
    fetchBanners();
  }, []);
  
  const fetchBanners = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/banners`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBanners(response.data.data.banners);
      setError(null);
    } catch (err) {
      console.error('Error fetching banners:', err);
      setError('Failed to load banners. Please try again.');
      toast.error('Failed to load banners');
    } finally {
      setFetchLoading(false);
    }
  };
  
  const handleCreateBanner = () => {
    setFormData({
      title: '',
      description: '',
      link: '',
      isActive: true,
      startDate: '',
      endDate: ''
    });
    setImage(null);
    setPreviewUrl('');
    setModalMode('create');
    setShowModal(true);
  };
  
  const handleEditBanner = (banner) => {
    setCurrentBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      link: banner.link || '',
      isActive: banner.isActive,
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : ''
    });
    setPreviewUrl(banner.image?.url || '');
    setModalMode('edit');
    setShowModal(true);
  };
  
  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/banners/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Banner deleted successfully');
      fetchBanners();
    } catch (err) {
      console.error('Error deleting banner:', err);
      toast.error('Failed to delete banner');
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/media/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      console.log("Upload response:", data);
      
      if (!data.data || !data.data.fileUrl) {
        throw new Error('Invalid response format from server');
      }

      // Store the original file reference for preview purposes
      setImage(file);
      
      // Set the preview URL from the response
      setPreviewUrl(data.data.fileUrl);
      
      setFormData((prev) => ({
        ...prev,
        image: {
          url: data.data.fileUrl,
          alt: prev.image?.alt || file.name,
        },
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Image upload error:', error);
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    // Validate image is present for new banners
    if (modalMode === 'create' && !image && !formData.image?.url) {
      toast.error('Please select an image for the banner');
      return;
    }
    
    // Set loading state
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const formDataObj = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          formDataObj.append(key, formData[key]);
        }
      });
      
      // Add image if exists
      if (image) {
        console.log('Adding image to form data:', {
          name: image.name,
          type: image.type,
          size: image.size
        });
        
        // Make sure the file field name matches what the backend expects
        formDataObj.append('image', image);
      }
      
      // Add image alt text
      formDataObj.append('alt', formData.title || 'Banner image');
      
      // Log form data contents (for debugging)
      console.log('Form data entries:');
      for (let [key, value] of formDataObj.entries()) {
        console.log(key, ':', typeof value === 'object' ? 'File object' : value);
      }
      
      // Create config with proper headers - don't set Content-Type, let browser set it with boundary
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`
          // Don't manually set Content-Type for multipart/form-data
          // The browser needs to set this with the proper boundary
        }
      };
      
      let response;
      
      if (modalMode === 'create') {
        console.log('Sending create banner request');
        response = await axios.post(`${API_URL}/banners`, formDataObj, config);
      } else {
        // For edit mode, if no new image is selected but there's an existing image URL
        // we need to pass the existing image URL to maintain it
        if (!image && previewUrl && currentBanner?.image?.url) {
          formDataObj.append('existingImageUrl', currentBanner.image.url);
          if (currentBanner.image.alt) {
            formDataObj.append('existingImageAlt', currentBanner.image.alt);
          }
        }
        
        console.log('Sending update banner request');
        response = await axios.patch(`${API_URL}/banners/${currentBanner._id}`, formDataObj, config);
      }
      
      if (response.data.status === 'success') {
        toast.success(`Banner ${modalMode === 'create' ? 'created' : 'updated'} successfully`);
        setShowModal(false);
        fetchBanners();
      }
    } catch (err) {
      console.error('Error saving banner:', err);
      // Extract the most useful error message possible
      let errorMessage = 'An unknown error occurred';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const renderModal = () => {
    if (!showModal) return null;
    
    return (
      <ModalOverlay onClick={() => setShowModal(false)}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>
              {modalMode === 'create' ? 'Create New Banner' : 'Edit Banner'}
            </ModalTitle>
            <ActionButton onClick={() => setShowModal(false)}>
              <X size={18} />
            </ActionButton>
          </ModalHeader>
          
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormGroup>
                <Label htmlFor="title">Title*</Label>
                <Input 
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="description">Description</Label>
                <TextArea 
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="image">Banner Image{modalMode === 'create' && '*'}</Label>
                <input 
                  type="file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                
                <ImageUploadContainer onClick={() => document.getElementById('image').click()}>
                  <ImageIcon size={32} />
                  <p>{previewUrl ? 'Change image' : 'Click to upload image'}</p>
                </ImageUploadContainer>
                
                {previewUrl && (
                  <ImagePreview>
                    <img src={previewUrl} alt="Preview" />
                  </ImagePreview>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="link">Link URL</Label>
                <Input 
                  type="url"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://"
                />
              </FormGroup>
              
              <FormGroup>
                <Checkbox>
                  <input 
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <Label htmlFor="isActive" style={{ margin: 0 }}>Active</Label>
                </Checkbox>
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="startDate">Start Date</Label>
                <Input 
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                />
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="endDate">End Date</Label>
                <Input 
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                />
              </FormGroup>
            </ModalBody>
            
            <ModalFooter>
              <Button type="button" onClick={() => setShowModal(false)} secondary>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <span>
                    <LoadingSpinner size={16} /> Loading...
                  </span>
                ) : (
                  modalMode === 'create' ? 'Create Banner' : 'Update Banner'
                )}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </ModalOverlay>
    );
  };
  
  if (fetchLoading) {
    return <Container>Loading banners...</Container>;
  }
  
  if (error) {
    return <Container>{error}</Container>;
  }
  
  return (
    <Container>
      <Header>
        <Title>Banner Management</Title>
        <Button onClick={handleCreateBanner}>
          <Plus size={18} />
          Add New Banner
        </Button>
      </Header>
      
      {banners.length === 0 ? (
        <NoResults>
          <ImageIcon size={48} />
          <p>No banners found. Click "Add New Banner" to create one.</p>
        </NoResults>
      ) : (
        <Grid>
          {banners.map(banner => (
            <BannerCard key={banner._id}>
              <BannerImage>
                {banner.image?.url ? (
                  <img src={banner.image.url} alt={banner.image.alt || banner.title} />
                ) : (
                  <EmptyImage>
                    <ImageIcon size={32} />
                    <p>No image</p>
                  </EmptyImage>
                )}
                <StatusBadge active={banner.isActive}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </StatusBadge>
              </BannerImage>
              
              <BannerContent>
                <BannerTitle>{banner.title}</BannerTitle>
                {banner.description && (
                  <BannerDescription>{banner.description}</BannerDescription>
                )}
                
                <Actions>
                  {banner.link && (
                    <ActionButton 
                      as="a" 
                      href={banner.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      title="Visit link"
                    >
                      <ExternalLink size={16} />
                    </ActionButton>
                  )}
                  <ActionButton onClick={() => handleEditBanner(banner)} title="Edit">
                    <Edit size={16} />
                  </ActionButton>
                  <ActionButton 
                    variant="danger" 
                    onClick={() => handleDeleteBanner(banner._id)}
                    title="Delete"
                  >
                    <Trash size={16} />
                  </ActionButton>
                </Actions>
              </BannerContent>
            </BannerCard>
          ))}
        </Grid>
      )}
      
      {renderModal()}
    </Container>
  );
};

export default Banners; 