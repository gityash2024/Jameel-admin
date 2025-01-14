import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a237e;
  margin-bottom: 32px;
`;

const Form = styled.form`
  display: grid;
  gap: 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #334155;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #1a237e;
    box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const PhoneInputGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const CountryCode = styled.select`
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: #000;
  color: white;
  min-width: 100px;
  
  &:focus {
    outline: none;
    border-color: #1a237e;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #1a237e;
    box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.1);
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

const Button = styled.button`
  padding: 12px 24px;
  background: #000;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-end;
  
  &:hover {
    background: #1a1a1a;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: #dc2626;
  font-size: 12px;
`;

const StatusGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const countryCodes = [
  { code: '+91', country: 'IN' },
  { code: '+1', country: 'US' },
  { code: '+44', country: 'UK' },
  { code: '+971', country: 'UAE' },
];

const roles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Manager' },
  { id: 3, name: 'Consumer' },
];

const AddUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    password: '',
    confirmPassword: '',
    role: '',
    status: true
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Here you would typically make an API call to save the user
        console.log('Form submitted:', formData);
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          countryCode: '+91',
          password: '',
          confirmPassword: '',
          role: '',
          status: true
        });
      } catch (error) {
        console.error('Error saving user:', error);
      }
    }
  };

  return (
    <Container>
      <Title>Add User</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Name</Label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Full Name"
            error={errors.name}
          />
          {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Email</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email Address"
            error={errors.email}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Phone</Label>
          <PhoneInputGroup>
            <CountryCode
              name="countryCode"
              value={formData.countryCode}
              onChange={handleChange}
            >
              {countryCodes.map(({ code, country }) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </CountryCode>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter Phone Number"
              error={errors.phone}
            />
          </PhoneInputGroup>
          {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Password</Label>
          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            error={errors.password}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Enter Confirm Password"
            error={errors.confirmPassword}
          />
          {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Role</Label>
          <Select
            name="role"
            value={formData.role}
            onChange={handleChange}
            error={errors.role}
          >
            <option value="">Select Role</option>
            {roles.map(role => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </Select>
          {errors.role && <ErrorMessage>{errors.role}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>Status</Label>
          <StatusGroup>
            <Toggle>
              <ToggleInput
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
              />
              <ToggleSlider />
            </Toggle>
          </StatusGroup>
        </FormGroup>

        <Button type="submit">
          Save User
        </Button>
      </Form>
    </Container>
  );
};

export default AddUser;