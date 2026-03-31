

// ========== НАСТРОЙКИ ==========
const GROUP_ID = 'skidki_marketa';
const VK_APP_ID = 54508911;  // App ID
const API_URL = 'https://skidki-market-api.onrender.com/api/discounts';  // URL бэкенда

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

/**
 * Форматирует цену с пробелами
 */
function formatPrice(price) {
    if (!price || price === 0) return 'Цена не указана';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
}

/**
 * Форматирует рейтинг: одна звезда + цифра + количество отзывов
 */
function formatRating(rating, count = null) {
    if (!rating || rating === 0) {
        return { stars: '☆☆☆☆☆', text: 'Нет отзывов' };
    }
    
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    
    let stars = '⭐'.repeat(full);
    if (half) stars += '½';
    stars += '☆'.repeat(empty);
    
    let text = `${rating}`;
    if (count) {
        text += ` (${count} отзывов)`;
    }
    
    return { stars, text };
}

/**
 * Получает название категории для отображения
 */
function getCategoryDisplay(category) {
    const categories = {
        'супер-скидки': '💥 СУПЕР-СКИДКИ 70%+ 💥',
        'смартфоны': '📱 СМАРТФОНЫ',
        'наушники': '🎧 НАУШНИКИ',
        'умный дом': '🏠 УМНЫЙ ДОМ',
        'ноутбуки': '💻 НОУТБУКИ',
        'часы': '⌚️ УМНЫЕ ЧАСЫ',
        'витамины и бады': '💊 ВИТАМИНЫ И БАДЫ',
        'спортивное питание': '💪 СПОРТИВНОЕ ПИТАНИЕ',
        'фитнес и йога': '🏋️ ФИТНЕС И ЙОГА',
        'товары для дома': '🏡 ТОВАРЫ ДЛЯ ДОМА',
        'разное': '🔥 ЛУЧШИЕ ПРЕДЛОЖЕНИЯ'
    };
    
    return categories[category] || '🔥 ГОРЯЧИЕ СКИДКИ 🔥';
}

/**
 * Открывает ссылку на товар
 */
function openProduct(url) {
    if (url) {
        window.open(url, '_blank');
    }
}

/**
 * Открывает сообщество VK
 */
function openCommunity() {
    window.open(`https://vk.com/${GROUP_ID}`, '_blank');
}

/**
 * Возвращает случайное вступление для скидки
 */
function getDiscountIntro(discount) {
    const intros = [
        `Скидка ${discount}% — это отличный повод!`,
        `Экономия ${discount}% уже ждет тебя!`,
        `Цена снижена на ${discount}%!`,
        `Минус ${discount}% — только сегодня!`,
        `Выгода ${discount}% — не упусти!`,
        `Скидка ${discount}% на этот товар!`
    ];
    return intros[Math.floor(Math.random() * intros.length)];
}

/**
 * Экранирует HTML для безопасности
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Рендерит карточку товара
 */
function renderOfferCard(offer) {
    const { stars, text: ratingText } = formatRating(offer.rating);
    const discountIntro = getDiscountIntro(offer.discount);
    const pictureUrl = offer.picture || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%23f0f0f0"/%3E%3Ctext x="40" y="45" text-anchor="middle" fill="%23999" font-size="12"%3E🛍️%3C/text%3E%3C/svg%3E';
    
    return `
        <div class="discount-card" onclick="openProduct('${offer.url}')">
            <img class="card-image" src="${pictureUrl}" 
                 alt="${escapeHtml(offer.name)}" 
                 onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'80\' height=\'80\' viewBox=\'0 0 80 80\'%3E%3Crect width=\'80\' height=\'80\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'40\' y=\'45\' text-anchor=\'middle\' fill=\'%23999\' font-size=\'12\'%3E🛍️%3C/text%3E%3C/svg%3E'">
            <div class="card-info">
                <div class="card-title">${escapeHtml(offer.name)}</div>
                <div class="rating">
                    <span class="rating-stars">${stars}</span>
                    <span class="rating-value">${offer.rating}</span>
                </div>
                <div class="price">
                    <span class="old-price">${formatPrice(offer.old_price)}</span>
                    <span class="new-price">${formatPrice(offer.price)}</span>
                    <span class="discount-badge">-${offer.discount}%</span>
                </div>
                <div class="discount-intro">🎁 ${discountIntro}</div>
                <button class="buy-btn" onclick="event.stopPropagation(); openProduct('${offer.url}')">
                    🛒 Купить со скидкой
                </button>
            </div>
        </div>
    `;
}

// ========== ЗАГРУЗКА СКИДОК ==========

/**
 * Загружает и отображает скидки из API
 */
async function loadDiscounts() {
    const container = document.getElementById('discountsContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>🔍 Ищем лучшие предложения...</p>
        </div>
    `;
    
    try {
        const response = await fetch(`${API_URL}?min_discount=30&limit=10`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success' && data.offers && data.offers.length > 0) {
            const categoryBadge = document.getElementById('categoryBadge');
            if (categoryBadge) {
                categoryBadge.textContent = getCategoryDisplay(data.category);
            }
            
            container.innerHTML = data.offers.map(offer => renderOfferCard(offer)).join('');
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">😢</div>
                    <div class="empty-title">Скидок пока нет</div>
                    <div class="empty-text">Загляните позже — мы постоянно ищем лучшие предложения!</div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Ошибка загрузки скидок:', error);
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❌</div>
                <div class="empty-title">Ошибка загрузки</div>
                <div class="empty-text">Не удалось загрузить скидки. Проверьте интернет-соединение.</div>
                <button class="buy-btn" style="margin-top: 20px;" onclick="loadDiscounts()">🔄 Повторить</button>
            </div>
        `;
    }
}

// ========== СТРАНИЦЫ ==========

/**
 * Показывает страницу подписки
 */
function showSubscribe() {
    const container = document.getElementById('discountsContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="subscribe-card">
            <h3>🔔 Получайте лучшие скидки первыми!</h3>
            <p>Подпишитесь на наше сообщество, чтобы не пропустить самые выгодные предложения.</p>
            <ul class="subscribe-features">
                <li>⭐️ Только товары с рейтингом 4.5+</li>
                <li>🔥 Скидки от 30% до 70%</li>
                <li>📦 Новые подборки каждые 2 часа</li>
                <li>🏠 Электроника, дом, спорт, витамины</li>
            </ul>
            <button class="subscribe-btn" onclick="openCommunity()">📢 Подписаться</button>
        </div>
    `;
}

/**
 * Показывает страницу о нас
 */
function showInfo() {
    const container = document.getElementById('discountsContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="info-card">
            <h3>💰 О проекте</h3>
            <p>Мы автоматически находим лучшие предложения на Яндекс Маркете и делимся ими с вами.</p>
            
            <p><strong>Что мы ищем:</strong></p>
            <ul>
                <li>✅ Скидки на Яндекс Маркет от 30% до 70%</li>
                <li>⭐️ Товары с рейтингом от 4.5 звезд</li>
                <li>📦 Тематические подборки: электроника, дом, спорт, витамины</li>
            </ul>
            
            <div class="info-highlight">
                <strong>💡 Зачем подписываться?</strong><br>
                Вы экономите время и деньги. Мы делаем всю работу по поиску скидок за вас!
            </div>
            
            <button class="buy-btn" style="margin-top: 20px;" onclick="loadDiscounts()">
                🔥 Смотреть скидки
            </button>
        </div>
    `;
}

// ========== НАВИГАЦИЯ ==========

/**
 * Инициализирует навигацию по вкладкам
 */
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tab = btn.dataset.tab;
            if (tab === 'discounts') {
                loadDiscounts();
            } else if (tab === 'subscribe') {
                showSubscribe();
            } else if (tab === 'info') {
                showInfo();
            }
        });
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ VK BRIDGE ==========

/**
 * Инициализирует приложение и VK Bridge
 */
function init() {
    // Инициализация VK Bridge (обязательно для модерации)
    if (typeof vkBridge !== 'undefined') {
        vkBridge.send('VKWebAppInit', {})
            .then(() => {
                console.log('✅ VK Bridge инициализирован успешно');
                // После успешной инициализации загружаем контент
                initNavigation();
                loadDiscounts();
            })
            .catch((error) => {
                console.error('❌ Ошибка инициализации VK Bridge:', error);
                // Даже при ошибке пробуем загрузить контент
                initNavigation();
                loadDiscounts();
            });
    } else {
        console.warn('⚠️ VK Bridge не загружен');
        // Загружаем контент без VK Bridge (для локальной разработки)
        initNavigation();
        loadDiscounts();
    }
    
    // Инициализация VK Open API
    if (typeof VK !== 'undefined') {
        VK.init({ apiId: VK_APP_ID });
    }
}

// Запускаем приложение
document.addEventListener('DOMContentLoaded', init);
