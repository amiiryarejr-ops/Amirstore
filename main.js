document.addEventListener('DOMContentLoaded', function () {

    // ---------- Footer year ----------
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ---------- Mobile nav toggle ----------
    var toggle = document.getElementById('navToggle');
    var nav = document.querySelector('.main-nav');
    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('nav-open');
            nav.style.display = nav.classList.contains('nav-open') ? 'block' : 'none';
        });
    }

    // ---------- Cart state ----------
    var cart = []; // { name, price, qty }
    var cartCountEl = document.getElementById('cartCount');

    function updateCartCount() {
        var total = cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
        if (cartCountEl) cartCountEl.textContent = total;
    }

    document.querySelectorAll('.btn-add').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var card = btn.closest('.product-card');
            var name = card ? card.getAttribute('data-name') : 'Product';
            var price = card ? parseFloat(card.getAttribute('data-price')) : 0;

            var existing = cart.find(function (i) { return i.name === name; });
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ name: name, price: price, qty: 1 });
            }
            updateCartCount();

            btn.style.transform = 'scale(1.3) rotate(90deg)';
            setTimeout(function () { btn.style.transform = ''; }, 200);

            showToast(name + ' waa lagu daray gaariga! 🛒');
        });
    });

    // ---------- Checkout modal open/close ----------
    var overlay = document.getElementById('checkoutOverlay');
    var cartIconBtn = document.getElementById('cartIconBtn');
    var checkoutClose = document.getElementById('checkoutClose');
    var checkoutDone = document.getElementById('checkoutDone');
    var checkoutForm = document.getElementById('checkoutForm');
    var checkoutSuccess = document.getElementById('checkoutSuccess');
    var checkoutCartSummary = document.getElementById('checkoutCartSummary');
    var checkoutSubmitBtn = document.getElementById('checkoutSubmitBtn');

    function renderCartSummary() {
        if (!checkoutCartSummary) return;
        if (cart.length === 0) {
            checkoutCartSummary.innerHTML = '<p class="empty-cart-msg">Gaarigaagu waa madhan yahay. Dib u noqo bogga alaabta oo dooro wax aad rabto.</p>';
            return;
        }
        var total = cart.reduce(function (sum, i) { return sum + i.price * i.qty; }, 0);
        var html = '<ul class="cart-summary-list">';
        cart.forEach(function (item) {
            html += '<li><span>' + item.name + ' &times; ' + item.qty + '</span><span>KES ' + (item.price * item.qty).toLocaleString() + '</span></li>';
        });
        html += '</ul><div class="cart-summary-total"><span>Wadarta</span><span>KES ' + total.toLocaleString() + '</span></div>';
        checkoutCartSummary.innerHTML = html;
    }

    function openCheckout() {
        renderCartSummary();
        if (overlay) overlay.classList.add('active');
        if (checkoutForm) checkoutForm.style.display = 'flex';
        if (checkoutSuccess) checkoutSuccess.classList.remove('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCheckout() {
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (cartIconBtn) cartIconBtn.addEventListener('click', function (e) { e.preventDefault(); openCheckout(); });
    if (checkoutClose) checkoutClose.addEventListener('click', closeCheckout);
    if (checkoutDone) checkoutDone.addEventListener('click', function () {
        closeCheckout();
        cart = [];
        updateCartCount();
    });
    if (overlay) overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeCheckout();
    });

    // Also let "Shop Now" / "Order" style buttons open checkout directly if cart has items
    document.querySelectorAll('a[href="#products"]').forEach(function (link) {
        // leave normal scroll behavior; checkout only opens via cart icon
    });

    // ---------- Checkout form submission ----------
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (cart.length === 0) {
                showToast('Fadlan dooro ugu yaraan hal alaab ka hor intaadan dirin dalabka.');
                return;
            }

            var formData = new FormData(checkoutForm);
            var itemsText = cart.map(function (i) { return i.name + ' x' + i.qty; }).join(', ');
            var total = cart.reduce(function (sum, i) { return sum + i.price * i.qty; }, 0);

            var payload = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                location: formData.get('location'),
                address: formData.get('address'),
                message: formData.get('message'),
                items: itemsText,
                total: total
            };

            var endpoint = (typeof CHECKOUT_ENDPOINT_URL !== 'undefined') ? CHECKOUT_ENDPOINT_URL : null;

            if (!endpoint || endpoint === 'PASTE_YOUR_URL_HERE') {
                showToast('Backend-ka weli lama xirin — fiiri tilmaamaha google-apps-script.gs');
                console.warn('CHECKOUT_ENDPOINT_URL is not configured. See google-apps-script.gs for setup instructions.');
                return;
            }

            checkoutSubmitBtn.disabled = true;
            checkoutSubmitBtn.textContent = 'Diraya...';

            fetch(endpoint, {
                method: 'POST',
                mode: 'no-cors', // Apps Script web apps often require no-cors from browser fetch
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(payload)
            })
            .then(function () {
                checkoutForm.style.display = 'none';
                checkoutSuccess.classList.add('active');
                checkoutForm.reset();
            })
            .catch(function (err) {
                console.error(err);
                showToast('Wax baa qaldantay. Fadlan isku day mar kale.');
            })
            .finally(function () {
                checkoutSubmitBtn.disabled = false;
                checkoutSubmitBtn.textContent = 'Dir Dalabka ✅';
            });
        });
    }

    // ---------- Newsletter form (demo) ----------
    var newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showToast('Mahadsanid! Waad ku biirtay liiska AmiirStore ✨');
            newsletterForm.reset();
        });
    }

    // ---------- Smooth scroll for anchor links ----------
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId.length > 1) {
                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                    if (nav) { nav.classList.remove('nav-open'); nav.style.display = ''; }
                }
            }
        });
    });

    // ---------- Toast notification ----------
    function showToast(message) {
        var toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position:fixed; bottom:30px; left:50%; transform:translateX(-50%) translateY(20px);
            background:#12081f; color:#fff; padding:14px 26px; border-radius:30px;
            font-size:14px; font-weight:600; box-shadow:0 15px 35px rgba(0,0,0,0.3);
            z-index:9999; opacity:0; transition:opacity .3s, transform .3s;
            max-width: 85vw; text-align:center;
        `;
        document.body.appendChild(toast);
        requestAnimationFrame(function () {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });
        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(function () { toast.remove(); }, 300);
        }, 2600);
    }

});
