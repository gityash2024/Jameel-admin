import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, ArrowDown, ArrowUp, Search } from 'lucide-react';
import ZipFile from '../assets/ZipFile.svg';
import medai_1 from '../assets/medai_1.svg';
import medai_2 from '../assets/medai_2.svg';
import medai_3 from '../assets/medai_3.svg';
import medai_4 from '../assets/medai_4.svg';
import medai_5 from '../assets/medai_5.svg';
import medai_6 from '../assets/medai_6.svg';
import medai_7 from '../assets/medai_7.svg';
import medai_8 from '../assets/medai_8.svg';
import medai_9 from '../assets/medai_9.svg';
import medai_10 from '../assets/medai_10.svg';
import medai_11 from '../assets/medai_11.svg';
import medai_12 from '../assets/medai_12.svg';
import medai_13 from '../assets/medai_13.svg';
import medai_14 from '../assets/medai_14.svg';
import medai_15 from '../assets/medai_15.svg';
import medai_16 from '../assets/medai_16.svg';
import medai_17 from '../assets/medai_17.svg';
import medai_18 from '../assets/medai_18.svg';
import medai_19 from '../assets/medai_19.svg';
import medai_20 from '../assets/medai_20.svg';
import medai_21 from '../assets/medai_21.svg';
import medai_22 from '../assets/medai_22.svg';
import medai_23 from '../assets/medai_23.svg';
import medai_24 from '../assets/medai_24.svg';
import medai_25 from '../assets/medai_25.svg';
import medai_26 from '../assets/medai_26.svg';
import medai_27 from '../assets/medai_27.svg';
import medai_28 from '../assets/medai_28.svg';
import medai_29 from '../assets/medai_29.svg';
import medai_30 from '../assets/medai_30.svg';
import medai_31 from '../assets/medai_31.svg';
import medai_32 from '../assets/medai_32.svg';
import medai_33 from '../assets/medai_33.svg';
import medai_34 from '../assets/medai_34.svg';
import medai_35 from '../assets/medai_35.svg';

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

const SortSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  outline: none;
  background: white;
  min-width: 150px;
  cursor: pointer;

  &:focus {
    border-color: #4299e1;
  }
`;

const MediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MediaItem = styled.div`
  background: #f8fafc;
  border-radius: 0.5rem;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 1;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &:hover {
    border-color: #4299e1;
  }

  .dimensions {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: #3B82F6;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;

  button {
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e2e8f0;
    background: white;
    border-radius: 0.375rem;
    color: #4a5568;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(.active, :disabled) {
      background: #f7fafc;
    }

    &.active {
      background: #1a202c;
      color: white;
      border-color: #1a202c;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .dots {
    color: #4a5568;
  }
`;


const Media = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;


  // Create an array of your imported media
  const allMedia = [
    { id: 1, src: ZipFile, type: 'svg', },
    { id: 2, src: ZipFile, type: 'svg', },
    { id: 3, src: Container, type: 'png',},
    { id: 4, src: medai_1, type: 'svg',},
    { id: 5, src: medai_2, type: 'svg', },
    { id: 6, src: medai_3, type: 'svg', },
    { id: 7, src: medai_4, type: 'svg'},
    { id: 8, src: medai_5, type: 'svg'},
    { id: 9, src: medai_6, type: 'svg'},
    { id: 10, src: medai_7, type: 'svg' },
    { id: 11, src: medai_8, type: 'svg'},
    { id: 12, src: medai_9, type: 'svg'},
    { id: 13, src: medai_10, type: 'svg' },
    { id: 14, src: medai_11, type: 'svg' },
    { id: 15, src: medai_12, type: 'svg'},
    { id: 16, src: medai_13, type: 'svg'},
    { id: 17, src: medai_14, type: 'svg'},
    { id: 18, src: medai_15, type: 'svg' },
    { id: 19, src: medai_16, type: 'svg'},
    { id: 20, src: medai_17, type: 'svg'},
    { id: 21, src: medai_18, type: 'svg'},
    { id: 22, src: medai_19, type: 'svg'},
    { id: 23, src: medai_20, type: 'svg'},
    { id: 24, src: medai_21, type: 'svg'},
    { id: 25, src: medai_22, type: 'svg'},
    { id: 26, src: medai_23, type: 'svg' },
    { id: 27, src: medai_24, type: 'svg'},
    { id: 28, src: medai_25, type: 'svg' },
    { id: 29, src: medai_26, type: 'svg'},
    { id: 30, src: medai_27, type: 'svg'},
    { id: 31, src: medai_28, type: 'svg'},
    { id: 32, src: medai_29, type: 'svg'},
    { id: 33, src: medai_30, type: 'svg'},
    { id: 34, src: medai_31, type: 'svg'},
    { id: 35, src: medai_32, type: 'svg'},
    { id: 36, src: medai_33, type: 'svg'},
    { id: 37, src: medai_34, type: 'svg'},
    { id: 38, src: medai_35, type: 'svg'},
  ];

  const filteredMedia = allMedia.filter(media => 
    media.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMedia = [...filteredMedia].sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.id - a.id;
    }
    return a.id - b.id;
  });
  
  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedia = filteredMedia.slice(indexOfFirstItem, indexOfLastItem);

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;

    if (totalPages <= maxVisibleButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>
        );
      }
    } else {
      buttons.push(
        <button
          key="prev"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          ←
        </button>
      );

      if (currentPage > 3) {
        buttons.push(
          <button key={1} onClick={() => setCurrentPage(1)}>1</button>,
          <span key="dots1" className="dots">...</span>
        );
      }

      for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        buttons.push(
          <span key="dots2" className="dots">...</span>,
          <button key={totalPages} onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
        );
      }

      buttons.push(
        <button
          key="next"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          →
        </button>
      );
    }

    return buttons;
  };


  // Handle file upload
  const handleAddMedia = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => {
      const files = e.target.files;
      console.log('Files to upload:', files);
    };
    input.click();
  };



  return (
    <Container>
    <Header>
      <h1>Media Library</h1>
      <AddButton onClick={handleAddMedia}>
        <Plus size={16} />
        Add Media
      </AddButton>
    </Header>

    <Controls>
      <SearchInput
        type="text"
        placeholder="Search your files"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <SortSelect 
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
      >
        <option value="desc">Sort By desc</option>
        <option value="asc">Sort By asc</option>
      </SortSelect>
    </Controls>

    <MediaGrid>
      {currentMedia.map((item) => (
        <MediaItem key={item.id}>
          <img src={item.src} alt={`Media ${item.id}`} />
        </MediaItem>
      ))}
    </MediaGrid>

    <Pagination>
      {renderPaginationButtons()}
    </Pagination>
  </Container>
);
};

export default Media;

