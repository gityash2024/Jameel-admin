import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Settings, 
  Image as ImageIcon, 
  Package, 
  Sliders, 
  Search, 
  Truck, 
  ToggleLeft,
  Code
} from 'lucide-react';

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

    &::placeholder {
      color: #a0aec0;
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }

  .helper-text {
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: #718096;
    font-style: italic;
  }

  .html-editor {
    margin-top: 0.25rem;
    display: flex;
    gap: 0.5rem;
    align-items: center;
    font-size: 0.75rem;
    color: #718096;

    button {
      padding: 0.25rem 0.5rem;
      background: #1a202c;
      color: white;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
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

    &:hover {
      background: #1a1a1a;
    }
  ` : `
    background: white;
    color: #1a202c;
    border: 1px solid #e2e8f0;

    &:hover {
      background: #f7fafc;
    }
  `}
`;

const Footer = styled.footer`
  text-align: center;
  padding: 2rem 0;
  color: #4a5568;
  font-size: 0.875rem;
`;

const AddProduct = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [formData, setFormData] = useState({
    productType: 'Physical Product',
    store: '',
    name: '',
    shortDescription: '',
    description: '',
    tax: ''
  });

  const menuItems = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'images', label: 'Product Images', icon: ImageIcon },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'setup', label: 'Setup', icon: Sliders },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'status', label: 'Status', icon: ToggleLeft }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Form data:', formData);
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

      <FormSection>
        <FormHeader>Add Product</FormHeader>

        <FormGroup>
          <label className="required">Product Type</label>
          <select
            name="productType"
            value={formData.productType}
            onChange={handleInputChange}
          >
            <option value="Physical Product">Physical Product</option>
            <option value="Digital Product">Digital Product</option>
          </select>
        </FormGroup>

        <FormGroup>
          <label className="required">Store</label>
          <select
            name="store"
            value={formData.store}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            {/* Add store options */}
          </select>
        </FormGroup>

        <FormGroup>
          <label className="required">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter Name"
          />
        </FormGroup>

        <FormGroup>
          <label className="required">Short Description</label>
          <textarea
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            placeholder="Enter Short Description"
          />
          <div className="helper-text">*Maximum length should be 300 characters.</div>
          <div className="html-editor">
            *Only accept html tags.
            <button>
              <Code size={14} />
              HTML
            </button>
          </div>
        </FormGroup>

        <FormGroup>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter Description"
          />
        </FormGroup>

        <FormGroup>
          <label className="required">Tax</label>
          <select
            name="tax"
            value={formData.tax}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            {/* Add tax options */}
          </select>
        </FormGroup>

        <ButtonGroup>
          <Button>Back</Button>
          <Button primary onClick={handleSubmit}>Save</Button>
        </ButtonGroup>
      </FormSection>

      <Footer>Copyright 2024 © JSK</Footer>
    </Container>
  );
};

export default AddProduct;