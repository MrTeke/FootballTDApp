export const SPAWN_CONFIGS = {
  '3-points': [
    { x: 100, y: 85 },
    { x: 240, y: 85 },
    { x: 380, y: 85 },
  ],
  '4-points': [
    { x: 80,  y: 85 },
    { x: 185, y: 85 },
    { x: 295, y: 85 },
    { x: 400, y: 85 },
  ],
  '5-points': [
    { x: 60,  y: 85 },
    { x: 150, y: 85 },
    { x: 240, y: 85 },
    { x: 330, y: 85 },
    { x: 420, y: 85 },
  ],
}

export const LEVELS = {
  1: {
    name: 'Training 1',
    group: 'Beginner',
    startMoney: 150,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['3-points'],
    waves: [
      { id: 1, interval: 1500, enemies: [{ type: 'amateur', count: 5 }] },
      { id: 2, interval: 1300, enemies: [{ type: 'amateur', count: 7 }] },
      { id: 3, interval: 1200, enemies: [{ type: 'amateur', count: 8 }, { type: 'forward', count: 1 }] },
    ]
  },
  2: {
    name: 'Training 2',
    group: 'Beginner',
    startMoney: 150,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['3-points'],
    waves: [
      { id: 1, interval: 1400, enemies: [{ type: 'amateur', count: 6 }] },
      { id: 2, interval: 1200, enemies: [{ type: 'amateur', count: 5 }, { type: 'forward', count: 3 }] },
      { id: 3, interval: 1100, enemies: [{ type: 'forward', count: 8 }] },
    ]
  },
  3: {
    name: 'Training 3',
    group: 'Beginner',
    startMoney: 150,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['4-points'],
    waves: [
      { id: 1, interval: 1200, enemies: [{ type: 'amateur', count: 8 }] },
      { id: 2, interval: 1100, enemies: [{ type: 'forward', count: 5 }, { type: 'amateur', count: 3 }] },
      { id: 3, interval: 1000, enemies: [{ type: 'forward', count: 8 }] },
      { id: 4, interval: 1000, enemies: [{ type: 'forward', count: 6 }, { type: 'striker', count: 1 }] },
    ]
  },
  4: {
    name: 'First Match',
    group: 'Beginner',
    startMoney: 150,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['4-points'],
    waves: [
      { id: 1, interval: 1100, enemies: [{ type: 'amateur', count: 8 }, { type: 'forward', count: 2 }] },
      { id: 2, interval: 1000, enemies: [{ type: 'forward', count: 6 }, { type: 'amateur', count: 2 }] },
      { id: 3, interval: 900,  enemies: [{ type: 'forward', count: 8 }] },
      { id: 4, interval: 1000, enemies: [{ type: 'forward', count: 4 }, { type: 'striker', count: 2 }] },
    ]
  },
  5: {
    name: 'Season Start',
    group: 'Amateur League',
    startMoney: 200,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['4-points'],
    waves: [
      { id: 1, interval: 1000, enemies: [{ type: 'amateur', count: 10 }, { type: 'forward', count: 3 }] },
      { id: 2, interval: 900,  enemies: [{ type: 'forward', count: 8 }] },
      { id: 3, interval: 1000, enemies: [{ type: 'forward', count: 5 }, { type: 'striker', count: 2 }] },
      { id: 4, interval: 800,  enemies: [{ type: 'forward', count: 10 }, { type: 'striker', count: 1 }] },
    ]
  },
  6: {
    name: 'Away Game',
    group: 'Amateur League',
    startMoney: 200,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['5-points'],
    waves: [
      { id: 1, interval: 900, enemies: [{ type: 'forward', count: 8 }, { type: 'amateur', count: 5 }] },
      { id: 2, interval: 850, enemies: [{ type: 'forward', count: 10 }] },
      { id: 3, interval: 900, enemies: [{ type: 'forward', count: 6 }, { type: 'striker', count: 3 }] },
      { id: 4, interval: 750, enemies: [{ type: 'forward', count: 12 }, { type: 'striker', count: 2 }] },
    ]
  },
  7: {
    name: 'Critical Match',
    group: 'Amateur League',
    startMoney: 250,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['5-points'],
    waves: [
      { id: 1, interval: 1200, enemies: [{ type: 'forward', count: 6 }] },
      { id: 2, interval: 1000, enemies: [{ type: 'forward', count: 8 }, { type: 'amateur', count: 4 }] },
      { id: 3, interval: 1200, enemies: [{ type: 'striker', count: 5 }] },
      { id: 4, interval: 850, enemies: [{ type: 'forward', count: 10 }] },
      { id: 5, interval: 750, enemies: [{ type: 'forward', count: 8 }, { type: 'striker', count: 2 }] },
    ]
  },
  8: {
    name: 'Derby',
    group: 'Amateur League',
    startMoney: 250,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['5-points'],
    waves: [
      { id: 1, interval: 1100, enemies: [{ type: 'forward', count: 7 }] },
      { id: 2, interval: 950,  enemies: [{ type: 'forward', count: 9 }, { type: 'striker', count: 2 }] },
      { id: 3, interval: 900,  enemies: [{ type: 'forward', count: 12 }] },
      { id: 4, interval: 1000, enemies: [{ type: 'striker', count: 6 }] },
      { id: 5, interval: 850,  enemies: [{ type: 'forward', count: 10 }, { type: 'striker', count: 3 }] },
    ]
  },
  9: {
    name: 'First Division',
    group: 'Pro League',
    startMoney: 300,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['5-points'],
    waves: [
      { id: 1, interval: 1000, enemies: [{ type: 'forward', count: 8 }, { type: 'amateur', count: 4 }] },
      { id: 2, interval: 900,  enemies: [{ type: 'forward', count: 10 }, { type: 'striker', count: 3 }] },
      { id: 3, interval: 850,  enemies: [{ type: 'forward', count: 14 }] },
      { id: 4, interval: 1150, enemies: [{ type: 'striker', count: 6 }, { type: 'forward', count: 4 }] },
      { id: 5, interval: 800,  enemies: [{ type: 'forward', count: 12 }, { type: 'striker', count: 4 }] },
    ]
  },
  10: {
    name: 'Champions Gate',
    group: 'Pro League',
    startMoney: 300,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['5-points'],
    waves: [
      { id: 1, interval: 950,  enemies: [{ type: 'forward', count: 9 }, { type: 'striker', count: 3 }] },
      { id: 2, interval: 850,  enemies: [{ type: 'forward', count: 12 }, { type: 'striker', count: 4 }] },
      { id: 3, interval: 800,  enemies: [{ type: 'forward', count: 16 }] },
      { id: 4, interval: 950,  enemies: [{ type: 'striker', count: 8 }] },
      { id: 5, interval: 750,  enemies: [{ type: 'forward', count: 14 }, { type: 'striker', count: 5 }] },
    ]
  },
  11: {
    name: 'European Night',
    group: 'Pro League',
    startMoney: 300,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['5-points'],
    speedModifier: 1.1,
    waves: [
      { id: 1, interval: 950,  enemies: [{ type: 'forward', count: 9 }, { type: 'striker', count: 3 }] },
      { id: 2, interval: 850,  enemies: [{ type: 'forward', count: 13 }] },
      { id: 3, interval: 1000, enemies: [{ type: 'striker', count: 8 }] },
      { id: 4, interval: 800,  enemies: [{ type: 'forward', count: 14 }, { type: 'striker', count: 4 }] },
      { id: 5, interval: 850,  enemies: [{ type: 'striker', count: 10 }, { type: 'forward', count: 8 }] },
    ]
  },
  12: {
    name: 'Semi Final',
    group: 'Pro League',
    startMoney: 350,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['5-points'],
    waves: [
      { id: 1, interval: 950,  enemies: [{ type: 'forward', count: 10 }, { type: 'amateur', count: 5 }] },
      { id: 2, interval: 850,  enemies: [{ type: 'forward', count: 12 }, { type: 'striker', count: 5 }] },
      { id: 3, interval: 780,  enemies: [{ type: 'forward', count: 18 }] },
      { id: 4, interval: 900,  enemies: [{ type: 'striker', count: 9 }, { type: 'forward', count: 7 }] },
      { id: 5, interval: 730,  enemies: [{ type: 'forward', count: 15 }, { type: 'striker', count: 6 }] },
    ]
  },
  13: {
    name: 'Elite 1',
    group: 'Elite',
    startMoney: 350,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['5-points'],
    waves: [
      { id: 1, interval: 900,  enemies: [{ type: 'forward', count: 11 }, { type: 'striker', count: 4 }] },
      { id: 2, interval: 820,  enemies: [{ type: 'forward', count: 14 }, { type: 'striker', count: 6 }] },
      { id: 3, interval: 750,  enemies: [{ type: 'forward', count: 20 }] },
      { id: 4, interval: 870,  enemies: [{ type: 'striker', count: 10 }, { type: 'forward', count: 8 }] },
      { id: 5, interval: 700,  enemies: [{ type: 'forward', count: 16 }, { type: 'striker', count: 7 }] },
    ]
  },
  14: {
    name: 'Elite 2',
    group: 'Elite',
    startMoney: 350,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['5-points'],
    waves: [
      { id: 1, interval: 870,  enemies: [{ type: 'forward', count: 12 }, { type: 'striker', count: 5 }] },
      { id: 2, interval: 800,  enemies: [{ type: 'forward', count: 16 }, { type: 'striker', count: 7 }] },
      { id: 3, interval: 720,  enemies: [{ type: 'forward', count: 22 }] },
      { id: 4, interval: 800,  enemies: [{ type: 'striker', count: 13 }, { type: 'forward', count: 12 }] },
      { id: 5, interval: 630,  enemies: [{ type: 'forward', count: 21 }, { type: 'striker', count: 10 }] },
    ]
  },
  15: {
    name: 'Elite 3',
    group: 'Elite',
    startMoney: 350,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['5-points'],
    waves: [
      { id: 1, interval: 850,  enemies: [{ type: 'forward', count: 13 }, { type: 'striker', count: 5 }] },
      { id: 2, interval: 770,  enemies: [{ type: 'forward', count: 18 }, { type: 'striker', count: 8 }] },
      { id: 3, interval: 700,  enemies: [{ type: 'forward', count: 24 }] },
      { id: 4, interval: 820,  enemies: [{ type: 'striker', count: 12 }, { type: 'forward', count: 10 }] },
      { id: 5, interval: 650,  enemies: [{ type: 'forward', count: 20 }, { type: 'striker', count: 9 }] },
    ]
  },
  16: {
    name: 'Elite Final',
    group: 'Elite',
    startMoney: 350,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['5-points'],
    waves: [
      { id: 1, interval: 820,  enemies: [{ type: 'forward', count: 14 }, { type: 'striker', count: 6 }] },
      { id: 2, interval: 750,  enemies: [{ type: 'forward', count: 20 }, { type: 'striker', count: 9 }] },
      { id: 3, interval: 680,  enemies: [{ type: 'forward', count: 26 }] },
      { id: 4, interval: 800,  enemies: [{ type: 'striker', count: 13 }, { type: 'forward', count: 12 }] },
      { id: 5, interval: 630,  enemies: [{ type: 'forward', count: 22 }, { type: 'striker', count: 10 }] },
    ]
  },
  17: {
    name: 'World Cup 1',
    group: 'Championship',
    startMoney: 400,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['5-points'],
    waves: [
      { id: 1, interval: 850,  enemies: [{ type: 'forward', count: 14 }, { type: 'amateur', count: 6 }, { type: 'striker', count: 4 }] },
      { id: 2, interval: 770,  enemies: [{ type: 'forward', count: 18 }, { type: 'striker', count: 8 }] },
      { id: 3, interval: 700,  enemies: [{ type: 'forward', count: 24 }, { type: 'striker', count: 6 }] },
      { id: 4, interval: 800,  enemies: [{ type: 'striker', count: 12 }, { type: 'forward', count: 14 }] },
      { id: 5, interval: 650,  enemies: [{ type: 'forward', count: 20 }, { type: 'striker', count: 10 }] },
    ]
  },
  18: {
    name: 'World Cup 2',
    group: 'Championship',
    startMoney: 400,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['5-points'],
    waves: [
      { id: 1, interval: 820,  enemies: [{ type: 'forward', count: 15 }, { type: 'striker', count: 6 }] },
      { id: 2, interval: 750,  enemies: [{ type: 'forward', count: 20 }, { type: 'striker', count: 9 }] },
      { id: 3, interval: 670,  enemies: [{ type: 'forward', count: 26 }, { type: 'striker', count: 8 }] },
      { id: 4, interval: 770,  enemies: [{ type: 'striker', count: 14 }, { type: 'forward', count: 16 }] },
      { id: 5, interval: 620,  enemies: [{ type: 'forward', count: 22 }, { type: 'striker', count: 11 }] },
    ]
  },
  19: {
    name: 'World Cup Semi Final',
    group: 'Championship',
    startMoney: 400,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['5-points'],
    waves: [
      { id: 1, interval: 800,  enemies: [{ type: 'forward', count: 16 }, { type: 'striker', count: 7 }] },
      { id: 2, interval: 720,  enemies: [{ type: 'forward', count: 22 }, { type: 'striker', count: 11 }] },
      { id: 3, interval: 650,  enemies: [{ type: 'forward', count: 28 }, { type: 'striker', count: 9 }] },
      { id: 4, interval: 720,  enemies: [{ type: 'striker', count: 15 }, { type: 'forward', count: 18 }] },
      { id: 5, interval: 570,  enemies: [{ type: 'forward', count: 24 }, { type: 'striker', count: 12 }] },
    ]
  },
  20: {
    name: 'World Cup Final',
    group: 'Championship',
    startMoney: 400,
    lives: 5,
    spawnPoints: SPAWN_CONFIGS['5-points'],
    waves: [
      { id: 1, interval: 850,  enemies: [{ type: 'forward', count: 14 }, { type: 'amateur', count: 8 }] },
      { id: 2, interval: 780,  enemies: [{ type: 'forward', count: 18 }, { type: 'striker', count: 8 }] },
      { id: 3, interval: 700,  enemies: [{ type: 'forward', count: 24 }] },
      { id: 4, interval: 790,  enemies: [{ type: 'striker', count: 13 }] },
      { id: 5, interval: 620,  enemies: [{ type: 'forward', count: 22 }, { type: 'striker', count: 8 }] },
      { id: 6, interval: 550,  enemies: [{ type: 'forward', count: 18 }, { type: 'striker', count: 13 }] },
    ]
  },
}
