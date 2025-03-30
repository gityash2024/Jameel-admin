import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, createBlog, updateBlog, deleteBlog, updateBlogStatus } from '../features/blog/blogSlice';
import styled from 'styled-components';
import { Plus, Pencil, Trash2, Eye, FileText, X, Calendar, User, Tag, ThumbsUp, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { resetModal } from '../features/blog/blogSlice';
import { API_URL } from '../config/constants';

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
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  color: #1a202c;
  font-size: 0.875rem;
`;

const BlogImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 0.25rem;
  object-fit: cover;
`;

const ActionButton = styled.button`
  padding: 0.25rem;
  color: ${props => {
    if (props.delete) return '#EF4444';
    if (props.edit) return '#3B82F6';
    return '#10B981';
  }};
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
  width: 800px;
  max-height: 90vh;
  overflow-y: auto;
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

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  &:hover {
    color: #4a5568;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  input, select, textarea {
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
  .quill {
    .ql-container {
      height: 200px;
    }
  }
`;

const ImageUpload = styled.div`
  border: 2px dashed #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  cursor: pointer;
  &:hover {
    border-color: #4299e1;
  }
  img {
    max-width: 100%;
    max-height: 200px;
    margin-top: 1rem;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #1a202c;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background: #2d3748;
  }
  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }
`;

const NoDataContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  text-align: center;
  color: #718096;
`;

const DeleteModal = styled.div`
  background: white;
  border-radius: 0.5rem;
  width: 400px;
  padding: 2rem;
  text-align: center;
`;

const DeleteText = styled.p`
  margin-bottom: 2rem;
  color: #4a5568;
`;

const DeleteButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const DeleteButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  background: ${props => props.cancel ? '#EDF2F7' : '#EF4444'};
  color: ${props => props.cancel ? '#4A5568' : 'white'};
  border: none;
  cursor: pointer;
  &:hover {
    background: ${props => props.cancel ? '#E2E8F0' : '#E53E3E'};
  }
`;

const DetailsSidebar = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 450px;
  height: 100%;
  background: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  overflow-y: auto;
  transform: translateX(${props => props.isOpen ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
`;

const DetailsSidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
`;

const DetailsSidebarContent = styled.div`
  padding: 1.5rem;
`;

const DetailsSidebarTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const DetailsSidebarCloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #718096;
  &:hover {
    color: #4a5568;
  }
`;

const DetailImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
`;

const DetailItem = styled.div`
  margin-bottom: 1.5rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: #718096;
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.div`
  font-size: 0.9375rem;
  color: #2d3748;
`;

const MetaInfoBox = styled.div`
  background: #f8fafc;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1.5rem;
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const TagItem = styled.span`
  background: #e2e8f0;
  color: #4a5568;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
`;

const ContentPreview = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-top: 0.5rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    if (props.status === 'published') return '#E6FFFA';
    if (props.status === 'draft') return '#EBF8FF';
    return '#FFF5F5';
  }};
  color: ${props => {
    if (props.status === 'published') return '#38B2AC';
    if (props.status === 'draft') return '#4299E1';
    return '#F56565';
  }};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #718096;
`;

const Blogs = () => {
  const dispatch = useDispatch();
  const { blogs, loading, total, currentPage, totalPages } = useSelector((state) => state.blogs);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    summary: '',
    status: 'draft',
    featuredImage: null,
    categories: [],
    tags: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    isFeature: false
  });
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  
  const [isDetailSidebarOpen, setIsDetailSidebarOpen] = useState(false);
  const [viewBlog, setViewBlog] = useState(null);

  useEffect(() => {
    dispatch(fetchBlogs({
      page: currentPage,
      search: searchQuery
    }));
  }, [dispatch, currentPage, searchQuery]);

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch(
        `${API_URL}/api/v1/media/upload`,
        {
          method: "POST",
          body: formData
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Upload failed: ${errorData.message || response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Upload response:", data);
      
      if (!data.data || !data.data.fileUrl) {
        throw new Error('Invalid response format from server');
      }
      
      return data.data.fileUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(`Failed to upload image: ${error.message}`);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!blogForm.title || !blogForm.content || !blogForm.summary) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (selectedBlog) {
        await dispatch(updateBlog({
          id: selectedBlog._id,
          data: blogForm
        })).unwrap();
      } else {
        await dispatch(createBlog(blogForm)).unwrap();
      }
      dispatch(resetModal());
      resetForm();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save blog');
    }
  };
  
  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setBlogForm({
      title: blog.title,
      content: blog.content,
      summary: blog.summary,
      status: blog.status,
      featuredImage: blog.featuredImage?.url || null,
      categories: blog.categories || [],
      tags: blog.tags || [],
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || '',
      metaKeywords: blog.metaKeywords || [],
      isFeature: blog.isFeature || false
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (blogToDelete) {
      try {
        await dispatch(deleteBlog(blogToDelete._id)).unwrap();
        toast.success('Blog deleted successfully');
      } catch (error) {
        toast.error('Failed to delete blog');
      } finally {
        setIsDeleteModalOpen(false);
        setBlogToDelete(null);
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await dispatch(updateBlogStatus({
        id,
        status: currentStatus === 'published' ? 'draft' : 'published'
      })).unwrap();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleViewDetails = (blog) => {
    setViewBlog(blog);
    setIsDetailSidebarOpen(true);
  };

  const resetForm = () => {
    setSelectedBlog(null);
    setBlogForm({
      title: '',
      content: '',
      summary: '',
      status: 'draft',
      featuredImage: null,
      categories: [],
      tags: [],
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
      isFeature: false
    });
  };

  const renderBlogForm = () => (
    <Modal>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {selectedBlog ? 'Edit Blog' : 'Create New Blog'}
          </ModalTitle>
          <CloseButton onClick={() => {
            setIsModalOpen(false);
            resetForm();
          }}>×</CloseButton>
        </ModalHeader>

        <FormGroup>
          <label>Title*</label>
          <input
            type="text"
            value={blogForm.title}
            onChange={(e) => setBlogForm(prev => ({
              ...prev,
              title: e.target.value
            }))}
            placeholder="Enter blog title"
          />
        </FormGroup>

        <FormGroup>
          <label>Featured Image</label>
          <ImageUpload>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleImageUpload(e.target.files[0]).then(url => {
                    if (url) {
                      setBlogForm(prev => ({
                        ...prev,
                        featuredImage: url
                      }));
                    }
                  });
                }
              }}
              style={{ display: 'none' }}
              id="image-upload"
            />
            <label htmlFor="image-upload">
              {blogForm.featuredImage ? (
                <img src={blogForm.featuredImage} alt="Preview" />
              ) : (
                <div>Click or drag to upload image</div>
              )}
            </label>
          </ImageUpload>
        </FormGroup>

        <FormGroup>
          <label>Summary*</label>
          <textarea
            rows="3"
            value={blogForm.summary}
            onChange={(e) => setBlogForm(prev => ({
              ...prev,
              summary: e.target.value
            }))}
            placeholder="Enter blog summary"
          />
        </FormGroup>

        <FormGroup>
          <label>Content*</label>
          <ReactQuill
            value={blogForm.content}
            onChange={(content) => setBlogForm(prev => ({
              ...prev,
              content
            }))}
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
              ]
            }}
          />
        </FormGroup>

        <FormGroup>
          <label>Status</label>
          <select
            value={blogForm.status}
            onChange={(e) => setBlogForm(prev => ({
              ...prev,
              status: e.target.value
            }))}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label>Meta Title</label>
          <input
            type="text"
            value={blogForm.metaTitle}
            onChange={(e) => setBlogForm(prev => ({
              ...prev,
              metaTitle: e.target.value
            }))}
            placeholder="Enter meta title"
          />
        </FormGroup>

        <FormGroup>
          <label>Meta Description</label>
          <textarea
            rows="2"
            value={blogForm.metaDescription}
            onChange={(e) => setBlogForm(prev => ({
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
            value={blogForm.metaKeywords.join(', ')}
            onChange={(e) => setBlogForm(prev => ({
              ...prev,
              metaKeywords: e.target.value.split(',').map(k => k.trim())
            }))}
            placeholder="Enter keywords separated by commas"
          />
        </FormGroup>

        <FormGroup>
          <label>
            <input
              type="checkbox"
              checked={blogForm.isFeature}
              onChange={(e) => setBlogForm(prev => ({
                ...prev,
                isFeature: e.target.checked
              }))}
            />
            Featured Blog
          </label>
        </FormGroup>

        <SubmitButton onClick={handleSubmit}>
          {selectedBlog ? 'Update Blog' : 'Create Blog'}
        </SubmitButton>
      </ModalContent>
    </Modal>
  );

  const renderDeleteConfirmation = () => (
    <Modal>
      <DeleteModal>
        <ModalHeader>
          <ModalTitle>Delete Blog</ModalTitle>
          <CloseButton onClick={() => setIsDeleteModalOpen(false)}>×</CloseButton>
        </ModalHeader>
        <DeleteText>
          Are you sure you want to delete "{blogToDelete?.title}"? This action cannot be undone.
        </DeleteText>
        <DeleteButtons>
          <DeleteButton cancel onClick={() => setIsDeleteModalOpen(false)}>
            Cancel
          </DeleteButton>
          <DeleteButton onClick={confirmDelete}>
            Delete
          </DeleteButton>
        </DeleteButtons>
      </DeleteModal>
    </Modal>
  );

  const renderDetailsSidebar = () => (
    <DetailsSidebar isOpen={isDetailSidebarOpen}>
      <DetailsSidebarHeader>
        <ModalTitle>Blog Details</ModalTitle>
        <DetailsSidebarCloseButton onClick={() => setIsDetailSidebarOpen(false)}>
          <X size={20} />
        </DetailsSidebarCloseButton>
      </DetailsSidebarHeader>
      
      <DetailsSidebarContent>
        {viewBlog && (
          <>
            {viewBlog.featuredImage?.url && (
              <DetailImage src={viewBlog.featuredImage.url} alt={viewBlog.title} />
            )}
            
            <DetailsSidebarTitle>{viewBlog.title}</DetailsSidebarTitle>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem' }}>
              <StatusBadge status={viewBlog.status}>
                {viewBlog.status.charAt(0).toUpperCase() + viewBlog.status.slice(1)}
              </StatusBadge>
              {viewBlog.isFeature && (
                <StatusBadge status="published">Featured</StatusBadge>
              )}
            </div>
            
            <InfoItem>
              <Calendar size={16} />
              Created: {new Date(viewBlog.createdAt).toLocaleString()}
            </InfoItem>
            
            <InfoItem>
              <Calendar size={16} />
              Updated: {new Date(viewBlog.updatedAt).toLocaleString()}
            </InfoItem>
            
            <InfoItem>
              <User size={16} />
              Author: {viewBlog.author?.firstName} {viewBlog.author?.lastName}
            </InfoItem>
            
            <InfoItem>
              <ThumbsUp size={16} />
              Likes: {viewBlog.likes?.length || 0}
            </InfoItem>
            
            <InfoItem>
              <Eye size={16} />
              Views: {viewBlog.viewCount || 0}
            </InfoItem>
            
            <DetailItem>
              <DetailLabel>Summary</DetailLabel>
              <DetailValue>{viewBlog.summary}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Content</DetailLabel>
              <ContentPreview dangerouslySetInnerHTML={{ __html: viewBlog.content }} />
            </DetailItem>
            
            {(viewBlog.categories?.length > 0 || viewBlog.tags?.length > 0) && (
              <DetailItem>
                <DetailLabel>Categories & Tags</DetailLabel>
                {viewBlog.categories?.length > 0 && (
                  <TagList>
                    {viewBlog.categories.map((category, index) => (
                      <TagItem key={`cat-${index}`}>{category}</TagItem>
                    ))}
                  </TagList>
                )}
                
                {viewBlog.tags?.length > 0 && (
                  <TagList style={{ marginTop: '0.5rem' }}>
                    {viewBlog.tags.map((tag, index) => (
                      <TagItem key={`tag-${index}`}>{tag}</TagItem>
                    ))}
                  </TagList>
                )}
              </DetailItem>
            )}
            
            <MetaInfoBox>
              <DetailItem>
                <DetailLabel>Meta Title</DetailLabel>
                <DetailValue>{viewBlog.metaTitle || '-'}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>Meta Description</DetailLabel>
                <DetailValue>{viewBlog.metaDescription || '-'}</DetailValue>
              </DetailItem>
              
              {viewBlog.metaKeywords?.length > 0 && (
                <DetailItem>
                  <DetailLabel>Meta Keywords</DetailLabel>
                  <TagList>
                    {viewBlog.metaKeywords.map((keyword, index) => (
                      <TagItem key={`keyword-${index}`}>{keyword}</TagItem>
                    ))}
                  </TagList>
                </DetailItem>
              )}
            </MetaInfoBox>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <SubmitButton 
                onClick={() => {
                  handleEdit(viewBlog);
                  setIsDetailSidebarOpen(false);
                }}
                style={{ flex: 1 }}
              >
                Edit Blog
              </SubmitButton>
              
              <DeleteButton 
                onClick={() => {
                  handleDeleteClick(viewBlog);
                  setIsDetailSidebarOpen(false);
                }}
                style={{ flex: 1 }}
              >
                Delete Blog
              </DeleteButton>
            </div>
          </>
        )}
      </DetailsSidebarContent>
    </DetailsSidebar>
  );

  return (
    <Container>
      <Header>
        <h1>Blogs</h1>
        <AddButton onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          Add Blog
        </AddButton>
      </Header>

      <Controls>
        <SearchInput
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Controls>

      {loading ? (
        <NoDataContainer>Loading...</NoDataContainer>
      ) : blogs.length === 0 ? (
        <NoDataContainer>
          <FileText size={48} />
          <p style={{ marginTop: '1rem' }}>No blogs found</p>
          <AddButton onClick={() => setIsModalOpen(true)} style={{ marginTop: '1rem' }}>
            <Plus size={16} />
            Create Your First Blog
          </AddButton>
        </NoDataContainer>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Image</Th>
              <Th>Title</Th>
              <Th>Created At</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id}>
                <Td>
                  <BlogImage 
                    src={blog.featuredImage?.[0] || '/placeholder.png'} 
                    alt={blog.title} 
                  />
                </Td>
                <Td>{blog.title}</Td>
                <Td>{new Date(blog.createdAt).toLocaleString()}</Td>
                <Td>
                  <ToggleSwitch>
                    <input
                      type="checkbox"
                      checked={blog.status === 'published'}
                      onChange={() => handleStatusToggle(blog._id, blog.status)}
                    />
                    <span className="slider" />
                  </ToggleSwitch>
                </Td>
                <Td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <ActionButton edit onClick={() => handleEdit(blog)}>
                      <Pencil size={16} />
                    </ActionButton>
                    <ActionButton delete onClick={() => handleDeleteClick(blog)}>
                      <Trash2 size={16} />
                    </ActionButton>
                    <ActionButton onClick={() => handleViewDetails(blog)}>
                      <Eye size={16} />
                    </ActionButton>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {isModalOpen && renderBlogForm()}
      {isDeleteModalOpen && renderDeleteConfirmation()}
      {isDetailSidebarOpen && renderDetailsSidebar()}
    </Container>
  );
};

export default Blogs;