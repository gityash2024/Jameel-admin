import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Settings, Image as ImageIcon, Package, Sliders, Search, Truck, ToggleLeft, Code, Upload, X } from 'lucide-react';
import { createProduct } from '../features/products/productSlice';
import { toast } from 'react-hot-toast';

const Container = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  padding: 2rem;
`;

const Sidebar = styled.div`
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${props => props.active ? '#f1f5f9' : 'transparent'};
  color: ${props => props.active ? '#000' : '#64748b'};
  border: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;

  &:hover {
    background: #f1f5f9;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const FormSection = styled.div`
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
`;

const FormHeader = styled.h1`
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
    font-weight: 500;
  }

  .required:after {
    content: " *";
    color: #e53e3e;
  }
`;

const Input = styled.input`
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

  &::placeholder {
    color: #a0aec0;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: #f8fafc;
  outline: none;
  font-size: 0.875rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    border-color: #4299e1;
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const Select = styled.select`
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
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 2rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  ${props => props.primary ? `
    background: #000;
    color: white;
    border: none;
    &:hover { background: #1a1a1a; }
    &:disabled { background: #ccc; cursor: not-allowed; }
  ` : `
    background: white;
    color: #1a202c;
    border: 1px solid #e2e8f0;
    &:hover { background: #f7fafc; }
  `}
`;

const ImageUploadArea = styled.div`
  border: 2px dashed #e2e8f0;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #4299e1;
  }
`;

const ImagePreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  padding-top: 100%;
  border-radius: 0.5rem;
  overflow: hidden;
  
  img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    padding: 0.25rem;
    cursor: pointer;
    
    &:hover {
      background: rgba(0, 0, 0, 0.7);
    }
  }
`;

const HelperText = styled.div`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #718096;
  font-style: italic;
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

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.product);
  const [activeSection, setActiveSection] = useState('general');
  const [images, setImages] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    shortDescription: '',
    type: 'physical',
    category: '',
    brand: '',
    regularPrice: '',
    salePrice: '',
    stockQuantity: '',
    lowStockThreshold: '10',
    stockStatus: 'in_stock',
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    dimensions: {
      length: '',
      width: '',
      height: '',
      unit: 'cm'
    },
    weight: {
      value: '',
      unit: 'g'
    },
    metaTitle: '',
    metaDescription: '',
    metaKeywords: [],
    specifications: [],
    attributes: []
  });

  const menuItems = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'images', label: 'Product Images', icon: ImageIcon },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'variants', label: 'Variants', icon: Sliders },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'status', label: 'Status', icon: ToggleLeft }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? Number(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : 
                type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (typeof formData[key] === 'object' && !Array.isArray(formData[key])) {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    images.forEach((image, index) => {
      formDataToSend.append(`images`, image.file);
    });

    try {
      await dispatch(createProduct(formDataToSend)).unwrap();
      toast.success('Product created successfully');
      navigate('/products');
    } catch (error) {
      toast.error(error.message || 'Error creating product');
    }
  };

  const renderGeneralSection = () => (
    <>
      <FormGroup>
        <label className="required">Product Name</label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter product name"
        />
      </FormGroup>

      <FormGroup>
        <label className="required">SKU</label>
        <Input
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleInputChange}
          placeholder="Enter SKU"
        />
      </FormGroup>

      <FormGroup>
        <label className="required">Short Description</label>
        <TextArea
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleInputChange}
          placeholder="Enter short description"
        />
        <HelperText>Maximum 1000 characters</HelperText>
      </FormGroup>

      <FormGroup>
        <label className="required">Description</label>
        <TextArea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Enter full description"
        />
      </FormGroup>

      <FormGroup>
        <label className="required">Type</label>
        <Select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
        >
          <option value="physical">Physical Product</option>
          <option value="digital">Digital Product</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <label className="required">Brand</label>
        <Input
          type="text"
          name="brand"
          value={formData.brand}
          onChange={handleInputChange}
          placeholder="Enter brand name"
        />
      </FormGroup>

      <FormGroup>
        <label className="required">Regular Price</label>
        <Input
          type="number"
          name="regularPrice"
          value={formData.regularPrice}
          onChange={handleInputChange}
          placeholder="Enter regular price"
          min="0"
          step="0.01"
        />
      </FormGroup>

      <FormGroup>
        <label>Sale Price</label>
        <Input
          type="number"
          name="salePrice"
          value={formData.salePrice}
          onChange={handleInputChange}
          placeholder="Enter sale price"
          min="0"
          step="0.01"
        />
      </FormGroup>
    </>
  );

  const renderImagesSection = () => (
    <>
      <FormGroup>
        <label className="required">Product Images</label>
        <ImageUploadArea onClick={() => document.getElementById('imageInput').click()}>
          <Upload size={48} color="#64748b" />
          <p>Click to upload or drag and drop</p>
          <input
            id="imageInput"
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
        </ImageUploadArea>
        <ImagePreviewContainer>
          {images.map((image, index) => (
            <ImagePreview key={index}>
              <img src={image.preview} alt={`Preview ${index + 1}`} />
              <button onClick={() => removeImage(index)}>
                <X size={16} />
              </button>
            </ImagePreview>
          ))}
        </ImagePreviewContainer>
      </FormGroup>
    </>
  );

  const renderInventorySection = () => (
    <>
      <FormGroup>
        <label className="required">Stock Quantity</label>
        <Input
          type="number"
          name="stockQuantity"
          value={formData.stockQuantity}
          onChange={handleInputChange}
          placeholder="Enter stock quantity"
          min="0"
        />
      </FormGroup>

      <FormGroup>
        <label>Low Stock Threshold</label>
        <Input
          type="number"
          name="lowStockThreshold"
          value={formData.lowStockThreshold}
          onChange={handleInputChange}
          placeholder="Enter low stock threshold"
          min="0"
        />
      </FormGroup>

      <FormGroup>
        <label>Stock Status</label>
        <Select
          name="stockStatus"
          value={formData.stockStatus}
          onChange={handleInputChange}
        >
          <option value="in_stock">In Stock</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="on_backorder">On Backorder</option>
        </Select>
      </FormGroup>
    </>
  );

  const renderShippingSection = () => (
    <>
      <FormGroup>
        <label>Dimensions</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <Input
            type="number"
            name="dimensions.length"
            value={formData.dimensions.length}
            onChange={handleInputChange}
            placeholder="Length"
            min="0"
            step="0.01"
          />
          <Input
            type="number"
            name="dimensions.width"
            value={formData.dimensions.width}
            onChange={handleInputChange}
            placeholder="Width"
            min="0"
            step="0.01"
          />
          <Input
            type="number"
            name="dimensions.height"
            value={formData.dimensions.height}
            onChange={handleInputChange}
            placeholder="Height"
            min="0"
            step="0.01"
          />
          <Select
            name="dimensions.unit"
            value={formData.dimensions.unit}
            onChange={handleInputChange}
          >
            <option value="cm">cm</option>
            <option value="in">in</option>
          </Select>
        </div>
      </FormGroup>

      <FormGroup>
        <label>Weight</label>
        <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '1rem' }}>
          <Input
            type="number"
            name="weight.value"
            value={formData.weight.value}
            onChange={handleInputChange}
            placeholder="Weight"
            min="0"
            step="0.01"
          />
          <Select
            name="weight.unit"
            value={formData.weight.unit}
            onChange={handleInputChange}
          >
            <option value="g">g</option>
            <option value="kg">kg</option>
            <option value="lb">lb</option>
            <option value="oz">oz</option>
          </Select>
        </div>
      </FormGroup>
    </>
  );

  const renderSEOSection = () => (
    <>
      <FormGroup>
        <label>Meta Title</label>
        <Input
          type="text"
          name="metaTitle"
          value={formData.metaTitle}
          onChange={handleInputChange}
          placeholder="Enter meta title"
        />
      </FormGroup>

      <FormGroup>
        <label>Meta Description</label>
        <TextArea
          name="metaDescription"
          value={formData.metaDescription}
          onChange={handleInputChange}
          placeholder="Enter meta description"
        />
      </FormGroup>

      <FormGroup>
        <label>Meta Keywords</label>
        <Input
          type="text"
          name="metaKeywords"
          value={formData.metaKeywords.join(', ')}
          onChange={(e) => {
            const keywords = e.target.value.split(',').map(k => k.trim());
            setFormData(prev => ({
              ...prev,
              metaKeywords: keywords.filter(k => k)
            }));
          }}
          placeholder="Enter keywords separated by commas"
        />
      </FormGroup>
    </>
  );

  const renderStatusSection = () => (
    <>
      <FormGroup>
        <label>Active Status</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Toggle>
            <ToggleInput
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <ToggleSlider />
          </Toggle>
          <span>{formData.isActive ? 'Active' : 'Inactive'}</span>
        </div>
      </FormGroup>

      <FormGroup>
        <label>Featured Product</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Toggle>
            <ToggleInput
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
            />
            <ToggleSlider />
          </Toggle>
          <span>{formData.isFeatured ? 'Featured' : 'Not Featured'}</span>
        </div>
      </FormGroup>

      <FormGroup>
        <label>New Arrival</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Toggle>
            <ToggleInput
              type="checkbox"
              name="isNewArrival"
              checked={formData.isNewArrival}
              onChange={handleInputChange}
            />
            <ToggleSlider />
          </Toggle>
          <span>{formData.isNewArrival ? 'New Arrival' : 'Not New Arrival'}</span>
        </div>
      </FormGroup>
    </>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSection();
      case 'images':
        return renderImagesSection();
      case 'inventory':
        return renderInventorySection();
      case 'shipping':
        return renderShippingSection();
      case 'seo':
        return renderSEOSection();
      case 'status':
        return renderStatusSection();
      default:
        return renderGeneralSection();
    }
  };

  const validateForm = () => {
    const requiredFields = ['name', 'sku', 'description', 'shortDescription', 'type', 'brand', 'regularPrice', 'stockQuantity'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (images.length === 0) {
      toast.error('Please add at least one product image');
      return false;
    }

    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    handleSubmit();
  };

  return (
    <Container>
      <Sidebar>
        {menuItems.map(item => (
          <MenuItem
            key={item.id}
            active={activeSection === item.id}
            onClick={() => setActiveSection(item.id)}
          >
            <item.icon />
            {item.label}
          </MenuItem>
        ))}
      </Sidebar>

      <form onSubmit={handleFormSubmit}>
        <FormSection>
          <FormHeader>Add Product</FormHeader>
          {renderActiveSection()}
          <ButtonGroup>
            <Button type="button" onClick={() => navigate('/products')}>
              Cancel
            </Button>
            <Button type="submit" primary disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
          </ButtonGroup>
        </FormSection>
      </form>
    </Container>
  );
};

export default AddProduct;