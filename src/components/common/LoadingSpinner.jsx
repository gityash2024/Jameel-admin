import React from 'react';
import styled from 'styled-components';

const SpinnerContainer = styled.div`
  display: inline-block;
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  margin-right: ${props => props.marginRight ? '8px' : '0'};
  
  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${props => props.size * 0.8}px;
    height: ${props => props.size * 0.8}px;
    margin: ${props => props.size * 0.1}px;
    border: ${props => props.size * 0.1}px solid ${props => props.color || '#fff'};
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${props => props.color || '#fff'} transparent transparent transparent;
  }
  
  div:nth-child(1) {
    animation-delay: -0.45s;
  }
  
  div:nth-child(2) {
    animation-delay: -0.3s;
  }
  
  div:nth-child(3) {
    animation-delay: -0.15s;
  }
  
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingSpinner = ({ 
  size = 24, 
  color, 
  marginRight = true,
  className
}) => (
  <SpinnerContainer 
    size={size} 
    color={color} 
    marginRight={marginRight} 
    className={className}
  >
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </SpinnerContainer>
);

export default LoadingSpinner; 