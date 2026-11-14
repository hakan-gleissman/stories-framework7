import Framework7 from 'framework7/lite';
import 'framework7/css';
import './original.css';
import './app.css';
import { routes } from './pages';
import { registerSW } from 'virtual:pwa-register';

// A fresh deep link needs real parent entries so Back stays inside Stories.
const basePath = window.location.pathname.replace(/index\.html$/, '');
const requestedPath = window.location.hash.replace(/^#!/, '') || '/';
const freshEntry = window.history.state?.storiesBase !== basePath;
const initialParents = requestedPath === '/sisyfos/'
  ? ['/grekisk/', '/fler-historier/', '/sisyfos/']
  : ['/midas/', '/eris/', '/fler-historier/'].includes(requestedPath)
    ? ['/grekisk/', requestedPath]
    : requestedPath === '/grekisk/' ? ['/grekisk/'] : [];
if (freshEntry) {
  window.history.replaceState({ ...window.history.state, storiesBase: basePath }, '',
    initialParents.length ? basePath : window.location.href);
}

const backButton = document.querySelector('.story-back');
const parentRoutes = { index: null, grekisk: '/', midas: '/grekisk/', eris: '/grekisk/', sisyfos: '/fler-historier/', 'fler-historier': '/grekisk/' };
function updateHeader(page, transitioning) {
  const parent = parentRoutes[page.el.dataset.name];
  backButton.hidden = parent == null;
  backButton.disabled = transitioning;
  backButton.dataset.target = parent || '/';
  backButton.setAttribute('aria-label', parent === '/fler-historier/'
    ? 'Tillbaka till Fler historier'
    : parent === '/grekisk/' ? 'Tillbaka till Grekisk mytologi' : 'Tillbaka till startsidan');
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const app = new Framework7({
  el: '#app',
  name: 'Stories',
  theme: 'auto',
  routes,
  view: {
    animate: !reducedMotion.matches,
    iosDynamicNavbar: false,
    iosSwipeBack: true,
    mdSwipeBack: true,
    browserHistory: true,
    browserHistorySeparator: '#!',
    browserHistoryRoot: basePath,
    browserHistoryOnLoad: true,
    restoreScrollTopOnBack: true,
  },
  on: {
    pageBeforeIn(page) {
      updateHeader(page, true);
      page.el.inert = false;
      page.el.removeAttribute('aria-hidden');
    },
    pageAfterIn(page) {
      updateHeader(page, false);
      // Retained pages keep their scroll position but stay out of keyboard/AT navigation.
      document.querySelectorAll('.page').forEach((element) => {
        const inactive = element !== page.el;
        element.inert = inactive;
        if (inactive) element.setAttribute('aria-hidden', 'true');
        else element.removeAttribute('aria-hidden');
      });
      const heading = page.el.querySelector('h1');
      document.title = heading ? `${heading.textContent} – Stories` : 'Stories';
      page.el.querySelector('.page-content')?.focus({ preventScroll: true });
    },
  },
});
const mainView = app.views.create('.view-main', { url: '/' });
if (freshEntry) {
  initialParents.forEach(path => mainView.router.navigate(path, { animate: false }));
}
// Capture brand navigation before Framework7's delegated link handler.
document.addEventListener('click', (event) => {
  const back = event.target.closest('.story-back');
  if (back) {
    event.preventDefault();
    event.stopPropagation();
    if (!back.disabled) mainView.router.back(back.dataset.target, {
      force: true,
      transition: mainView.router.currentRoute.route.transition,
    });
    return;
  }
  if (!event.target.closest('.story-home')) return;
  event.preventDefault();
  event.stopPropagation();
  if (app.views.main.router.currentRoute.path === '/') return;
  app.views.main.router.back('/', { force: true });
}, true);
registerSW({ immediate: true });
