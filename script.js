// script.js - вся логика VK Mini App
// ВСЕ ТОВАРЫ С РЕЙТИНГОМ 4.5+

// ========== НАСТРОЙКИ ==========
const GROUP_ID = 'skidki_marketa';

// ТОВАРЫ С ВЫСОКИМ РЕЙТИНГОМ (4.5+)
const mockProducts = [
    {
        id: 1,
        name: 'Беспроводные наушники HUAWEI FreeBuds 6i',
        rating: 4.8,           // ⭐️ 4.8
        ratingCount: 2500,
        oldPrice: 11990,
        price: 5990,
        discount: 50,
        image: 'assets/headphones.jpg'
    },
    {
        id: 2,
        name: 'Смарт-часы Amazfit GTR 4',
        rating: 4.7,           // ⭐️ 4.7
        ratingCount: 3400,
        oldPrice: 21990,
        price: 6590,
        discount: 70,
        image: 'assets/clock.jpg'
    },
    {
        id: 3,
        name: 'Робот-пылесос Xiaomi Robot Vacuum S20',
        rating: 4.6,           // ⭐️ 4.6
        ratingCount: 1890,
        oldPrice: 29990,
        price: 18990,
        discount: 37,
        image: 'assets/cleaner.jpg'
    }
];

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽';
}

function formatRating(rating, count) {
    const full = Math.floor(rating);
    const empty = 5 - full;
    // Отображаем звезды + текст о высоком рейтинге
    return '⭐'.repeat(full) + '☆'.repeat(empty) + ` ${rating} (${count} отзывов)`;
}

function getRatingStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    return '⭐'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

// ========== ОТКРЫТИЕ ТОВАРА ==========
function openProduct(productUrl) {
    if (productUrl) {
        window.open(productUrl, '_blank');
    } else {
        alert('Ссылка на товар появится после подключения партнерской программы');
    }
}

// ========== ОТКРЫТИЕ СООБЩЕСТВА ==========
function openCommunity() {
    window.open('https://vk.com/' + GROUP_ID, '_blank');
}

// ========== ЗАГРУЗКА СКИДОК ==========
function loadDiscounts() {
    const container = document.getElementById('discountsList');
    if (!container) return;

    container.innerHTML = '<div class="loading">🔍 Ищем лучшие предложения...</div>';

    setTimeout(() => {
        if (mockProducts.length === 0) {
            container.innerHTML = '<div class="empty">😢 Скидок пока нет. Загляните позже!</div>';
            return;
        }

        container.innerHTML = mockProducts.map(product => {
            const stars = getRatingStars(product.rating);
            return `
            <div class="discount-card" onclick="openProduct('${product.url || ''}')">
                <img class="card-image" src="${product.image}" alt="${product.name}" onerror="this.src='assets/placeholder.png'">
                <div class="card-info">
                    <div class="card-title">${product.name}</div>
                    <div class="rating">
                        ${stars} ${product.rating} (${product.ratingCount} отзывов)
                        <span style="color: #22c55e; margin-left: 8px;">★ Высокий рейтинг</span>
                    </div>
                    <div class="price">
                        <span class="old-price">${formatPrice(product.oldPrice)}</span>
                        <span class="new-price">${formatPrice(product.price)}</span>
                        <span class="discount-badge">-${product.discount}%</span>
                    </div>
                    <button class="buy-btn" onclick="event.stopPropagation(); openProduct('${product.url || ''}')">
                        🛒 Купить со скидкой
                    </button>
                </div>
            </div>
        `}).join('');
    }, 500);
}

// ========== СТРАНИЦА ПОДПИСКИ ==========
function showSubscribe() {
    const container = document.getElementById('discountsList');
    container.innerHTML = `
        <div class="subscribe-card">
            <h3>🔔 Получайте лучшие скидки первыми!</h3>
            <p>Подпишитесь на наше сообщество, чтобы не пропустить самые выгодные предложения.</p>
            <p style="background: #fef3c7; padding: 12px; border-radius: 12px; margin: 15px 0;">
                ⭐️ <strong>Мы отбираем только товары с рейтингом 4.5+ и максимальными скидками!</strong>
            </p>
            <button class="buy-btn" onclick="openCommunity()">📢 Подписаться</button>
        </div>
    `;
}

// ========== СТРАНИЦА О НАС ==========
function showInfo() {
    const container = document.getElementById('discountsList');
    container.innerHTML = `
        <div class="info-card">
            <h3>💰 О проекте</h3>
            <p>Мы автоматически находим лучшие предложения на Яндекс Маркете и делимся ими с вами.</p>
            
            <p><strong>Что мы ищем:</strong></p>
            <ul>
                <li>✅ Скидки на Яндекс Маркет от 30% до 70%</li>
                <li>⭐️ <strong>Товары с рейтингом от 4.5 звезд</strong> — только проверенные покупки</li>
                <li>📦 Акции и распродажи на электронику, дом, одежду, подарки</li>
            </ul>
            
            <div style="background: #f0fdf4; padding: 12px; border-radius: 12px; margin: 15px 0;">
                💡 <strong>Почему рейтинг 4.5+?</strong><br>
                Мы публикуем только товары, которые получили высокие оценки от реальных покупателей.
                Никакого некачественного товара — только проверенные предложения.
            </div>
            
            <button class="buy-btn" style="margin-top: 10px;" onclick="loadDiscounts()">
                🔥 Смотреть скидки
            </button>
        </div>
    `;
}

// ========== НАВИГАЦИЯ ==========
function initNavigation() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const tab = btn.dataset.tab;
            if (tab === 'discounts') loadDiscounts();
            else if (tab === 'subscribe') showSubscribe();
            else if (tab === 'info') showInfo();
        });
    });
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
function init() {
    initNavigation();
    loadDiscounts();
    
    if (typeof VK !== 'undefined') {
        VK.init({ apiId: VK_APP_ID });
    }
}

document.addEventListener('DOMContentLoaded', init);