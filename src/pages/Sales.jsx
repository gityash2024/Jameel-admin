import React, { useState } from 'react';
import styled from 'styled-components';
import { HelpCircle, ChevronDown } from 'lucide-react';

const Container = styled.div`
  padding: 24px;
  max-width: 800px;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1a237e;
`;

const HelpLink = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1a237e;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #334155;
`;

const SelectWrapper = styled.div`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  color: #334155;
  appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #1a237e;
    box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.1);
  }
`;

const NumberInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    padding: 12px;
    padding-right: 32px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    color: #334155;

    &:focus {
      outline: none;
      border-color: #1a237e;
      box-shadow: 0 0 0 2px rgba(26, 35, 126, 0.1);
    }
  }

  span {
    position: absolute;
    right: 12px;
    color: #64748b;
    font-size: 14px;
  }
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    cursor: pointer;
  }

  label {
    font-size: 14px;
    color: #334155;
    cursor: pointer;
  }
`;

const DropdownIcon = styled(ChevronDown)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  pointer-events: none;
`;

const Sales = () => {
  // State for regular price section
  const [regularPrice, setRegularPrice] = useState({
    action: 'decrease',
    changeType: 'percent',
    percent: '0.00',
    overrideCents: false
  });

  // State for compare at price section
  const [comparePrice, setComparePrice] = useState({
    action: 'decrease',
    changeType: 'percent',
    percent: '0.00',
    overrideCents: false
  });

  const actions = [
    { value: 'decrease', label: 'Decrease Price' },
    { value: 'increase', label: 'Increase Price' },
    { value: 'set', label: 'Set Price' }
  ];

  const changeTypes = [
    { value: 'percent', label: 'By Percent' },
    { value: 'amount', label: 'By Amount' },
    { value: 'fixed', label: 'Fixed Amount' }
  ];

  const handleRegularChange = (field, value) => {
    setRegularPrice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCompareChange = (field, value) => {
    setComparePrice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const PriceSection = ({ title, state, onChange }) => (
    <Section>
      <SectionHeader>
        <Title>{title}</Title>
        <HelpLink>
          <HelpCircle size={16} />
          Help with Prices
        </HelpLink>
      </SectionHeader>

      <FormGroup>
        <Label>Action</Label>
        <SelectWrapper>
          <Select
            value={state.action}
            onChange={(e) => onChange('action', e.target.value)}
          >
            {actions.map(action => (
              <option key={action.value} value={action.value}>
                {action.label}
              </option>
            ))}
          </Select>
          <DropdownIcon size={16} />
        </SelectWrapper>
      </FormGroup>

      <FormGroup>
        <Label>Change Type</Label>
        <SelectWrapper>
          <Select
            value={state.changeType}
            onChange={(e) => onChange('changeType', e.target.value)}
          >
            {changeTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
          <DropdownIcon size={16} />
        </SelectWrapper>
      </FormGroup>

      <FormGroup>
        <Label>Percent</Label>
        <NumberInput>
          <input
            type="number"
            value={state.percent}
            onChange={(e) => onChange('percent', e.target.value)}
            step="0.01"
            min="0"
          />
          <span>%</span>
        </NumberInput>
      </FormGroup>

      <Checkbox>
        <input
          type="checkbox"
          id={`override-${title}`}
          checked={state.overrideCents}
          onChange={(e) => onChange('overrideCents', e.target.checked)}
        />
        <label htmlFor={`override-${title}`}>Override Cents</label>
      </Checkbox>
    </Section>
  );

  return (
    <Container>
      <PriceSection
        title="Price"
        state={regularPrice}
        onChange={handleRegularChange}
      />
      
      <PriceSection
        title="Compare at Price"
        state={comparePrice}
        onChange={handleCompareChange}
      />
    </Container>
  );
};

export default Sales;