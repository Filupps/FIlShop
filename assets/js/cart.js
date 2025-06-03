// Cart Context
const CartContext = React.createContext();

function CartProvider({ children }) {
  const [cartItems, setCartItems] = React.useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  const [totalItems, setTotalItems] = React.useState(0);
  const cartCounterRef = React.useRef(null);

  // Обновляем общее количество товаров при изменении корзины
  React.useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
    setTotalItems(total);
    
    // Обновляем счетчик в DOM с анимацией
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
      cartCounterRef.current = cartCounter;
      
      if (total > 0) {
        cartCounter.textContent = total;
        cartCounter.classList.add('show');
        
        // Добавляем анимацию пульсации при изменении количества
        cartCounter.classList.add('pulse');
        setTimeout(() => {
          cartCounter.classList.remove('pulse');
        }, 300);
      } else {
        cartCounter.classList.remove('show');
      }
    }
  }, [cartItems]);

  // Сохраняем корзину в localStorage при изменениях
  React.useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const removeFromCart = React.useCallback((itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = React.useCallback((itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, []);

  const clearCart = React.useCallback(() => {
    setCartItems([]);
  }, []);

  const value = {
    cartItems,
    totalItems,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}


function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="cart-item">
      <img src={item.image} alt={item.title} />
      <div className="cart-item-info">
        <h3>{item.title}</h3>
      </div>
      <div className="cart-item-quantity">
        <button onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}>-</button>
        <span>{item.quantity || 1}</span>
        <button onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}>+</button>
      </div>
      <div className="cart-item-price">
        {item.price * (item.quantity || 1)} ₽
      </div>
      <button 
        className="remove-item"
        onClick={() => removeFromCart(item.id)}
      >
        ✕
      </button>
    </div>
  );
}

function Cart() {
  const { cartItems, clearCart } = useCart();
  const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  const handleCheckout = () => {
    window.orderModal.open(cartItems, total);
  };

  return (
    <div className="cart-main-container">
      {cartItems.length > 0 ? (
        <>
          <div className="cart-items">
            <h1>Корзина</h1>
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <div className="cart-summary">
            <div className="cart-total">
              <span>Итого:</span>
              <span>{total} ₽</span>
            </div>
            <div className="cart-actions">
              <button className="clear-cart" onClick={clearCart}>
                Очистить корзину
              </button>
              <button className="checkout" onClick={handleCheckout}>
                Оформить заказ
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-cart">
          <p>Ваша корзина пуста</p>
          <a href="catalog.html" className="continue-shopping">
            Перейти в каталог
          </a>
        </div>
      )}
    </div>
  );
}


ReactDOM.render(
  <CartProvider>
    <Cart />
  </CartProvider>,
  document.getElementById('cart-root')
); 

