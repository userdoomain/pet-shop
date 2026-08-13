/* ============================================================
   Pet Shop Amigo Fiel - Scripts
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Utilitários ---------- */
  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $all(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  /* ---------- Ano do rodapé ---------- */
  var yearEl = $('#year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ---------- Alternância de tema claro/escuro ---------- */
  var themeToggle = $('#themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', current);
      try {
        localStorage.setItem('af-theme', current);
      } catch (e) { /* armazenamento indisponível */ }
    });
  }

  /* ---------- Animações de scroll (reveal + contadores) ---------- */
  (function () {
    var revealEls = $all('[data-reveal]');
    if (!('IntersectionObserver' in window) || revealEls.length === 0) return;

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 80 + 'ms';
      revealObserver.observe(el);
    });

    var statEls = $all('.stat-counter');
    if (statEls.length) {
      var statObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          statObserver.unobserve(entry.target);
          animateCounter(entry.target);
        });
      }, { threshold: 0.6 });

      statEls.forEach(function (el) { statObserver.observe(el); });

      function animateCounter(el) {
        var target = parseFloat(el.getAttribute('data-target'));
        var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        var duration = 1400;
        var start = null;

        function step(timestamp) {
          if (!start) start = timestamp;
          var progress = Math.min((timestamp - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var value = target * eased;
          el.textContent = value.toLocaleString('pt-BR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          }).replace(',', decimals ? ',' : '');
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        }
        window.requestAnimationFrame(step);
      }
    }
  })();

  /* ---------- Menu mobile ---------- */
  var nav = $('#nav');
  var navToggle = $('#navToggle');

  if (nav && navToggle) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });

    $all('.nav__link', nav).forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu');
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menu');
        navToggle.focus();
      }
    });
  }

  /* ---------- Header com sombra ao rolar ---------- */
  var header = $('#header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ---------- Catálogo de produtos ---------- */
  var PRODUCTS = [
    { nome: 'Ração Premium Cães Adultos 15kg', categoria: 'racao', emoji: '🍖', preco: 189.90, precoAntigo: 219.90, descricao: 'Proteína de alta qualidade para cães adultos.' },
    { nome: 'Ração Gatos Filhotes 10kg', categoria: 'racao', emoji: '🐟', preco: 159.90, precoAntigo: null, descricao: 'Nutrição completa e saborosa para filhotes.' },
    { nome: 'Bola de borracha resistente', categoria: 'brinquedos', emoji: '⚽', preco: 24.90, precoAntigo: 34.90, descricao: 'Ideal para cães que adoram morder e brincar.' },
    { nome: 'Brinquedo de pelúcia "Osso"', categoria: 'brinquedos', emoji: '🧸', preco: 29.90, precoAntigo: null, descricao: 'Fofinho, lavável e com guizo interno.' },
    { nome: 'Ratos de brinquedo com catnip', categoria: 'brinquedos', emoji: '🐭', preco: 14.90, precoAntigo: null, descricao: 'Rico em catnip, perfeito para gatos.' },
    { nome: 'Coleira anti-puxão ajustável', categoria: 'acessorios', emoji: '🪢', preco: 49.90, precoAntigo: 59.90, descricao: 'Confortável, resistente e com fecho de segurança.' },
    { nome: 'Prato de alimentação lento', categoria: 'acessorios', emoji: '🍽️', preco: 39.90, precoAntigo: null, descricao: 'Reduz a ansiedade e melhora a digestão.' },
    { nome: 'Shampoo hipoalergênico 500ml', categoria: 'higiene', emoji: '🧴', preco: 34.90, precoAntigo: 42.90, descricao: 'Suave para peles sensíveis, com cheiro de amêndoas.' },
    { nome: 'Escova de dentes + pasta sabor carne', categoria: 'higiene', emoji: '🦷', preco: 19.90, precoAntigo: null, descricao: 'Kit de higiene dental para cães e gatos.' },
    { nome: 'Lenço umedecido para pets 80un', categoria: 'higiene', emoji: '🧻', preco: 22.90, precoAntigo: null, descricao: 'Limpeza rápida entre os banhos.' }
  ];

  function formatPrice(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function createProductCard(produto) {
    var article = document.createElement('article');
    article.className = 'product-card';
    article.setAttribute('data-categoria', produto.categoria);

    var media = document.createElement('div');
    media.className = 'product-card__media';
    media.setAttribute('aria-hidden', 'true');
    media.textContent = produto.emoji;

    var body = document.createElement('div');
    body.className = 'product-card__body';

    var tags = document.createElement('div');
    tags.className = 'product-card__tags';

    var tag = document.createElement('span');
    tag.className = 'product-card__tag';
    tag.textContent = produto.categoria;
    tags.appendChild(tag);

    var desconto = null;
    if (produto.precoAntigo && produto.precoAntigo > produto.preco) {
      desconto = Math.round((1 - produto.preco / produto.precoAntigo) * 100);
    }
    if (desconto) {
      var badge = document.createElement('span');
      badge.className = 'product-card__badge';
      badge.textContent = '-' + desconto + '%';
      tags.appendChild(badge);
    }

    var title = document.createElement('h3');
    title.textContent = produto.nome;

    var desc = document.createElement('p');
    desc.textContent = produto.descricao;

    var stock = document.createElement('span');
    stock.className = 'product-card__stock';
    stock.innerHTML = '<i aria-hidden="true"></i> Em estoque';

    var price = document.createElement('div');
    price.className = 'product-card__price';
    if (desconto) {
      var oldPrice = document.createElement('span');
      oldPrice.className = 'product-card__old';
      oldPrice.textContent = 'de ' + formatPrice(produto.precoAntigo);
      var newPrice = document.createElement('span');
      newPrice.className = 'product-card__current';
      newPrice.textContent = 'por ' + formatPrice(produto.preco);
      var installment = document.createElement('span');
      installment.className = 'product-card__installment';
      installment.textContent = 'ou 3x de ' + formatPrice(produto.preco / 3) + ' sem juros';
      price.appendChild(oldPrice);
      price.appendChild(newPrice);
      price.appendChild(installment);
    } else {
      var onlyPrice = document.createElement('span');
      onlyPrice.className = 'product-card__current';
      onlyPrice.textContent = formatPrice(produto.preco).replace('R$', 'R$ ');
      var plainInstallment = document.createElement('span');
      plainInstallment.className = 'product-card__installment';
      plainInstallment.textContent = 'ou 3x de ' + formatPrice(produto.preco / 3) + ' sem juros';
      price.appendChild(onlyPrice);
      price.appendChild(plainInstallment);
    }

    body.appendChild(tags);
    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(stock);
    body.appendChild(price);
    article.appendChild(media);
    article.appendChild(body);
    return article;
  }

  function renderProducts(container, filter) {
    if (!container) return;
    container.innerHTML = '';
    var list = filter === 'todos' ? PRODUCTS : PRODUCTS.filter(function (p) {
      return p.categoria === filter;
    });
    list.forEach(function (produto) {
      container.appendChild(createProductCard(produto));
    });

    var count = $('#productCount');
    if (count) {
      count.textContent = list.length === 1 ? '1 produto' : list.length + ' produtos';
    }
  }

  var productGrid = $('#productGrid');

  // Página da loja: com filtros e contador
  var filterButtons = $all('.chip');
  if (filterButtons.length && productGrid) {
    renderProducts(productGrid, 'todos');
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        renderProducts(productGrid, btn.getAttribute('data-filter') || 'todos');
      });
    });
  } else if (productGrid) {
    // Página inicial: apenas os 3 primeiros destaques
    renderProducts(productGrid, 'todos');
    var featured = $all('.product-card', productGrid);
    featured.slice(3).forEach(function (card) {
      if (card.parentNode === productGrid) {
        productGrid.removeChild(card);
      }
    });
    var countEl = $('#productCount');
    if (countEl) { countEl.style.display = 'none'; }
  }

  /* ---------- Depoimentos (slider) ---------- */
  var slider = $('#slider');
  var prevBtn = $('#prevSlide');
  var nextBtn = $('#nextSlide');

  if (slider && prevBtn && nextBtn) {
    var slides = $all('.card--testimonial', slider);
    var current = 0;
    var visible = 1;

    function updateVisible() {
      if (window.innerWidth >= 1025) return 3;
      if (window.innerWidth >= 769) return 2;
      return 1;
    }

    function show(index) {
      if (!slides.length) return;
      visible = updateVisible();
      var max = slides.length - visible;
      current = Math.max(0, Math.min(index, max));
      slides.forEach(function (slide, i) {
        var atStart = i < current;
        slide.style.display = atStart || i >= current + visible ? 'none' : '';
      });
    }

    prevBtn.addEventListener('click', function () { show(current - 1); });
    nextBtn.addEventListener('click', function () { show(current + 1); });
    window.addEventListener('resize', function () { show(current); });

    show(0);
  }

  /* ---------- Validação do formulário de contato ---------- */
  var contactForm = $('#contactForm');
  if (contactForm) {
    var contactMsg = $('#contactMsg');

    function setError(input, message) {
      var error = $('[data-for="' + input.id + '"]');
      input.classList.toggle('is-invalid', Boolean(message));
      if (error) error.textContent = message || '';
    }

    function validateField(input) {
      var name = input.name;
      if (name === 'nome') {
        setError(input, input.value.trim().length >= 3 ? '' : 'Informe seu nome (mínimo 3 caracteres).');
      } else if (name === 'telefone') {
        var digits = input.value.replace(/\D/g, '');
        setError(input, digits.length >= 8 ? '' : 'Informe um telefone válido.');
      } else if (name === 'email') {
        setError(input, input.value === '' || isValidEmail(input.value) ? '' : 'Informe um e-mail válido.');
      } else if (name === 'mensagem') {
        setError(input, input.value.trim().length >= 5 ? '' : 'Escreva uma mensagem com pelo menos 5 caracteres.');
      }
    }

    $all('input, textarea', contactForm).forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.classList.contains('is-invalid')) validateField(input);
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      $all('input[required], textarea[required]', contactForm).forEach(function (input) {
        validateField(input);
        if (input.classList.contains('is-invalid')) valid = false;
      });

      var emailInput = contactForm.querySelector('[name="email"]');
      validateField(emailInput);

      if (!valid) {
        if (contactMsg) {
          contactMsg.textContent = 'Por favor, corrija os campos destacados.';
          contactMsg.className = 'form__msg is-error';
        }
        return;
      }

      contactForm.reset();
      if (contactMsg) {
        contactMsg.textContent = 'Mensagem enviada com sucesso! Retornaremos em breve.';
        contactMsg.className = 'form__msg is-success';
      }
    });
  }

  /* ---------- Newsletter (rodapé) ---------- */
  var newsletterForm = $('#newsletterForm');
  if (newsletterForm) {
    var newsMsg = $('#newsMsg');
    var newsEmail = $('#newsEmail');

    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var value = newsEmail.value.trim();
      if (!isValidEmail(value)) {
        if (newsMsg) {
          newsMsg.textContent = 'Informe um e-mail válido para assinar.';
          newsMsg.className = 'form__msg is-error';
        }
        return;
      }
      newsletterForm.reset();
      if (newsMsg) {
        newsMsg.textContent = 'Inscrição feita! Obrigado por assinar.';
        newsMsg.className = 'form__msg is-success';
      }
    });
  }
})();