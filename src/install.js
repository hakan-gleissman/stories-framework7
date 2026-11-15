// An installation invitation is dismissed once per browser and app path.
const button = document.querySelector('.install-offer');
const dialog = document.querySelector('.install-dialog');
const description = document.querySelector('#install-description');
const steps = document.querySelector('.install-steps');
const standalone = window.matchMedia('(display-mode: standalone)');
const smallScreen = window.matchMedia('(max-width: 600px)');
const storageKey = `stories:install-dismissed:v4:${location.pathname.replace(/index\.html$/, '')}`;
let dismissed = false;
let installPrompt = null;
try { dismissed = localStorage.getItem(storageKey) === 'yes'; } catch { /* In-memory choice still works. */ }

function updateOffer() {
  button.hidden = !smallScreen.matches || dismissed || standalone.matches || navigator.standalone === true;
}
function rememberChoice() {
  dismissed = true;
  installPrompt = null;
  try { localStorage.setItem(storageKey, 'yes'); } catch { /* Storage can be disabled. */ }
  updateOffer();
}
function showInstructions() {
  if (!smallScreen.matches) return;
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const android = /Android/.test(navigator.userAgent);
  let instructions;
  if (ios) {
    description.textContent = 'Spara Stories på hemskärmen så kan du öppna den som en app.';
    instructions = [
      'Tryck på … (de tre punkterna) bredvid adressfältet. Om Dela-knappen redan syns kan du trycka direkt på den.',
      'Välj Dela.',
      'Välj Lägg till på hemskärmen.',
      'Aktivera Öppna som webbapp om valet visas och tryck på Lägg till. Öppna sedan Stories via ikonen på hemskärmen.',
    ];
  } else if (android) {
    description.textContent = 'Lägg till Stories via webbläsarens meny om installationsrutan inte är tillgänglig.';
    instructions = ['Öppna ⋮-menyn och välj Installera app eller Lägg till på startskärmen.', 'Bekräfta i webbläsarens ruta. Öppna sedan Stories via ikonen på hemskärmen.'];
  } else {
    description.textContent = 'Spara Stories på hemskärmen via webbläsarens meny.';
    instructions = ['iPhone: tryck på … bredvid adressfältet → Dela → Lägg till på hemskärmen → Lägg till. Om Dela redan syns kan du trycka direkt där. Öppna sedan Stories via ikonen på hemskärmen.', 'Android: öppna webbläsarens meny och välj Installera app eller Lägg till på startskärmen. Bekräfta och öppna sedan Stories via ikonen på hemskärmen.'];
  }
  steps.replaceChildren(...instructions.map(text => {
    const item = document.createElement('li');
    item.textContent = text;
    return item;
  }));
  dialog.showModal();
}
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  installPrompt = event;
  updateOffer();
});
window.addEventListener('appinstalled', () => {
  rememberChoice();
  if (dialog.open) dialog.close();
});
standalone.addEventListener('change', updateOffer);
smallScreen.addEventListener('change', () => {
  updateOffer();
  if (!smallScreen.matches && dialog.open) dialog.close();
});
button.addEventListener('click', async () => {
  if (!smallScreen.matches) return;
  if (!installPrompt) { showInstructions(); return; }
  const prompt = installPrompt;
  installPrompt = null;
  try {
    await prompt.prompt();
    await prompt.userChoice;
    rememberChoice();
  } catch {
    showInstructions();
  }
});
dialog.querySelectorAll('[data-install-close]').forEach(control => {
  control.addEventListener('click', () => dialog.close());
});
// Acknowledging the instructions or pressing Escape dismisses the invitation persistently.
dialog.addEventListener('close', rememberChoice);
updateOffer();
