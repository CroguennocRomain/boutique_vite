import React, { useState, useEffect } from 'react';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  const addToCart = (p) => {
    const exists = cart.find(x => x.id === p.id);
    if (exists) {
      setCart(cart.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x));
    } else {
      setCart([...cart, { ...p, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0 }}>BOUTIQUE</h1>
        <button onClick={() => setShowCart(!showCart)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
          PANIER ({cart.reduce((a, b) => a + b.qty, 0)})
        </button>
      </header>

      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ flex: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {products.map(p => (
            <div key={p.id} style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
              <img src={p.image} alt="" style={{ width: '100%', height: '150px', objectFit: 'contain' }} />
              <h4 style={{ fontSize: '14px', height: '40px', overflow: 'hidden' }}>{p.title}</h4>
              <p style={{ fontWeight: 'bold' }}>{p.price} €</p>
              <button 
                onClick={() => addToCart(p)}
                style={{ width: '100%', padding: '10px', background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}
              >
                AJOUTER
              </button>
            </div>
          ))}
        </div>

        {showCart && (
          <div style={{ flex: 1, borderLeft: '2px solid #000', paddingLeft: '20px', minWidth: '250px' }}>
            <h2>Votre Panier</h2>
            {cart.length === 0 ? <p>Vide.</p> : (
              <>
                {cart.map(item => (
                  <div key={item.id} style={{ marginBottom: '15px', fontSize: '14px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                    <div style={{ fontWeight: '500' }}>{item.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                      <span>{item.qty} x {item.price} €</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))}
                <hr />
                <h3>Total : {cart.reduce((total, item) => total + (item.price * item.qty), 0).toFixed(2)} €</h3>
                <button style={{ width: '100%', padding: '15px', background: 'green', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                  PAYER
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;