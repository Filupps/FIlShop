// Пример данных игр
const gamesData = [
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
  },
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
  },
  {
    id: 15,
    title: "Age of Empires IV",
    price: 1999,
    image: "assets/img/games/game15.webp",
    video: "assets/videos/game15.webm",
    description: "Классическая RTS с историческими кампаниями.",
    genre: "strategy",
    rating: 4.4
  }
];

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

// Получение параметров URL
const urlParams = new URLSearchParams(window.location.search);
const initialGenre = urlParams.get('genre');

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

  const updateQuantity = React.useCallback((id, quantity) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === id);
      if (existingItemIndex !== -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: quantity
        };
        return newItems;
      }
      return prevItems;
    });
  }, []);

  const removeFromCart = React.useCallback((id) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== id);
      return newItems;
    });
  }, []);

  const value = {
    cartItems,
    totalItems,
    addToCart,
    updateQuantity,
    removeFromCart
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
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
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
    e.stopPropagation();
    window.location.href = 'cart.html';
  };

  return (
    <div className="game-gallery-card">
      <img src={game.image} alt={game.title} />
      <div className="game-gallery-content">
        <h3>{game.title}</h3>
        <p>{game.description}</p>
        <div className="game-price">
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
  );
}

function Catalog() {
  const [selectedGenre, setSelectedGenre] = React.useState(initialGenre || 'all');
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');
  const [sortBy, setSortBy] = React.useState('default');
  const [currentPage, setCurrentPage] = React.useState(1);
  const gamesPerPage = 12;

  // Filter and sort games
  const filteredGames = React.useMemo(() => {
    let result = [...gamesData];

    if (selectedGenre && selectedGenre !== 'all') {
      result = result.filter(game => game.genre === selectedGenre);
    }

    if (minPrice) {
      result = result.filter(game => game.price >= parseInt(minPrice));
    }
    if (maxPrice) {
      result = result.filter(game => game.price <= parseInt(maxPrice));
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-asc':
        result.sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }

    return result;
  }, [selectedGenre, minPrice, maxPrice, sortBy]);

  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);
  const currentGames = filteredGames.slice(
    (currentPage - 1) * gamesPerPage,
    currentPage * gamesPerPage
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenre, minPrice, maxPrice, sortBy]);

  return (
    <div className="catalog-container">
      <div className="filters-section">
        <h2 className="filters-title">Фильтры</h2>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Жанр</label>
            <select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              <option value="all">Все жанры</option>
              {Object.entries(genreMap).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Цена от</label>
            <input 
              type="number" 
              value={minPrice} 
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="filter-group">
            <label>Цена до</label>
            <input 
              type="number" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="10000"
            />
          </div>
          <div className="filter-group">
            <label>Сортировка</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">По умолчанию</option>
              <option value="price-asc">Цена по возрастанию</option>
              <option value="price-desc">Цена по убыванию</option>
              <option value="name-asc">По названию (А-Я)</option>
              <option value="name-desc">По названию (Я-А)</option>
              <option value="rating-desc">По рейтингу (высокий-низкий)</option>
              <option value="rating-asc">По рейтингу (низкий-высокий)</option>
            </select>
          </div>
        </div>
      </div>
      <div className="game-cards">
        {currentGames.length > 0 ? (
          currentGames.map(game => (
            <GameGalleryCard key={game.id} game={game} />
          ))
        ) : (
          <div className="no-games">Игры не найдены</div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <span className="pagination-info">
            Страница {currentPage} из {totalPages}
          </span>
          <button 
            className="pagination-btn"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

// Рендеринг компонента каталога
ReactDOM.render(
  <CartProvider>
    <Catalog />
  </CartProvider>,
  document.getElementById('catalog-root')
);