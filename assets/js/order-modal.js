class OrderModal {
  constructor() {
    this.modal = null;
    this.init();
  }

  init() {
    // Создание HTML модального окна
    const modalHTML = `
      <div class="order-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Оформление заказа</h2>
            <button class="close-modal">&times;</button>
          </div>
          <div class="order-items"></div>
          <div class="order-total">
            <span>Итого:</span>
            <span class="total-amount">0 ₽</span>
          </div>
          <form class="payment-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" required placeholder="Введите ваш email">
            </div>
            <div class="payment-methods">
              <div class="payment-method" data-method="card">
                <img src="assets/img/icons/card-payment.svg" alt="Банковская карта">
                <p>Банковская карта</p>
              </div>
              <div class="payment-method" data-method="sbp">
                <img src="assets/img/icons/sbp-payment.svg" alt="СБП">
                <p>СБП</p>
              </div>
            </div>
            <button type="submit" class="pay-button">Оплатить</button>
          </form>
        </div>
      </div>
    `;

    // Добавление модального окна на страницу
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.querySelector('.order-modal');

    // Добавление обработчиков событий
    this.addEventListeners();
  }

  addEventListeners() {
    // Закрытие модального окна
    const closeButton = this.modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => this.close());

    // Закрытие при клике вне окна
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Выбор способа оплаты
    const paymentMethods = this.modal.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
      method.addEventListener('click', () => {
        paymentMethods.forEach(m => m.classList.remove('selected'));
        method.classList.add('selected');
      });
    });

    // Отправка формы
    const form = this.modal.querySelector('.payment-form');
    form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  open(cartItems, total) {
    // Обновление списка товаров
    const orderItemsContainer = this.modal.querySelector('.order-items');
    orderItemsContainer.innerHTML = cartItems.map(item => `
      <div class="order-item">
        <div class="order-item-info">
          <img src="${item.image}" alt="${item.title}">
          <div class="order-item-details">
            <h3>${item.title}</h3>
            <p>Количество: ${item.quantity || 1}</p>
          </div>
        </div>
        <div class="order-item-price">${item.price * (item.quantity || 1)} ₽</div>
      </div>
    `).join('');

    // Обновление общей суммы
    this.modal.querySelector('.total-amount').textContent = `${total} ₽`;

    // Показ модального окна
    this.modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const email = this.modal.querySelector('#email').value;
    const selectedPaymentMethod = this.modal.querySelector('.payment-method.selected');
    
    if (!selectedPaymentMethod) {
      alert('Пожалуйста, выберите способ оплаты');
      return;
    }

    const paymentMethod = selectedPaymentMethod.dataset.method;
    
    // Здесь обычно отправляются данные заказа на сервер
    console.log('Order submitted:', {
      email,
      paymentMethod,
      items: window.cartItems,
      total: window.cartTotal
    });

    // Очистка корзины из localStorage
    localStorage.removeItem('cartItems');
    
    // Очистка счетчика корзины
    const cartCounter = document.querySelector('.cart-counter');
    if (cartCounter) {
      cartCounter.classList.remove('show');
    }

    // Показ сообщения об успехе и закрытие окна
    alert('Заказ успешно оформлен!');
    this.close();

    // Перезагрузка страницы для обновления состояния корзины
    window.location.reload();
  }
}

// Инициализация модального окна
window.orderModal = new OrderModal();

// Добавление обработчика клика на кнопку оформления заказа
document.querySelector('.checkout').addEventListener('click', () => {
  const cartItems = window.cartItems || [];
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  window.orderModal.open(cartItems, total);
}); 