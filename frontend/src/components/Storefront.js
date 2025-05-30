import React from 'react';
import { Link } from 'react-router-dom';

function StoreFront({ products, cart, addToCart, increment, decrement }) {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const getQuantity = (productId) => {
    const item = cart.find((item) => item._id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Navbar */}
      <nav
        style={{
          backgroundColor: '#24292e',
          color: '#ffffff',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          fontSize: '1rem',
          fontWeight: '600',
        }}
      >
        <h1 style={{ margin: 0 }}>🛒 My Store</h1>
        <Link
          to="/cart"
          style={{
            color: '#ffffff',
            textDecoration: 'none',
            backgroundColor: '#0366d6',
            padding: '8px 16px',
            borderRadius: '20px',
            fontWeight: '600',
            boxShadow: '0 4px 8px rgba(3, 102, 214, 0.3)',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#024ea2')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0366d6')}
          title="View Cart"
        >
          Cart Items: <strong>{totalItems}</strong>
        </Link>
      </nav>

      {/* Product Grid */}
      <main style={{ padding: '30px 28px', maxWidth: '1200px', margin: 'auto' }}>
        {products.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6c757d', fontSize: '1.1rem' }}>No products available.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '22px',
            }}
          >
            {products.map((product) => {
              const quantity = getQuantity(product._id);

              return (
                <div
                  key={product._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '18px',
                    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '370px',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    cursor: 'default',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <div>
                    <img
                     // src={`http://localhost:5000${product.image}`}
                     src={`${process.env.REACT_APP_API_URL}${product.image}`}

                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        marginBottom: '12px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                      }}
                    />
                    <h3
                      style={{
                        margin: '0 0 6px',
                        fontSize: '1.15rem',
                        color: '#24292e',
                        fontWeight: '700',
                        lineHeight: '1.2',
                      }}
                    >
                      {product.name}
                    </h3>
                    <p
                      style={{
                        color: '#218838',
                        fontWeight: '700',
                        fontSize: '1rem',
                        margin: '0 0 8px',
                      }}
                    >
                      ${product.price.toFixed(2)}
                    </p>
                    <p
                      style={{
                        color: '#6c757d',
                        fontSize: '0.9rem',
                        lineHeight: '1.3',
                        minHeight: '52px',
                      }}
                    >
                      {product.description.length > 80
                        ? product.description.slice(0, 77) + '...'
                        : product.description}
                    </p>
                  </div>

                  <div style={{ marginTop: 'auto' }}>
                    {quantity === 0 ? (
                      <button
                        onClick={() => addToCart(product)}
                        style={{
                          width: '100%',
                          padding: '11px 0',
                          marginTop: '14px',
                          backgroundColor: '#0366d6',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '1rem',
                          transition: 'background-color 0.3s ease',
                          boxShadow: '0 6px 12px rgba(3, 102, 214, 0.3)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#024ea2')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0366d6')}
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: '14px',
                          gap: '14px',
                        }}
                      >
                        <button
                          onClick={() => decrement(product._id)}
                          style={{
                            padding: '6px 14px',
                            cursor: 'pointer',
                            fontSize: '18px',
                            borderRadius: '6px',
                            border: '1.8px solid #d1d5da',
                            backgroundColor: '#f6f8fa',
                            transition: 'background-color 0.2s ease',
                            fontWeight: '600',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eaeef2')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f6f8fa')}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span
                          style={{
                            fontWeight: '700',
                            minWidth: '28px',
                            textAlign: 'center',
                            fontSize: '18px',
                            color: '#24292e',
                          }}
                          aria-live="polite"
                        >
                          {quantity}
                        </span>
                        <button
                          onClick={() => increment(product._id)}
                          style={{
                            padding: '6px 14px',
                            cursor: 'pointer',
                            fontSize: '18px',
                            borderRadius: '6px',
                            border: '1.8px solid #d1d5da',
                            backgroundColor: '#f6f8fa',
                            transition: 'background-color 0.2s ease',
                            fontWeight: '600',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eaeef2')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f6f8fa')}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default StoreFront;
