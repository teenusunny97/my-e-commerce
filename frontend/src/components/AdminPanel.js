import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPanel({ products, fetchProducts, onLogout }) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
    existingImage: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Base styles
  const inputBase = {
    padding: '10px 16px',
    borderRadius: '14px',
    border: '1.5px solid #ddd',
    fontSize: '15px',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    backgroundColor: '#fafafa',
    marginBottom: '16px',
    fontWeight: '500',
    color: '#333',
  };

  const inputFocused = {
    borderColor: '#0099ff',
    boxShadow: '0 0 8px rgba(0, 153, 255, 0.4)',
    backgroundColor: '#fff',
    outline: 'none',
  };

  const buttonBase = {
    padding: '10px 22px',
    borderRadius: '14px',
    backgroundColor: '#0099ff',
    color: '#fff',
    border: 'none',
    fontSize: '15px',
    cursor: 'pointer',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(0, 153, 255, 0.3)',
    transition: 'background-color 0.3s ease, transform 0.15s ease',
    userSelect: 'none',
  };

  const buttonHover = {
    backgroundColor: '#007acc',
    transform: 'scale(1.05)',
  };

  const secondaryButton = {
    ...buttonBase,
    backgroundColor: '#777',
    boxShadow: 'none',
    color: '#eee',
  };

  // Handlers for form inputs
  const handleFocus = (name) => setFocusedInput(name);
  const handleBlur = () => setFocusedInput(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('price', Number(form.price));
      formData.append('description', form.description);
      if (form.image) {
        formData.append('image', form.image);
      }

      if (editingId) {
        // await fetch(`http://localhost:5000/products/${editingId}`, {
        //   method: 'PUT',
        //   body: formData,
        // });
        await fetch(`${process.env.REACT_APP_API_URL}/products/${editingId}`, {
  method: 'PUT',
  body: formData,
});

        setEditingId(null);
      } else {
        await fetch(`${process.env.REACT_APP_API_URL}/products`, {
  method: 'POST',
  body: formData,
});

        // await fetch('http://localhost:5000/products', {
        //   method: 'POST',
        //   body: formData,
        // });
      }

      setForm({ name: '', price: '', description: '', image: null, existingImage: null });
      if (fileInputRef.current) fileInputRef.current.value = null;
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: null,
      existingImage: product.image,
    });
    setEditingId(product._id);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const deleteProduct = async (id) => {
    try {
     // await fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' });
     await fetch(`${process.env.REACT_APP_API_URL}/products/${id}`, {
     method: 'DELETE',
});

      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', price: '', description: '', image: null, existingImage: null });
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  // Hover states for buttons (to avoid multiple useStates, inline CSS with onMouseEnter/Leave)
  // can be done but for brevity, use CSS :hover in style or keep this simple

  return (
    <div
      style={{
        padding: '28px 30px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        maxWidth: '900px',
        margin: 'auto',
        color: '#222',
      }}
    >
      <h2 style={{ marginBottom: '26px', fontWeight: '700', fontSize: '2rem' }}>
        📦 Admin Panel
      </h2>

      <button
        onClick={handleLogout}
        type="button"
        style={{
          ...buttonBase,
          width: '130px',
          marginBottom: '32px',
          boxShadow: '0 5px 15px rgba(0, 153, 255, 0.35)',
          fontWeight: '700',
          userSelect: 'none',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007acc')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0099ff')}
      >
        Logout
      </button>

      <form onSubmit={handleSubmit} style={{ marginBottom: '42px' }}>
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          onFocus={() => handleFocus('name')}
          onBlur={handleBlur}
          required
          style={{ ...inputBase, ...(focusedInput === 'name' ? inputFocused : {}) }}
        />

        <input
          name="price"
          type="number"
          placeholder="Price ($)"
          value={form.price}
          onChange={handleChange}
          onFocus={() => handleFocus('price')}
          onBlur={handleBlur}
          required
          min="0"
          step="0.01"
          style={{ ...inputBase, ...(focusedInput === 'price' ? inputFocused : {}) }}
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          onFocus={() => handleFocus('description')}
          onBlur={handleBlur}
          required
          style={{ ...inputBase, ...(focusedInput === 'description' ? inputFocused : {}) }}
        />

        {editingId && form.existingImage && !form.image && (
          <div
            style={{
              marginBottom: '14px',
              padding: '12px',
              backgroundColor: '#f5f8fa',
              borderRadius: '14px',
              boxShadow: '0 0 10px rgba(0,0,0,0.05)',
            }}
          >
            <p
              style={{
                marginBottom: '8px',
                fontWeight: '600',
                color: '#555',
                fontSize: '0.9rem',
              }}
            >
              Current Image:
            </p>
            <img
             // src={`http://localhost:5000${form.existingImage}`}
             src={`${process.env.REACT_APP_API_URL}${form.existingImage}`}

              alt="Current"
              width="180"
              style={{ borderRadius: '14px', boxShadow: '0 0 12px rgba(0,0,0,0.1)' }}
            />
          </div>
        )}

        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleChange}
          required={!editingId}
          ref={fileInputRef}
          style={{
            ...inputBase,
            cursor: 'pointer',
            padding: '10px 14px',
            fontWeight: '600',
          }}
        />

        <div style={{ marginTop: '8px' }}>
          <button
            type="submit"
            style={{
              ...buttonBase,
              width: editingId ? '160px' : '140px',
              fontWeight: '700',
              marginRight: editingId ? '16px' : '0',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#007acc')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0099ff')}
          >
            {editingId ? 'Update Product' : 'Add Product'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              style={{
                ...secondaryButton,
                width: '100px',
                fontWeight: '700',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#555')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#777')}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h3 style={{ fontWeight: '700', fontSize: '1.6rem', marginBottom: '20px' }}>
        All Products
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '24px',
        }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #e2e8f0',
              padding: '18px',
              borderRadius: '14px',
              minHeight: '420px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
              backgroundColor: '#fff',
            }}
          >
            {product.image && (
              <img
               // src={`http://localhost:5000${product.image}`}
               src={`${process.env.REACT_APP_API_URL}${product.image}`}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '210px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  marginBottom: '14px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                }}
              />
            )}

            <div style={{ flexGrow: 1 }}>
              <h4
                style={{
                  marginBottom: '8px',
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  color: '#111',
                }}
              >
                {product.name}
              </h4>
              <p
                style={{
                  marginBottom: '12px',
                  fontWeight: '600',
                  color: '#007acc',
                  fontSize: '1rem',
                }}
              >
                ${product.price.toFixed(2)}
              </p>
              <p style={{ color: '#444', fontSize: '0.95rem', lineHeight: '1.4' }}>
                {product.description}
              </p>
            </div>

            <div
              style={{
                marginTop: 'auto',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <button
                onClick={() => handleEdit(product)}
                style={{
                  ...buttonBase,
                  backgroundColor: '#28a745',
                  width: '110px',
                  fontSize: '14px',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(40, 167, 69, 0.4)',
                  transition: 'background-color 0.3s ease, transform 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#218838';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#28a745';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteProduct(product._id)}
                style={{
                  ...buttonBase,
                  backgroundColor: '#dc3545',
                  width: '110px',
                  fontSize: '14px',
                  fontWeight: '700',
                  boxShadow: '0 4px 12px rgba(220, 53, 69, 0.4)',
                  transition: 'background-color 0.3s ease, transform 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#c82333';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc3545';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;
