import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Edit, Trash2, Eye, Download, Plus, X, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  fetchProducts, 
  deleteProduct, 
  updateProductStatus, 
} from '../features/products/productSlice';
import { toast } from 'react-hot-toast';

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a202c;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary ? `
    background: #000;
    color: white;
    border: none;
    
    &:hover {
      background: #1a1a1a;
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
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

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  min-width: 200px;
  
  &:focus {
    border-color: #4299e1;
  }
`;

const SearchInput = styled.input`
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  min-width: 240px;
  
  &:focus {
    border-color: #4299e1;
  }
`;

const ItemsPerPage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #f8fafc;
  color: #1a202c;
  font-weight: 500;
  font-size: 0.875rem;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 1rem;
  font-size: 0.875rem;
  color: #1a202c;
  border-bottom: 1px solid #e2e8f0;
`;

const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  object-fit: cover;
`;

const StockBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 500;
  ${props => {
    switch (props.status) {
      case 'in_stock':
        return 'background: #DEF7EC; color: #03543F;';
      case 'out_of_stock':
        return 'background: #FDE8E8; color: #9B1C1C;';
      case 'on_backorder':
        return 'background: #FEF3C7; color: #92400E;';
      default:
        return 'background: #E5E7EB; color: #374151;';
    }
  }}
`;

const StockStatus = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  display: inline-block;
  background: ${props => props.inStock ? '#DEF7EC' : '#FDE8E8'};
  color: ${props => props.inStock ? '#03543F' : '#9B1C1C'};
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: none;
  background: none;
  color: ${props => props.delete ? '#E53E3E' : '#3182CE'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    opacity: 0.7;
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

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 100%;
  max-width: ${props => props.size || '500px'};
  max-height: 90vh;
  overflow-y: auto;
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
  color: #1a202c;
`;

const ModalText = styled.p`
  color: #4a5568;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
`;

const ProductDetailGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const ProductDetailSection = styled.div`
  margin-bottom: 1rem;
`;

const ProductDetailLabel = styled.p`
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const ProductDetailValue = styled.p`
  color: #1a202c;
`;

const ProductImageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const SkeletonCell = styled.div`
  height: 20px;
  width: ${props => props.width || '100%'};
  background: #f0f0f0;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f0f0f0 25%, #f7f7f7 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: ${shimmer} 1.5s infinite;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 0.5rem;
  text-align: center;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
`;

const PageInfo = styled.div`
  font-size: 0.875rem;
  color: #4a5568;
`;

const PageNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PageButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #e2e8f0;
  background: ${props => props.active ? '#1a237e' : 'white'};
  color: ${props => props.active ? 'white' : '#1a202c'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.active ? '#1a237e' : '#f7fafc'};
  }
  
  &:disabled {
    background: #f7fafc;
    color: #a0aec0;
    cursor: not-allowed;
  }
`;

const PaginationEllipsis = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  color: #4a5568;
  font-size: 1.25rem;
`;

const AllProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, total, product: selectedProductDetail } = useSelector((state) => state.product);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    brand: '',
    status: ''
  });
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filters.type || product.type === filters.type;
    const matchesBrand = !filters.brand || product.brand === filters.brand;
    const matchesStatus = !filters.status || product.stockStatus === filters.status;
    
    return matchesSearch && matchesType && matchesBrand && matchesStatus;
  });

  const totalProducts = total || (filteredProducts?.length || 0);
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  useEffect(() => {
    dispatch(fetchProducts({ 
      page: currentPage, 
      limit: itemsPerPage
    }));
  }, [dispatch, currentPage, itemsPerPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setCurrentPage(1);
  };

  const handleStatusChange = async (product, newStatus) => {
    try {
      await dispatch(updateProductStatus({
        id: product._id, 
        status: newStatus
      })).unwrap();
      toast.success(`Product ${newStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error(error.message || 'Failed to update product status');
    }
  };

  const handleDeleteClick = (product) => {
    setConfirmAction({
      type: 'delete',
      product,
      message: 'Are you sure you want to delete this product?'
    });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmAction.type === 'delete') {
        await dispatch(deleteProduct(confirmAction.product._id)).unwrap();
        toast.success('Product deleted successfully');
      }
      setIsConfirmModalOpen(false);
      setConfirmAction(null);
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  const handleEditClick = (product) => {
    console.log(`Editing product with ID: ${product._id}`);
    navigate(`/products/edit/${product._id}`);
  };

  const handleViewClick = (product) => {
    setCurrentProduct(product);
    setIsViewModalOpen(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'SKU', 'Brand', 'Price', 'Stock', 'Status'],
      ...products.map(product => [
        product.name,
        product.sku,
        product.brand,
        product.regularPrice,
        product.stockQuantity,
        product.stockStatus
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pageButtons = [];
    const showEllipsisStart = currentPage > 3;
    const showEllipsisEnd = currentPage < totalPages - 2;
    
    // Always show first page
    pageButtons.push(
      <PageButton
        key={1}
        active={currentPage === 1}
        onClick={() => handlePageChange(1)}
      >
        1
      </PageButton>
    );
    
    // Show ellipsis after first page if necessary
    if (showEllipsisStart) {
      pageButtons.push(<PaginationEllipsis key="ellipsis-start">...</PaginationEllipsis>);
    }
    
    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue; // Skip first and last pages as they're always shown
      pageButtons.push(
        <PageButton
          key={i}
          active={currentPage === i}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </PageButton>
      );
    }
    
    // Show ellipsis before last page if necessary
    if (showEllipsisEnd) {
      pageButtons.push(<PaginationEllipsis key="ellipsis-end">...</PaginationEllipsis>);
    }
    
    // Always show last page if more than one page
    if (totalPages > 1) {
      pageButtons.push(
        <PageButton
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </PageButton>
      );
    }

    return (
      <PaginationContainer>
        <PageInfo>
          Showing {totalProducts > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} to {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} entries
        </PageInfo>
        <PageNavigation>
          <PageButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </PageButton>
          {pageButtons}
          <PageButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </PageButton>
        </PageNavigation>
      </PaginationContainer>
    );
  };

  const renderSkeletonLoader = () => (
    <Table>
      <thead>
        <tr>
          <Th>Image</Th>
          <Th>Name</Th>
          <Th>SKU</Th>
          <Th>Category</Th>
          <Th>Subcategory</Th>
          <Th>Price</Th>
          <Th>Stock</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {[1, 2, 3, 4, 5].map((index) => (
          <tr key={index}>
            <Td><SkeletonCell width="48px" style={{ height: '48px' }} /></Td>
            <Td><SkeletonCell width="200px" /></Td>
            <Td><SkeletonCell width="100px" /></Td>
            <Td><SkeletonCell width="100px" /></Td>
            <Td><SkeletonCell width="100px" /></Td>
            <Td><SkeletonCell width="80px" /></Td>
            <Td><SkeletonCell width="100px" /></Td>
            <Td><SkeletonCell width="80px" /></Td>
            <Td><SkeletonCell width="120px" /></Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const displayedProducts = searchTerm || filters.type || filters.brand || filters.status 
    ? filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : products;

  return (
    <Container>
      <Header>
        <Title>Products</Title>
        <ButtonGroup>
          <Button onClick={handleExport}>
            <Download size={16} />
            Export
          </Button>
          <Button primary onClick={() => navigate('/products/add')}>
            <Plus size={16} />
            Add Product
          </Button>
        </ButtonGroup>
      </Header>

      <FilterSection>
        <FilterGroup>
          <ItemsPerPage>
            Show:
            <Select 
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Select>
            items
          </ItemsPerPage>
        </FilterGroup>

        <FilterGroup>
          <Select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="physical">Physical</option>
            <option value="digital">Digital</option>
          </Select>

          <Select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="on_backorder">On Backorder</option>
          </Select>

          <SearchInput
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </FilterGroup>
      </FilterSection>

      {loading ? (
        renderSkeletonLoader()
      ) : displayedProducts.length === 0 ? (
        <EmptyState>
          <Title>No products found</Title>
          <Button primary onClick={() => navigate('/products/add')} style={{ marginTop: '1rem' }}>
            <Plus size={16} />
            Add Your First Product
          </Button>
        </EmptyState>
      ) : (
        <>
          <Table>
            <thead>
              <tr>
                <Th>Image</Th>
                <Th>Name</Th>
                <Th>SKU</Th>
                <Th>Category</Th>
                <Th>Subcategory</Th>  
                <Th>Price</Th>
                <Th>Stock</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.map((product) => (
                <tr key={product._id}>
                  <Td>
                    <ProductImage 
                      src={product.images?.[0]?.url || '/placeholder.png'} 
                      alt={product.name}
                    />
                  </Td>
                  <Td>{product.name}</Td>
                  <Td>{product.sku}</Td>
                  <Td>{product.category?.name}</Td>
                  <Td>{product.subcategory?.name}</Td>  
                  <Td>${product.regularPrice.toFixed(2)}</Td>
                  <Td>
                    <StockStatus inStock={product.stockStatus === 'in_stock'}>
                      {product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                    </StockStatus>
                  </Td>
                  <Td>
                    <Toggle>
                      <ToggleInput
                        type="checkbox"
                        checked={product.isActive}
                        onChange={(e) => handleStatusChange(product, e.target.checked)}
                      />
                      <ToggleSlider />
                    </Toggle>
                  </Td>
                  <Td>
                    <ButtonGroup>
                      <ActionButton onClick={() => handleEditClick(product)}>
                        <Edit size={16} />
                      </ActionButton>
                      <ActionButton delete onClick={() => handleDeleteClick(product)}>
                        <Trash2 size={16} />
                      </ActionButton>
                      <ActionButton onClick={() => handleViewClick(product)}>
                        <Eye size={16} />
                      </ActionButton>
                    </ButtonGroup>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          {renderPagination()}
        </>
      )}

      {isConfirmModalOpen && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Confirm Action</ModalTitle>
              <Button onClick={() => {
                setIsConfirmModalOpen(false);
                setConfirmAction(null);
              }}>
                <X size={20} />
              </Button>
            </ModalHeader>

            <ModalText>{confirmAction?.message}</ModalText>

            <ButtonGroup>
              <Button onClick={() => {
                setIsConfirmModalOpen(false);
                setConfirmAction(null);
              }}>
                Cancel
              </Button>
              <Button primary onClick={handleConfirmAction}>
                Confirm
              </Button>
            </ButtonGroup>
          </ModalContent>
        </Modal>
      )}

      {isViewModalOpen && currentProduct && (
        <Modal>
          <ModalContent size="800px">
            <ModalHeader>
              <ModalTitle>Product Details</ModalTitle>
              <Button onClick={() => setIsViewModalOpen(false)}>
                <X size={20} />
              </Button>
            </ModalHeader>

            <ProductDetailGrid>
              <div>
                <ProductDetailSection>
                  <ProductDetailLabel>Name</ProductDetailLabel>
                  <ProductDetailValue>{currentProduct.name}</ProductDetailValue>
                </ProductDetailSection>

                <ProductDetailSection>
                  <ProductDetailLabel>SKU</ProductDetailLabel>
                  <ProductDetailValue>{currentProduct.sku}</ProductDetailValue>
                </ProductDetailSection>

                <ProductDetailSection>
                  <ProductDetailLabel>Brand</ProductDetailLabel>
                  <ProductDetailValue>{currentProduct.brand}</ProductDetailValue>
                </ProductDetailSection>

                <ProductDetailSection>
                  <ProductDetailLabel>Type</ProductDetailLabel>
                  <ProductDetailValue>{currentProduct.type}</ProductDetailValue>
                </ProductDetailSection>

                <ProductDetailSection>
                  <ProductDetailLabel>Category</ProductDetailLabel>
                  <ProductDetailValue>{currentProduct.category.name}</ProductDetailValue>
                </ProductDetailSection>

                <ProductDetailSection>
                  <ProductDetailLabel>Subcategory</ProductDetailLabel>
                  <ProductDetailValue>{currentProduct.subcategory.name}</ProductDetailValue>
                </ProductDetailSection>

                <ProductDetailSection>
                  <ProductDetailLabel>Price</ProductDetailLabel>
                  <ProductDetailValue>
                    Regular: ${currentProduct.regularPrice.toFixed(2)}
                    {currentProduct.salePrice && 
                      ` | Sale: $${currentProduct.salePrice.toFixed(2)}`
                    }
                  </ProductDetailValue>
                </ProductDetailSection>
              </div>

              <div>
                <ProductDetailSection>
                  <ProductDetailLabel>Stock Quantity</ProductDetailLabel>
                  <ProductDetailValue>{currentProduct.stockQuantity}</ProductDetailValue>
                </ProductDetailSection>

                <ProductDetailSection>
                  <ProductDetailLabel>Stock Status</ProductDetailLabel>
                  <ProductDetailValue>
                    <StockStatus inStock={currentProduct.stockStatus === 'in_stock'}>
                      {currentProduct.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                    </StockStatus>
                  </ProductDetailValue>
                </ProductDetailSection>

                <ProductDetailSection>
                  <ProductDetailLabel>Status</ProductDetailLabel>
                  <ProductDetailValue>
                    {currentProduct.isActive ? 'Active' : 'Inactive'}
                  </ProductDetailValue>
                </ProductDetailSection>

                <ProductDetailSection>
                  <ProductDetailLabel>Featured</ProductDetailLabel>
                  <ProductDetailValue>
                    {currentProduct.isFeatured ? 'Yes' : 'No'}
                  </ProductDetailValue>
                </ProductDetailSection>

                <ProductDetailSection>
                  <ProductDetailLabel>New Arrival</ProductDetailLabel>
                  <ProductDetailValue>
                    {currentProduct.isNewArrival ? 'Yes' : 'No'}
                  </ProductDetailValue>
                </ProductDetailSection>
              </div>
            </ProductDetailGrid>

            <ProductDetailSection>
              <ProductDetailLabel>Description</ProductDetailLabel>
              <ProductDetailValue>{currentProduct.description}</ProductDetailValue>
            </ProductDetailSection>

            <ProductDetailSection>
              <ProductDetailLabel>Product Images</ProductDetailLabel>
              <ProductImageContainer>
                {currentProduct.images.map((image, index) => (
                  <ProductImage 
                    key={index} 
                    src={image.url} 
                    alt={`Product ${index + 1}`} 
                  />
                ))}
              </ProductImageContainer>
            </ProductDetailSection>

            {/* Jewelry Details Section */}
            <ProductDetailSection>
              <ProductDetailLabel>Jewelry Details</ProductDetailLabel>
              <ProductDetailGrid>
                <div>
                  <ProductDetailSection>
                    <ProductDetailLabel>Stone</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.stone || '-'}</ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Total Weight</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.totalWeight || '-'}</ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Color</ProductDetailLabel>
                    <ProductDetailValue>
                      {currentProduct.color ? (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ 
                            width: '20px', 
                            height: '20px', 
                            backgroundColor: currentProduct.color,
                            borderRadius: '4px',
                            marginRight: '8px',
                            border: '1px solid #ddd'
                          }} />
                          {currentProduct.color}
                        </div>
                      ) : '-'}
                    </ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Clarity</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.clarity || '-'}</ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Stone Type</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.stoneType || '-'}</ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Stone Color</ProductDetailLabel>
                    <ProductDetailValue>
                      {currentProduct.stoneColor ? (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ 
                            width: '20px', 
                            height: '20px', 
                            backgroundColor: currentProduct.stoneColor,
                            borderRadius: '4px',
                            marginRight: '8px',
                            border: '1px solid #ddd'
                          }} />
                          {currentProduct.stoneColor}
                        </div>
                      ) : '-'}
                    </ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Stone Shape</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.stoneShape || '-'}</ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Stone Carat Range</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.stoneCaratRange || '-'}</ProductDetailValue>
                  </ProductDetailSection>
                </div>

                <div>
                  <ProductDetailSection>
                    <ProductDetailLabel>Stone Class</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.stoneClass || '-'}</ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Stone Setting</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.stoneSetting || '-'}</ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Setting Only</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.settingOnly ? 'Yes' : 'No'}</ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Metal Type</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.metalType || '-'}</ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Metal Color</ProductDetailLabel>
                    <ProductDetailValue>
                      {currentProduct.metalColor ? (
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <div style={{ 
                            width: '20px', 
                            height: '20px', 
                            backgroundColor: currentProduct.metalColor,
                            borderRadius: '4px',
                            marginRight: '8px',
                            border: '1px solid #ddd'
                          }} />
                          {currentProduct.metalColor}
                        </div>
                      ) : '-'}
                    </ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Metal Finish</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.metalFinish || '-'}</ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Gold Karat</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.goldKarat || '-'}</ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Ring Design</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.ringDesign || '-'}</ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Ring Style</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.ringStyle || '-'}</ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Standard Ring Size</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.standardRingSize || '-'}</ProductDetailValue>
                  </ProductDetailSection>

                  <ProductDetailSection>
                    <ProductDetailLabel>Height</ProductDetailLabel>
                    <ProductDetailValue>{currentProduct.height || '-'}</ProductDetailValue>
                  </ProductDetailSection>
                </div>
              </ProductDetailGrid>
            </ProductDetailSection>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default AllProducts;