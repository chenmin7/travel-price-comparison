const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('node-cron');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 限流保护
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 每个IP限制100次请求
});
app.use(limiter);

// 缓存数据
const cache = {
  promotions: [],
  hotRoutes: [],
  lastUpdate: null
};

// ==================== 模拟真实数据源 ====================

// 火车票数据源（模拟12306数据）
const trainDataSource = {
  '北京-上海': [
    { trainNo: 'G1', type: '高铁', departure: '06:00', arrival: '10:28', duration: '4小时28分', price: { second: 553, first: 933, business: 1748 }, discount: 0.95 },
    { trainNo: 'G3', type: '高铁', departure: '07:00', arrival: '11:28', duration: '4小时28分', price: { second: 553, first: 933, business: 1748 }, discount: 1 },
    { trainNo: 'G5', type: '高铁', departure: '08:00', arrival: '12:28', duration: '4小时28分', price: { second: 553, first: 933, business: 1748 }, discount: 0.9 },
    { trainNo: 'T109', type: '特快', departure: '19:30', arrival: '08:58', duration: '13小时28分', price: { hard: 156, soft: 283 }, discount: 0.85 },
    { trainNo: '1461', type: '普快', departure: '11:55', arrival: '06:47', duration: '18小时52分', price: { hard: 148, soft: 268 }, discount: 0.8 }
  ],
  '北京-西安': [
    { trainNo: 'G87', type: '高铁', departure: '14:00', arrival: '18:20', duration: '4小时20分', price: { second: 515, first: 824, business: 1627 }, discount: 0.95 },
    { trainNo: 'G89', type: '高铁', departure: '15:00', arrival: '19:20', duration: '4小时20分', price: { second: 515, first: 824, business: 1627 }, discount: 1 },
    { trainNo: 'T7', type: '特快', departure: '16:40', arrival: '05:42', duration: '13小时2分', price: { hard: 148, soft: 263 }, discount: 0.85 },
    { trainNo: 'T41', type: '特快', departure: '18:48', arrival: '08:01', duration: '13小时13分', price: { hard: 148, soft: 263 }, discount: 0.8 }
  ],
  '上海-杭州': [
    { trainNo: 'G7501', type: '高铁', departure: '06:00', arrival: '06:45', duration: '45分', price: { second: 73, first: 117, business: 219 }, discount: 0.95 },
    { trainNo: 'G7503', type: '高铁', departure: '06:30', arrival: '07:15', duration: '45分', price: { second: 73, first: 117, business: 219 }, discount: 1 },
    { trainNo: 'G7505', type: '高铁', departure: '07:00', arrival: '07:45', duration: '45分', price: { second: 73, first: 117, business: 219 }, discount: 0.9 },
    { trainNo: 'K833', type: '快速', departure: '07:10', arrival: '09:30', duration: '2小时20分', price: { hard: 24, soft: 40 }, discount: 0.85 }
  ]
};

// 机票数据源
const flightDataSource = {
  '北京-上海': [
    { airline: '中国国航', flightNo: 'CA1515', departure: '08:00', arrival: '10:15', price: 680, discount: 0.35, baggage: '20kg', meal: true },
    { airline: '东方航空', flightNo: 'MU5101', departure: '09:00', arrival: '11:15', price: 720, discount: 0.38, baggage: '20kg', meal: true },
    { airline: '南方航空', flightNo: 'CZ3101', departure: '10:00', arrival: '12:15', price: 650, discount: 0.32, baggage: '20kg', meal: true },
    { airline: '海南航空', flightNo: 'HU7601', departure: '14:00', arrival: '16:15', price: 590, discount: 0.28, baggage: '20kg', meal: false },
    { airline: '春秋航空', flightNo: '9C8801', departure: '16:00', arrival: '18:15', price: 380, discount: 0.18, baggage: '7kg', meal: false }
  ],
  '北京-西安': [
    { airline: '中国国航', flightNo: 'CA1201', departure: '08:30', arrival: '10:45', price: 580, discount: 0.32, baggage: '20kg', meal: true },
    { airline: '东方航空', flightNo: 'MU2101', departure: '10:00', arrival: '12:15', price: 620, discount: 0.35, baggage: '20kg', meal: true },
    { airline: '海南航空', flightNo: 'HU7137', departure: '14:30', arrival: '16:45', price: 480, discount: 0.25, baggage: '20kg', meal: false }
  ],
  '上海-成都': [
    { airline: '中国国航', flightNo: 'CA4501', departure: '08:00', arrival: '11:15', price: 780, discount: 0.28, baggage: '20kg', meal: true },
    { airline: '四川航空', flightNo: '3U8965', departure: '10:00', arrival: '13:15', price: 680, discount: 0.24, baggage: '20kg', meal: true },
    { airline: '春秋航空', flightNo: '9C8887', departure: '15:00', arrival: '18:15', price: 480, discount: 0.16, baggage: '7kg', meal: false }
  ]
};

// 酒店数据源
const hotelDataSource = {
  '上海': [
    { name: '上海外滩青年旅舍', type: '青旅', rating: 4.5, price: 68, location: '外滩', tags: ['近地铁', '江景', '免费WiFi'], bookingLink: 'https://www.booking.com' },
    { name: '汉庭酒店(上海南京路店)', type: '经济型', rating: 4.3, price: 289, location: '南京路', tags: ['含早', '近地铁', '干净'], bookingLink: 'https://www.ctrip.com' },
    { name: '如家精选(上海人民广场店)', type: '快捷', rating: 4.4, price: 359, location: '人民广场', tags: ['含早', '近地铁', '服务好'], bookingLink: 'https://www.ctrip.com' },
    { name: '上海民宿·田子坊艺术公寓', type: '民宿', rating: 4.6, price: 428, location: '田子坊', tags: ['可做饭', '艺术风', '近景点'], bookingLink: 'https://www.airbnb.cn' },
    { name: '上海浦东香格里拉', type: '五星级', rating: 4.8, price: 1280, location: '陆家嘴', tags: ['江景', '泳池', 'SPA'], bookingLink: 'https://www.shangri-la.com' }
  ],
  '北京': [
    { name: '北京国际青年旅舍', type: '青旅', rating: 4.4, price: 78, location: '东城区', tags: ['近故宫', '四合院', '免费WiFi'], bookingLink: 'https://www.booking.com' },
    { name: '7天酒店(北京天安门店)', type: '经济型', rating: 4.1, price: 268, location: '天安门', tags: ['近地铁', '干净', '性价比高'], bookingLink: 'https://www.ctrip.com' },
    { name: '全季酒店(北京王府井店)', type: '快捷', rating: 4.5, price: 459, location: '王府井', tags: ['含早', '近地铁', '服务好'], bookingLink: 'https://www.ctrip.com' },
    { name: '北京胡同民宿', type: '民宿', rating: 4.7, price: 388, location: '南锣鼓巷', tags: ['四合院', '文化体验', '近景点'], bookingLink: 'https://www.airbnb.cn' }
  ],
  '西安': [
    { name: '西安湘子门青年旅舍', type: '青旅', rating: 4.6, price: 58, location: '南门', tags: ['古城墙', '近地铁', '免费WiFi'], bookingLink: 'https://www.booking.com' },
    { name: '汉庭酒店(西安钟楼店)', type: '经济型', rating: 4.4, price: 238, location: '钟楼', tags: ['含早', '近地铁', '干净'], bookingLink: 'https://www.ctrip.com' },
    { name: '西安古城民宿', type: '民宿', rating: 4.8, price: 328, location: '回民街', tags: ['古风', '近美食', '可做饭'], bookingLink: 'https://www.airbnb.cn' }
  ]
};

// 景点数据源
const attractionDataSource = {
  '上海': [
    { name: '外滩', price: 0, type: '免费', rating: 4.8, duration: '2-3小时', tags: ['夜景', '拍照', '历史'], description: '上海标志性景点，万国建筑博览群', bookingLink: 'https://www.meituan.com' },
    { name: '东方明珠', price: 199, type: '观光', rating: 4.5, duration: '3-4小时', tags: ['高空', '观景', '地标'], description: '上海地标，263米主观光层', discount: '网上预订9折', bookingLink: 'https://www.ctrip.com' },
    { name: '上海迪士尼', price: 475, type: '主题乐园', rating: 4.7, duration: '全天', tags: ['亲子', '游乐', '演出'], description: '中国大陆首座迪士尼主题乐园', discount: '早鸟票8折', bookingLink: 'https://www.shanghaidisneyresort.com' },
    { name: '豫园', price: 40, type: '园林', rating: 4.4, duration: '2小时', tags: ['古典', '园林', '文化'], description: '明代私人园林，江南古典园林代表', bookingLink: 'https://www.meituan.com' },
    { name: '上海博物馆', price: 0, type: '免费', rating: 4.8, duration: '3-4小时', tags: ['文物', '艺术', '历史'], description: '中国古代艺术博物馆，免费开放', bookingLink: 'https://www.shanghaimuseum.net' }
  ],
  '北京': [
    { name: '故宫博物院', price: 60, type: '历史', rating: 4.9, duration: '半天', tags: ['皇家', '文物', '建筑'], description: '明清皇宫，世界文化遗产', discount: '淡季40元', bookingLink: 'https://www.dpm.org.cn' },
    { name: '长城(八达岭)', price: 40, type: '历史', rating: 4.7, duration: '半天', tags: ['登山', '摄影', '历史'], description: '万里长城精华段', discount: '学生半价', bookingLink: 'https://www.badaling.cn' },
    { name: '颐和园', price: 30, type: '园林', rating: 4.6, duration: '3-4小时', tags: ['皇家', '湖景', '园林'], description: '中国清朝时期皇家园林', discount: '淡季20元', bookingLink: 'https://www.summerpalace-china.com' },
    { name: '天坛', price: 15, type: '历史', rating: 4.5, duration: '2小时', tags: ['祭祀', '建筑', '公园'], description: '明清皇帝祭天场所', bookingLink: 'https://www.meituan.com' }
  ],
  '西安': [
    { name: '兵马俑', price: 120, type: '历史', rating: 4.8, duration: '3小时', tags: ['考古', '世界遗产', '震撼'], description: '世界第八大奇迹', discount: '学生半价', bookingLink: 'https://www.bmy.com.cn' },
    { name: '大雁塔', price: 50, type: '历史', rating: 4.5, duration: '2小时', tags: ['佛教', '音乐喷泉', '夜景'], description: '唐代佛教建筑艺术杰作', bookingLink: 'https://www.meituan.com' },
    { name: '古城墙', price: 54, type: '历史', rating: 4.6, duration: '2-3小时', tags: ['骑行', '摄影', '历史'], description: '中国现存最完整的古城墙', discount: '网上预订48元', bookingLink: 'https://www.xiantravel.cn' },
    { name: '回民街', price: 0, type: '免费', rating: 4.3, duration: '2小时', tags: ['美食', '文化', '购物'], description: '西安著名美食文化街区', bookingLink: 'https://www.meituan.com' }
  ]
};

// 优惠活动数据
const promotionsData = [
  {
    id: 1,
    platform: '携程',
    title: '新用户火车票立减20元',
    description: '首次在携程购买火车票，立减20元',
    code: 'TRAIN20',
    validUntil: '2024-12-31',
    link: 'https://www.ctrip.com',
    category: '交通'
  },
  {
    id: 2,
    platform: '去哪儿',
    title: '机票满500减50',
    description: '国内机票满500元减50元',
    code: 'FLIGHT50',
    validUntil: '2024-11-30',
    link: 'https://www.qunar.com',
    category: '交通'
  },
  {
    id: 3,
    platform: '美团',
    title: '酒店新客7折起',
    description: '首次预订酒店享受7折优惠',
    code: 'HOTEL30',
    validUntil: '2024-12-31',
    link: 'https://hotel.meituan.com',
    category: '住宿'
  },
  {
    id: 4,
    platform: '飞猪',
    title: '景点门票买一送一',
    description: '指定景点门票买一送一',
    code: 'TICKET1+1',
    validUntil: '2024-10-31',
    link: 'https://www.fliggy.com',
    category: '景点'
  },
  {
    id: 5,
    platform: '12306',
    title: '学生票75折',
    description: '学生凭学生证享受火车票75折',
    code: 'STUDENT',
    validUntil: '长期有效',
    link: 'https://www.12306.cn',
    category: '交通'
  },
  {
    id: 6,
    platform: 'Booking',
    title: 'Genius会员9折',
    description: 'Booking Genius会员享受额外9折',
    code: 'GENIUS10',
    validUntil: '长期有效',
    link: 'https://www.booking.com',
    category: '住宿'
  }
];

// ==================== API路由 ====================

// 获取火车票信息
app.get('/api/trains', (req, res) => {
  const { from, to, date } = req.query;
  const routeKey = `${from}-${to}`;
  const reverseKey = `${to}-${from}`;
  
  let trains = trainDataSource[routeKey] || trainDataSource[reverseKey] || [];
  
  // 添加跳转链接
  trains = trains.map(train => ({
    ...train,
    bookingLinks: {
      '12306': `https://www.12306.cn/index/`,
      '携程': `https://trains.ctrip.com/TrainBooking/Search.aspx?from=${from}&to=${to}&date=${date}`,
      '去哪儿': `https://train.qunar.com/`,
      '飞猪': `https://www.fliggy.com/train/`
    }
  }));
  
  res.json({
    success: true,
    data: trains,
    from,
    to,
    date,
    updateTime: new Date().toISOString()
  });
});

// 获取机票信息
app.get('/api/flights', (req, res) => {
  const { from, to, date } = req.query;
  const routeKey = `${from}-${to}`;
  const reverseKey = `${to}-${from}`;
  
  let flights = flightDataSource[routeKey] || flightDataSource[reverseKey] || [];
  
  // 添加跳转链接
  flights = flights.map(flight => ({
    ...flight,
    bookingLinks: {
      '携程': `https://flights.ctrip.com/`,
      '去哪儿': `https://flight.qunar.com/`,
      '飞猪': `https://www.fliggy.com/flight/`,
      '天巡': `https://www.skyscanner.com.cn/`
    }
  }));
  
  res.json({
    success: true,
    data: flights,
    from,
    to,
    date,
    updateTime: new Date().toISOString()
  });
});

// 获取酒店信息
app.get('/api/hotels', (req, res) => {
  const { city, checkin, checkout, guests } = req.query;
  
  let hotels = hotelDataSource[city] || [];
  
  // 添加跳转链接
  hotels = hotels.map(hotel => ({
    ...hotel,
    bookingLinks: {
      '携程': `https://hotels.ctrip.com/hotel/${city}`,
      '美团': `https://hotel.meituan.com/${city}`,
      '飞猪': `https://www.fliggy.com/hotel/`,
      'Booking': `https://www.booking.com/searchresults.html?city=${city}`,
      'Airbnb': `https://www.airbnb.cn/s/${city}`
    }
  }));
  
  res.json({
    success: true,
    data: hotels,
    city,
    checkin,
    checkout,
    guests,
    updateTime: new Date().toISOString()
  });
});

// 获取景点信息
app.get('/api/attractions', (req, res) => {
  const { city } = req.query;
  
  let attractions = attractionDataSource[city] || [];
  
  // 添加跳转链接
  attractions = attractions.map(attraction => ({
    ...attraction,
    bookingLinks: {
      '美团': `https://www.meituan.com/`,
      '大众点评': `https://www.dianping.com/`,
      '携程': `https://piao.ctrip.com/`,
      '飞猪': `https://www.fliggy.com/ticket/`
    }
  }));
  
  res.json({
    success: true,
    data: attractions,
    city,
    updateTime: new Date().toISOString()
  });
});

// 获取优惠活动
app.get('/api/promotions', (req, res) => {
  const { category } = req.query;
  let promotions = promotionsData;
  
  if (category) {
    promotions = promotions.filter(p => p.category === category);
  }
  
  res.json({
    success: true,
    data: promotions,
    updateTime: new Date().toISOString()
  });
});

// 获取综合比价结果
app.get('/api/compare', async (req, res) => {
  const { from, to, date, travelers, days } = req.query;
  
  try {
    // 并行获取所有数据
    const [trains, flights, hotels, attractions, promotions] = await Promise.all([
      // 模拟API调用
      Promise.resolve(trainDataSource[`${from}-${to}`] || trainDataSource[`${to}-${from}`] || []),
      Promise.resolve(flightDataSource[`${from}-${to}`] || flightDataSource[`${to}-${from}`] || []),
      Promise.resolve(hotelDataSource[to] || []),
      Promise.resolve(attractionDataSource[to] || []),
      Promise.resolve(promotionsData)
    ]);
    
    // 计算最低价格
    const minTrainPrice = trains.length > 0 ? Math.min(...trains.map(t => 
      t.price.second || t.price.hard || 9999
    )) * travelers : null;
    
    const minFlightPrice = flights.length > 0 ? Math.min(...flights.map(f => f.price)) : null;
    
    const minHotelPrice = hotels.length > 0 ? Math.min(...hotels.map(h => h.price)) * Math.ceil(travelers/2) * days : null;
    
    const attractionsTotal = attractions.reduce((sum, a) => sum + a.price, 0) * travelers;
    
    res.json({
      success: true,
      summary: {
        minTransport: Math.min(minTrainPrice || Infinity, minFlightPrice || Infinity),
        minHotel: minHotelPrice,
        attractions: attractionsTotal,
        minTotal: (minTrainPrice || 0) + (minHotelPrice || 0) + attractionsTotal
      },
      details: {
        trains,
        flights,
        hotels,
        attractions,
        promotions
      },
      updateTime: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取热门路线
app.get('/api/hot-routes', (req, res) => {
  const hotRoutes = [
    { from: '北京', to: '上海', avgPrice: 553, type: '高铁', popularity: 98 },
    { from: '北京', to: '西安', avgPrice: 515, type: '高铁', popularity: 95 },
    { from: '上海', to: '杭州', avgPrice: 73, type: '高铁', popularity: 92 },
    { from: '广州', to: '深圳', avgPrice: 80, type: '高铁', popularity: 90 },
    { from: '成都', to: '重庆', avgPrice: 150, type: '高铁', popularity: 88 }
  ];
  
  res.json({
    success: true,
    data: hotRoutes,
    updateTime: new Date().toISOString()
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📊 API文档: http://localhost:${PORT}/api/health`);
});

// 定时更新数据（每30分钟）
cron.schedule('*/30 * * * *', () => {
  console.log('🔄 正在更新数据...', new Date().toISOString());
  // 这里可以添加数据抓取逻辑
  cache.lastUpdate = new Date().toISOString();
});
