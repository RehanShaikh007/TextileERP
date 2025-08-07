const API_BASE_URL = 'http://localhost:4000/api/v1'; 

export const createProduct = async (productData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/addProduct`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const uploadProductImages = async (files) => {
  try {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_BASE_URL}/products/upload-images`, {
      method: 'POST',
      body: formData,

    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Image upload failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};