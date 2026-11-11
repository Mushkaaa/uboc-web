import '@fontsource-variable/instrument-sans/wght.css';
import './styles/base.css';
import './styles/sections.css';
import './styles/previews.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { detectTier } from './core/env';
import { initScroll } from './core/scroll';
import { fitLines, watchFit } from './core/fit';
import { initHero, runIntro } from './sections/hero';
import { initHeader, initMenu, initCtaBar, initCursor, initMagnetic, initBackToTop } from './sections/ui';
import { initForm } from './sections/form';
import {
  initHeadings, initServices, initWorks, initProcess, initResults, initTeam, initTestimonials, initFooterAndContact,
} from './sections/content';

gsap.registerPlugin(ScrollTrigger, SplitText);

const tier = detectTier();

/** Run init steps one per task so no single task blocks the main thread for long. */
function queue(steps: Array<() => void>) {
  const next = () => {
    const step = steps.shift();
    if (!step) return;
    step();
    if (!steps.length) return;
    if ('requestIdleCallback' in window) requestIdleCallback(next, { timeout: 120 });
    else setTimeout(next, 1);
  };
  next();
}

// Critical: things a visitor can touch in the first seconds.
initScroll(tier);
fitLines();
initHero(tier);
initMenu(tier);
initForm(tier);

const fontsReady = document.fonts.ready;
queue([
  () => initCtaBar(tier),
  () => initHeader(tier),
  () => initServices(tier),
  () => initWorks(tier),
  () => initProcess(tier),
  () => initResults(tier),
  () => initTeam(tier),
  () => initTestimonials(tier),
  () => initBackToTop(),
]);

// Display font metrics are needed for the headline fit and the intro; start those as soon as fonts land.
fontsReady.then(() => {
  fitLines();
  runIntro(tier);
  queue([
    () => initHeadings(tier),
    () => initFooterAndContact(tier),
    () => { initCursor(tier); initMagnetic(tier); },
    () => ScrollTrigger.refresh(),
  ]);
});

watchFit(() => {
  fitLines();
  ScrollTrigger.refresh();
});
