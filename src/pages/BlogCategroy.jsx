import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronDown, ChevronRight, Image as ImageIcon, Plus, Folder, Search, X } from 'lucide-react';

const Container = styled.div`
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 2rem;
  padding: 2rem;
`;

const CategoryTreeSection = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 1rem;
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;

  h2 {
    font-size: 1rem;
    font-weight: 600;
    color: #1a202c;
  }
`;

const ActionDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #4a5568;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;

  &:hover {
    background: #f7fafc;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 50;
  min-width: 120px;
  overflow: hidden;

  button {
    display: block;
    width: 100%;
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.875rem;
    color: #4a5568;
    border: none;
    background: none;
    cursor: pointer;
    border-bottom: 1px solid #e2e8f0;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: #f7fafc;
      color: #1a202c;
    }
  }
`;

const SearchBox = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  outline: none;
  font-size: 0.875rem;

  &:focus {
    border-color: #4299e1;
  }
`;

const TreeItem = styled.div`
  margin: 0.25rem 0;
  
  .item-content {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    cursor: pointer;
    border-radius: 0.375rem;
    
    &:hover {
      background: #f7fafc;
    }
  }

  .label {
    margin-left: 0.5rem;
    font-size: 0.875rem;
    color: #4a5568;
  }
`;

const FormSection = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
`;

const FormHeader = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4a5568;
    font-size: 0.875rem;
  }

  &.required label:after {
    content: " *";
    color: #e53e3e;
  }

  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    background: #f8fafc;
    outline: none;
    font-size: 0.875rem;

    &:focus {
      border-color: #4299e1;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
`;

const ImageUpload = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4a5568;
    font-size: 0.875rem;
  }

  .upload-box {
    width: 100px;
    height: 100px;
    border: 2px dashed #e2e8f0;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: #f8fafc;

    &:hover {
      border-color: #4299e1;
    }
  }
`;

const ImagePreview = styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(0, 0, 0, 0.5);
    border: none;
    border-radius: 0.25rem;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    padding: 0;

    &:hover {
      background: rgba(0, 0, 0, 0.7);
    }
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

const SaveButton = styled.button`
  float: right;
  padding: 0.75rem 2rem;
  background: #000;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #1a1a1a;
  }
`;

const BlogCategory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryData, setCategoryData] = useState({
    name: '',
    description: '',
    parent: '',
    metaTitle: '',
    metaDescription: '',
    status: true
  });
  const [expandedItems, setExpandedItems] = useState(['']);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryIcon, setCategoryIcon] = useState(null);

  const categories = [
    { id: 1, name: 'Baby Essentials', parent: null },
    { id: 2, name: 'Bag Emporium', parent: null },
    { id: 3, name: 'Books', parent: null },
    { id: 4, name: 'Christmas', parent: null },
    { id: 5, name: 'Classic Furnishings', parent: null },
    { id: 6, name: 'Crystal Clarity Optics', parent: null },
    { id: 7, name: 'Fashion', parent: null },
    { id: 8, name: 'Fit Gear Central', parent: null },
    { id: 9, name: 'Flowers', parent: null },
    { id: 10, name: 'Green Haven Nursery', parent: null },
    { id: 11, name: 'Hybrid Bicycle', parent: null },
    { id: 12, name: 'Lingerie', parent: null },
    { id: 13, name: 'Marijuana', parent: null }
  ];

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.action-dropdown')) {
        setIsActionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleExpand = (id) => {
    setExpandedItems(prev => 
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleActionClick = (action) => {
    setIsActionDropdownOpen(false);
    switch (action) {
      case 'edit':
        console.log('Edit category');
        break;
      case 'delete':
        console.log('Delete category');
        break;
      case 'clone':
        console.log('Clone category');
        break;
      default:
        break;
    }
  };

  const handleImageUpload = (type, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'image') {
        setCategoryImage(reader.result);
      } else {
        setCategoryIcon(reader.result);
      }
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (type) => {
    if (type === 'image') {
      setCategoryImage(null);
    } else {
      setCategoryIcon(null);
    }
  };

  const handleSubmit = () => {
    const formData = {
      ...categoryData,
      image: categoryImage,
      icon: categoryIcon
    };
    console.log('Saving category:', formData);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <CategoryTreeSection>
        <CategoryHeader>
          <h2>Category</h2>
          <ActionDropdown className="action-dropdown">
            <ActionButton onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}>
              Action 
              <ChevronDown size={16} />
            </ActionButton>
            {isActionDropdownOpen && (
              <DropdownMenu>
                <button onClick={() => handleActionClick('edit')}>Edit</button>
                <button onClick={() => handleActionClick('delete')}>Delete</button>
                <button onClick={() => handleActionClick('clone')}>Clone</button>
              </DropdownMenu>
            )}
          </ActionDropdown>
        </CategoryHeader>
        <SearchBox
          type="text"
          placeholder="Search Node"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div style={{ marginTop: '1rem' }}>
          {filteredCategories.map(category => (
            <TreeItem key={category.id}>
              <div className="item-content" onClick={() => toggleExpand(category.id)}>
                {expandedItems.includes(category.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <Folder size={16} style={{ marginLeft: '0.5rem' }} />
                <span className="label">{category.name}</span>
              </div>
            </TreeItem>
          ))}
        </div>
      </CategoryTreeSection>

      <FormSection>
        <FormHeader>Add Category</FormHeader>
        
        <FormGroup className="required">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleInputChange}
            placeholder="Enter Category Name"
          />
        </FormGroup>

        <FormGroup>
          <label>Description</label>
          <textarea
            name="description"
            value={categoryData.description}
            onChange={handleInputChange}
            placeholder="Enter Category Description"
          />
        </FormGroup>

        <FormGroup>
          <label>Select Parent</label>
          <select
            name="parent"
            value={categoryData.parent}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </FormGroup>

        <ImageUpload>
          <label>Image</label>
          {categoryImage ? (
            <ImagePreview>
              <img src={categoryImage} alt="Category" />
              <button onClick={() => handleRemoveImage('image')}>
                <X size={12} />
              </button>
            </ImagePreview>
          ) : (
            <div 
              className="upload-box" 
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  if (e.target.files[0]) {
                    handleImageUpload('image', e.target.files[0]);
                  }
                };
                input.click();
              }}
            >
              <ImageIcon size={24} color="#4a5568" />
            </div>
          )}
        </ImageUpload>

        <ImageUpload>
          <label>Icon</label>
          {categoryIcon ? (
            <ImagePreview>
              <img src={categoryIcon} alt="Icon" />
              <button onClick={() => handleRemoveImage('icon')}>
                <X size={12} />
                </button>
            </ImagePreview>
          ) : (
            <div 
              className="upload-box" 
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  if (e.target.files[0]) {
                    handleImageUpload('icon', e.target.files[0]);
                  }
                };
                input.click();
              }}
            >
              <ImageIcon size={24} color="#4a5568" />
            </div>
          )}
        </ImageUpload>

        <FormGroup>
          <label>Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={categoryData.metaTitle}
            onChange={handleInputChange}
            placeholder="Enter Meta Title"
          />
        </FormGroup>

        <FormGroup>
          <label>Meta Description</label>
          <textarea
            name="metaDescription"
            value={categoryData.metaDescription}
            onChange={handleInputChange}
            placeholder="Enter Meta Description"
          />
        </FormGroup>

        <FormGroup>
          <label>Status</label>
          <div style={{ marginTop: '0.5rem' }}>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={categoryData.status}
                onChange={(e) => setCategoryData(prev => ({ ...prev, status: e.target.checked }))}
              />
              <span className="slider" />
            </ToggleSwitch>
          </div>
        </FormGroup>

        <SaveButton onClick={handleSubmit}>Save</SaveButton>
      </FormSection>
    </Container>
  );
};

export default BlogCategory;