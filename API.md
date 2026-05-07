# 📡 API 接口文档

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **Content-Type**: `application/json`
- **编码**: UTF-8

## 接口列表

### 1. 火车票查询

获取指定路线的火车票信息。

```http
GET /api/trains?from={出发城市}&to={目的城市}&date={日期}
```

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| from | string | ✅ | 出发城市，如：北京 |
| to | string | ✅ | 目的城市，如：上海 |
| date | string | ❌ | 出发日期，格式：YYYY-MM-DD |

#### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "trainNo": "G1",
      "type": "高铁",
      "from": "北京南",
      "to": "上海虹桥",
      "departure": "06:00",
      "arrival": "10:28",
      "duration": "4小时28分",
      "price": {
        "second": 553,
        "first": 933,
        "business": 1748
      },
      "discount": 0.95,
      "bookingLinks": {
        "12306": "https://www.12306.cn/",
        "携程": "https://trains.ctrip.com/",
        "去哪儿": "https://train.qunar.com/",
        "飞猪": "https://www.fliggy.com/train/"
      }
    }
  ],
  "from": "北京",
  "to": "上海",
  "date": "2024-01-01",
  "updateTime": "2024-01-01T12:00:00.000Z"
}
```

#### 错误响应

```json
{
  "success": false,
  "error": "参数错误：from和to不能为空"
}
```

---

### 2. 机票查询

获取指定航线的机票信息。

```http
GET /api/flights?from={出发城市}&to={目的城市}&date={日期}
```

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| from | string | ✅ | 出发城市 |
| to | string | ✅ | 目的城市 |
| date | string | ❌ | 出发日期 |

#### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "airline": "中国国航",
      "flightNo": "CA1515",
      "from": "首都T3",
      "to": "虹桥T2",
      "departure": "08:00",
      "arrival": "10:15",
      "price": 680,
      "discount": 0.35,
      "baggage": "20kg",
      "meal": true,
      "bookingLinks": {
        "携程": "https://flights.ctrip.com/",
        "去哪儿": "https://flight.qunar.com/",
        "飞猪": "https://www.fliggy.com/flight/",
        "天巡": "https://www.skyscanner.com.cn/"
      }
    }
  ],
  "updateTime": "2024-01-01T12:00:00.000Z"
}
```

---

### 3. 酒店查询

获取指定城市的酒店信息。

```http
GET /api/hotels?city={城市}&checkin={入住日期}&checkout={退房日期}&guests={人数}
```

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| city | string | ✅ | 城市名称 |
| checkin | string | ❌ | 入住日期 |
| checkout | string | ❌ | 退房日期 |
| guests | number | ❌ | 入住人数 |

#### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "name": "上海外滩青年旅舍",
      "type": "青旅",
      "rating": 4.5,
      "price": 68,
      "location": "外滩",
      "tags": ["近地铁", "江景", "免费WiFi"],
      "bookingLinks": {
        "携程": "https://hotels.ctrip.com/",
        "美团": "https://hotel.meituan.com/",
        "飞猪": "https://www.fliggy.com/hotel/",
        "Booking": "https://www.booking.com/",
        "Airbnb": "https://www.airbnb.cn/"
      }
    }
  ],
  "city": "上海",
  "updateTime": "2024-01-01T12:00:00.000Z"
}
```

---

### 4. 景点查询

获取指定城市的景点信息。

```http
GET /api/attractions?city={城市}
```

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| city | string | ✅ | 城市名称 |

#### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "name": "外滩",
      "price": 0,
      "type": "免费",
      "rating": 4.8,
      "duration": "2-3小时",
      "tags": ["夜景", "拍照", "历史"],
      "description": "上海标志性景点，万国建筑博览群",
      "bookingLinks": {
        "美团": "https://www.meituan.com/",
        "大众点评": "https://www.dianping.com/",
        "携程": "https://piao.ctrip.com/",
        "飞猪": "https://www.fliggy.com/ticket/"
      }
    }
  ],
  "city": "上海",
  "updateTime": "2024-01-01T12:00:00.000Z"
}
```

---

### 5. 优惠活动查询

获取当前可用的优惠活动列表。

```http
GET /api/promotions?category={类别}
```

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | ❌ | 类别：交通/住宿/景点 |

#### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "platform": "携程",
      "title": "新用户火车票立减20元",
      "description": "首次在携程购买火车票，立减20元",
      "code": "TRAIN20",
      "validUntil": "2024-12-31",
      "link": "https://www.ctrip.com",
      "category": "交通"
    }
  ],
  "updateTime": "2024-01-01T12:00:00.000Z"
}
```

---

### 6. 综合比价

一次性获取所有类型的比价数据。

```http
GET /api/compare?from={出发城市}&to={目的城市}&date={日期}&travelers={人数}&days={天数}
```

#### 请求参数

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| from | string | ✅ | 出发城市 |
| to | string | ✅ | 目的城市 |
| date | string | ❌ | 出发日期 |
| travelers | number | ❌ | 出行人数，默认1 |
| days | number | ❌ | 住宿天数，默认2 |

#### 响应示例

```json
{
  "success": true,
  "summary": {
    "minTransport": 553,
    "minHotel": 408,
    "attractions": 135,
    "minTotal": 1696
  },
  "details": {
    "trains": [...],
    "flights": [...],
    "hotels": [...],
    "attractions": [...],
    "promotions": [...]
  },
  "updateTime": "2024-01-01T12:00:00.000Z"
}
```

---

### 7. 热门路线

获取热门旅游路线推荐。

```http
GET /api/hot-routes
```

#### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "from": "北京",
      "to": "上海",
      "avgPrice": 553,
      "type": "高铁",
      "popularity": 98
    }
  ],
  "updateTime": "2024-01-01T12:00:00.000Z"
}
```

---

### 8. 健康检查

检查API服务状态。

```http
GET /api/health
```

#### 响应示例

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 数据模型

### Train 火车票

| 字段 | 类型 | 说明 |
|------|------|------|
| trainNo | string | 车次号 |
| type | string | 列车类型：高铁/动车/特快/普快 |
| from | string | 出发站 |
| to | string | 到达站 |
| departure | string | 出发时间 |
| arrival | string | 到达时间 |
| duration | string | 历时 |
| price | object | 票价：second/first/business/hard/soft |
| discount | number | 折扣率 |
| bookingLinks | object | 预订链接 |

### Flight 机票

| 字段 | 类型 | 说明 |
|------|------|------|
| airline | string | 航空公司 |
| flightNo | string | 航班号 |
| from | string | 出发航站楼 |
| to | string | 到达航站楼 |
| departure | string | 起飞时间 |
| arrival | string | 到达时间 |
| price | number | 票价 |
| discount | number | 折扣率 |
| baggage | string | 行李额度 |
| meal | boolean | 是否含餐 |
| bookingLinks | object | 预订链接 |

### Hotel 酒店

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 酒店名称 |
| type | string | 类型：青旅/经济型/快捷/民宿/五星级 |
| rating | number | 评分 |
| price | number | 每晚价格 |
| location | string | 位置 |
| tags | array | 标签列表 |
| bookingLinks | object | 预订链接 |

### Attraction 景点

| 字段 | 类型 | 说明 |
|------|------|------|
| name | string | 景点名称 |
| price | number | 门票价格 |
| type | string | 类型 |
| rating | number | 评分 |
| duration | string | 建议游玩时长 |
| tags | array | 标签列表 |
| description | string | 景点描述 |
| discount | string | 优惠信息 |
| bookingLinks | object | 预订链接 |

### Promotion 优惠活动

| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 活动ID |
| platform | string | 平台名称 |
| title | string | 活动标题 |
| description | string | 活动描述 |
| code | string | 优惠码 |
| validUntil | string | 有效期 |
| link | string | 活动链接 |
| category | string | 类别 |

---

## 错误码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

## 限流说明

- 每个IP每15分钟最多100次请求
- 超过限制将返回429状态码

## 更新频率

- 火车票数据：实时
- 机票数据：实时
- 酒店数据：30分钟
- 景点数据：每日
- 优惠活动：每日
