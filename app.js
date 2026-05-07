/**
 * 穷游费用对比系统 Pro - 前端逻辑
 * @version 1.0.0
 * @author Travel Price Comparison Team
 */

// ========================================
// 配置
// ========================================
const CONFIG = {
    API_BASE: 'http://localhost:3000/api',
    DEFAULT_CITY: '北京',
    UPDATE_INTERVAL: 30000 // 30秒
};

// ========================================
// 数据源（模拟API数据）
// ========================================
const DATA_SOURCE = {
    // 火车票数据
    trains: {
        '北京-上海': [
            { trainNo: 'G1', type: '高铁', from: '北京南', to: '上海虹桥', departure: '06:00', arrival: '10:28', duration: '4小时28分', price: { second: 553, first: 933, business: 1748 }, discount: 0.95 },
            { trainNo: 'G3', type: '高铁', from: '北京南', to: '上海虹桥', departure: '07:00', arrival: '11:28', duration: '4小时28分', price: { second: 553, first: 933, business: 1748 }, discount: 1 },
            { trainNo: 'G5', type: '高铁', from: '北京南', to: '上海虹桥', departure: '08:00', arrival: '12:28', duration: '4小时28分', price: { second: 553, first: 933, business: 1748 }, discount: 0.9 },
            { trainNo: 'T109', type: '特快', from: '北京', to: '上海', departure: '19:30', arrival: '08:58', duration: '13小时28分', price: { hard: 156, soft: 283 }, discount: 0.85 },
            { trainNo: '1461', type: '普快', from: '北京', to: '上海', departure: '11:55', arrival: '06:47', duration: '18小时52分', price: { hard: 148, soft: 268 }, discount: 0.8 }
        ],
        '北京-西安': [
            { trainNo: 'G87', type: '高铁', from: '北京西', to: '西安北', departure: '14:00', arrival: '18:20', duration: '4小时20分', price: { second: 515, first: 824, business: 1627 }, discount: 0.95 },
            { trainNo: 'G89', type: '高铁', from: '北京西', to: '西安北', departure: '15:00', arrival: '19:20', duration: '4小时20分', price: { second: 515, first: 824, business: 1627 }, discount: 1 },
            { trainNo: 'T7', type: '特快', from: '北京西', to: '西安', departure: '16:40', arrival: '05:42', duration: '13小时2分', price: { hard: 148, soft: 263 }, discount: 0.85 },
            { trainNo: 'T41', type: '特快', from: '北京西', to: '西安', departure: '18:48', arrival: '08:01', duration: '13小时13分', price: { hard: 148, soft: 263 }, discount: 0.8 }
        ],
        '上海-杭州': [
            { trainNo: 'G7501', type: '高铁', from: '上海虹桥', to: '杭州东', departure: '06:00', arrival: '06:45', duration: '45分', price: { second: 73, first: 117, business: 219 }, discount: 0.95 },
            { trainNo: 'G7503', type: '高铁', from: '上海虹桥', to: '杭州东', departure: '06:30', arrival: '07:15', duration: '45分', price: { second: 73, first: 117, business: 219 }, discount: 1 },
            { trainNo: 'G7505', type: '高铁', from: '上海虹桥', to: '杭州东', departure: '07:00', arrival: '07:45', duration: '45分', price: { second: 73, first: 117, business: 219 }, discount: 0.9 },
            { trainNo: 'K833', type: '快速', from: '上海南', to: '杭州东', departure: '07:10', arrival: '09:30', duration: '2小时20分', price: { hard: 24, soft: 40 }, discount: 0.85 }
        ]
    },
    
    // 机票数据
    flights: {
        '北京-上海': [
            { airline: '中国国航', flightNo: 'CA1515', from: '首都T3', to: '虹桥T2', departure: '08:00', arrival: '10:15', price: 680, discount: 0.35, baggage: '20kg', meal: true },
            { airline: '东方航空', flightNo: 'MU5101', from: '大兴', to: '虹桥T2', departure: '09:00', arrival: '11:15', price: 720, discount: 0.38, baggage: '20kg', meal: true },
            { airline: '南方航空', flightNo: 'CZ3101', from: '大兴', to: '浦东T2', departure: '10:00', arrival: '12:15', price: 650, discount: 0.32, baggage: '20kg', meal: true },
            { airline: '海南航空', flightNo: 'HU7601', from: '首都T2', to: '虹桥T2', departure: '14:00', arrival: '16:15', price: 590, discount: 0.28, baggage: '20kg', meal: false },
            { airline: '春秋航空', flightNo: '9C8801', from: '大兴', to: '浦东T2', departure: '16:00', arrival: '18:15', price: 380, discount: 0.18, baggage: '7kg', meal: false }
        ],
        '北京-西安': [
            { airline: '中国国航', flightNo: 'CA1201', from: '首都T3', to: '咸阳T2', departure: '08:30', arrival: '10:45', price: 580, discount: 0.32, baggage: '20kg', meal: true },
            { airline: '东方航空', flightNo: 'MU2101', from: '大兴', to: '咸阳T3', departure: '10:00', arrival: '12:15', price: 620, discount: 0.35, baggage: '20kg', meal: true },
            { airline: '海南航空', flightNo: 'HU7137', from: '首都T2', to: '咸阳T2', departure: '14:30', arrival: '16:45', price: 480, discount: 0.25, baggage: '20kg', meal: false }
        ],
        '上海-成都': [
            { airline: '中国国航', flightNo: 'CA4501', from: '浦东T2', to: '双流T2', departure: '08:00', arrival: '11:15', price: 780, discount: 0.28, baggage: '20kg', meal: true },
            { airline: '四川航空', flightNo: '3U8965', from: '虹桥T2', to: '双流T2', departure: '10:00', arrival: '13:15', price: 680, discount: 0.24, baggage: '20kg', meal: true },
            { airline: '春秋航空', flightNo: '9C8887', from: '浦东T2', to: '天府T2', departure: '15:00', arrival: '18:15', price: 480, discount: 0.16, baggage: '7kg', meal: false }
        ]
    },
    
    // 酒店数据
    hotels: {
        '上海': [
            { name: '上海外滩青年旅舍', type: '青旅', rating: 4.5, price: 68, location: '外滩', tags: ['近地铁', '江景', '免费WiFi'], image: '🏨' },
            { name: '汉庭酒店(上海南京路店)', type: '经济型', rating: 4.3, price: 289, location: '南京路', tags: ['含早', '近地铁', '干净'], image: '🏨' },
            { name: '如家精选(上海人民广场店)', type: '快捷', rating: 4.4, price: 359, location: '人民广场', tags: ['含早', '近地铁', '服务好'], image: '🏨' },
            { name: '上海民宿·田子坊艺术公寓', type: '民宿', rating: 4.6, price: 428, location: '田子坊', tags: ['可做饭', '艺术风', '近景点'], image: '🏠' },
            { name: '上海浦东香格里拉', type: '五星级', rating: 4.8, price: 1280, location: '陆家嘴', tags: ['江景', '泳池', 'SPA'], image: '🏨' }
        ],
        '北京': [
            { name: '北京国际青年旅舍', type: '青旅', rating: 4.4, price: 78, location: '东城区', tags: ['近故宫', '四合院', '免费WiFi'], image: '🏨' },
            { name: '7天酒店(北京天安门店)', type: '经济型', rating: 4.1, price: 268, location: '天安门', tags: ['近地铁', '干净', '性价比高'], image: '🏨' },
            { name: '全季酒店(北京王府井店)', type: '快捷', rating: 4.5, price: 459, location: '王府井', tags: ['含早', '近地铁', '服务好'], image: '🏨' },
            { name: '北京胡同民宿', type: '民宿', rating: 4.7, price: 388, location: '南锣鼓巷', tags: ['四合院', '文化体验', '近景点'], image: '🏠' }
        ],
        '西安': [
            { name: '西安湘子门青年旅舍', type: '青旅', rating: 4.6, price: 58, location: '南门', tags: ['古城墙', '近地铁', '免费WiFi'], image: '🏨' },
            { name: '汉庭酒店(西安钟楼店)', type: '经济型', rating: 4.4, price: 238, location: '钟楼', tags: ['含早', '近地铁', '干净'], image: '🏨' },
            { name: '西安古城民宿', type: '民宿', rating: 4.8, price: 328, location: '回民街', tags: ['古风', '近美食', '可做饭'], image: '🏠' }
        ]
    },
    
    // 景点数据
    attractions: {
        '上海': [
            { name: '外滩', price: 0, type: '免费', rating: 4.8, duration: '2-3小时', tags: ['夜景', '拍照', '历史'], description: '上海标志性景点，万国建筑博览群' },
            { name: '东方明珠', price: 199, type: '观光', rating: 4.5, duration: '3-4小时', tags: ['高空', '观景', '地标'], description: '上海地标，263米主观光层', discount: '网上预订9折' },
            { name: '上海迪士尼', price: 475, type: '主题乐园', rating: 4.7, duration: '全天', tags: ['亲子', '游乐', '演出'], description: '中国大陆首座迪士尼主题乐园', discount: '早鸟票8折' },
            { name: '豫园', price: 40, type: '园林', rating: 4.4, duration: '2小时', tags: ['古典', '园林', '文化'], description: '明代私人园林，江南古典园林代表' },
            { name: '上海博物馆', price: 0, type: '免费', rating: 4.8, duration: '3-4小时', tags: ['文物', '艺术', '历史'], description: '中国古代艺术博物馆，免费开放' }
        ],
        '北京': [
            { name: '故宫博物院', price: 60, type: '历史', rating: 4.9, duration: '半天', tags: ['皇家', '文物', '建筑'], description: '明清皇宫，世界文化遗产', discount: '淡季40元' },
            { name: '长城(八达岭)', price: 40, type: '历史', rating: 4.7, duration: '半天', tags: ['登山', '摄影', '历史'], description: '万里长城精华段', discount: '学生半价' },
            { name: '颐和园', price: 30, type: '园林', rating: 4.6, duration: '3-4小时', tags: ['皇家', '湖景', '园林'], description: '中国清朝时期皇家园林', discount: '淡季20元' },
            { name: '天坛', price: 15, type: '历史', rating: 4.5, duration: '2小时', tags: ['祭祀', '建筑', '公园'], description: '明清皇帝祭天场所' }
        ],
        '西安': [
            { name: '兵马俑', price: 120, type: '历史', rating: 4.8, duration: '3小时', tags: ['考古', '世界遗产', '震撼'], description: '世界第八大奇迹', discount: '学生半价' },
            { name: '大雁塔', price: 50, type: '历史', rating: 4.5, duration: '2小时', tags: ['佛教', '音乐喷泉', '夜景'], description: '唐代佛教建筑艺术杰作' },
            { name: '古城墙', price: 54, type: '历史', rating: 4.6, duration: '2-3小时', tags: ['骑行', '摄影', '历史'], description: '中国现存最完整的古城墙', discount: '网上预订48元' },
            { name: '回民街', price: 0, type: '免费', rating: 4.3, duration: '2小时', tags: ['美食', '文化', '购物'], description: '西安著名美食文化街区' }
        ]
    },
    
    // 优惠活动
    promotions: [
        { id: 1, platform: '携程', title: '新用户火车票立减20元', description: '首次在携程购买火车票，立减20元', code: 'TRAIN20', validUntil: '2024-12-31', category: '交通' },
        { id: 2, platform: '去哪儿', title: '机票满500减50', description: '国内机票满500元减50元', code: 'FLIGHT50', validUntil: '2024-11-30', category: '交通' },
        { id: 3, platform: '美团', title: '酒店新客7折起', description: '首次预订酒店享受7折优惠', code: 'HOTEL30', validUntil: '2024-12-31', category: '住宿' },
        { id: 4, platform: '飞猪', title: '景点门票买一送一', description: '指定景点门票买一送一', code: 'TICKET1+1', validUntil: '2024-10-31', category: '景点' },
        { id: 5, platform: '12306', title: '学生票75折', description: '学生凭学生证享受火车票75折', code: 'STUDENT', validUntil: '长期有效', category: '交通' },
        { id: 6, platform: 'Booking', title: 'Genius会员9折', description: 'Booking Genius会员享受额外9折', code: 'GENIUS10', validUntil: '长期有效', category: '住宿' }
    ]
};

// ========================================
// 工具函数
// ========================================

/**
 * 显示加载动画
 */
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

/**
 * 隐藏加载动画
 */
function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

/**
 * 获取表单数据
 * @returns {Object} 表单数据对象
 */
function getFormData() {
    return {
        from: document.getElementById('fromCity').value,
        to: document.getElementById('toCity').value,
        date: document.getElementById('travelDate').value,
        travelers: parseInt(document.getElementById('travelers').value) || 1,
        days: parseInt(document.getElementById('stayDays').value) || 2,
        checkin: document.getElementById('checkinDate').value,
        foodBudget: parseInt(document.getElementById('foodBudget').value) || 100
    };
}

/**
 * 获取路线key
 * @param {string} from - 出发城市
 * @param {string} to - 目的城市
 * @returns {string} 路线key
 */
function getRouteKey(from, to) {
    const key1 = `${from}-${to}`;
    const key2 = `${to}-${from}`;
    return DATA_SOURCE.trains[key1] ? key1 : 
           DATA_SOURCE.trains[key2] ? key2 : null;
}

// ========================================
// 数据获取函数
// ========================================

/**
 * 获取火车票数据
 * @param {Object} data - 查询参数
 * @returns {Array} 火车票列表
 */
async function fetchTrains(data) {
    const routeKey = getRouteKey(data.from, data.to);
    return routeKey ? DATA_SOURCE.trains[routeKey] : [];
}

/**
 * 获取机票数据
 * @param {Object} data - 查询参数
 * @returns {Array} 机票列表
 */
async function fetchFlights(data) {
    const routeKey = getRouteKey(data.from, data.to);
    return routeKey ? DATA_SOURCE.flights[routeKey] : [];
}

/**
 * 获取酒店数据
 * @param {Object} data - 查询参数
 * @returns {Array} 酒店列表
 */
async function fetchHotels(data) {
    return DATA_SOURCE.hotels[data.to] || [];
}

/**
 * 获取景点数据
 * @param {Object} data - 查询参数
 * @returns {Array} 景点列表
 */
async function fetchAttractions(data) {
    return DATA_SOURCE.attractions[data.to] || [];
}

// ========================================
// 渲染函数
// ========================================

/**
 * 渲染火车票
 * @param {Array} trains - 火车票列表
 * @param {Object} data - 表单数据
 */
function renderTrains(trains, data) {
    const container = document.getElementById('transportResults');
    
    if (trains.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🚄</div>
                <p>暂无火车数据</p>
            </div>`;
        return;
    }

    let html = '<h3 style="margin-bottom:16px;">🚄 火车票</h3>';
    
    trains.forEach((train, index) => {
        const isBest = index === 0;
        const basePrice = train.price.second || train.price.hard || 0;
        const discountPrice = Math.round(basePrice * train.discount);
        
        html += `
            <div class="transport-card ${isBest ? 'best' : ''}" style="position:relative;">
                ${isBest ? '<div class="best-badge">👑 最省钱</div>' : ''}
                <div class="transport-header">
                    <div>
                        <span class="transport-type">${train.type}</span>
                        <span class="transport-number">${train.trainNo}</span>
                    </div>
                </div>
                <div class="transport-time">
                    <div class="time-block">
                        <div class="time">${train.departure}</div>
                        <div class="station">${train.from}</div>
                    </div>
                    <div class="duration-line" data-duration="${train.duration}"></div>
                    <div class="time-block">
                        <div class="time">${train.arrival}</div>
                        <div class="station">${train.to}</div>
                    </div>
                </div>
                <div class="transport-price">
                    ${train.price.second ? `
                        <div class="price-tag">
                            <div class="label">二等座</div>
                            <div class="value">¥${train.price.second}</div>
                        </div>
                    ` : ''}
                    ${train.price.hard ? `
                        <div class="price-tag">
                            <div class="label">硬座</div>
                            <div class="value">¥${train.price.hard}</div>
                        </div>
                    ` : ''}
                    ${train.discount < 1 ? `
                        <div class="price-tag discount">
                            <div class="label">优惠价</div>
                            <div class="value">¥${discountPrice}</div>
                        </div>
                    ` : ''}
                </div>
                <div class="booking-links">
                    <a href="https://www.12306.cn/index/" target="_blank" class="booking-link ctrip">12306官网</a>
                    <a href="https://trains.ctrip.com/" target="_blank" class="booking-link ctrip">携程预订</a>
                    <a href="https://train.qunar.com/" target="_blank" class="booking-link qunar">去哪儿</a>
                    <a href="https://www.fliggy.com/train/" target="_blank" class="booking-link fliggy">飞猪</a>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * 渲染机票
 * @param {Array} flights - 机票列表
 * @param {Object} data - 表单数据
 */
function renderFlights(flights, data) {
    const container = document.getElementById('transportResults');
    
    if (flights.length === 0) return;

    let html = container.innerHTML + '<h3 style="margin:32px 0 16px;">✈️ 机票</h3>';
    
    flights.forEach((flight, index) => {
        const isBest = flight.price === Math.min(...flights.map(f => f.price));
        
        html += `
            <div class="transport-card ${isBest ? 'best' : ''}" style="position:relative;">
                ${isBest ? '<div class="best-badge">💰 最低价</div>' : ''}
                <div class="transport-header">
                    <div>
                        <span class="transport-type">${flight.airline}</span>
                        <span class="transport-number">${flight.flightNo}</span>
                    </div>
                    <span style="color:#6b7280;font-size:0.9em;">${flight.baggage}托运 ${flight.meal ? '✓ 餐食' : ''}</span>
                </div>
                <div class="transport-time">
                    <div class="time-block">
                        <div class="time">${flight.departure}</div>
                        <div class="station">${flight.from}</div>
                    </div>
                    <div class="duration-line" data-duration="直飞"></div>
                    <div class="time-block">
                        <div class="time">${flight.arrival}</div>
                        <div class="station">${flight.to}</div>
                    </div>
                </div>
                <div class="transport-price">
                    <div class="price-tag">
                        <div class="label">票价</div>
                        <div class="value">¥${flight.price}</div>
                    </div>
                    <div class="price-tag discount">
                        <div class="label">折扣</div>
                        <div class="value">${(flight.discount * 10).toFixed(1)}折</div>
                    </div>
                </div>
                <div class="booking-links">
                    <a href="https://flights.ctrip.com/" target="_blank" class="booking-link ctrip">携程预订</a>
                    <a href="https://flight.qunar.com/" target="_blank" class="booking-link qunar">去哪儿</a>
                    <a href="https://www.fliggy.com/flight/" target="_blank" class="booking-link fliggy">飞猪</a>
                    <a href="https://www.skyscanner.com.cn/" target="_blank" class="booking-link booking">天巡比价</a>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * 渲染酒店
 * @param {Array} hotels - 酒店列表
 * @param {Object} data - 表单数据
 */
function renderHotels(hotels, data) {
    const container = document.getElementById('hotelResults');
    
    if (hotels.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🏨</div>
                <p>暂无酒店数据</p>
            </div>`;
        return;
    }

    let html = '';
    const rooms = Math.ceil(data.travelers / 2);
    
    hotels.forEach((hotel, index) => {
        const isBest = index === 0;
        const totalPrice = hotel.price * rooms * data.days;
        
        html += `
            <div class="hotel-card ${isBest ? 'best' : ''}" style="position:relative;">
                ${isBest ? '<div class="best-badge">👑 最省钱</div>' : ''}
                <div class="hotel-image">${hotel.image}</div>
                <div class="hotel-info">
                    <div class="hotel-name">${hotel.name}</div>
                    <div class="hotel-meta">
                        <span class="hotel-rating">⭐ ${hotel.rating}</span>
                        <span class="hotel-location">📍 ${hotel.location}</span>
                    </div>
                    <div class="hotel-tags">
                        ${hotel.tags.map(tag => `<span class="hotel-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="hotel-price">
                        <div>
                            <span class="price">¥${totalPrice}</span>
                            <span class="unit">/ ${data.days}晚</span>
                        </div>
                        <span style="color:#6b7280;font-size:0.9em;">¥${hotel.price}/晚</span>
                    </div>
                    <div class="booking-links">
                        <a href="https://hotels.ctrip.com/" target="_blank" class="booking-link ctrip">携程</a>
                        <a href="https://hotel.meituan.com/" target="_blank" class="booking-link meituan">美团</a>
                        <a href="https://www.fliggy.com/hotel/" target="_blank" class="booking-link fliggy">飞猪</a>
                        <a href="https://www.booking.com/" target="_blank" class="booking-link booking">Booking</a>
                        <a href="https://www.airbnb.cn/" target="_blank" class="booking-link" style="background:#ff5a5f;color:white;">Airbnb</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * 渲染景点
 * @param {Array} attractions - 景点列表
 * @param {Object} data - 表单数据
 */
function renderAttractions(attractions, data) {
    const container = document.getElementById('attractionResults');
    
    if (attractions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎫</div>
                <p>暂无景点数据</p>
            </div>`;
        return;
    }

    let html = '';
    
    attractions.forEach(attraction => {
        const isFree = attraction.price === 0;
        
        html += `
            <div class="attraction-card ${isFree ? 'free' : ''}">
                <div class="attraction-header">
                    <div class="attraction-name">${attraction.name}</div>
                    <div class="attraction-price ${isFree ? 'free' : ''}">${isFree ? '免费' : '¥' + attraction.price}</div>
                </div>
                <div class="attraction-desc">${attraction.description}</div>
                <div class="attraction-meta">
                    <span>⭐ ${attraction.rating}</span>
                    <span>⏱️ ${attraction.duration}</span>
                    <span>${attraction.tags.join(' · ')}</span>
                </div>
                ${attraction.discount ? `<div class="attraction-discount">🎁 ${attraction.discount}</div>` : ''}
                <div class="booking-links">
                    <a href="https://www.meituan.com/" target="_blank" class="booking-link meituan">美团</a>
                    <a href="https://www.dianping.com/" target="_blank" class="booking-link" style="background:#ff6633;color:white;">大众点评</a>
                    <a href="https://piao.ctrip.com/" target="_blank" class="booking-link ctrip">携程</a>
                    <a href="https://www.fliggy.com/ticket/" target="_blank" class="booking-link fliggy">飞猪</a>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

/**
 * 计算费用汇总
 * @param {Array} trains - 火车票列表
 * @param {Array} flights - 机票列表
 * @param {Array} hotels - 酒店列表
 * @param {Array} attractions - 景点列表
 * @param {Object} data - 表单数据
 */
function calculateSummary(trains, flights, hotels, attractions, data) {
    // 计算最低交通费用
    let minTransport = Infinity;
    
    trains.forEach(train => {
        const price = train.price.second || train.price.hard || 9999;
        const discountedPrice = Math.round(price * train.discount);
        minTransport = Math.min(minTransport, discountedPrice * data.travelers);
    });
    
    flights.forEach(flight => {
        minTransport = Math.min(minTransport, flight.price);
    });
    
    if (minTransport === Infinity) minTransport = 0;
    
    // 计算最低住宿费用
    const minHotelPrice = hotels.length > 0 ? Math.min(...hotels.map(h => h.price)) : 0;
    const minHotel = minHotelPrice * Math.ceil(data.travelers / 2) * data.days;
    
    // 计算景点费用
    const totalAttraction = attractions.reduce((sum, a) => sum + a.price, 0) * data.travelers;
    
    // 计算餐饮费用
    const totalFood = data.foodBudget * data.travelers * data.days;
    
    // 计算舒适预算
    const comfortTransport = trains.length > 0 ? (trains[0].price.second || trains[0].price.hard || 500) * data.travelers : 1000;
    const comfortHotel = hotels.length > 1 ? hotels[1].price * Math.ceil(data.travelers / 2) * data.days : minHotel * 2;
    const comfortAttraction = totalAttraction * 1.5;
    const comfortFood = totalFood * 1.5;
    
    // 更新显示
    document.getElementById('minTransport').textContent = '¥' + minTransport;
    document.getElementById('minHotel').textContent = '¥' + minHotel;
    document.getElementById('totalAttraction').textContent = '¥' + totalAttraction;
    document.getElementById('totalFood').textContent = '¥' + totalFood;
    document.getElementById('minTotal').textContent = '¥' + (minTransport + minHotel + totalAttraction + totalFood);
    document.getElementById('comfortTotal').textContent = '¥' + (comfortTransport + comfortHotel + comfortAttraction + comfortFood);
}

// ========================================
// 主要功能函数
// ========================================

/**
 * 搜索所有数据
 */
async function searchAll() {
    const data = getFormData();
    
    // 验证输入
    if (!data.from || !data.to) {
        alert('请选择出发城市和目的地城市');
        return;
    }
    
    if (data.from === data.to) {
        alert('出发城市和目的地不能相同');
        return;
    }

    showLoading();

    try {
        // 并行获取所有数据
        const [trains, flights, hotels, attractions] = await Promise.all([
            fetchTrains(data),
            fetchFlights(data),
            fetchHotels(data),
            fetchAttractions(data)
        ]);

        // 渲染结果
        renderTrains(trains, data);
        renderFlights(flights, data);
        renderHotels(hotels, data);
        renderAttractions(attractions, data);
        
        // 计算汇总
        calculateSummary(trains, flights, hotels, attractions, data);

        // 显示结果区域
        document.getElementById('transportSection').style.display = 'block';
        document.getElementById('hotelSection').style.display = 'block';
        document.getElementById('attractionSection').style.display = 'block';
        document.getElementById('summaryCard').style.display = 'block';

        // 滚动到结果
        document.getElementById('transportSection').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('搜索失败:', error);
        alert('搜索失败，请稍后重试');
    } finally {
        hideLoading();
    }
}

/**
 * 显示优惠活动
 */
function showPromotions() {
    const container = document.getElementById('promotionsGrid');
    const section = document.getElementById('promotionsSection');
    
    let html = '';
    DATA_SOURCE.promotions.forEach(promo => {
        html += `
            <div class="promotion-card">
                <span class="promotion-platform">${promo.platform}</span>
                <div class="promotion-title">${promo.title}</div>
                <div class="promotion-desc">${promo.description}</div>
                <div class="promotion-code">${promo.code}</div>
                <div class="promotion-valid">⏰ 有效期至: ${promo.validUntil}</div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    section.style.display = 'block';
    section.scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// 初始化
// ========================================

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    // 设置默认日期
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateStr = tomorrow.toISOString().split('T')[0];
    document.getElementById('travelDate').value = dateStr;
    document.getElementById('checkinDate').value = dateStr;
    
    console.log('🎒 穷游费用对比系统 Pro 已加载');
});

// 导出函数供全局使用
window.searchAll = searchAll;
window.showPromotions = showPromotions;
