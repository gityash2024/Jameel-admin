import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedia, uploadMedia, deleteMedia } from '../features/media/mediaSlice';
import styled from 'styled-components';
import { Plus, X, Trash2, Download, FileImage } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Container = styled.div`
  padding: 2rem;
  background: white;
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
`;

const AddButton = styled.button`
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
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  outline: none;
  width: 300px;
  font-size: 0.875rem;
  &::placeholder {
    color: #a0aec0;
  }
  &:focus {
    border-color: #4299e1;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  outline: none;
  background: white;
  min-width: 150px;
  cursor: pointer;
  &:focus {
    border-color: #4299e1;
  }
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const NoMediaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  text-align: center;
`;

const MediaCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
  position: relative;
  transition: all 0.2s;
  &:hover {
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }
`;

const MediaThumbnail = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const MediaInfo = styled.div`
  padding: 1rem;
`;

const MediaName = styled.h3`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MediaMeta = styled.p`
  font-size: 0.75rem;
  color: #718096;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: rgba(255,255,255,0.8);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: rgba(255,255,255,1);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.5rem;
  width: 500px;
  padding: 2rem;
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
`;

const ModalCloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  border: 2px dashed #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-bottom: 1rem;
  &:hover {
    border-color: #4299e1;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #1a202c;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  button {
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 0.375rem;
    cursor: pointer;
    &.active {
      background: #1a202c;
      color: white;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const Media = () => {
  const dispatch = useDispatch();
  const { media, loading, total, currentPage, totalPages } = useSelector((state) => state.media);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState('');
  const [mediaForm, setMediaForm] = useState({
    folder: 'general',
    alt: '',
    caption: '',
    type: 'image'
  });
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    folder: ''
  });

  useEffect(() => {
    dispatch(fetchMedia({
      page: currentPage,
      ...filters
    }));
  }, [dispatch, currentPage, filters]);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const response = await axios.post(
        "https://chirag-backend.onrender.com/api/files/upload",
        formData
      );

      if (response.data?.fileUrl) {
        await dispatch(uploadMedia({
          url: response.data.fileUrl,
          type: mediaForm.type,
          folder: mediaForm.folder,
          alt: mediaForm.alt,
          caption: mediaForm.caption
        })).unwrap();

        setIsUploadModalOpen(false);
        setSelectedFile(null);
        setSelectedFileUrl('');
        setMediaForm({
          folder: 'general',
          alt: '',
          caption: '',
          type: 'image'
        });
      }
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const handleDeleteMedia = async (id) => {
    try {
      await dispatch(deleteMedia(id)).unwrap();
    } catch (error) {
      toast.error('Failed to delete media');
    }
  };

  const renderUploadModal = () => (
    <Modal>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Upload Media</ModalTitle>
          <ModalCloseButton onClick={() => setIsUploadModalOpen(false)}>
            <X size={24} />
          </ModalCloseButton>
        </ModalHeader>

        <FileInput
          type="file"
          id="file-upload"
          onChange={handleFileSelect}
          accept="image/*,video/*,application/pdf"
        />
        <FileInputLabel htmlFor="file-upload">
          <Plus size={24} />
          <span style={{ marginLeft: '0.5rem' }}>
            {selectedFile ? selectedFile.name : 'Click or drag file to upload'}
          </span>
        </FileInputLabel>

        <FormGroup>
          <label>File Type</label>
          <select
            value={mediaForm.type}
            onChange={(e) => setMediaForm(prev => ({
              ...prev,
              type: e.target.value
            }))}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label>Folder</label>
          <select
            value={mediaForm.folder}
            onChange={(e) => setMediaForm(prev => ({
              ...prev,
              folder: e.target.value
            }))}
          >
            <option value="general">General</option>
            <option value="products">Products</option>
            <option value="blogs">Blogs</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label>Alt Text</label>
          <input
            type="text"
            value={mediaForm.alt}
            onChange={(e) => setMediaForm(prev => ({
              ...prev,
              alt: e.target.value
            }))}
            placeholder="Enter alt text"
          />
        </FormGroup>

        <FormGroup>
          <label>Caption</label>
          <input
            type="text"
            value={mediaForm.caption}
            onChange={(e) => setMediaForm(prev => ({
              ...prev,
              caption: e.target.value
            }))}
            placeholder="Enter caption"
          />
        </FormGroup>

        <SubmitButton onClick={handleSubmit} disabled={!selectedFile}>
          Upload
        </SubmitButton>
      </ModalContent>
    </Modal>
  );

  return (
    <Container>
      <Header>
        <h1>Media Library</h1>
        <AddButton onClick={() => setIsUploadModalOpen(true)}>
          <Plus size={16} />
          Add Media
        </AddButton>
      </Header>

      <Controls>
        <SearchInput
          type="text"
          placeholder="Search media"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            search: e.target.value
          }))}
        />
        <FilterSelect
          value={filters.type}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            type: e.target.value
          }))}
        >
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
        </FilterSelect>
      </Controls>

      {loading ? (
        <NoMediaContainer>Loading...</NoMediaContainer>
      ) : media.length === 0 ? (
        <NoMediaContainer>
          <FileImage size={48} />
          <p style={{ marginTop: '1rem', color: '#718096' }}>No media files found</p>
          <AddButton onClick={() => setIsUploadModalOpen(true)} style={{ marginTop: '1rem' }}>
            <Plus size={16} />
            Add Media
          </AddButton>
        </NoMediaContainer>
      ) : (
        <>
          <MediaGrid>
            {media.map((item) => (
              <MediaCard key={item._id}>
                <ActionButtons>
                  <ActionButton onClick={() => {
                    const link = document.createElement('a');
                    link.href = item.url;
                    link.download = item.fileName;
                    link.click();
                  }}>
                    <Download size={16} />
                  </ActionButton>
                  <ActionButton onClick={() => handleDeleteMedia(item._id)}>
                    <Trash2 size={16} />
                  </ActionButton>
                </ActionButtons>
                {item.fileType === 'image' ? (
                  <MediaThumbnail src={item.url} alt={item.alt || item.fileName} />
                ) : (
                  <MediaThumbnail 
                    src="/file-placeholder.svg" 
                    alt="File placeholder" 
                  />
                )}
                <MediaInfo>
                  <MediaName>{item.fileName}</MediaName>
                  <MediaMeta>{item.fileType}</MediaMeta>
                </MediaInfo>
              </MediaCard>
            ))}
          </MediaGrid>

          <Pagination>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={page === currentPage ? 'active' : ''}
                onClick={() => dispatch(fetchMedia({ page }))}
              >
                {page}
              </button>
            ))}
          </Pagination>
        </>
      )}

      {isUploadModalOpen && renderUploadModal()}
    </Container>
  );
};

export default Media;