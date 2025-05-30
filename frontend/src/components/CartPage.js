import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function CartPage({ cart, increment, decrement }) {
  const navigate = useNavigate();
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div>
      {/* Navbar */}
      <nav
        style={{
          backgroundColor: '#222',
          color: 'white',
          padding: '15px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0 }}>🛒 My Store</h1>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '18px' }}>
          Back to Store
        </Link>
      </nav>

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'flex',
                  gap: '20px',
                  marginBottom: '20px',
                  border: '1px solid #eee',
                  padding: '15px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                }}
              >
                {/* Product Image */}
                <img
                //  src={`http://localhost:5000${item.image}`}
                src={`${process.env.REACT_APP_API_URL}${item.image}`}

                  alt={item.name}
                  style={{
                    width: '120px',
                    height: '120px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />

                {/* Product Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 8px' }}>{item.name}</h3>
                  <p style={{ margin: '0 0 8px', color: '#555' }}>{item.description}</p>
                  <p style={{ margin: '0 0 8px' }}>
                    Price: <strong>${item.price.toFixed(2)}</strong>
                  </p>
                  <p style={{ margin: '0 0 12px' }}>
                    Subtotal: <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                  </p>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => decrement(item._id)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '16px',
                        cursor: 'pointer',
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increment(item._id)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '16px',
                        cursor: 'pointer',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <hr />
            <div
              style={{
                textAlign: 'right',
                fontWeight: 'bold',
                fontSize: '18px',
                marginBottom: '20px',
              }}
            >
              Total: ${totalPrice.toFixed(2)}
            </div>
            <button
              onClick={() => alert('Proceeding to payment (placeholder)...')}
              style={{
                backgroundColor: 'green',
                color: 'white',
                padding: '12px 20px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Proceed to Payment
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;
