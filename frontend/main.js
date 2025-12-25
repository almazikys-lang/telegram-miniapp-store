const tg = window.Telegram?.WebApp;
if (tg) { tg.ready(); tg.expand(); tg.setBackgroundColor('#ffffff'); }
const user = tg?.initDataUnsafe?.user || { id: 123, first_name: 'Test', username: 'testuser' };
const products = [
  { id: 1, name: 'Premium Plan', emoji: '⭐', price: '$9.99' },
  { id: 2, name: 'Pro Tools', emoji: '🔧', price: '$19.99' },
  { id: 3, name: 'Storage Plus', emoji: '💾', price: '$4.99' },
  { id: 4, name: 'Support Pack', emoji: '🎯', price: '$14.99' },
  { id: 5, name: 'Analytics', emoji: '📈', price: '$7.99' },
  { id: 6, name: 'Export Bundle', emoji: '📦', price: '$24.99' }
];
function initUI() {
  document.getElementById('user-info').textContent = `Welcome, ${user.first_name}!`;
  document.getElementById('userInfo').innerHTML = `<p><strong>ID:</strong> ${user.id}</p><p><strong>Name:</strong> ${user.first_name}</p><p><strong>Username:</strong> @${user.username || 'N/A'}</p>`;
  const itemsList = document.getElementById('itemsList');
  itemsList.innerHTML = products.map(p => `<div class="item" onclick="selectProduct(${p.id}, '${p.name}')"><div class="item-emoji">${p.emoji}</div><div class="item-name">${p.name}</div><div class="item-price">${p.price}</div></div>`).join('');
  document.getElementById('itemCount').textContent = products.length;
  document.getElementById('platform').textContent = tg?.platform || 'unknown';
  document.getElementById('version').textContent = tg?.version || 'unknown';
  document.getElementById('buy-btn').addEventListener('click', () => {
    if (tg?.MainButton) {
      tg.MainButton.text = 'Complete Purchase';
      tg.MainButton.show();
      tg.MainButton.onClick(() => {
        tg.sendData(JSON.stringify({ action: 'purchase', user_id: user.id, timestamp: new Date().toISOString() }));
      });
    }
  });
  document.getElementById('haptic-btn').addEventListener('click', () => {
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
    showNotification('Haptic feedback triggered! 📳');
  });
  document.getElementById('popup-btn').addEventListener('click', () => {
    if (tg?.showPopup) {
      tg.showPopup({ title: 'Confirm', message: 'Do you want to proceed?', buttons: [{ id: 'yes', type: 'ok', text: 'Yes' }, { id: 'no', type: 'cancel', text: 'Cancel' }] }, (id) => showNotification(id === 'yes' ? 'Confirmed! ✅' : 'Cancelled'));
    }
  });
}
function selectProduct(id, name) { showNotification(`Added ${name} to cart! 🛒`); }
function showNotification(text) { if (tg?.showAlert) tg.showAlert(text); else alert(text); }
window.addEventListener('load', initUI);
