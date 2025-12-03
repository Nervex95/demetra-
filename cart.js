// Simple Cart Management System
(function() {
  // Initialize cart from localStorage
  function getCart() {
    const cartData = localStorage.getItem('demetra_cart');
    return cartData ? JSON.parse(cartData) : {};
  }

  function saveCart(cart) {
    localStorage.setItem('demetra_cart', JSON.stringify(cart));
    // Trigger update event for other pages/windows
    window.dispatchEvent(new Event('cartUpdated'));
  }

  function updateCartCount() {
    const cart = getCart();
    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    const countElements = document.querySelectorAll('#cartCount');
    countElements.forEach(el => {
      el.textContent = totalItems;
      if (totalItems > 0) {
        el.style.display = 'flex';
      } else {
        el.style.display = 'none';
      }
    });
  }

  // Attach to window for global access
  window.cartManager = {
    addItem: function(productId, productName = 'Product') {
      const cart = getCart();
      if (!cart[productId]) {
        cart[productId] = 0;
      }
      cart[productId]++;
      saveCart(cart);
      updateCartCount();
      // Show feedback
      alert(productName + ' aggiunto al carrello!');
    },
    removeItem: function(productId) {
      const cart = getCart();
      if (cart[productId] > 0) {
        cart[productId]--;
        if (cart[productId] === 0) {
          delete cart[productId];
        }
        saveCart(cart);
        updateCartCount();
      }
    },
    getCart: getCart,
    clear: function() {
      localStorage.removeItem('demetra_cart');
      updateCartCount();
    }
  };

  // Update count on page load
  document.addEventListener('DOMContentLoaded', updateCartCount);
  
  // Listen for cart updates from other tabs/windows
  window.addEventListener('storage', updateCartCount);
  window.addEventListener('cartUpdated', updateCartCount);
})();
