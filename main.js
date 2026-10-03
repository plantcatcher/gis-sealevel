(function() {
  'use strict';

  // ===== SCENARIO DATA =====
  // Based on IPCC AR6 approximate values
  const scenarios = {
    '2.6': {
      label: 'RCP 2.6',
      desc: '积极减排',
      slr: { 2024: 0, 2030: 25, 2040: 65, 2050: 110, 2060: 155, 2070: 195, 2080: 240, 2090: 290, 2100: 350 },
      temp: { 2024: 1.2, 2030: 1.35, 2040: 1.55, 2050: 1.7, 2060: 1.8, 2070: 1.85, 2080: 1.9, 2090: 1.92, 2100: 1.95 },
      pop: { 2024: 0, 2030: 0.5, 2040: 1.2, 2050: 2.0, 2060: 2.8, 2070: 3.5, 2080: 4.2, 2090: 5.0, 2100: 5.8 },
      ice: { 2024: 270, 2030: 310, 2040: 370, 2050: 420, 2060: 460, 2070: 490, 2080: 510, 2090: 520, 2100: 530 },
      color: getComputedStyle(document.documentElement).getPropertyValue('--rcp-low').trim()
    },
    '4.5': {
      label: 'RCP 4.5',
      desc: '中等排放',
      slr: { 2024: 0, 2030: 30, 2040: 85, 2050: 155, 2060: 240, 2070: 330, 2080: 420, 2090: 510, 2100: 600 },
      temp: { 2024: 1.2, 2030: 1.5, 2040: 1.9, 2050: 2.3, 2060: 2.7, 2070: 3.0, 2080: 3.2, 2090: 3.4, 2100: 3.5 },
      pop: { 2024: 0, 2030: 0.7, 2040: 1.8, 2050: 3.5, 2060: 5.5, 2070: 7.5, 2080: 9.5, 2090: 11.5, 2100: 13.5 },
      ice: { 2024: 270, 2030: 340, 2040: 440, 2050: 560, 2060: 680, 2070: 780, 2080: 860, 2090: 920, 2100: 960 },
      color: getComputedStyle(document.documentElement).getPropertyValue('--rcp-mid').trim()
    },
    '8.5': {
      label: 'RCP 8.5',
      desc: '高排放',
      slr: { 2024: 0, 2030: 40, 2040: 120, 2050: 230, 2060: 380, 2070: 550, 2080: 740, 2090: 940, 2100: 1150 },
      temp: { 2024: 1.2, 2030: 1.7, 2040: 2.4, 2050: 3.2, 2060: 4.0, 2070: 4.8, 2080: 5.5, 2090: 6.1, 2100: 6.7 },
      pop: { 2024: 0, 2030: 1.0, 2040: 3.0, 2050: 6.0, 2060: 10.0, 2070: 14.5, 2080: 19.0, 2090: 23.0, 2100: 27.0 },
      ice: { 2024: 270, 2030: 400, 2040: 600, 2050: 850, 2060: 1100, 2070: 1350, 2080: 1550, 2090: 1700, 2100: 1800 },
      color: getComputedStyle(document.documentElement).getPropertyValue('--rcp-high').trim()
    }
  };

  // City data with elevation and vulnerability
  const cityData = {
    shanghai:     { name: '上海',       country: '中国',       elev: 4,   vuln: 3.5 },
    guangzhou:    { name: '广州',       country: '中国',       elev: 6,   vuln: 2.8 },
    tianjin:      { name: '天津',       country: '中国',       elev: 3,   vuln: 3.0 },
    beijing:      { name: '北京',       country: '中国',       elev: 43,  vuln: 1.0 },
    shenzhen:     { name: '深圳',       country: '中国',       elev: 8,   vuln: 2.5 },
    chengdu:      { name: '成都',       country: '中国',       elev: 500, vuln: 0.5 },
    hangzhou:     { name: '杭州',       country: '中国',       elev: 8,   vuln: 2.0 },
    wuhan:        { name: '武汉',       country: '中国',       elev: 23,  vuln: 1.5 },
    nanjing:      { name: '南京',       country: '中国',       elev: 12,  vuln: 1.8 },
    xian:         { name: '西安',       country: '中国',       elev: 405, vuln: 0.5 },
    mumbai:       { name: '孟买',       country: '印度',       elev: 14,  vuln: 3.0 },
    delhi:        { name: '德里',       country: '印度',       elev: 216, vuln: 0.8 },
    dhaka:        { name: '达卡',       country: '孟加拉国',   elev: 5,   vuln: 4.5 },
    karachi:      { name: '卡拉奇',     country: '巴基斯坦',   elev: 10,  vuln: 3.0 },
    kolkata:      { name: '加尔各答',   country: '印度',       elev: 9,   vuln: 3.5 },
    chennai:      { name: '金奈',       country: '印度',       elev: 7,   vuln: 2.5 },
    bangkok:      { name: '曼谷',       country: '泰国',       elev: 2,   vuln: 3.5 },
    jakarta:      { name: '雅加达',     country: '印度尼西亚', elev: 8,   vuln: 3.0 },
    singapore:    { name: '新加坡',     country: '新加坡',     elev: 15,  vuln: 1.5 },
    manila:       { name: '马尼拉',     country: '菲律宾',     elev: 5,   vuln: 3.5 },
    ho_chi_minh:  { name: '胡志明市',   country: '越南',       elev: 2,   vuln: 3.0 },
    tokyo:        { name: '东京',       country: '日本',       elev: 40,  vuln: 1.5 },
    osaka:        { name: '大阪',       country: '日本',       elev: 5,   vuln: 2.0 },
    seoul:        { name: '首尔',       country: '韩国',       elev: 38,  vuln: 1.2 },
    busan:        { name: '釜山',       country: '韩国',       elev: 10,  vuln: 2.0 },
    cairo:        { name: '开罗',       country: '埃及',       elev: 23,  vuln: 2.0 },
    lagos:        { name: '拉各斯',     country: '尼日利亚',   elev: 5,   vuln: 3.5 },
    kinshasa:     { name: '金沙萨',     country: '刚果(金)',   elev: 240, vuln: 1.0 },
    johannesburg: { name: '约翰内斯堡', country: '南非',       elev: 1753,vuln: 0.5 },
    nairobi:      { name: '内罗毕',     country: '肯尼亚',     elev: 1795,vuln: 0.5 },
    london:       { name: '伦敦',       country: '英国',       elev: 11,  vuln: 1.5 },
    paris:        { name: '巴黎',       country: '法国',       elev: 35,  vuln: 1.0 },
    berlin:       { name: '柏林',       country: '德国',       elev: 34,  vuln: 1.0 },
    madrid:       { name: '马德里',     country: '西班牙',     elev: 667, vuln: 0.5 },
    rome:         { name: '罗马',       country: '意大利',     elev: 21,  vuln: 1.5 },
    milan:        { name: '米兰',       country: '意大利',     elev: 122, vuln: 1.0 },
    amsterdam:    { name: '阿姆斯特丹', country: '荷兰',       elev: 0,   vuln: 2.0 },
    venice:       { name: '威尼斯',     country: '意大利',     elev: 1,   vuln: 5.0 },
    moscow:       { name: '莫斯科',     country: '俄罗斯',     elev: 156, vuln: 0.5 },
    istanbul:     { name: '伊斯坦布尔', country: '土耳其',     elev: 39,  vuln: 1.5 },
    newyork:      { name: '纽约',       country: '美国',       elev: 10,  vuln: 2.0 },
    los_angeles:  { name: '洛杉矶',     country: '美国',       elev: 71,  vuln: 1.0 },
    chicago:      { name: '芝加哥',     country: '美国',       elev: 179, vuln: 0.8 },
    houston:      { name: '休斯顿',     country: '美国',       elev: 15,  vuln: 2.5 },
    miami:        { name: '迈阿密',     country: '美国',       elev: 2,   vuln: 2.5 },
    san_francisco:{ name: '旧金山',     country: '美国',       elev: 16,  vuln: 1.5 },
    washington:   { name: '华盛顿',     country: '美国',       elev: 7,   vuln: 2.0 },
    boston:       { name: '波士顿',     country: '美国',       elev: 5,   vuln: 2.0 },
    toronto:      { name: '多伦多',     country: '加拿大',     elev: 76,  vuln: 0.8 },
    vancouver:    { name: '温哥华',     country: '加拿大',     elev: 70,  vuln: 1.0 },
    mexico_city:  { name: '墨西哥城',   country: '墨西哥',     elev: 2240,vuln: 0.3 },
    sao_paulo:    { name: '圣保罗',     country: '巴西',       elev: 760, vuln: 0.5 },
    rio_de_janeiro:{ name: '里约热内卢',country: '巴西',       elev: 11,  vuln: 2.0 },
    buenos_aires: { name: '布宜诺斯艾利斯', country: '阿根廷', elev: 25,  vuln: 1.5 },
    lima:         { name: '利马',       country: '秘鲁',       elev: 154, vuln: 1.0 },
    bogota:       { name: '波哥大',     country: '哥伦比亚',   elev: 2640,vuln: 0.3 },
    santiago:     { name: '圣地亚哥',   country: '智利',       elev: 570, vuln: 0.5 },
    sydney:       { name: '悉尼',       country: '澳大利亚',   elev: 3,   vuln: 2.0 },
    melbourne:    { name: '墨尔本',     country: '澳大利亚',   elev: 31,  vuln: 1.2 }
  };

  // Interpolate value for a given year
  function interpolate(data, year) {
    const keys = Object.keys(data).map(Number).sort((a, b) => a - b);
    if (year <= keys[0]) return data[keys[0]];
    if (year >= keys[keys.length - 1]) return data[keys[keys.length - 1]];
    for (let i = 0; i < keys.length - 1; i++) {
      if (year >= keys[i] && year <= keys[i + 1]) {
        const t = (year - keys[i]) / (keys[i + 1] - keys[i]);
        return data[keys[i]] + t * (data[keys[i + 1]] - data[keys[i]]);
      }
    }
    return data[keys[keys.length - 1]];
  }

  // Convert hex color (#RRGGBB) to rgba string with given alpha
  function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '').trim();
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  }

  // Normalize any CSS color string to rgba with given alpha
  function toRgba(color, alpha) {
    color = color.trim();
    if (color.startsWith('#')) return hexToRgba(color, alpha);
    if (color.startsWith('rgb(')) return color.replace('rgb(', 'rgba(').replace(')', ', ' + alpha + ')');
    if (color.startsWith('rgba(')) {
      // Replace existing alpha
      return color.replace(/rgba\(([^)]+)\)/, function(m, vals) {
        var parts = vals.split(',').map(function(s) { return s.trim(); });
        return 'rgba(' + parts[0] + ', ' + parts[1] + ', ' + parts[2] + ', ' + alpha + ')';
      });
    }
    return color;
  }

  // State
  let currentHeightM = 0;

  // DOM elements
  const heightSlider = document.getElementById('heightSlider');
  const heightDisplay = document.getElementById('heightDisplay');
  const panelSLR = document.getElementById('panelSLR');
  const panelElev = document.getElementById('panelElev');
  const metricSLR = document.getElementById('metricSLR');
  const metricTemp = document.getElementById('metricTempVal');
  const metricPop = document.getElementById('metricPopVal');
  const metricIce = document.getElementById('metricIceVal');
  const metricsSubtitle = document.getElementById('metricsSubtitle');
  const citySubtitle = document.getElementById('citySubtitle');

  // ===== LEAFLET MAP INIT =====
  // On mobile (narrow viewport), default to a zoomed-in view of China
  const isNarrowView = window.innerWidth <= 768;
  const leafletMap = L.map('leafletMap', {
    center: isNarrowView ? [35, 105] : [20, 20],
    zoom: isNarrowView ? 4 : 2,
    minZoom: 2,
    maxZoom: 8,
    zoomControl: true,
    attributionControl: true,
    worldCopyJump: true
  });

  // Tianditu basemap layers
  const tiandituKey = 'e92d8558a9a7eb0709e7f895801bdcc9';
  const tdSubs = ['0','1','2','3','4','5','6','7'];
  const tdBase = 'https://t{s}.tianditu.gov.cn/';

  const baseLayers = {
    terrain: L.tileLayer(
      tdBase + 'ter_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ter&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=' + tiandituKey,
      { subdomains: tdSubs, maxZoom: 18,
        attribution: '&copy; <a href="https://www.tianditu.gov.cn" target="_blank">天地图</a>' }
    ),
    vector: L.tileLayer(
      tdBase + 'vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=' + tiandituKey,
      { subdomains: tdSubs, maxZoom: 18 }
    ),
    satellite: L.tileLayer(
      tdBase + 'img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=' + tiandituKey,
      { subdomains: tdSubs, maxZoom: 18 }
    )
  };

  // Separate pane for the Chinese annotation layer so the basemap darkening
  // filter (applied to the tile pane) does not dim the labels.
  leafletMap.createPane('annotationPane');
  leafletMap.getPane('annotationPane').style.zIndex = 350;

  // Chinese annotation layer (always visible on top)
  const annotationLayer = L.tileLayer(
    tdBase + 'cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}&tk=' + tiandituKey,
    { subdomains: tdSubs, maxZoom: 18, pane: 'annotationPane' }
  );

  // Default basemap: satellite imagery
  let currentBasemap = 'satellite';
  baseLayers.satellite.addTo(leafletMap);
  annotationLayer.addTo(leafletMap);

  // Basemap switching
  function switchBasemap(type) {
    if (type === currentBasemap) return;
    leafletMap.removeLayer(baseLayers[currentBasemap]);
    baseLayers[type].addTo(leafletMap);
    annotationLayer.bringToFront();
    currentBasemap = type;
    document.querySelectorAll('.basemap-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.dataset.basemap === type);
      btn.setAttribute('aria-pressed', btn.dataset.basemap === type ? 'true' : 'false');
    });
  }

  document.querySelectorAll('.basemap-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      switchBasemap(this.dataset.basemap);
    });
  });

  // Set satellite as active by default
  document.querySelector('.basemap-btn[data-basemap="satellite"]').classList.add('active');
  document.querySelector('.basemap-btn[data-basemap="satellite"]').setAttribute('aria-pressed', 'true');

  // City markers with real coordinates
  const cityMarkers = {
    shanghai:     { lat: 31.23, lng: 121.47 },
    guangzhou:    { lat: 23.13, lng: 113.26 },
    tianjin:      { lat: 39.14, lng: 117.18 },
    beijing:      { lat: 39.90, lng: 116.41 },
    shenzhen:     { lat: 22.54, lng: 114.06 },
    chengdu:      { lat: 30.57, lng: 104.07 },
    hangzhou:     { lat: 30.27, lng: 120.15 },
    wuhan:        { lat: 30.59, lng: 114.31 },
    nanjing:      { lat: 32.06, lng: 118.78 },
    xian:         { lat: 34.34, lng: 108.94 },
    mumbai:       { lat: 19.08, lng: 72.88 },
    delhi:        { lat: 28.61, lng: 77.23 },
    dhaka:        { lat: 23.81, lng: 90.41 },
    karachi:      { lat: 24.86, lng: 67.01 },
    kolkata:      { lat: 22.57, lng: 88.36 },
    chennai:      { lat: 13.08, lng: 80.27 },
    bangkok:      { lat: 13.76, lng: 100.50 },
    jakarta:      { lat: -6.21, lng: 106.85 },
    singapore:    { lat: 1.35, lng: 103.82 },
    manila:       { lat: 14.59, lng: 120.98 },
    ho_chi_minh:  { lat: 10.82, lng: 106.63 },
    tokyo:        { lat: 35.68, lng: 139.69 },
    osaka:        { lat: 34.69, lng: 135.50 },
    seoul:        { lat: 37.57, lng: 126.98 },
    busan:        { lat: 35.18, lng: 129.08 },
    cairo:        { lat: 30.04, lng: 31.24 },
    lagos:        { lat: 6.52, lng: 3.38 },
    kinshasa:     { lat: -4.44, lng: 15.27 },
    johannesburg: { lat: -26.20, lng: 28.05 },
    nairobi:      { lat: -1.29, lng: 36.82 },
    london:       { lat: 51.51, lng: -0.13 },
    paris:        { lat: 48.86, lng: 2.35 },
    berlin:       { lat: 52.52, lng: 13.41 },
    madrid:       { lat: 40.42, lng: -3.70 },
    rome:         { lat: 41.90, lng: 12.50 },
    milan:        { lat: 45.46, lng: 9.19 },
    amsterdam:    { lat: 52.37, lng: 4.90 },
    venice:       { lat: 45.44, lng: 12.32 },
    moscow:       { lat: 55.76, lng: 37.62 },
    istanbul:     { lat: 41.01, lng: 28.98 },
    newyork:      { lat: 40.71, lng: -74.01 },
    los_angeles:  { lat: 34.05, lng: -118.24 },
    chicago:      { lat: 41.88, lng: -87.63 },
    houston:      { lat: 29.76, lng: -95.37 },
    miami:        { lat: 25.76, lng: -80.19 },
    san_francisco:{ lat: 37.77, lng: -122.42 },
    washington:   { lat: 38.91, lng: -77.04 },
    boston:       { lat: 42.36, lng: -71.06 },
    toronto:      { lat: 43.65, lng: -79.38 },
    vancouver:    { lat: 49.28, lng: -123.12 },
    mexico_city:  { lat: 19.43, lng: -99.13 },
    sao_paulo:    { lat: -23.55, lng: -46.63 },
    rio_de_janeiro:{ lat: -22.91, lng: -43.17 },
    buenos_aires: { lat: -34.60, lng: -58.38 },
    lima:         { lat: -12.05, lng: -77.04 },
    bogota:       { lat: 4.71, lng: -74.07 },
    santiago:     { lat: -33.45, lng: -70.67 },
    sydney:       { lat: -33.87, lng: 151.21 },
    melbourne:    { lat: -37.81, lng: 144.96 }
  };

  // Dynamic risk-colored marker factory
  function getMarkerColor(heightM, elev) {
    const css = getComputedStyle(document.documentElement);
    if (heightM >= elev) return css.getPropertyValue('--seed-danger').trim();
    if (heightM >= elev * 0.5) return css.getPropertyValue('--seed-accent').trim();
    return css.getPropertyValue('--seed-success').trim();
  }

  function createRiskIcon(color, size) {
    const s = size || 12;
    return L.divIcon({
      className: 'city-marker-icon',
      html: '<div style="width:' + s + 'px;height:' + s + 'px;background:' + color + ';border-radius:50%;border:2px solid rgba(255,255,255,0.3);box-shadow:0 0 ' + (s > 16 ? '14px' : '8px') + ' ' + color + '80;transition:all 200ms ease;"></div>',
      iconSize: [s, s],
      iconAnchor: [Math.round(s / 2), Math.round(s / 2)]
    });
  }

  // Store marker references for dynamic updates
  const mapMarkers = {};

  Object.entries(cityMarkers).forEach(([key, coords]) => {
    const city = cityData[key];
    if (!city) return;
    const color = getMarkerColor(0, city.elev);
    const marker = L.marker([coords.lat, coords.lng], { icon: createRiskIcon(color, 12) })
      .bindTooltip('', {
        className: 'leaflet-tooltip-dark',
        direction: 'top',
        offset: [0, -14]
      })
      .addTo(leafletMap);

    // Hover to show full city info with dynamic sizing
    marker.on('mouseover', function() {
      const margin = city.elev - currentHeightM;
      const isFlooded = margin <= 0;
      const depth = Math.abs(margin);

      let markerSize = 12;
      if (isFlooded) markerSize = 12 + Math.min(depth * 2, 20);
      else if (margin < city.elev * 0.3) markerSize = 16;

      const color = getMarkerColor(currentHeightM, city.elev);
      marker.setIcon(createRiskIcon(color, markerSize));

      const statusClass = isFlooded ? 'status-flooded' : 'status-safe';
      const statusPrefix = isFlooded ? '\u25BC' : '\u25B2';
      const statusText = isFlooded ? '已淹没 ' + depth + ' m' : '高出 ' + margin + ' m';

      const tooltipContent = '<div style="min-width:140px;padding:4px;">' +
        '<strong style="font-size:14px;">' + city.name + '</strong><br/>' +
        '<span style="color:var(--fg-muted);">' + city.country + ' · 海拔 ' + city.elev + 'm</span><br/>' +
        '<hr style="border:none;border-top:1px solid var(--border-subtle);margin:6px 0;"/>' +
        '<div style="font-size:12px;line-height:1.5;">' +
        '当前海平面上升：<strong>' + currentHeightM + ' m</strong><br/>' +
        '状态：<span class="' + statusClass + '" style="font-weight:600;">' + statusPrefix + ' ' + statusText + '</span>' +
        '</div></div>';

      marker.setTooltipContent(tooltipContent);
      marker.openTooltip();
    });

    // Reset size on mouseout
    marker.on('mouseout', function() {
      marker.setIcon(createRiskIcon(getMarkerColor(currentHeightM, city.elev), 12));
    });

    mapMarkers[key] = marker;
  });

  // Update marker colors based on current height
  function updateMarkerColors() {
    Object.entries(mapMarkers).forEach(([key, marker]) => {
      const city = cityData[key];
      if (!city) return;
      const color = getMarkerColor(currentHeightM, city.elev);
      marker.setIcon(createRiskIcon(color, 12));
      if (marker.isTooltipOpen()) {
        const margin = city.elev - currentHeightM;
        const isFlooded = margin <= 0;
        const depth = Math.abs(margin);
        let markerSize = 12;
        if (isFlooded) markerSize = 12 + Math.min(depth * 2, 20);
        else if (margin < city.elev * 0.3) markerSize = 16;
        marker.setIcon(createRiskIcon(color, markerSize));

        const statusClass = isFlooded ? 'status-flooded' : 'status-safe';
        const statusPrefix = isFlooded ? '\u25BC' : '\u25B2';
        const statusText = isFlooded ? '已淹没 ' + depth + ' m' : '高出 ' + margin + ' m';

        const tooltipContent = '<div style="min-width:140px;padding:4px;">' +
          '<strong style="font-size:14px;">' + city.name + '</strong><br/>' +
          '<span style="color:var(--fg-muted);">' + city.country + ' · 海拔 ' + city.elev + 'm</span><br/>' +
          '<hr style="border:none;border-top:1px solid var(--border-subtle);margin:6px 0;"/>' +
          '<div style="font-size:12px;line-height:1.5;">' +
          '当前海平面上升：<strong>' + currentHeightM + ' m</strong><br/>' +
          '状态：<span class="' + statusClass + '" style="font-weight:600;">' + statusPrefix + ' ' + statusText + '</span>' +
          '</div></div>';
        marker.setTooltipContent(tooltipContent);
      }
    });
  }

  // ===== DEM-BASED FLOOD SIMULATION =====
  // Elevation decode: height_m = (R * 256 + G + B / 256) - 32768
  let currentSeaLevelMeters = 0;

  const FloodLayer = L.GridLayer.extend({
    createTile: function(coords, done) {
      const tile = document.createElement('canvas');
      tile.width = 256;
      tile.height = 256;
      const ctx = tile.getContext('2d');

      const maxTile = Math.pow(2, coords.z);
      if (coords.x < 0 || coords.x >= maxTile || coords.y < 0 || coords.y >= maxTile) {
        done(null, tile);
        return tile;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = function() {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, 256, 256);

        const imageData = ctx.getImageData(0, 0, 256, 256);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const elevation = (data[i] * 256 + data[i + 1] + data[i + 2] / 256) - 32768;

          if (elevation <= currentSeaLevelMeters) {
            const depth = currentSeaLevelMeters - elevation;
            const baseOpacity = Math.min(0.35 + depth * 0.02, 0.7);
            data[i]     = 56;
            data[i + 1] = 189;
            data[i + 2] = 248;
            data[i + 3] = Math.round(baseOpacity * 255);
          } else {
            data[i + 3] = 0;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        done(null, tile);
      };
      img.onerror = function() {
        done(null, tile);
      };
      img.src = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/' +
        coords.z + '/' + coords.x + '/' + coords.y + '.png';

      return tile;
    }
  });

  // Separate pane for flood overlay
  leafletMap.createPane('floodPane');
  leafletMap.getPane('floodPane').style.zIndex = 450;

  const floodLayer = new FloodLayer({
    tileSize: 256,
    opacity: 0.65,
    maxZoom: 14,
    minZoom: 2,
    updateWhenIdle: true,
    keepBuffer: 2,
    pane: 'floodPane'
  });
  floodLayer.addTo(leafletMap);

  function updateMapOverlay(slrMM) {
    currentSeaLevelMeters = slrMM / 1000;
    floodLayer.redraw();
  }

  const metricCards = {
    slr: document.getElementById('metricSeaLevel'),
    temp: document.getElementById('metricTemp'),
    pop: document.getElementById('metricPop'),
    ice: document.getElementById('metricIce')
  };

  // ===== UPDATE FUNCTION =====
  function updateAll() {
    const heightM = currentHeightM;
    const heightMM = heightM * 1000;

    heightDisplay.innerHTML = heightM + '<span style="font-size:20px;color:var(--fg-muted);margin-left:4px;">m</span>';

    panelSLR.innerHTML = heightM + '<span class="panel-stat-unit">m</span>';
    panelElev.innerHTML = '\u2264' + heightM + '<span class="panel-stat-unit">m</span>';

    metricSLR.innerHTML = heightM >= 1 ? heightM + '<span class="metric-unit">m</span>' : heightMM + '<span class="metric-unit">mm</span>';

    const estTemp = Math.min(heightM * 0.3, 20).toFixed(1);
    metricTemp.innerHTML = estTemp + '<span class="metric-unit">\u00B0C</span>';

    let estPop;
    if (heightM <= 1) estPop = (heightM * 6.8).toFixed(1);
    else if (heightM <= 10) estPop = (6.8 + (heightM - 1) * 1.5).toFixed(1);
    else if (heightM <= 60) estPop = (20 + (heightM - 10) * 0.3).toFixed(1);
    else estPop = (35 + (heightM - 60) * 0.05).toFixed(1);
    metricPop.innerHTML = estPop + '<span class="metric-unit">亿人</span>';

    const estIce = Math.round(270 + heightM * 8);
    metricIce.innerHTML = estIce + '<span class="metric-unit">Gt/年</span>';

    metricsSubtitle.textContent = '海平面上升 ' + heightM + 'm';

    citySubtitle.textContent = '海平面上升 ' + heightM + 'm · 共 ' + Object.keys(cityData).length + ' 个城市受评估';

    document.querySelectorAll('.metric-card').forEach(function(card) {
      if (heightM > 10) {
        card.classList.add('danger-pulse');
      } else {
        card.classList.remove('danger-pulse');
      }
    });

    updateMapOverlay(heightMM);
    updateMarkerColors();
    updateCityCards();

    var gradIndicator = document.getElementById('gradientIndicator');
    if (gradIndicator) {
      var pct = heightM === 0 ? 0 : (Math.log10(heightM + 1) / Math.log10(501)) * 100;
      gradIndicator.style.left = Math.min(pct, 100) + '%';
    }

    document.querySelectorAll('.preset-btn').forEach(function(btn) {
      btn.classList.toggle('active', parseInt(btn.dataset.height) === heightM);
    });

    updateChart();
  }

  // ===== SPARKLINES =====
  function generateSparkData(dataObj) {
    var points = [];
    for (var y = 2024; y <= 2100; y += 4) {
      points.push(interpolate(dataObj, y));
    }
    return points;
  }

  function drawSparkline(containerId, data, color) {
    var container = document.getElementById(containerId);
    if (!container) return;
    var w = 220, h = 32;
    var min = Math.min.apply(null, data);
    var max = Math.max.apply(null, data);
    var range = max - min || 1;

    var points = data.map(function(v, i) {
      var x = (i / (data.length - 1)) * w;
      var y = h - ((v - min) / range) * (h - 4) - 2;
      return x + ',' + y;
    }).join(' ');

    var areaPoints = points + ' ' + w + ',' + h + ' 0,' + h;

    var markerIdx = Math.min(Math.round(data.length - 1), data.length - 1);
    var cx = (markerIdx / (data.length - 1)) * w;
    var cy = h - ((data[markerIdx] - min) / range) * (h - 4) - 2;

    container.innerHTML =
      '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="趋势迷你图">' +
        '<polygon points="' + areaPoints + '" fill="' + color + '" opacity="0.08"/>' +
        '<polyline points="' + points + '" fill="none" stroke="' + color + '" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="' + color + '" opacity="0.9"/>' +
      '</svg>';
  }

  // Track active scenario for sparklines (defaults to 2.6, ignores 'all')
  var activeSparkScenario = '2.6';

  function updateSparklines() {
    var sc = scenarios[activeSparkScenario] || scenarios['2.6'];
    var css = getComputedStyle(document.documentElement);
    drawSparkline('sparkSLR', generateSparkData(sc.slr), css.getPropertyValue('--accent').trim());
    drawSparkline('sparkTemp', generateSparkData(sc.temp), sc.color);
    drawSparkline('sparkPop', generateSparkData(sc.pop), css.getPropertyValue('--warn').trim());
    drawSparkline('sparkIce', generateSparkData(sc.ice), css.getPropertyValue('--fg-secondary').trim());
  }

  // ===== CITY CARDS =====
  var showAllCities = false;
  var CITIES_PER_PAGE = 9;
  var citySearchQuery = '';
  var cityFilterType = 'all';

  function updateCityCards() {
    var grid = document.getElementById('cityGrid');
    var heightM = currentHeightM;
    var moreBtn = document.getElementById('showMoreCities');

    var sortedCities = Object.entries(cityData).map(function(entry) {
      var key = entry[0];
      var city = entry[1];
      var margin = city.elev - heightM;
      return { key: key, city: city, margin: margin };
    }).sort(function(a, b) { return a.margin - b.margin; });

    // Apply search filter
    var filteredCities = sortedCities.filter(function(item) {
      var city = item.city;
      var key = item.key;

      // Search query filter
      if (citySearchQuery) {
        var q = citySearchQuery.toLowerCase();
        var matchName = city.name.toLowerCase().indexOf(q) >= 0;
        var matchCountry = city.country.toLowerCase().indexOf(q) >= 0;
        var matchKey = key.toLowerCase().indexOf(q) >= 0;
        if (!matchName && !matchCountry && !matchKey) return false;
      }

      // Risk level filter
      if (cityFilterType !== 'all') {
        var margin = item.margin;
        var isFlooded = margin <= 0;
        var riskLevel;
        if (isFlooded) riskLevel = 'flooded';
        else if (margin <= city.elev * 0.25) riskLevel = 'high';
        else if (margin <= city.elev * 0.5) riskLevel = 'medium';
        else riskLevel = 'low';

        if (riskLevel !== cityFilterType) return false;
      }

      return true;
    });

    var totalCities = filteredCities.length;
    var visibleCount = showAllCities ? totalCities : Math.min(CITIES_PER_PAGE, totalCities);
    var hiddenCount = totalCities - visibleCount;

    var html = '';
    filteredCities.forEach(function(item, index) {
      var key = item.key;
      var city = item.city;
      var margin = item.margin;
      var slrNow = heightM;
      var vuln = city.vuln || 2.0;
      var estPop = (slrNow * vuln * 0.01).toFixed(1);

      var isFlooded = margin <= 0;
      var riskLevel, riskText, barColor;
      if (isFlooded) {
        riskLevel = 'extreme';
        riskText = '已淹没';
        barColor = 'var(--danger)';
      } else if (margin <= city.elev * 0.25) {
        riskLevel = 'high';
        riskText = '高风险';
        barColor = 'var(--danger)';
      } else if (margin <= city.elev * 0.5) {
        riskLevel = 'medium';
        riskText = '中风险';
        barColor = 'var(--warn)';
      } else {
        riskLevel = 'low';
        riskText = '安全';
        barColor = 'var(--success)';
      }
      var barWidth = isFlooded ? 100 : Math.max(0, Math.min(((city.elev - slrNow) / city.elev) * 100, 100));

      var marginHtml = isFlooded
        ? '<span style="color:var(--danger);font-weight:600;">已淹没 ' + Math.abs(margin) + ' m</span>'
        : '<span style="color:var(--success);font-weight:600;">高出 ' + margin + ' m</span>';

      var hiddenClass = index >= visibleCount ? ' hidden-city' : '';

      html +=
        '<div class="city-card' + hiddenClass + '" data-component="City Card" data-od-id="city-' + key + '">' +
          '<div class="city-header">' +
            '<div>' +
              '<div class="city-name">' + city.name + '</div>' +
              '<div class="city-country">' + city.country + ' · 海拔 ' + city.elev + 'm</div>' +
            '</div>' +
            '<span class="risk-badge ' + riskLevel + '">' + riskText + '</span>' +
          '</div>' +
          '<div class="city-stats">' +
            '<div class="city-stat-row">' +
              '<span class="city-stat-label">裕度</span>' +
              '<span class="city-stat-val">' + marginHtml + '</span>' +
            '</div>' +
            '<div class="city-stat-row">' +
              '<span class="city-stat-label">预估受影响人口</span>' +
              '<span class="city-stat-val">' + estPop + ' 亿</span>' +
            '</div>' +
            '<div class="city-stat-row">' +
              '<span class="city-stat-label">脆弱性指数</span>' +
              '<span class="city-stat-val">' + (vuln * 20).toFixed(0) + '%</span>' +
            '</div>' +
          '</div>' +
          '<div class="city-bar-container">' +
            '<div class="city-bar" style="width:' + barWidth + '%; background:' + barColor + ';"></div>' +
          '</div>' +
        '</div>';
    });
    if (totalCities === 0) {
      html = '<div class="city-no-results" style="grid-column:1/-1;text-align:center;padding:48px 16px;color:var(--fg-muted);font-size:14px;">未找到匹配的城市，请尝试其他搜索词或筛选条件。</div>';
    }
    grid.innerHTML = html;

    if (moreBtn) {
      if (hiddenCount > 0) {
        moreBtn.textContent = '显示更多城市 (' + hiddenCount + ')';
        moreBtn.parentElement.style.display = 'flex';
      } else {
        if (!showAllCities) {
          moreBtn.parentElement.style.display = 'none';
        } else {
          moreBtn.textContent = '收起城市列表';
          moreBtn.parentElement.style.display = 'flex';
        }
      }
    }
  }

  // Show more button handler
  document.getElementById('showMoreCities').addEventListener('click', function() {
    showAllCities = !showAllCities;
    updateCityCards();
    if (!showAllCities) {
      document.querySelector('[data-component="City Impact"]').scrollIntoView({ behavior: 'smooth' });
    }
  });

  // ===== CHART =====
  var trendChart = null;

  function initChart() {
    var ctx = document.getElementById('trendChart').getContext('2d');
    var css = getComputedStyle(document.documentElement);
    var fgSec = css.getPropertyValue('--fg-secondary').trim();
    var fgMuted = css.getPropertyValue('--fg-muted').trim();
    var fg = css.getPropertyValue('--fg').trim();

    var histYears = [];
    var histData = [];
    for (var y = 1900; y <= 2024; y += 2) {
      histYears.push(y);
      var t = (y - 1900) / 124;
      histData.push(Math.round(t * t * 120 + t * 80 + Math.sin(t * 10) * 3 * (1 - t)));
    }

    var futureYears = [];
    for (var y = 2024; y <= 2100; y += 2) futureYears.push(y);

    function getFutureData(slrObj) {
      return futureYears.map(function(y) { return Math.round(interpolate(slrObj, y) + 200); });
    }

    var datasets = [
      {
        label: '历史观测',
        data: histYears.map(function(y, i) { return { x: y, y: histData[i] }; }),
        borderColor: fgSec,
        backgroundColor: 'rgba(148, 163, 184, 0.05)',
        borderWidth: 2,
        fill: true,
        pointRadius: 0,
        tension: 0.3
      }
    ];

    trendChart = new Chart(ctx, {
      type: 'line',
      data: { datasets: datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600, easing: 'easeInOutCubic' },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: fgSec,
              font: { size: 12, family: "'Inter', system-ui" },
              boxWidth: 12,
              padding: 16,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'rgba(10, 22, 40, 0.95)',
            borderColor: 'rgba(56, 189, 248, 0.2)',
            borderWidth: 1,
            titleColor: fg,
            bodyColor: fgSec,
            titleFont: { family: "'Inter', system-ui", weight: '600' },
            bodyFont: { family: "'Inter', system-ui" },
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(ctx) {
                return ctx.dataset.label + ': ' + ctx.parsed.y + ' mm';
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            min: 1900,
            max: 2100,
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: {
              color: fgMuted,
              font: { size: 11, family: "'Inter', system-ui" },
              stepSize: 20,
              callback: function(v) { return v + '年'; }
            },
            title: { display: false }
          },
          y: {
            min: 0,
            max: 1400,
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: {
              color: fgMuted,
              font: { size: 11, family: "'Inter', system-ui" },
              callback: function(v) { return v + ' mm'; }
            },
            title: { display: false }
          }
        }
      }
    });

    updateChart();
  }

  function updateChart() {
    if (!trendChart) return;

    var futureYears = [];
    for (var y = 2024; y <= 2100; y += 2) futureYears.push(y);

    function getFutureData(slrObj) {
      return futureYears.map(function(y) { return Math.round(interpolate(slrObj, y) + 200); });
    }

    var activeTab = document.querySelector('.chart-tab.active');
    var activeRCP = activeTab ? activeTab.dataset.rcp : '2.6';

    var datasets = [trendChart.data.datasets[0]];

    if (activeRCP === 'all') {
      Object.entries(scenarios).forEach(function(entry) {
        var key = entry[0];
        var sc = entry[1];
        var data = getFutureData(sc.slr);
        datasets.push({
          label: sc.label + ' (' + sc.desc + ')',
          data: futureYears.map(function(y, i) { return { x: y, y: data[i] }; }),
          borderColor: sc.color,
          backgroundColor: toRgba(sc.color, 0.08),
          borderWidth: 2,
          borderDash: key === '8.5' ? [6, 3] : key === '4.5' ? [3, 3] : [],
          fill: false,
          pointRadius: 0,
          tension: 0.3
        });
      });
    } else {
      var sc = scenarios[activeRCP];
      var data = getFutureData(sc.slr);
      datasets.push({
        label: sc.label + ' 预测',
        data: futureYears.map(function(y, i) { return { x: y, y: data[i] }; }),
        borderColor: sc.color,
        backgroundColor: toRgba(sc.color, 0.1),
        borderWidth: 2.5,
        fill: true,
        pointRadius: 0,
        tension: 0.3
      });
    }

    trendChart.data.datasets = datasets;
    trendChart.update('none');
  }

  // ===== EVENT LISTENERS =====

  heightSlider.addEventListener('input', function() {
    currentHeightM = parseInt(this.value);
    updateAll();
  });

  document.querySelectorAll('.preset-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetHeight = parseInt(this.dataset.height);
      heightSlider.value = targetHeight;
      currentHeightM = targetHeight;
      updateAll();
    });
  });

  document.querySelectorAll('.chart-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.chart-tab').forEach(function(t) { t.classList.remove('active'); });
      this.classList.add('active');
      var rcp = this.dataset.rcp;
      if (rcp !== 'all') {
        activeSparkScenario = rcp;
        updateSparklines();
      }
      updateChart();
    });
  });

  document.querySelectorAll('.topbar-nav a').forEach(function(link) {
    link.addEventListener('click', function() {
      document.querySelectorAll('.topbar-nav a').forEach(function(l) { l.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.fade-in').forEach(function(el) { observer.observe(el); });

  // ===== MOBILE NAV TOGGLE =====
  var navToggle = document.getElementById('navToggle');
  var topbarNav = document.getElementById('topbarNav');

  if (navToggle && topbarNav) {
    navToggle.addEventListener('click', function() {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      topbarNav.classList.toggle('open');
    });

    // Close nav when a link is clicked
    topbarNav.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        navToggle.setAttribute('aria-expanded', 'false');
        topbarNav.classList.remove('open');
      });
    });
  }

  // ===== MAP LOADING INDICATOR =====
  var mapLoadingEl = document.getElementById('mapLoading');
  var loadingHideTimer = null;

  if (mapLoadingEl) {
    // Hide after initial basemap load
    leafletMap.whenReady(function() {
      setTimeout(function() {
        mapLoadingEl.classList.add('hidden');
      }, 2000);
    });

    // Show/hide during flood layer redraw
    floodLayer.on('loading', function() {
      mapLoadingEl.classList.remove('hidden');
    });
    floodLayer.on('load', function() {
      if (loadingHideTimer) clearTimeout(loadingHideTimer);
      loadingHideTimer = setTimeout(function() {
        mapLoadingEl.classList.add('hidden');
      }, 400);
    });
  }

  // ===== AUTOPLAY ANIMATION =====
  var autoplayBtn = document.getElementById('autoplayBtn');
  var autoplayActive = false;
  var autoplayTimer = null;
  var autoplayPlayIcon = document.querySelector('.autoplay-icon-play');
  var autoplayPauseIcon = document.querySelector('.autoplay-icon-pause');
  var autoplayText = document.querySelector('.autoplay-text');

  function toggleAutoplay() {
    if (autoplayActive) {
      // Stop
      autoplayActive = false;
      clearInterval(autoplayTimer);
      autoplayTimer = null;
      if (autoplayBtn) autoplayBtn.classList.remove('playing');
      if (autoplayPlayIcon) autoplayPlayIcon.style.display = '';
      if (autoplayPauseIcon) autoplayPauseIcon.style.display = 'none';
      if (autoplayText) autoplayText.textContent = '自动播放模拟';
    } else {
      // Start
      autoplayActive = true;
      if (autoplayBtn) autoplayBtn.classList.add('playing');
      if (autoplayPlayIcon) autoplayPlayIcon.style.display = 'none';
      if (autoplayPauseIcon) autoplayPauseIcon.style.display = '';
      if (autoplayText) autoplayText.textContent = '暂停播放';

      // Reset to 0 if at max
      if (currentHeightM >= 500) {
        currentHeightM = 0;
        heightSlider.value = 0;
        updateAll();
      }

      autoplayTimer = setInterval(function() {
        if (currentHeightM < 500) {
          // Smart increment: smaller steps at low values, larger at high
          var increment = currentHeightM < 10 ? 1 : currentHeightM < 50 ? 2 : currentHeightM < 100 ? 5 : 10;
          currentHeightM = Math.min(currentHeightM + increment, 500);
          heightSlider.value = currentHeightM;
          updateAll();
        } else {
          // Stop at max
          toggleAutoplay();
        }
      }, 450);
    }
  }

  if (autoplayBtn) {
    autoplayBtn.addEventListener('click', toggleAutoplay);
  }

  // ===== SHARE FUNCTIONALITY =====
  var shareFeedback = document.getElementById('shareFeedback');

  function showShareFeedback(msg) {
    if (!shareFeedback) return;
    shareFeedback.textContent = msg;
    shareFeedback.classList.add('show');
    setTimeout(function() {
      shareFeedback.classList.remove('show');
    }, 2000);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        showShareFeedback('链接已复制！');
      }).catch(function() {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showShareFeedback('链接已复制！');
    } catch (e) {
      showShareFeedback('复制失败，请手动复制');
    }
    document.body.removeChild(textarea);
  }

  function getShareUrl() {
    var baseUrl = window.location.origin + window.location.pathname;
    return baseUrl + '?slr=' + currentHeightM;
  }

  function getShareText() {
    return '海平面模拟实验室：当海平面上升 ' + currentHeightM + ' 米时，看看地球会变成什么样！';
  }

  document.querySelectorAll('.share-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var type = this.dataset.share;
      var url = getShareUrl();
      var text = getShareText();

      switch (type) {
        case 'wechat':
          copyToClipboard(url);
          showShareFeedback('链接已复制，请粘贴到微信中分享');
          break;
        case 'weibo':
          window.open('https://service.weibo.com/share/share.php?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(text), '_blank', 'width=600,height=500');
          break;
        case 'twitter':
          window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url), '_blank', 'width=600,height=500');
          break;
        case 'link':
          copyToClipboard(url);
          break;
      }
    });
  });

  // ===== CITY SEARCH & FILTER =====
  var citySearchInput = document.getElementById('citySearch');

  if (citySearchInput) {
    var searchDebounceTimer = null;
    citySearchInput.addEventListener('input', function() {
      var val = this.value;
      if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
      searchDebounceTimer = setTimeout(function() {
        citySearchQuery = val.trim();
        showAllCities = false;
        updateCityCards();
      }, 200);
    });
  }

  document.querySelectorAll('.city-filter-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.city-filter-btn').forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');
      cityFilterType = this.dataset.filter;
      showAllCities = false;
      updateCityCards();
    });
  });

  // ===== BACK TO TOP =====
  var backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== MODAL DIALOGS =====
  document.querySelectorAll('.modal-trigger').forEach(function(trigger) {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      var modalId = this.dataset.modal;
      var modal = document.getElementById(modalId);
      if (modal) modal.classList.add('active');
    });
  });

  document.querySelectorAll('.modal-close').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var modalId = this.dataset.modal;
      var modal = document.getElementById(modalId);
      if (modal) modal.classList.remove('active');
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === this) {
        this.classList.remove('active');
      }
    });
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(function(modal) {
        modal.classList.remove('active');
      });
    }
  });

  // ===== URL PARAM: load shared state =====
  (function loadSharedState() {
    var params = new URLSearchParams(window.location.search);
    var slr = params.get('slr');
    if (slr !== null) {
      var h = Math.max(0, Math.min(500, parseInt(slr) || 0));
      currentHeightM = h;
      heightSlider.value = h;
    }
  })();

  // ===== INIT =====
  initChart();
  updateSparklines();
  updateAll();
  setTimeout(function() { leafletMap.invalidateSize(); }, 100);
  window.addEventListener('resize', function() { leafletMap.invalidateSize(); });

  // ===== CHANGELOG MODULE =====
  var changelogData = [
    {
      version: 'v2.5.0',
      date: '2026-08-01',
      tag: 'feature',
      tagLabel: '新功能',
      title: '网站全面优化与数据修复',
      items: [
        { type: 'new', text: '新增<strong>延伸阅读</strong>板块，精选 6 篇科普文章卡片，支持响应式 3 列网格布局' },
        { type: 'new', text: '四项关键指标（上升幅度 / 均温升幅 / 受影响人口 / 冰盖融化速率）新增<strong>概念解释</strong>，蓝色边框样式统一展示' },
        { type: 'new', text: '接入<strong>Google Analytics</strong>（G-Z04MECQKPK），异步加载不影响页面性能' },
        { type: 'new', text: '新增<strong>移动端汉堡菜单</strong>，小屏幕下自动折叠导航栏' },
        { type: 'new', text: '新增<strong>返回顶部</strong>按钮，长页面滚动后一键回到顶部' },
        { type: 'new', text: '新增<strong>法律声明弹窗</strong>，点击底部链接以模态框形式展示隐私政策' },
        { type: 'improve', text: '趋势图默认展示「全部对比」，替代原先默认的 RCP 2.6 单一情景' },
        { type: 'improve', text: '趋势图 Y 轴固定为 0–1400mm 范围，避免切换标签时坐标轴跳变' },
        { type: 'fix', text: '修复历史观测线与 RCP 预测线在 2024 年衔接处不重合问题（正弦扰动项归零）' },
        { type: 'fix', text: '修复 tooltip 因 mode: \'index\' 导致历史与预测数据年份错位 124 年的问题' },
        { type: 'fix', text: '修复城市副标题未随海平面参数更新、风险等级分类异常、Sparkline 迷你图未同步等 4 项缺陷' }
      ]
    },
    {
      version: 'v2.4.0',
      date: '2026-08-01',
      tag: 'feature',
      tagLabel: '新功能',
      title: '新增更新日志模块',
      items: [
        { type: 'new', text: '新增<strong>更新日志</strong>模块，以时间线形式展示版本迭代记录' },
        { type: 'new', text: '支持按版本号筛选日志条目，快速定位特定版本更新内容' },
        { type: 'new', text: '日志条目支持分类标签（新功能 / 改进 / 修复 / 重大更新），直观展示变更类型' },
        { type: 'improve', text: '导航栏新增「日志」入口，便于用户查看项目迭代历史' }
      ]
    },
    {
      version: 'v2.3.0',
      date: '2026-07-20',
      tag: 'feature',
      tagLabel: '新功能',
      title: '城市搜索与筛选系统',
      items: [
        { type: 'new', text: '新增<strong>城市搜索</strong>功能，支持按城市名称或国家快速检索' },
        { type: 'new', text: '新增风险等级筛选按钮（已淹没 / 高风险 / 中风险 / 安全）' },
        { type: 'improve', text: '城市卡片默认显示 9 个，支持点击「显示更多」展开完整列表' },
        { type: 'improve', text: '优化城市卡片排序逻辑，按淹没裕度从小到大排列' }
      ]
    },
    {
      version: 'v2.2.0',
      date: '2026-07-05',
      tag: 'feature',
      tagLabel: '新功能',
      title: '分享功能与社交传播',
      items: [
        { type: 'new', text: '新增<strong>分享栏</strong>，支持分享到微信、微博、Twitter 及复制链接' },
        { type: 'new', text: '分享链接包含当前海平面上升参数，接收方打开即可看到相同模拟状态' },
        { type: 'improve', text: 'URL 参数解析支持自动加载分享状态（?slr=参数）' }
      ]
    },
    {
      version: 'v2.1.0',
      date: '2026-06-15',
      tag: 'improvement',
      tagLabel: '改进',
      title: '地图底图切换与自动播放',
      items: [
        { type: 'new', text: '新增<strong>底图切换</strong>功能，支持地形晕渲、矢量底图、卫星影像三种模式' },
        { type: 'new', text: '新增<strong>自动播放</strong>按钮，可自动模拟海平面从 0m 到 500m 的上升过程' },
        { type: 'improve', text: '自动播放采用智能步进策略，低海拔区精细步进、高海拔区快速推进' },
        { type: 'fix', text: '修复底图切换时标注图层未正确置顶的问题' }
      ]
    },
    {
      version: 'v2.0.0',
      date: '2026-05-28',
      tag: 'major',
      tagLabel: '重大更新',
      title: 'DEM 地形数据驱动洪水模拟',
      items: [
        { type: 'new', text: '基于<strong>AWS Terrarium DEM 高程瓦片</strong>实现真实地形洪水淹没模拟' },
        { type: 'new', text: '高程解码算法：height = (R*256 + G + B/256) - 32768，逐像素渲染淹没区域' },
        { type: 'new', text: '淹没区域根据水深动态调整透明度，深度越大颜色越浓' },
        { type: 'improve', text: '地图引擎从 SVG 切换至 Leaflet，支持缩放、拖拽等丰富交互' },
        { type: 'improve', text: '城市标记点根据风险等级动态变色（安全 / 警告 / 危险）' }
      ]
    },
    {
      version: 'v1.0.0',
      date: '2026-04-10',
      tag: 'major',
      tagLabel: '初始版本',
      title: '海平面模拟实验室首次发布',
      items: [
        { type: 'new', text: '交互式海平面上升模拟器，支持 0-500m 滑块调节' },
        { type: 'new', text: '9 档快速预设（0m / 1m / 5m / 10m / 25m / 50m / 100m / 200m / 500m）' },
        { type: 'new', text: '4 项关键指标实时计算：上升幅度、均温升幅、受影响人口、冰盖融化速率' },
        { type: 'new', text: '历史与预测趋势图（1900-2100），支持 RCP 2.6 / 4.5 / 8.5 三种情景对比' },
        { type: 'new', text: '60 个全球主要城市影响评估，含海拔、脆弱性指数与淹没裕度' },
        { type: 'new', text: '科普知识板块，涵盖海平面上升成因、情景含义与行动方向' }
      ]
    }
  ];

  var changelogTimeline = document.getElementById('changelogTimeline');
  var changelogSidebar = document.getElementById('changelogSidebar');
  var changelogVersionFilter = 'all';

  function renderChangelogSidebar() {
    if (!changelogSidebar) return;
    var versions = [{ version: 'all', label: '全部版本' }];
    changelogData.forEach(function(entry) {
      versions.push({ version: entry.version, label: entry.version });
    });

    var html = '';
    versions.forEach(function(v) {
      var isActive = v.version === changelogVersionFilter ? ' active' : '';
      html += '<button class="changelog-filter-btn' + isActive + '" data-version="' + v.version + '">' + v.label + '</button>';
    });
    changelogSidebar.innerHTML = html;

    changelogSidebar.querySelectorAll('.changelog-filter-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        changelogVersionFilter = this.dataset.version;
        changelogSidebar.querySelectorAll('.changelog-filter-btn').forEach(function(b) {
          b.classList.toggle('active', b.dataset.version === changelogVersionFilter);
        });
        renderChangelogTimeline();
      });
    });
  }

  function renderChangelogTimeline() {
    if (!changelogTimeline) return;
    var html = '';
    changelogData.forEach(function(entry) {
      var isHidden = changelogVersionFilter !== 'all' && entry.version !== changelogVersionFilter;
      if (isHidden) return;

      var itemsHtml = '';
      entry.items.forEach(function(item) {
        itemsHtml += '<li class="type-' + item.type + '">' + item.text + '</li>';
      });

      html +=
        '<div class="changelog-entry">' +
          '<div class="changelog-entry-header">' +
            '<span class="changelog-version">' + entry.version + '</span>' +
            '<span class="changelog-date">' + entry.date + '</span>' +
            '<span class="changelog-tag ' + entry.tag + '">' + entry.tagLabel + '</span>' +
          '</div>' +
          '<div class="changelog-entry-body">' +
            '<div class="changelog-entry-title">' + entry.title + '</div>' +
            '<ul class="changelog-list">' + itemsHtml + '</ul>' +
          '</div>' +
        '</div>';
    });

    if (html === '') {
      html = '<div style="text-align:center;padding:48px 16px;color:var(--fg-muted);font-size:14px;">该版本暂无日志记录。</div>';
    }

    changelogTimeline.innerHTML = html;
  }

  renderChangelogSidebar();
  renderChangelogTimeline();

  // ===== BLOG ARTICLES MODULE =====
  var articlesData = [
    {
      title: '如果海水涨10米，济南会变成海边城市吗？',
      tag: '山东·济南',
      date: '2026-07-22',
      excerpt: '站在黄河边往北看，今天是大棚与油田；海平面涨20米后，你看到的是漫到泰山脚下的海——内陆省会一夜变沿海。',
      url: 'https://blog.planetgis.cn/archives/c8c20415.html'
    },
    {
      title: '海平面下降20米会怎样？山东直接连上东北？',
      tag: '海平面下降',
      date: '2026-04-20',
      excerpt: '海平面下降20米，渤海变平原，山东半岛与辽东半岛连成一片，海岸线大幅外推数百公里。',
      url: 'https://blog.planetgis.cn/archives/b22aa644.html'
    },
    {
      title: '换个角度看福州：洪水模拟里的城市地貌',
      tag: '福建·福州',
      date: '2026-03-26',
      excerpt: '用洪水模拟换个角度看福州，盆地与丘陵交错的城市地貌在水位升降间逐渐浮现轮廓。',
      url: 'https://blog.planetgis.cn/archives/88ff86dd.html'
    },
    {
      title: '模拟海平面上升50米：江苏还剩什么？',
      tag: '江苏',
      date: '2026-03-23',
      excerpt: '江苏全省超一半面积海拔低于10米，海平面上升50米后几乎全域没入水下——还剩什么？',
      url: 'https://blog.planetgis.cn/archives/50dc43b6.html'
    },
    {
      title: '海平面上升50米模拟：湖北会变成什么样？武汉真会沉入水下？',
      tag: '湖北·武汉',
      date: '2026-03-23',
      excerpt: '武汉号称"百湖之市"，长江穿城而过，海平面上升50米时这座中部城市会沉入水下吗？',
      url: 'https://blog.planetgis.cn/archives/909a90d5.html'
    },
    {
      title: '冰河时期海平面模拟：冰岛的面积究竟能膨胀到多大？',
      tag: '冰岛·下降',
      date: '2026-03-21',
      excerpt: '冰河时期海平面大幅下降，冰岛周围大陆架露出水面，国土面积能膨胀到原来的几倍？',
      url: 'https://blog.planetgis.cn/archives/c639e7c2.html'
    }
  ];

  function renderArticles() {
    var grid = document.getElementById('articlesGrid');
    if (!grid) return;
    var html = '';
    articlesData.forEach(function(article) {
      html +=
        '<a href="' + article.url + '" target="_blank" rel="noopener" class="article-card">' +
          '<div class="article-card-meta">' +
            '<span class="article-card-tag">' + article.tag + '</span>' +
            '<span class="article-card-date">' + article.date + '</span>' +
          '</div>' +
          '<div class="article-card-title">' + article.title + '</div>' +
          '<div class="article-card-excerpt">' + article.excerpt + '</div>' +
          '<span class="article-card-link">阅读全文' +
            '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>' +
          '</span>' +
        '</a>';
    });
    grid.innerHTML = html;
  }

  renderArticles();

})();

/* ===== SCROLL HINT ===== */
(function() {
  var btn = document.getElementById('scrollHint');
  if (!btn) return;
  btn.addEventListener('click', function() {
    var metrics = document.querySelector('[data-component="Metrics Panel"]');
    if (metrics) metrics.scrollIntoView({ behavior: 'smooth' });
  });
})();
