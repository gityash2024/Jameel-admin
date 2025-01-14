import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Settings as SettingsIcon,
  Key,
  Wallet,
  Mail,
  MessageSquare,
  Image,
  RefreshCcw,
  Truck,
  CreditCard,
  BarChart,
  Shield,
  X,
  Plus
} from 'lucide-react';

const Container = styled.div`
  padding: 2rem;
  display: flex;
  gap: 2rem;
`;

const Sidebar = styled.div`
  width: 280px;
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

  &:hover {
    background: #f1f5f9;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const Content = styled.div`
  flex: 1;
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #334155;
    font-size: 0.875rem;
  }

  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    background: #f8fafc;
    outline: none;

    &:focus {
      border-color: #3b82f6;
    }
  }

  .helper-text {
    margin-top: 0.25rem;
    color: #64748b;
    font-size: 0.75rem;
  }

  &.required label::after {
    content: " *";
    color: #ef4444;
  }
`;

const ImageUpload = styled.div`
  margin-bottom: 2rem;

  .upload-container {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .placeholder {
    width: 100px;
    height: 100px;
    border: 2px dashed #e2e8f0;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .preview {
    width: 100px;
    height: 100px;
    border-radius: 0.5rem;
    overflow: hidden;
    position: relative;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    button {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      background: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      border-radius: 0.25rem;
      padding: 0.25rem;
      cursor: pointer;
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
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
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
    color: #000;
    border: 1px solid #e2e8f0;

    &:hover {
      background: #f8fafc;
    }
  `}
`;

const ImageUploadSection = styled.div`
  margin-bottom: 2rem;

  .label {
    color: #333;
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }

  .upload-area {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }

  .upload-box {
    width: 100px;
    height: 100px;
    border: none;
    border-radius: 0.375rem;
    overflow: hidden;
    position: relative;
    cursor: pointer;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    background: #777777;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 24px;
      height: 24px;
      color: #fff;
    }
  }

  .preview {
    width: 100%;
    height: 100%;
    position: relative;
    background: #000;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .remove {
      position: absolute;
      top: 4px;
      right: 4px;
      background: transparent;
      border: none;
      padding: 2px;
      cursor: pointer;
      z-index: 2;

      svg {
        color: #fff;
        width: 14px;
        height: 14px;
      }
    }
  }

  .filename {
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: #666;
  }

  .helper-text {
    margin-top: 0.25rem;
    color: #777777;
    font-size: 0.75rem;
    font-style: italic;
  }
`;


const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [formData, setFormData] = useState({
    lightLogo: null,
    darkLogo: null,
    tinyLogo: null,
    favicon: null,
    siteTitle: 'JSK Marketplace: Where Vendors Shine Together',
    siteName: 'JSK',
    siteUrl: 'https://JSK',
    siteTagline: 'Shop Unique, Sell Exceptional – JSK Multi-Vendor Universe.',
    timezone: 'Kolkata',
    currency: 'USD',
    direction: 'LTR',
    minOrderAmount: '0',
    minOrderFreeShipping: '50',
    storePrefix: 'FS',
    mode: 'Light',
    copyright: 'Copyright 2024 © JSK'
  });

  const menuItems = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'activation', label: 'Activation', icon: Key },
    { id: 'wallet', label: 'Wallet Points', icon: Wallet },
    { id: 'email', label: 'Email Configuration', icon: Mail },
    { id: 'sms', label: 'SMS Configuration', icon: MessageSquare },
    { id: 'media', label: 'Media Configuration', icon: Image },
    { id: 'refund', label: 'Refund', icon: RefreshCcw },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart },
    { id: 'recaptcha', label: 'ReCaptcha', icon: Shield }
  ];

  const handleImageUpload = (type) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, [type]: URL.createObjectURL(file) });
      }
    };
    input.click();
  };

  const handleRemoveImage = (type) => {
    setFormData({ ...formData, [type]: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    console.log('Saving settings:', formData);
    // Implement save functionality
  };

  const handleBack = () => {
    console.log('Going back');
    // Implement back navigation
  };

  const renderGeneralSettings = () => (
    <>
      <ImageUpload>
        <label>Light Logo</label>
        <div className="upload-container">
          {formData.lightLogo ? (
            <div className="preview">
              <img src={formData.lightLogo} alt="Light Logo" />
              <button onClick={() => handleRemoveImage('lightLogo')}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="placeholder" onClick={() => handleImageUpload('lightLogo')}>
              <Plus size={24} />
            </div>
          )}
          <div className="helper-text">*Upload image size 180x50px recommended</div>
        </div>
      </ImageUpload>

      <ImageUpload>
        <label>Dark Logo</label>
        <div className="upload-container">
          {formData.darkLogo ? (
            <div className="preview">
              <img src={formData.darkLogo} alt="Dark Logo" />
              <button onClick={() => handleRemoveImage('darkLogo')}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="placeholder" onClick={() => handleImageUpload('darkLogo')}>
              <Plus size={24} />
            </div>
          )}
          <div className="helper-text">*Upload image size 180x50px recommended</div>
        </div>
      </ImageUpload>

      <ImageUpload>
        <label>Tiny Logo</label>
        <div className="upload-container">
          {formData.tinyLogo ? (
            <div className="preview">
              <img src={formData.tinyLogo} alt="Tiny Logo" />
              <button onClick={() => handleRemoveImage('tinyLogo')}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="placeholder" onClick={() => handleImageUpload('tinyLogo')}>
              <Plus size={24} />
            </div>
          )}
          <div className="helper-text">*Upload image size 50x50px recommended</div>
        </div>
      </ImageUpload>

      <ImageUpload>
        <label>Favicon</label>
        <div className="upload-container">
          {formData.favicon ? (
            <div className="preview">
              <img src={formData.favicon} alt="Favicon" />
              <button onClick={() => handleRemoveImage('favicon')}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="placeholder" onClick={() => handleImageUpload('favicon')}>
              <Plus size={24} />
            </div>
          )}
          <div className="helper-text">*Upload image size 16x16px recommended</div>
        </div>
      </ImageUpload>

      <FormGroup className="required">
        <label>Site Title</label>
        <input
          type="text"
          name="siteTitle"
          value={formData.siteTitle}
          onChange={handleInputChange}
        />
      </FormGroup>

      <FormGroup>
        <label>Site Name</label>
        <input
          type="text"
          name="siteName"
          value={formData.siteName}
          onChange={handleInputChange}
        />
      </FormGroup>

      <FormGroup>
        <label>Site Url</label>
        <input
          type="text"
          name="siteUrl"
          value={formData.siteUrl}
          onChange={handleInputChange}
        />
      </FormGroup>

      <FormGroup>
        <label>Site Tag line</label>
        <input
          type="text"
          name="siteTagline"
          value={formData.siteTagline}
          onChange={handleInputChange}
        />
      </FormGroup>

      <FormGroup>
        <label>Timezone</label>
        <select name="timezone" value={formData.timezone} onChange={handleInputChange}>
          <option value="Kolkata">Kolkata</option>
          {/* Add more timezone options */}
        </select>
      </FormGroup>

      <FormGroup>
        <label>Currency</label>
        <select name="currency" value={formData.currency} onChange={handleInputChange}>
          <option value="USD">USD</option>
          {/* Add more currency options */}
        </select>
      </FormGroup>

      <FormGroup>
        <label>Direction</label>
        <select name="direction" value={formData.direction} onChange={handleInputChange}>
          <option value="LTR">LTR</option>
          <option value="RTL">RTL</option>
        </select>
      </FormGroup>

      <FormGroup>
        <label>Minimum Order Amount</label>
        <input
          type="number"
          name="minOrderAmount"
          value={formData.minOrderAmount}
          onChange={handleInputChange}
        />
        <div className="helper-text">*Please enter the minimum amount required for an order to be processed.</div>
      </FormGroup>

      <FormGroup>
        <label>Minimum Order Free Shipping</label>
        <input
          type="number"
          name="minOrderFreeShipping"
          value={formData.minOrderFreeShipping}
          onChange={handleInputChange}
        />
        <div className="helper-text">*Please enter the minimum order amount for free shipping.</div>
      </FormGroup>

      <FormGroup>
        <label>Store Prefix</label>
        <input
          type="text"
          name="storePrefix"
          value={formData.storePrefix}
          onChange={handleInputChange}
        />
      </FormGroup>

      <FormGroup>
        <label>Mode</label>
        <select name="mode" value={formData.mode} onChange={handleInputChange}>
          <option value="Light">Light</option>
          <option value="Dark">Dark</option>
        </select>
      </FormGroup>

      <FormGroup>
        <label>Copyright</label>
        <input
          type="text"
          name="copyright"
          value={formData.copyright}
          onChange={handleInputChange}
        />
      </FormGroup>
    </>
  );

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

      <Content>
        {activeSection === 'general' && renderGeneralSettings()}
        {/* Add other sections content here */}

        <ButtonGroup>
          <Button onClick={handleBack}>Back</Button>
          <Button primary onClick={handleSave}>Save</Button>
        </ButtonGroup>
      </Content>
    </Container>
  );
};

export default Settings;