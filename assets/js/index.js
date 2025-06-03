// Типы
const CartItem = {
  id: Number,
  title: String,
  price: Number,
  image: String,
  quantity: Number,
  video: String,
  description: String,
  genre: String,
  rating: Number
};

// Контекст корзины
const CartContext = React.createContext();

function CartProvider({ children }) {
  const [cartItems, setCartItems] = React.useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Ошибка загрузки корзины из localStorage:', error);
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
      console.error('Ошибка сохранения корзины в localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = React.useCallback((item) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex === -1) {
        // Добавляем новый товар
        return [...prevItems, { ...item, quantity: 1 }];
      } else {
        // Увеличиваем количество существующего товара
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: (newItems[existingItemIndex].quantity || 1) + 1
        };
        return newItems;
      }
    });
  }, []);

  const removeFromCart = React.useCallback((itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = React.useCallback((itemId, quantity) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = React.useCallback(() => {
    setCartItems([]);
  }, []);

  const value = {
    cartItems,
    totalItems,
    addToCart,
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

// Пользовательский хук для использования корзины
function useCart() {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error('useCart должен использоваться внутри CartProvider');
  }
  return context;
}

// Сопоставление жанров
const genreMap = {
  action: "Экшн",
  adventure: "Приключения",
  rpg: "Ролевые",
  strategy: "Стратегии",
  simulator: "Симуляторы",
  sport: "Спортивные",
  racing: "Гонки",
  horror: "Хоррор"
};

// Данные игр для рекомендуемых игр
const featuredGames = [
  {
    id: 1,
    title: "Cyberpunk 2077",
    price: 2999,
    image: "assets/img/games/game1.webp",
    video: "assets/videos/game1.webm",
    description: "Откройте для себя захватывающий мир будущего в Night City. Станьте киберпанком и измените судьбу города в этой эпической RPG.",
    genre: "rpg",
    rating: 4.8
  },
  {
    id: 2,
    title: "Hogwarts Legacy",
    price: 3499,
    image: "assets/img/games/game2.webp",
    video: "assets/videos/game2.webm",
    description: "Погрузитесь в мир магии и волшебства. Станьте студентом Хогвартса и раскройте древние тайны магического мира.",
    genre: "rpg",
    rating: 4.9
  },
  {
    id: 3,
    title: "The Witcher 3",
    price: 1999,
    image: "assets/img/games/game3.webp",
    video: "assets/videos/game3.webm",
    description: "Эпическая RPG о ведьмаке Геральте из Ривии. Исследуйте огромный открытый мир, сражайтесь с монстрами и принимайте судьбоносные решения.",
    genre: "rpg",
    rating: 4.9
  },
  {
    id: 4,
    title: "Kingdom Come: Deliverance 2",
    price: 2499,
    image: "assets/img/games/game4.webp",
    video: "assets/videos/game4.webm",
    description: "Реалистичная историческая RPG, где каждый ваш выбор влияет на судьбу королевства. Станьте частью эпической средневековой саги.",
    genre: "rpg",
    rating: 4.7
  },
  {
    id: 5,
    title: "Detroit: Become Human",
    price: 2499,
    image: "assets/img/games/game5.webp",
    video: "assets/videos/game5.webm",
    description: "Погрузитесь в будущее, где андроиды борются за свою свободу. Каждое ваше решение влияет на судьбу человечества в этом захватывающем приключении.",
    genre: "adventure",
    rating: 4.8
  },
  {
    id: 6,
    title: "Counter-Strike 2",
    price: 1999,
    image: "assets/img/games/game6.webp",
    video: "assets/videos/game6.webm",
    description: "Легендарный шутер от первого лица с обновленной графикой и механиками. Сражайтесь в команде террористов или спецназа в динамичных матчах.",
    genre: "action",
    rating: 4.9
  }
];

// Данные игр для популярных игр
const popularGames = [
  {
    id: 7,
    title: "Baldur's Gate 3",
    price: 3999,
    image: "assets/img/games/game7.webp",
    description: "Эпическая RPG в стиле D&D",
    genre: "rpg",
    rating: 4.8
  },
  {
    id: 8,
    title: "Red Dead Redemption 2",
    price: 2499,
    image: "assets/img/games/game8.webp",
    description: "Дикий Запад в открытом мире",
    genre: "action",
    rating: 4.9
  },
  {
    id: 9,
    title: "Elden Ring",
    price: 3299,
    image: "assets/img/games/game9.webp",
    description: "Темное фэнтези от создателей Dark Souls",
    genre: "rpg",
    rating: 4.8
  },
  {
    id: 10,
    title: "God of War Ragnarök",
    price: 3999,
    image: "assets/img/games/game10.webp",
    description: "Эпическое приключение Кратоса",
    genre: "action",
    rating: 4.9
  },
  {
    id: 11,
    title: "Starfield",
    price: 3499,
    image: "assets/img/games/game11.webp",
    description: "Космическая RPG от Bethesda",
    genre: "rpg",
    rating: 4.6
  },
  {
    id: 12,
    title: "Resident Evil 4 Remake",
    price: 2999,
    image: "assets/img/games/game12.webp",
    description: "Культовый хоррор в новом исполнении",
    genre: "horror",
    rating: 4.7
  },
  {
    id: 13,
    title: "Spider-Man 2",
    price: 3999,
    image: "assets/img/games/game13.webp",
    description: "Приключения Человека-паука",
    genre: "action",
    rating: 4.8
  },
  {
    id: 14,
    title: "Final Fantasy XVI",
    price: 3499,
    image: "assets/img/games/game14.webp",
    description: "Новая глава легендарной серии",
    genre: "rpg",
    rating: 4.7
  }
];

// Пользовательский хук для плавной прокрутки
function useSmoothScroll() {
  const scrollToElement = React.useCallback((elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 25; // Высота хедера
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset + headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  return scrollToElement;
}

// Пользовательский хук для карусели промо-предложений
function usePromoCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = React.useState(false);
  const carouselInterval = React.useRef(null);
  const promoItemsRef = React.useRef(null);

  const startCarousel = React.useCallback(() => {
    if (!carouselInterval.current) {
      carouselInterval.current = setInterval(() => {
        if (!isScrolling && !isAutoScrolling) {
          setIsAutoScrolling(true);
          setCurrentIndex(prev => prev + 1);
          setTimeout(() => setIsAutoScrolling(false), 500);
        }
      }, 8000);
    }
  }, [isScrolling, isAutoScrolling]);

  const stopCarousel = React.useCallback(() => {
    if (carouselInterval.current) {
      clearInterval(carouselInterval.current);
      carouselInterval.current = null;
    }
  }, []);

  React.useEffect(() => {
    if (promoItemsRef.current) {
      const itemHeight = promoItemsRef.current.firstChild.offsetHeight + 40;
      promoItemsRef.current.style.transform = `translateY(-${itemHeight * currentIndex}px)`;

      // Обработка зацикливания
      if (currentIndex >= promoItems.length * 2) {
        setTimeout(() => {
          if (promoItemsRef.current) {
            promoItemsRef.current.style.transition = 'none';
            setCurrentIndex(promoItems.length);
            promoItemsRef.current.style.transform = `translateY(-${itemHeight * promoItems.length}px)`;
            promoItemsRef.current.offsetHeight;
            promoItemsRef.current.style.transition = 'transform 0.5s ease';
          }
        }, 500);
      } else if (currentIndex < 0) {
        setTimeout(() => {
          if (promoItemsRef.current) {
            promoItemsRef.current.style.transition = 'none';
            setCurrentIndex(promoItems.length - 1);
            promoItemsRef.current.style.transform = `translateY(-${itemHeight * (promoItems.length - 1)}px)`;
            promoItemsRef.current.offsetHeight;
            promoItemsRef.current.style.transition = 'transform 0.5s ease';
          }
        }, 500);
      }
    }
  }, [currentIndex]);

  React.useEffect(() => {
    startCarousel();
    return () => stopCarousel();
  }, [startCarousel, stopCarousel]);

  const handleWheel = React.useCallback((e) => {
    e.preventDefault();
    
    if (isScrolling || isAutoScrolling) return;
    
    setIsScrolling(true);
    stopCarousel();
    
    setCurrentIndex(prev => prev + (e.deltaY > 0 ? 1 : -1));
    
    setTimeout(() => {
      setIsScrolling(false);
      startCarousel();
    }, 500);
  }, [isScrolling, isAutoScrolling, stopCarousel, startCarousel]);

  return {
    promoItemsRef,
    handleWheel,
    startCarousel,
    stopCarousel
  };
}

// Данные промо-предложений
const promoItems = [
  {
    id: 1,
    title: "Warhammer 40,000",
    description: "Обретите мощь космодесантника",
    originalPrice: 2999,
    discountedPrice: 1499,
    image: "assets/img/promo/promo1.webp",
    discount: "-50%",
    timer: "2 дня"
  },
  {
    id: 2,
    title: "RPG Bundle",
    description: "Набор из 2 популярных ролевых игр",
    originalPrice: 3999,
    discountedPrice: 1999,
    image: "assets/img/promo/promo2.webp",
    discount: "-50%",
    timer: "5 дней"
  },
  {
    id: 3,
    title: "No Man's Sky",
    description: "Начни свое путешествие к центру галактики",
    originalPrice: 1900,
    discountedPrice: 760,
    image: "assets/img/promo/promo3.webp",
    discount: "-60%",
    timer: "1 день"
  },
  {
    id: 4,
    title: "Adventure Pack",
    description: "Сборник приключенческих игр для всей семьи",
    originalPrice: 2499,
    discountedPrice: 1499,
    image: "assets/img/promo/promo4.webp",
    discount: "-40%",
    timer: "3 дня"
  },
  {
    id: 5,
    title: "Strategy Bundle",
    description: "Комплект стратегий для настоящих тактиков",
    originalPrice: 3999,
    discountedPrice: 1599,
    image: "assets/img/promo/promo5.webp",
    discount: "-60%",
    timer: "4 дня"
  }
];

// Данные категорий
const categories = [
  {
    id: 1,
    title: "Экшн",
    description: "Динамичные игры с захватывающим геймплеем",
    image: "assets/img/categories/action.webp",
    genre: "action"
  },
  {
    id: 2,
    title: "Приключения",
    description: "Исследуйте новые миры и раскрывайте тайны",
    image: "assets/img/categories/adventure.webp",
    genre: "adventure"
  },
  {
    id: 3,
    title: "Ролевые",
    description: "Создайте своего героя и отправьтесь в эпическое путешествие",
    image: "assets/img/categories/rpg.webp",
    genre: "rpg"
  },
  {
    id: 4,
    title: "Стратегии",
    description: "Развивайте свою империю и сражайтесь за господство",
    image: "assets/img/categories/strategy.webp",
    genre: "strategy"
  },
  {
    id: 5,
    title: "Спортивные",
    description: "Станьте чемпионом в любимом виде спорта",
    image: "assets/img/categories/sports.webp",
    genre: "sports"
  },
  {
    id: 6,
    title: "Симуляторы",
    description: "Погрузитесь в реалистичные симуляции",
    image: "assets/img/categories/simulator.webp",
    genre: "simulator"
  },
  {
    id: 7,
    title: "Гонки",
    description: "Испытайте адреналин на гоночных трассах",
    image: "assets/img/categories/racing.webp",
    genre: "racing"
  },
  {
    id: 8,
    title: "Хоррор",
    description: "Погрузитесь в атмосферу ужаса",
    image: "assets/img/categories/horror.webp",
    genre: "horror"
  }
];

function Notification({ message, onClose }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="notification show">
      <span className="notification-icon">✓</span>
      {message}
    </div>
  );
}

function GameCard({ game }) {
  const videoRef = React.useRef(null);
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const cartItem = cartItems.find(item => item.id === game.id);

  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.innerHTML = `
      <span class="notification-icon">✓</span>
      ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 1500);
  };

  const handleAddToCart = () => {
    const message = cartItem 
      ? 'Количество товара в корзине увеличено!'
      : 'Игра добавлена в корзину!';
    
    addToCart(game);
    showNotification(message);
  };

  const handleQuantityChange = (delta) => {
    if (!cartItem) return;
    
    const newQuantity = cartItem.quantity + delta;
    if (newQuantity < 1) {
      removeFromCart(game.id);
      showNotification('Товар удален из корзины');
    } else {
      updateQuantity(game.id, newQuantity);
      showNotification(
        delta > 0 
          ? 'Количество товара в корзине увеличено!'
          : 'Количество товара в корзине уменьшено!'
      );
    }
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    window.location.href = 'cart.html';
  };

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className="game-card-wrapper">
      <div 
        className="game-card"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="card-content">
          <div className="card-main">
            <img src={game.image} alt={game.title} />
            <h3>{game.title}</h3>
            <div className="price" onClick={handleAddToCart}>
              {cartItem ? `${cartItem.quantity} шт. - ${game.price} ₽` : `${game.price} ₽`}
            </div>
          </div>
          <div className="card-overlay">
            <video 
              ref={videoRef}
              className="card-video" 
              muted 
              loop 
              playsInline
            >
              <source src={game.video} type="video/webm" />
            </video>
            <div className="card-description">
              <h4>{game.title}</h4>
              <p>{game.description}</p>
            </div>
            <div className="card-footer">
              <div className="genre">{genreMap[game.genre]}</div>
              <div className="rating">
                <span className="stars">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < game.rating ? 'star filled' : 'star'}>★</span>
                  ))}
                </span>
                <span className="rating-value">{game.rating}</span>
              </div>
              {!cartItem ? (
                <button className="price-button" onClick={handleAddToCart}>
                  {game.price} ₽
                </button>
              ) : (
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn minus" 
                    onClick={() => handleQuantityChange(-1)}
                  >
                    -
                  </button>
                  <span className="quantity">{cartItem.quantity}</span>
                  <button 
                    className="quantity-btn plus" 
                    onClick={() => handleQuantityChange(1)}
                  >
                    +
                  </button>
                  <div 
                    className="cart-icon-small" 
                    onClick={handleCartClick}
                    title="Перейти в корзину"
                  >
                    <img src="assets/img/icons/cart.svg" alt="В корзине" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GameGalleryCard({ game }) {
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const cartItem = cartItems.find(item => item.id === game.id);

  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.innerHTML = `
      <span class="notification-icon">✓</span>
      ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 1500);
  };

  const handleAddToCart = () => {
    const message = cartItem 
      ? 'Количество товара в корзине увеличено!'
      : 'Игра добавлена в корзину!';
    
    addToCart(game);
    showNotification(message);
  };

  const handleQuantityChange = (delta) => {
    if (!cartItem) return;
    
    const newQuantity = cartItem.quantity + delta;
    if (newQuantity < 1) {
      removeFromCart(game.id);
      showNotification('Товар удален из корзины');
    } else {
      updateQuantity(game.id, newQuantity);
      showNotification(
        delta > 0 
          ? 'Количество товара в корзине увеличено!'
          : 'Количество товара в корзине уменьшено!'
      );
    }
  };

  const handleCartClick = (e) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    window.location.href = 'cart.html';
  };

  return (
    <div className="game-gallery-card">
      <img src={game.image} alt={game.title} />
      <div className="game-gallery-content">
        <h3>{game.title}</h3>
        <p>{game.description}</p>
        {!cartItem ? (
          <div className="price-button" onClick={handleAddToCart}>
            {game.price} ₽
          </div>
        ) : (
          <div className="quantity-controls">
            <button 
              className="quantity-btn minus" 
              onClick={() => handleQuantityChange(-1)}
            >
              -
            </button>
            <span className="quantity">{cartItem.quantity}</span>
            <button 
              className="quantity-btn plus" 
              onClick={() => handleQuantityChange(1)}
            >
              +
            </button>
            <div 
              className="cart-icon-small" 
              onClick={handleCartClick}
              title="Перейти в корзину"
            >
              <img src="assets/img/icons/cart.svg" alt="В корзине" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PromoItem({ promo }) {
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const promoId = `promo_${promo.id}`; // Добавляем префикс к ID
  const cartItem = cartItems.find(item => item.id === promoId);

  const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification show';
    notification.innerHTML = `
      <span class="notification-icon">✓</span>
      ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('hide');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 1500);
  };

  const handleAddToCart = () => {
    const promoItem = {
      id: promoId, // Используем ID с префиксом
      title: promo.title,
      price: promo.discountedPrice,
      image: promo.image
    };
    
    const message = cartItem 
      ? 'Количество товара в корзине увеличено!'
      : 'Товар добавлен в корзину!';
    
    addToCart(promoItem);
    showNotification(message);
  };

  const handleQuantityChange = (delta) => {
    if (!cartItem) return;
    
    const newQuantity = cartItem.quantity + delta;
    if (newQuantity < 1) {
      removeFromCart(promoId); // Используем ID с префиксом
      showNotification('Товар удален из корзины');
    } else {
      updateQuantity(promoId, newQuantity); // Используем ID с префиксом
      showNotification(
        delta > 0 
          ? 'Количество товара в корзине увеличено!'
          : 'Количество товара в корзине уменьшено!'
      );
    }
  };

  const handleCartClick = (e) => {
    e.stopPropagation();
    window.location.href = 'cart.html';
  };

  return (
    <div className="promo-item">
      <img src={promo.image} alt={promo.title} />
      <div className="promo-content">
        <div className="discount">{promo.discount}</div>
        <div className="promo-title">{promo.title}</div>
        <div className="promo-description">{promo.description}</div>
        <div className="promo-price">
          <span className="original-price">{promo.originalPrice} ₽</span>
          {!cartItem ? (
            <span className="discounted-price" onClick={handleAddToCart}>
              {promo.discountedPrice} ₽
            </span>
          ) : (
            <div className="quantity-controls">
              <button 
                className="quantity-btn minus" 
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <span className="quantity">{cartItem.quantity}</span>
              <button 
                className="quantity-btn plus" 
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
              <div 
                className="cart-icon-small" 
                onClick={handleCartClick}
                title="Перейти в корзину"
              >
                <img src="assets/img/icons/cart.svg" alt="В корзине" />
              </div>
            </div>
          )}
        </div>
        <div className="promo-timer">До конца акции: {promo.timer}</div>
      </div>
    </div>
  );
}

function CategoryCard({ category }) {
  return (
    <div 
      className="category-card" 
      onClick={() => window.location.href=`catalog.html?genre=${category.genre}`}
    >
      <img src={category.image} alt={category.title} />
      <div className="category-content">
        <h3>{category.title}</h3>
        <p>{category.description}</p>
      </div>
    </div>
  );
}

function PromoGallery() {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const carouselRef = React.useRef(null);
  const autoScrollInterval = React.useRef(null);

  const startAutoScroll = React.useCallback(() => {
    if (!autoScrollInterval.current && !isHovered) {
      autoScrollInterval.current = setInterval(() => {
        if (!isAutoScrolling && !isHovered) {
          setCurrentIndex(prev => (prev + 1) % promoItems.length);
        }
      }, 5000);
    }
  }, [isAutoScrolling, isHovered]);

  const stopAutoScroll = React.useCallback(() => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  }, []);

  React.useEffect(() => {
    if (!isHovered) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
    return () => stopAutoScroll();
  }, [startAutoScroll, stopAutoScroll, isHovered]);

  const handleWheel = React.useCallback((e) => {
    e.preventDefault();
    if (isAutoScrolling) return;

    setIsAutoScrolling(true);
    stopAutoScroll();

    if (e.deltaY > 0) {
      setCurrentIndex(prev => (prev + 1) % promoItems.length);
    } else {
      setCurrentIndex(prev => (prev - 1 + promoItems.length) % promoItems.length);
    }

    setTimeout(() => {
      setIsAutoScrolling(false);
      if (!isHovered) {
        startAutoScroll();
      }
    }, 500);
  }, [isAutoScrolling, startAutoScroll, stopAutoScroll, isHovered]);

  React.useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('wheel', handleWheel, { passive: false });
      return () => carousel.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  return (
    <div className="promo-gallery">
      <h2>
        Скидки <br /> и акции
      </h2>
      <div 
        ref={carouselRef}
        className="promo-carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="promo-items"
          style={{
            transform: `translateY(-${currentIndex * 430}px)`,
            transition: 'transform 0.5s ease'
          }}
        >
          {[...promoItems, ...promoItems].map((promo, index) => (
            <div 
              key={`${promo.id}-${index}`}
              style={{
                height: '410px',
                marginBottom: '20px'
              }}
            >
              <PromoItem promo={promo} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HomePage() {
  const scrollToElement = useSmoothScroll();

  React.useEffect(() => {
    // Ожидание рендеринга компонентов React
    setTimeout(() => {
      // Добавление начальных стилей для анимации
      $('.section-title').css({
        'opacity': '0',
        'transform': 'translateY(50px)',
        'transition': 'opacity 0.8s ease, transform 0.8s ease'
      });

      // Функциональность jQuery для заголовков секций
      function checkVisibility() {
        $('.section-title').each(function() {
          var elementTop = $(this).offset().top;
          var elementBottom = elementTop + $(this).outerHeight();
          var viewportTop = $(window).scrollTop();
          var viewportBottom = viewportTop + $(window).height();
          
          if (elementBottom > viewportTop && elementTop < viewportBottom) {
            // Сброс анимации путем удаления и повторного добавления стилей
            $(this).css({
              'opacity': '0',
              'transform': 'translateY(50px)'
            });
            
            // Принудительное обновление потока
            $(this)[0].offsetHeight;
            
            // Запуск анимации
            $(this).css({
              'opacity': '1',
              'transform': 'translateY(0)'
            });
          } else {
            // Сброс при выходе из области видимости
            $(this).css({
              'opacity': '0',
              'transform': 'translateY(50px)'
            });
          }
        });
      }

      // Проверка видимости при загрузке и прокрутке
      checkVisibility();
      $(window).on('scroll', checkVisibility);

      // Начальная проверка видимых секций
      $('.section-title').each(function() {
        var elementTop = $(this).offset().top;
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        
        if (elementTop < viewportBottom) {
          $(this).css({
            'opacity': '1',
            'transform': 'translateY(0)'
          });
        }
      });

      // Функциональность навигации по галерее
      document.querySelectorAll('.gallery-nav').forEach(button => {
        button.addEventListener('click', function() {
          const container = this.closest('.gallery-container');
          const gallery = container.querySelector('.categories-gallery, .games-gallery');
          const direction = this.classList.contains('prev') ? -1 : 1;
          
          // Вычисляем ширину карточки с учетом отступов
          const cardWidth = gallery.querySelector('.category-card, .game-gallery-card').offsetWidth;
          const gap = 30; // отступ между карточками
          
          // Добавляем половину отступа для экранов около 800px
          let scrollAmount = cardWidth + gap;
          if ( window.innerWidth <= 768) {
            scrollAmount = cardWidth + (gap - 10);
          }

          if (gallery) {
            const currentScroll = gallery.scrollLeft;
            gallery.scrollTo({
              left: currentScroll + (direction * scrollAmount),
              behavior: 'smooth'
            });
          }
        });
      });

      // Добавляем обработчик изменения размера окна
      window.addEventListener('resize', function() {
        const galleries = document.querySelectorAll('.categories-gallery, .games-gallery');
        galleries.forEach(gallery => {
          // Сбрасываем прокрутку при изменении размера окна
          gallery.scrollLeft = 0;
        });
      });

      // Обработка прокрутки галереи промо-предложений
      const promoCarousel = document.querySelector('.promo-carousel');
      const promoItems = document.querySelector('.promo-items');
      
      if (promoCarousel && promoItems) {
        let isHovered = false;
        let isScrolling = false;
        let currentIndex = 0;
        const itemHeight = promoItems.firstElementChild.offsetHeight + 20; // высота элемента + отступ
        
        promoCarousel.addEventListener('mouseenter', () => {
          isHovered = true;
          document.body.style.overflow = 'hidden';
        });
        
        promoCarousel.addEventListener('mouseleave', () => {
          isHovered = false;
          document.body.style.overflow = '';
        });
        
        promoCarousel.addEventListener('wheel', (e) => {
          if (!isHovered || isScrolling) return;
          
          e.preventDefault();
          isScrolling = true;
          
          // Определяем направление скролла
          const direction = e.deltaY > 0 ? 1 : -1;
          
          // Обновляем индекс с учетом направления
          currentIndex = Math.max(0, Math.min(currentIndex + direction, promoItems.children.length - 1));
          
          // Применяем плавный переход
          promoItems.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
          promoItems.style.transform = `translateY(-${currentIndex * itemHeight}px)`;
          
          // Сбрасываем флаг скролла после завершения анимации
          setTimeout(() => {
            isScrolling = false;
          }, 500);
        }, { passive: false });
      }
    }, 100);
  }, []);

  return (
    <CartProvider>
      <section className="hero" onClick={() => scrollToElement('store')} style={{ cursor: 'pointer' }}>
        <div className="game-start-text">
          Игра <br /> стартует <br /> здесь
        </div>
        <div className="btn-container">
          <button 
            className="cta-btn"
          >
            Перейти к покупкам
          </button>
        </div>
      </section>

      <section id="store" className="store-section">
        <div className="store-content">
          <h2 className="section-title">Выгодные предложения</h2>
          <div className="game-cards">
            {featuredGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          <PromoGallery />
        </div>
      </section>

      <div className="view-all-container">
        <button 
          className="view-all-btn" 
          onClick={() => window.location.href='catalog.html'}
        >
          Посмотреть все
          <span className="arrow-right">→</span>
        </button>
      </div>

      {/* Categories Gallery Section */}
      <section className="categories-section">
        <div className="section-content">
          <h2 className="section-title">Категории игр</h2>
          <div className="gallery-container">
            <div className="gallery-scroll">
              <div 
                className="categories-gallery" 
                style={{ 
                  display: 'flex', 
                  overflowX: 'auto', 
                  scrollBehavior: 'smooth',
                  msOverflowStyle: 'none',  // IE и Edge
                  scrollbarWidth: 'none',   // Firefox
                  '&::-webkit-scrollbar': { // Chrome, Safari и Opera
                    display: 'none'
                  }
                }}
              >
                {categories.map(category => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </div>
            </div>
            <button 
              className="gallery-nav prev" 
              type="button"
            ></button>
            <button 
              className="gallery-nav next" 
              type="button"
            ></button>
          </div>
        </div>
      </section>

      <section className="games-gallery-section">
        <div className="section-content">
          <h2 className="section-title">Популярные игры</h2>
          <div className="gallery-container">
            <div className="gallery-scroll">
              <div 
                className="games-gallery" 
                style={{ 
                  display: 'flex', 
                  overflowX: 'auto', 
                  scrollBehavior: 'smooth',
                  msOverflowStyle: 'none',  // IE и Edge
                  scrollbarWidth: 'none',   // Firefox
                  '&::-webkit-scrollbar': { // Chrome, Safari и Opera
                    display: 'none'
                  }
                }}
              >
                {popularGames.map(game => (
                  <GameGalleryCard key={game.id} game={game} />
                ))}
              </div>
            </div>
            <button 
              className="gallery-nav prev" 
              type="button"
            ></button>
            <button 
              className="gallery-nav next" 
              type="button"
            ></button>
          </div>
        </div>
      </section>
    </CartProvider>
  );
}

// Рендеринг компонента главной страницы
ReactDOM.render(<HomePage />, document.getElementById('root'));