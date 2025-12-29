const tg = window.Telegram.WebApp;

// Initialize WebApp properly
tg.ready();
tg.expand();
tg.setBackgroundColor('#ffffff');

const user = tg.initDataUnsafe?.user || { id: 123, first_name: 'Test', username: 'testuser' };
const products = [
  { id: 1, name: 'Premium Plan', emoji: '\u2b50', price: '$9.99' },
  { id: 2, name: 'Pro Tools', emoji: '\ud83d\udd27', price: '$19.99' },
  { id: 3, name: 'Storage Plus', emoji: '\ud83d\udcc1', price: '$4.99' },
  { id: 4, name: 'Support Pack', emoji: '\ud83c\udfaf', price: '$14.99' },
  { id: 5, name: 'Analytics', emoji: '\ud83d\udcc8', price: '$7.99' },
  { id: 6, name: 'Export Bundle', emoji: '\ud83d\udcde', price: '$24.99' }
];

function initUI() {
  document.getElementById('user-info').textContent = `Welcome, ${user.first_name}!`;
  document.getElementById('userInfo').innerHTML = `<p>ID: ${user.id}</p><p>Name: ${user.first_name}</p><p>Username: @${user.username}`;
  const itemsList = document.getElementById('itemsList');
  itemsList.innerHTML = products.map(p => `<div class="item" onclick="selectProduct(${p.id}, '${p.name}')"><div class="emoji">${p.emoji}</div><div class="name">${p.name}</div><div class="price">${p.price}</div></div>`).join('');
  document.getElementById('itemCount').textContent = products.length;
  document.getElementById('platform').textContent = tg.platform || 'unknown';
  document.getElementById('version').textContent = tg.version || '6.0';
  document.getElementById('buy-btn').addEventListener('click', () => {
    if (tg.MainButton) {
      tg.MainButton.text = 'Complete Purchase';
      tg.MainButton.show();
      tg.MainButton.onClick(() => {
        tg.sendData(JSON.stringify({ action: 'purchase', user_id: user.id, timestamp: new Date().toISOString() }));
      });
    }
  });
}

document.getElementById('haptic-btn').addEventListener('click', () => {
  if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
  showNotification('Haptic feedback triggered! \ud83d\udcf1');
});

function selectProduct(id, name) {
  showNotification(`Selected: ${name}`);
}

function showNotification(text) {
  if (tg.showPopup) {
    tg.showPopup({
      title: 'Notification',
      message: text,
      buttons: [{ id: 1, text: 'OK' }]
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUI);
} else {
  initUI();
}
