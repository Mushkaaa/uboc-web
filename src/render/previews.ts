// Generated, animated "project previews" (no photos/videos exist). Pure markup;
// motion lives in CSS keyframes that only run while `.is-playing` is set.
import { contourSvg } from './util.ts';

type Pal = { bg: string; a: string; b: string };

const vars = (p: Pal) => `--pv-bg:${p.bg};--pv-a:${p.a};--pv-b:${p.b}`;

function calendar(): string {
  let cells = '';
  for (let i = 0; i < 35; i++) {
    // pseudo-random "booked" pattern, fixed so the poster frame is stable
    const booked = (i * 7 + 3) % 5 !== 0;
    cells += `<i style="--i:${i}"${booked ? ' class="b"' : ''}></i>`;
  }
  return `<div class="pv-cal"><div class="pv-cal__bar"><span></span></div><div class="pv-cal__grid">${cells}</div></div>`;
}

function feed(): string {
  let tiles = '';
  for (let i = 0; i < 9; i++) tiles += `<i style="--i:${i}"></i>`;
  return `<div class="pv-feed"><div class="pv-phone"><div class="pv-feed__count pv-count" style="--from:1200;--to:9800"></div><div class="pv-feed__grid">${tiles}</div></div></div>`;
}

function map(): string {
  return `<div class="pv-map">${contourSvg({
    seed: 'volnobeh-map',
    count: 9,
    cx: 200,
    cy: 120,
    rMax: 190,
    viewBox: '0 0 400 250',
    cls: 'pv-map__bg',
    drift: [40, -10],
  })}<span class="pv-map__pin"></span><ol class="pv-map__list"><li style="--r:0"></li><li style="--r:1"></li><li class="me" style="--r:2"></li></ol></div>`;
}

function chart(): string {
  return `<div class="pv-chart"><svg viewBox="0 0 400 250" aria-hidden="true" focusable="false" fill="none"><path class="pv-chart__axis" d="M30 20V220H380"/><path class="pv-chart__line" pathLength="1" d="M30 205C80 200 100 180 140 170S200 150 230 120S300 70 330 55S370 30 380 28"/><circle cx="140" cy="170" r="7" style="--i:0"/><circle cx="230" cy="120" r="7" style="--i:1"/><circle cx="330" cy="55" r="7" style="--i:2"/></svg><div class="pv-chart__num pv-count" style="--from:0;--to:47"></div></div>`;
}

function shop(): string {
  const bag = (i: number) =>
    `<i class="pv-shop__item" style="--i:${i}"><svg viewBox="0 0 60 80" aria-hidden="true" focusable="false"><path d="M8 14h44l4 62H4z"/><path d="M8 14l6-10h32l6 10" fill="none"/><circle cx="30" cy="44" r="10"/></svg></i>`;
  return `<div class="pv-shop"><div class="pv-shop__row">${bag(0)}${bag(1)}${bag(2)}</div><div class="pv-shop__cart"><svg viewBox="0 0 48 40" aria-hidden="true" focusable="false" fill="none"><path d="M2 4h8l6 24h24l5-16H13"/><circle cx="19" cy="35" r="3"/><circle cx="37" cy="35" r="3"/></svg><b class="pv-count" style="--from:0;--to:3"></b></div></div>`;
}

function reel(): string {
  let holds = '';
  const pos = [
    [22, 8],
    [62, 20],
    [34, 36],
    [70, 52],
    [28, 66],
    [58, 82],
    [24, 96],
  ];
  pos.forEach(([x, y], i) => {
    holds += `<i style="--x:${x}%;--y:${y}%;--s:${0.7 + ((i * 37) % 10) / 20}"></i>`;
  });
  return `<div class="pv-reel"><div class="pv-reel__frame"><div class="pv-reel__wall">${holds}${holds.replace(/--y:(\d+)%/g, (_, y) => `--y:${Number(y) + 100}%`)}</div><span class="pv-reel__climber"></span><div class="pv-reel__views pv-count" style="--from:0;--to:410"></div></div></div>`;
}

const kinds: Record<string, () => string> = { calendar, feed, map, chart, shop, reel };

export function preview(kind: string, palette: Pal): string {
  const fn = kinds[kind];
  return `<div class="pv pv--${kind}" style="${vars(palette)}" aria-hidden="true">${fn ? fn() : ''}</div>`;
}
