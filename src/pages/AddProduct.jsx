import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  Settings,
  Image as ImageIcon,
  Package,
  ToggleLeft,
  ArrowLeft
} from "lucide-react";
import { createProduct, fetchProduct, updateProduct } from "../features/products/productSlice";
import { fetchCategories } from "../features/category/categorySlice";
import { fetchTags } from "../features/tags/tagSlice";
import { toast } from "react-hot-toast";
import { fetchSubcategoriesByCategory } from "../features/subCategory/subcategorySlice";

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
  background: ${(props) => (props.active ? "#f1f5f9" : "transparent")};
  color: ${(props) => (props.active ? "#000" : "#64748b")};
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
  display: flex;
  align-items: center;
  gap: 1rem;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  ${(props) =>
    props.primary
      ? `
    background: #000;
    color: white;
    border: none;
    &:hover { background: #1a1a1a; }
    &:disabled { background: #ccc; cursor: not-allowed; }
  `
      : `
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

const HelperText = styled.div`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #718096;
  font-style: italic;
`;

const AddProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { loading } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const { subcategories } = useSelector((state) => state.subcategory); // Add this line
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
    const { tags } = useSelector((state) => state.tag);
  const [activeSection, setActiveSection] = useState("general");
  const [images, setImages] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",

    shortDescription: "",
    type: "physical",
    brand: "",
    regularPrice: "",
    salePrice: "",
    stockQuantity: "",
    lowStockThreshold: "10",
    stockStatus: "in_stock",
    category: "",
    subcategory: '',
    tags: [],
    isActive: true,
    isFeatured: false,
    isNewArrival: false
  });
  useEffect(() => {
    if (formData.category) {
      dispatch(fetchSubcategoriesByCategory(formData.category));
    }
  }, [formData.category, dispatch]);
  
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchTags());

    if (isEditMode) {
      dispatch(fetchProduct(id)).then((action) => {
        if (action.payload) {
          const product = action.payload.data.product;
          setSelectedProduct(product);
          setFormData({
            name: product.name,
            sku: product.sku,
            description: product.description,
            shortDescription: product.shortDescription,
            type: product.type,
            brand: product.brand,
            regularPrice: product.regularPrice,
            salePrice: product.salePrice || "",
            stockQuantity: product.stockQuantity,
            lowStockThreshold: product.lowStockThreshold,
            stockStatus: product.stockStatus,
            category: product.category._id,
            tags: product.tags.map(tag => tag._id || tag),
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            isNewArrival: product.isNewArrival
          });
          setImages(product.images.map(img => ({
            preview: img.url,
            url: img.url,
            alt: img.alt
          })));
        }
      });
    }
  }, [dispatch, id, isEditMode]);

  const menuItems = [
    { id: "general", label: "General", icon: Settings },
    { id: "images", label: "Product Images", icon: ImageIcon },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "status", label: "Status", icon: ToggleLeft }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "tags") {
      const selectedTags = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData((prev) => ({
        ...prev,
        tags: selectedTags
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? Number(value)
            : value
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(
          "https://chirag-backend.onrender.com/api/files/upload",
          {
            method: "POST",
            body: formData
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to upload file: ${response.statusText}`);
        }
        const responseData = await response.json();
        setImages((prev) => [
          ...prev,
          {
            file,
            preview: responseData.fileUrl,
            url: responseData.fileUrl
          }
        ]);
      } catch (error) {
        toast.error(`Error uploading file: ${error.message}`);
      }
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "tags") {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    formDataToSend.append(
      "images",
      JSON.stringify(
        images.map((img) => ({
          url: img.url,
          alt: img.file ? img.file.name : img.alt
        }))
      )
    );

    try {
      if (isEditMode) {
        await dispatch(updateProduct({ id, productData: formDataToSend })).unwrap();
        toast.success("Product updated successfully");
      } else {
        await dispatch(createProduct(formDataToSend)).unwrap();
        toast.success("Product created successfully");
      }
      navigate("/products");
    } catch (error) {
      toast.error(error.message || "Error saving product");
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "sku",
      "description",
      "shortDescription",
      "type",
      "brand",
      "regularPrice",
      "stockQuantity",
      "category"
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    if (images.length === 0) {
      toast.error("Please add at least one product image");
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
          required
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
          required
        />
      </FormGroup>

      <FormGroup>
        <label className="required">Short Description</label>
        <TextArea
          name="shortDescription"
          value={formData.shortDescription}
          onChange={handleInputChange}
          placeholder="Enter short description"
          required
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
          required
        />
      </FormGroup>

      <FormGroup>
        <label className="required">Type</label>
        <Select name="type" value={formData.type} onChange={handleInputChange}>
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
          required
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
          required
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

      <FormGroup>
        <label className="required">Category</label>
        <Select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormGroup>
      <FormGroup>
  <label className="required">Subcategory</label>
  <Select
    name="subcategory"
    value={formData.subcategory}
    onChange={handleInputChange}
    required
    disabled={!formData.category}
  >
    <option value="">Select a subcategory</option>
    {subcategories
      .filter(sub => sub.category._id === formData.category)
      .map((subcategory) => (
        <option key={subcategory._id} value={subcategory._id}>
          {subcategory.name}
        </option>
    ))}
  </Select>
</FormGroup>
      <FormGroup>
        <label>Tags</label>
        <Select
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
          multiple
        >
          {tags.map((tag) => (
            <option key={tag._id} value={tag._id}>
              {tag.name}
            </option>
          ))}
        </Select>
      </FormGroup>
    </>
  );

  const renderImagesSection = () => (
    <>
      <FormGroup>
        <label className="required">Product Images</label>
        <ImageUploadArea
          onClick={() => document.getElementById("imageInput").click()}
        >
          <ImageIcon size={48} color="#64748b" />
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
              <button onClick={() => removeImage(index)}>×</button>
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
          required
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

  const renderStatusSection = () => (
    <>
      <FormGroup>
        <label>Active Status</label>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Toggle>
            <ToggleInput
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
            />
            <ToggleSlider />
          </Toggle>
          <span>{formData.isActive ? "Active" : "Inactive"}</span>
        </div>
      </FormGroup>
      <FormGroup>
        <label>Featured Product</label>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Toggle>
            <ToggleInput
              type="checkbox"
              name="isFeatured"
              checked={formData.isFeatured}
              onChange={handleInputChange}
            />
            <ToggleSlider />
          </Toggle>
          <span>{formData.isFeatured ? "Featured" : "Not Featured"}</span>
        </div>
      </FormGroup>

      <FormGroup>
        <label>New Arrival</label>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Toggle>
            <ToggleInput
              type="checkbox"
              name="isNewArrival"
              checked={formData.isNewArrival}
              onChange={handleInputChange}
            />
            <ToggleSlider />
          </Toggle>
          <span>
            {formData.isNewArrival ? "New Arrival" : "Not New Arrival"}
          </span>
        </div>
      </FormGroup>
    </>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case "general":
        return renderGeneralSection();
      case "images":
        return renderImagesSection();
      case "inventory":
        return renderInventorySection();
      case "status":
        return renderStatusSection();
      default:
        return renderGeneralSection();
    }
  };

  return (
    <Container>
      <Sidebar>
        {menuItems.map((item) => (
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
          <FormHeader>
            <Button 
              type="button" 
              onClick={() => navigate("/products")}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                padding: 0, 
                marginRight: '1rem' 
              }}
            >
              <ArrowLeft size={24} />
            </Button>
            {isEditMode ? "Edit Product" : "Add Product"}
          </FormHeader>
          {renderActiveSection()}
          <ButtonGroup>
            <Button type="button" onClick={() => navigate("/products")}>
              Cancel
            </Button>
            <Button type="submit" primary disabled={loading}>
              {loading ? "Saving..." : (isEditMode ? "Update Product" : "Save Product")}
            </Button>
          </ButtonGroup>
        </FormSection>
      </form>
    </Container>
  );
};

export default AddProduct;