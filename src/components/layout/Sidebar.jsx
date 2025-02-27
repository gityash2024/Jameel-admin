import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Jsk_Logo from '../../assets/Jsk_Logo.svg';
import logo from '../../assets/logo.svg';
import { 
  HomeIcon, 
  Users, 
  CreditCard, 
  ShoppingBag, 
  Image as ImageIcon, 
  FileText, 
  Percent, 
  Truck, 
  Tag, 
  DollarSign, 
  Star, 
  HelpCircle, 
  Settings, 
  ChevronRight,
  ChevronDown,
  Grid ,
  Calendar,MapPin
} from 'lucide-react';
import { Category } from '@mui/icons-material';

const SidebarContainer = styled.div`
  width: 280px;
  height: 100vh;
  background: #0B1222;
  color: #fff;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  }
`;

const LogoSection = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .logo-container {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .logo-main {
      display: flex;
      align-items: center;
      gap: 8px;

      img.jsk-logo {
        height: 36px;
        width: auto;
      }

      img.logo-text {
        height: 24px;
        width: auto;
      }
    }

    .powered-text {
      color: #64748B;
      font-size: 0.625rem;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
  }

  .grid-icon {
    color: #64748B;
    cursor: pointer;
    transition: color 0.2s;

    &:hover {
      color: #fff;
    }
  }
`;

const NavSection = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #1E293B;
    border-radius: 2px;
  }
`;

const MenuItem = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  width: 100%;
  padding: 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  color: ${props => props.isActive ? '#rgb(247, 241, 241)' : '#64748B'};
  background: ${props => props.isActive ? '#1E293B' : 'transparent'};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-size: 0.9375rem;
  position: relative;

  &:hover {
    color:rgb(247, 241, 241);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  .arrow {
    margin-left: auto;
    width: 16px;
    height: 16px;
  }
`;

const SubMenu = styled.div`
  background: #111827;
  overflow: hidden;
  max-height: ${props => props.isOpen ? props.itemCount * 45 + 'px' : '0'};
  transition: max-height 0.3s ease;
`;

const SubMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.75rem 3rem;
  color: #64748B;
  text-decoration: none;
  font-size: 0.9375rem;
  transition: all 0.2s;
  position: relative;

  &:hover {
    color: #3B82F6;
  }

  &.active {
    color: #3B82F6;
  }

  &::before {
    content: '';
    position: absolute;
    left: 2rem;
    top: 50%;
    width: 4px;
    height: 1px;
    background: currentColor;
  }
`;

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [openMenus, setOpenMenus] = useState(['Orders']);

  const menuItems = [
    {
      label: 'Dashboard',
      icon: HomeIcon,
      path: '/'
    },
    {
      label: 'Users',
      icon: Users,
      path: '/users',
      submenu: [
        { label: 'All Users', path: '/users/all' },
        { label: 'Role', path: '/users/role' }
      ]
    },
    {
      label: 'Products',
      icon: CreditCard,
      path: '/products/all',
   
    },{ label: 'Categories', icon: Category,  path: '/products/category' },
    { label: 'Sub Categories', icon: Category,  path: '/products/subcategory' },
    { label: 'Tags', icon: ImageIcon,  path: '/products/tgs' }, 
    {
      label: 'Orders',
      icon: ShoppingBag,
      path: '/orders/all'
    },
    
    {
      label: 'Media',
      icon: ImageIcon,
      path: '/media'
    },
    {
      label: 'Blog',
      icon: FileText,
      path: '/blogs'
    },

    {
      label: "Help Center",
      icon: Calendar,
      path: '/support-tickets'
   },
    
    
   {
    label: "Find-Near-Store",
    icon: MapPin,
    path: '/find-nearby-store'
},
    {
       label: "Book-In-Appointment",
       icon: Calendar,
       path: '/book-in-store-appointment'
    },
    
    
    {
      label: 'Coupons',
      icon: Tag,
      path: '/coupons'
    }
  ];

  const toggleMenu = (label) => {
    setOpenMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isMenuOpen = (label) => openMenus.includes(label);
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <LogoSection>
          <div className="logo-container">
            <div className="logo-main">
              <img src={Jsk_Logo} alt="JSK" className="jsk-logo" />
              <img src={logo} alt="JSK" className="logo-text" size={20} />
            </div>
            {/* <span className="powered-text">Powered by Jameel Group AI</span> */}
          </div>
          {/* <Grid className="grid-icon" size={20} onClick={() => setIsOpen(!isOpen)} /> */}
        </LogoSection>

        <NavSection>
          {menuItems.map((item) => (
            <MenuItem key={item.path}>
              {item.submenu ? (
                <>
                  <MenuButton
                    isActive={isActive(item.path)}
                    onClick={() => toggleMenu(item.label)}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                    {isMenuOpen(item.label) ? (
                      <ChevronDown className="arrow" />
                    ) : (
                      <ChevronRight className="arrow" />
                    )}
                  </MenuButton>
                  <SubMenu isOpen={isMenuOpen(item.label)} itemCount={item.submenu.length}>
                    {item.submenu.map((subItem) => (
                      <SubMenuItem
                        key={subItem.path}
                        to={subItem.path}
                        className={isActive(subItem.path) ? 'active' : ''}
                      >
                        {subItem.label}
                      </SubMenuItem>
                    ))}
                  </SubMenu>
                </>
              ) : (
                <MenuButton
                  as={Link}
                  to={item.path}
                  isActive={isActive(item.path)}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </MenuButton>
              )}
            </MenuItem>
          ))}
        </NavSection>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;