import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

import StoreFront from './components/Storefront';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import CartPage from './components/CartPage';  // new

function App() {
  const [products, setProducts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);  // cart moved here

  const fetchProducts = async () => {
  try {
    //const res = await fetch('http://localhost:5000/products');
    const res = await fetch(`${process.env.REACT_APP_API_URL}/products`);
    const data = await res.json();
    setProducts(data);
  } catch (error) {
    console.error(error);
  }
};


  useEffect(() => {
    fetchProducts();
  }, []);

  const login = (password) => {
    if (password === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  // Cart functions
  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const increment = (productId) => {
    setCart(
      cart.map((item) =>
        item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrement = (productId) => {
    const product = cart.find((item) => item._id === productId);
    if (product.quantity === 1) {
      setCart(cart.filter((item) => item._id !== productId));
    } else {
      setCart(
        cart.map((item) =>
          item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
      );
    }
  };

  function PrivateRoute({ children }) {
    return isAdmin ? children : <Navigate to="/admin/login" />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <StoreFront
              products={products}
              cart={cart}
              addToCart={addToCart}
              increment={increment}
              decrement={decrement}
            />
          }
        />
        <Route path="/cart" element={
          <CartPage
            cart={cart}
            increment={increment}
            decrement={decrement}
          />
        } />
        <Route path="/admin/login" element={<AdminLogin login={login} />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel products={products} fetchProducts={fetchProducts} onLogout={logout} />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
