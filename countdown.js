const engagementTime = Date.parse('2026-10-24T18:30:00+08:00');
const weddingCountdownStart = Date.parse('2026-10-27T00:00:00+08:00');
const weddingTime = Date.parse('2027-09-05T00:00:00+08:00');
let petals;
let petalsRunning = false;
let currentPhase;
const motion = matchMedia('(prefers-reduced-motion: reduce)');
function phaseAt(now) {
  if (now < engagementTime) return 'engagement';
  if (now < weddingCountdownStart) return 'engaged';
  return now < weddingTime ? 'wedding' : 'married';
}
function updatePetals(celebrating) {
  if (celebrating && !motion.matches && !document.hidden && typeof Sakura === 'function') {
    if (!petals) petals = new Sakura('#petals', {lifeTime:20000, delay:450, minSize:9, maxSize:17, fallSpeed:1.4, colors:[{gradientColorStart:'rgba(226,137,150,0.85)',gradientColorEnd:'rgba(160,43,70,0.8)',gradientColorDegree:120}]});

    else if (!petalsRunning) petals.start();
    petalsRunning = true;
  } else if (petalsRunning) {petals.stop(); petalsRunning = false;}
}
function tick() {
  const now = Date.now();
  const phase = phaseAt(now);
  const celebrating = phase === 'engaged' || phase === 'married';
  const left = celebrating ? 0 : Math.max(0, Math.ceil(((phase === 'engagement' ? engagementTime : weddingTime) - now) / 1000));
  const values = [Math.floor(left/86400), Math.floor(left/3600)%24, Math.floor(left/60)%60, left%60];
  ['days','hours','minutes','seconds'].forEach((id,i) => document.getElementById(id).textContent = String(values[i]).padStart(2,'0'));
  if (phase !== currentPhase) {
    const titles = {engagement:'We are getting engaged!',engaged:'We are engaged!',wedding:'We are getting married!',married:'We are married!'};
    document.querySelector('#countdown-title').textContent = titles[phase];
    document.title = titles[phase] + ' — Yoghender & Shalini';
    document.querySelector('.countdown').setAttribute('aria-label', celebrating ? 'Celebrating together' : 'Time until our ' + (phase === 'engagement' ? 'engagement' : 'wedding'));
    const calendar = document.querySelector('.calendar');
    calendar.hidden = celebrating;
    calendar.href = phase === 'engagement' ? 'engagement.ics' : 'wedding.ics';
    calendar.download = phase === 'engagement' ? 'Yoghender-and-Shalini-engagement.ics' : 'Yoghender-and-Shalini-wedding.ics';
    calendar.setAttribute('aria-label','Add our ' + (phase === 'engagement' ? 'engagement' : 'wedding') + ' to your calendar');
    updatePetals(celebrating);
    currentPhase = phase;
  }
}
tick();setInterval(tick,1000);
document.addEventListener('visibilitychange', () => {tick();updatePetals(currentPhase === 'engaged' || currentPhase === 'married');});
motion.addEventListener('change', () => updatePetals(currentPhase === 'engaged' || currentPhase === 'married'));
