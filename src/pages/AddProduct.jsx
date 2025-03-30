import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import {
  Settings,
  Image as ImageIcon,
  Package,
  ToggleLeft,
  ArrowLeft,
  Diamond
} from "lucide-react";
import { createProduct, fetchProduct, updateProduct } from "../features/products/productSlice";
import { fetchCategories } from "../features/category/categorySlice";
import { toast } from "react-hot-toast";
import { fetchSubcategoriesByCategory } from "../features/subCategory/subcategorySlice";
import { ChromePicker } from "react-color";
import { API_URL } from '../config/constants';

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

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 1.5rem;
  margin-top: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
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
  const { loading: productLoading } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const { subcategories } = useSelector((state) => state.subcategory);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [activeSection, setActiveSection] = useState("general");
  const [images, setImages] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [stoneColorPickerVisible, setStoneColorPickerVisible] = useState(false);
  const [metalColorPickerVisible, setMetalColorPickerVisible] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    stone: "",
    totalWeight: "",
    color: "",
    clarity: "",
    stoneType: "",
    stoneColor: "",
    stoneShape: "",
    stoneCaratRange: "",
    stoneClass: "",
    stoneSetting: "",
    settingOnly: false,
    metalType: "",
    metalColor: "",
    metalFinish: "",
    goldKarat: "",
    ringDesign: "",
    ringStyle: "",
    standardRingSize: "",
    height: ""
  });
  useEffect(() => {
    if (formData.category) {
      dispatch(fetchSubcategoriesByCategory(formData.category));
    }
  }, [formData.category, dispatch]);
  
  useEffect(() => {
    dispatch(fetchCategories());

    if (isEditMode) {
      setIsLoading(true);
      dispatch(fetchProduct(id))
        .unwrap()
        .then((response) => {
          if (response && response.data && response.data.product) {
            const product = response.data.product;
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
              subcategory: product.subcategory ? product.subcategory._id : "",
              isActive: product.isActive,
              isFeatured: product.isFeatured,
              isNewArrival: product.isNewArrival,
              stone: product.stone || "",
              totalWeight: product.totalWeight || "",
              color: product.color || "",
              clarity: product.clarity || "",
              stoneType: product.stoneType || "",
              stoneColor: product.stoneColor || "",
              stoneShape: product.stoneShape || "",
              stoneCaratRange: product.stoneCaratRange || "",
              stoneClass: product.stoneClass || "",
              stoneSetting: product.stoneSetting || "",
              settingOnly: product.settingOnly || false,
              metalType: product.metalType || "",
              metalColor: product.metalColor || "",
              metalFinish: product.metalFinish || "",
              goldKarat: product.goldKarat || "",
              ringDesign: product.ringDesign || "",
              ringStyle: product.ringStyle || "",
              standardRingSize: product.standardRingSize || "",
              height: product.height || ""
            });
            if (product.images && product.images.length) {
              setImages(product.images.map(img => ({
                url: img.url,
                alt: img.alt || "",
                isMain: img.isMain || false
              })));
            }
            if (product.category && product.category._id) {
              dispatch(fetchSubcategoriesByCategory(product.category._id));
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          toast.error(`Failed to fetch product: ${error.message || "Product not found"}`);
          navigate("/products/all");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [dispatch, id, isEditMode, navigate]);

  const menuItems = [
    { id: "general", label: "General", icon: Settings },
    { id: "jewelry", label: "Jewelry Details", icon: Diamond },
    { id: "images", label: "Product Images", icon: ImageIcon },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "status", label: "Status", icon: ToggleLeft }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleColorChange = (color, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: color.hex
    }));
  };

  const handleImageUpload = async (e) => {
    try {
      setUploadingImage(true);
      const file = e.target.files[0];
      if (file) {
        console.log("Uploading file:", file.name);
        const formData = new FormData();
        formData.append("file", file);
        
        const response = await fetch(
          `${API_URL}/api/v1/media/upload`,
          {
            method: "POST",
            body: formData
          }
        );
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Upload failed: ${errorData.message || response.statusText}`);
        }
        
        const responseData = await response.json();
        console.log("Upload response:", responseData);
        
        if (!responseData.data || !responseData.data.fileUrl) {
          throw new Error('Invalid response format from server');
        }
        
        setImages((prev) => [
          ...prev,
          {
            url: responseData.data.fileUrl,
            alt: file.name,
            isMain: prev.length === 0
          }
        ]);
        
        toast.success(`${file.name} uploaded successfully`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    formDataToSend.append(
      "images",
      JSON.stringify(
        images.map((img) => ({
          url: img.url,
          alt: img.alt
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
      navigate("/products/all");
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

  const renderJewelrySection = () => (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Stone Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <FormGroup>
          <label>Stone</label>
          <Input
            type="text"
            name="stone"
            value={formData.stone}
            onChange={handleInputChange}
            placeholder="Enter stone name"
          />
        </FormGroup>

        <FormGroup>
          <label>Total Weight (CT. T.W.)</label>
          <Input
            type="number"
            name="totalWeight"
            value={formData.totalWeight}
            onChange={handleInputChange}
            placeholder="Enter total weight"
            step="0.01"
            min="0"
          />
        </FormGroup>

        <FormGroup>
          <label>Color</label>
          <div style={{ position: 'relative' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                cursor: 'pointer'
              }}
              onClick={() => setColorPickerVisible(!colorPickerVisible)}
            >
              <div 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  backgroundColor: formData.color,
                  borderRadius: '4px',
                  marginRight: '8px',
                  border: '1px solid #ddd'
                }} 
              />
              <span>{formData.color}</span>
            </div>
            {colorPickerVisible && (
              <div style={{ position: 'absolute', zIndex: 2, marginTop: '4px' }}>
                <div 
                  style={{ 
                    position: 'fixed', 
                    top: '0px', 
                    right: '0px', 
                    bottom: '0px', 
                    left: '0px' 
                  }} 
                  onClick={() => setColorPickerVisible(false)}
                />
                <ChromePicker 
                  color={formData.color} 
                  onChange={(color) => handleColorChange(color, 'color')} 
                />
              </div>
            )}
          </div>
        </FormGroup>

        <FormGroup>
          <label>Clarity</label>
          <Select name="clarity" value={formData.clarity} onChange={handleInputChange}>
            <option value="">Select clarity</option>
            <option value="FL">FL - Flawless</option>
            <option value="IF">IF - Internally Flawless</option>
            <option value="VVS1">VVS1 - Very Very Slightly Included 1</option>
            <option value="VVS2">VVS2 - Very Very Slightly Included 2</option>
            <option value="VS1">VS1 - Very Slightly Included 1</option>
            <option value="VS2">VS2 - Very Slightly Included 2</option>
            <option value="SI1">SI1 - Slightly Included 1</option>
            <option value="SI2">SI2 - Slightly Included 2</option>
            <option value="I1">I1 - Inclusions 1</option>
            <option value="I2">I2 - Inclusions 2</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <label>Stone Type</label>
          <Select name="stoneType" value={formData.stoneType} onChange={handleInputChange}>
            <option value="">Select stone type</option>
            <option value="Diamond">Diamond</option>
            <option value="Ruby">Ruby</option>
            <option value="Emerald">Emerald</option>
            <option value="Sapphire">Sapphire</option>
            <option value="Amethyst">Amethyst</option>
            <option value="Topaz">Topaz</option>
            <option value="Opal">Opal</option>
            <option value="Pearl">Pearl</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <label>Stone Color</label>
          <div style={{ position: 'relative' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                cursor: 'pointer'
              }}
              onClick={() => setStoneColorPickerVisible(!stoneColorPickerVisible)}
            >
              <div 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  backgroundColor: formData.stoneColor,
                  borderRadius: '4px',
                  marginRight: '8px',
                  border: '1px solid #ddd'
                }} 
              />
              <span>{formData.stoneColor}</span>
            </div>
            {stoneColorPickerVisible && (
              <div style={{ position: 'absolute', zIndex: 2, marginTop: '4px' }}>
                <div 
                  style={{ 
                    position: 'fixed', 
                    top: '0px', 
                    right: '0px', 
                    bottom: '0px', 
                    left: '0px' 
                  }} 
                  onClick={() => setStoneColorPickerVisible(false)}
                />
                <ChromePicker 
                  color={formData.stoneColor} 
                  onChange={(color) => handleColorChange(color, 'stoneColor')} 
                />
              </div>
            )}
          </div>
        </FormGroup>

        <FormGroup>
          <label>Stone Shape</label>
          <Select name="stoneShape" value={formData.stoneShape} onChange={handleInputChange}>
            <option value="">Select stone shape</option>
            <option value="Round">Round</option>
            <option value="Princess">Princess</option>
            <option value="Cushion">Cushion</option>
            <option value="Emerald">Emerald</option>
            <option value="Oval">Oval</option>
            <option value="Pear">Pear</option>
            <option value="Marquise">Marquise</option>
            <option value="Radiant">Radiant</option>
            <option value="Asscher">Asscher</option>
            <option value="Heart">Heart</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <label>Stone Carat Range</label>
          <Input
            type="text"
            name="stoneCaratRange"
            value={formData.stoneCaratRange}
            onChange={handleInputChange}
            placeholder="e.g., 1 Ctw - Under 3 Ctw"
          />
        </FormGroup>

        <FormGroup>
          <label>Stone Class</label>
          <Select name="stoneClass" value={formData.stoneClass} onChange={handleInputChange}>
            <option value="">Select stone class</option>
            <option value="Natural">Natural</option>
            <option value="Lab-grown">Lab-grown</option>
            <option value="Synthetic">Synthetic</option>
            <option value="Simulated">Simulated</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <label>Stone Setting</label>
          <Select name="stoneSetting" value={formData.stoneSetting} onChange={handleInputChange}>
            <option value="">Select stone setting</option>
            <option value="Prong">Prong</option>
            <option value="Bezel">Bezel</option>
            <option value="Channel">Channel</option>
            <option value="Pavé">Pavé</option>
            <option value="Halo">Halo</option>
            <option value="Tension">Tension</option>
            <option value="Invisible">Invisible</option>
            <option value="Bar">Bar</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <label>Setting Only</label>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              id="settingOnly"
              name="settingOnly"
              checked={formData.settingOnly}
              onChange={(e) => handleInputChange({ target: { name: 'settingOnly', value: e.target.checked } })}
              style={{ marginRight: '8px' }}
            />
            <label htmlFor="settingOnly">Yes</label>
          </div>
        </FormGroup>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-6 mt-8">Metal Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <FormGroup>
          <label>Metal Type</label>
          <Select name="metalType" value={formData.metalType} onChange={handleInputChange}>
            <option value="">Select metal type</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Platinum">Platinum</option>
            <option value="Palladium">Palladium</option>
            <option value="Titanium">Titanium</option>
            <option value="Stainless Steel">Stainless Steel</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <label>Metal Color</label>
          <div style={{ position: 'relative' }}>
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: '0.375rem',
                padding: '0.5rem',
                cursor: 'pointer'
              }}
              onClick={() => setMetalColorPickerVisible(!metalColorPickerVisible)}
            >
              <div 
                style={{ 
                  width: '24px', 
                  height: '24px', 
                  backgroundColor: formData.metalColor,
                  borderRadius: '4px',
                  marginRight: '8px',
                  border: '1px solid #ddd'
                }} 
              />
              <span>{formData.metalColor}</span>
            </div>
            {metalColorPickerVisible && (
              <div style={{ position: 'absolute', zIndex: 2, marginTop: '4px' }}>
                <div 
                  style={{ 
                    position: 'fixed', 
                    top: '0px', 
                    right: '0px', 
                    bottom: '0px', 
                    left: '0px' 
                  }} 
                  onClick={() => setMetalColorPickerVisible(false)}
                />
                <ChromePicker 
                  color={formData.metalColor} 
                  onChange={(color) => handleColorChange(color, 'metalColor')} 
                />
              </div>
            )}
          </div>
        </FormGroup>

        <FormGroup>
          <label>Metal Finish</label>
          <Select name="metalFinish" value={formData.metalFinish} onChange={handleInputChange}>
            <option value="">Select metal finish</option>
            <option value="Polished">Polished</option>
            <option value="Brushed">Brushed</option>
            <option value="Matte">Matte</option>
            <option value="Satin">Satin</option>
            <option value="Hammered">Hammered</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <label>Gold Karat</label>
          <Select name="goldKarat" value={formData.goldKarat} onChange={handleInputChange}>
            <option value="">Select gold karat</option>
            <option value="10K">10K</option>
            <option value="14K">14K</option>
            <option value="18K">18K</option>
            <option value="22K">22K</option>
            <option value="24K">24K</option>
          </Select>
        </FormGroup>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-6 mt-8">Ring Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <FormGroup>
          <label>Ring Design</label>
          <Input
            type="text"
            name="ringDesign"
            value={formData.ringDesign}
            onChange={handleInputChange}
            placeholder="Enter ring design"
          />
        </FormGroup>

        <FormGroup>
          <label>Ring Style</label>
          <Select name="ringStyle" value={formData.ringStyle} onChange={handleInputChange}>
            <option value="">Select ring style</option>
            <option value="Solitaire">Solitaire</option>
            <option value="Halo">Halo</option>
            <option value="Three Stone">Three Stone</option>
            <option value="Vintage">Vintage</option>
            <option value="Side Stone">Side Stone</option>
            <option value="Eternity">Eternity</option>
            <option value="Wedding">Wedding</option>
            <option value="Engagement">Engagement</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <label>Standard Ring Size</label>
          <Input
            type="text"
            name="standardRingSize"
            value={formData.standardRingSize}
            onChange={handleInputChange}
            placeholder="Enter standard ring size"
          />
        </FormGroup>

        <FormGroup>
          <label>Height</label>
          <Input
            type="text"
            name="height"
            value={formData.height}
            onChange={handleInputChange}
            placeholder="Enter height (e.g., 2.9 mm)"
          />
        </FormGroup>
      </div>
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
      case "jewelry":
        return renderJewelrySection();
      default:
        return renderGeneralSection();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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

      <FormSection>
        <FormHeader>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center"
            }}
          >
            <ArrowLeft size={18} />
          </button>
          {isEditMode ? "Edit Product" : "Add New Product"}
        </FormHeader>
        <form onSubmit={handleFormSubmit}>
          {renderActiveSection()}

          <ButtonGroup>
            <Button type="submit" primary disabled={productLoading}>
              {productLoading ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
            </Button>
          </ButtonGroup>
        </form>
      </FormSection>
    </Container>
  );
};

export default AddProduct;