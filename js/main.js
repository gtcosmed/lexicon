/* ════════════════════════════════════════
   GT-CnT — main.js
   Bilingual (Korean / Japanese) Website
   ════════════════════════════════════════ */

/* ── FORMSPREE 설정 ── */
const FORMSPREE_ID = 'xjgjplrg';

/* ── LANGUAGE SWITCHER ── */
const LANG_KEY = 'gt-cnt-lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'ko';

const ALERT_MESSAGES = {
  ko: {
    required: '성함, 연락처, 이메일은 필수 항목입니다.',
    email: '올바른 이메일 주소를 입력해주세요.',
  },
  ja: {
    required: 'お名前、電話番号、メールアドレスは必須項目です。',
    email: '正しいメールアドレスを入力してください。',
  }
};

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);

  // html lang attr
  document.documentElement.lang = lang === 'ja' ? 'ja' : 'ko';
  document.body.setAttribute('data-lang', lang);

  // Toggle buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  // Translate all elements with data-ko / data-ja
  document.querySelectorAll('[data-ko],[data-ja]').forEach(el => {
    const val = el.getAttribute(`data-${lang}`);
    if (val === null) return;

    // textarea placeholder special handling
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      const phAttr = `data-placeholder-${lang}`;
      const ph = el.getAttribute(phAttr);
      if (ph) el.placeholder = ph;
      return;
    }

    // Use innerHTML for elements that need HTML entities / tags
    if (val.includes('<') || val.includes('&')) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });

  // Update nav links
  document.querySelectorAll('.nav-links a').forEach(a => {
    const val = a.getAttribute(`data-${lang}`);
    if (val) a.textContent = val;
  });

  // Textarea & input placeholders (direct data-placeholder-* attrs)
  document.querySelectorAll('textarea[data-placeholder-ko], input[data-placeholder-ko]').forEach(el => {
    const ph = el.getAttribute(`data-placeholder-${lang}`);
    if (ph) el.placeholder = ph;
  });

  // Update document title & meta
  if (lang === 'ja') {
    document.title = 'GT-CnT | 日韓翻訳・通訳サービス';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = 'GT-CnT — AIの速度に、人間の責任を加える。日韓ビジネス翻訳・通訳の専門チーム。';
  } else {
    document.title = 'GT-CnT | 한일 번역·통역 서비스';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = 'GT-CnT — AI의 속도에 인간의 책임을 더한 한일 비즈니스 번역·통역 서비스.';
  }
}

// Language toggle button click
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

/* ── FORM: 탭 전환 ── */
function switchTab(tab) {
  const isText = tab === 'text';
  document.getElementById('panel-text').style.display      = isText ? 'block' : 'none';
  document.getElementById('panel-interpret').style.display = isText ? 'none'  : 'block';
  document.getElementById('form-success').style.display    = 'none';

  const tText = document.getElementById('tab-text');
  const tInt  = document.getElementById('tab-interpret');
  tText.classList.toggle('active', isText);
  tInt.classList.toggle('active', !isText);
}

/* ── FORM: 번역 방향 선택 ── */
function selectDir(btn) {
  document.querySelectorAll('.dir-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ── FORM: 번역 분야 선택 ── */
function selectField(btn) {
  document.querySelectorAll('.field-btn').forEach(b => {
    b.style.background  = '#fff';
    b.style.color       = 'var(--text-sub)';
    b.style.borderColor = 'var(--border)';
  });
  btn.style.background  = 'var(--light-blue)';
  btn.style.color       = 'var(--deep-blue)';
  btn.style.borderColor = 'var(--deep-blue)';
}

/* ── FORM: 통역 유형 선택 ── */
function selectType(btn) {
  document.querySelectorAll('.type-btn').forEach(b => {
    b.style.background  = '#fff';
    b.style.color       = 'var(--text-sub)';
    b.style.borderColor = 'var(--border)';
  });
  btn.style.background  = 'var(--light-blue)';
  btn.style.color       = 'var(--deep-blue)';
  btn.style.borderColor = 'var(--deep-blue)';
}

/* ── FORM: 글자 수 카운터 ── */
function countChars() {
  const len = document.getElementById('source-text').value.length;
  document.getElementById('char-count').textContent = len.toLocaleString();
}

/* ── FORM: 제출 처리 ── */
async function submitForm(type) {
  const nameId  = type === 'text' ? 'name'      : 'int-name';
  const phoneId = type === 'text' ? 'phone'     : 'int-phone';
  const emailId = type === 'text' ? 'email'     : 'int-email';

  const name  = document.getElementById(nameId)?.value.trim()  || '';
  const phone = document.getElementById(phoneId)?.value.trim() || '';
  const email = document.getElementById(emailId)?.value.trim() || '';

  const msgs = ALERT_MESSAGES[currentLang];

  if (!name || !phone || !email) {
    alert(msgs.required);
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert(msgs.email);
    return;
  }

  // ── 폼 데이터 수집 ──
  const formData = { _replyto: email };

  if (type === 'text') {
    const dirBtn   = document.querySelector('.dir-btn.active');
    const fieldBtn = [...document.querySelectorAll('.field-btn')].find(b => b.style.background && b.style.background !== '#fff');
    formData['의뢰유형']   = '번역 의뢰';
    formData['성함']       = name;
    formData['연락처']     = phone;
    formData['이메일']     = email;
    formData['번역방향']   = dirBtn ? dirBtn.textContent.trim() : '-';
    formData['번역분야']   = fieldBtn ? fieldBtn.textContent.trim() : '-';
    formData['원문내용']   = document.getElementById('source-text')?.value.trim() || '-';
    formData['희망납기일'] = document.getElementById('deadline')?.value || '-';
  } else {
    const typeBtn = [...document.querySelectorAll('.type-btn')].find(b => b.style.background && b.style.background !== '#fff');
    formData['의뢰유형'] = '통역 의뢰';
    formData['성함']     = name;
    formData['연락처']   = phone;
    formData['이메일']   = email;
    formData['통역유형'] = typeBtn ? typeBtn.textContent.trim() : '-';
    formData['예정일정'] = document.getElementById('int-date')?.value || '-';
    formData['통역내용'] = document.getElementById('int-content')?.value.trim() || '-';
  }

  // ── 버튼 로딩 상태 ──
  const submitBtn = document.querySelector(`#panel-${type === 'text' ? 'text' : 'interpret'} .btn-submit`);
  if (submitBtn) { submitBtn.disabled = true; }

  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (!res.ok) throw new Error('전송 실패');

    document.getElementById('panel-text').style.display      = 'none';
    document.getElementById('panel-interpret').style.display = 'none';
    document.getElementById('form-success').style.display    = 'block';
    document.getElementById('form-success').scrollIntoView({ behavior: 'smooth', block: 'center' });
    applyLanguage(currentLang);

  } catch (e) {
    const errMsg = currentLang === 'ja'
      ? '送信に失敗しました。直接メールでお問い合わせください。\ngtcosmed@gmail.com'
      : '전송에 실패했습니다. 직접 이메일로 문의해주세요.\ngtcosmed@gmail.com';
    alert(errMsg);
  } finally {
    if (submitBtn) { submitBtn.disabled = false; }
  }
}

/* ── FORM: 초기화 ── */
function resetForm() {
  document.getElementById('form-success').style.display = 'none';
  switchTab('text');
  ['name', 'phone', 'email', 'source-text', 'deadline',
   'int-name', 'int-phone', 'int-email', 'int-date', 'int-content'
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  countChars();
}

/* ── SCROLL-REVEAL ── */
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.service-card, .strength-card, .step-item, .stat-item, .info-point'
  ).forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

/* ── SMOOTH ANCHOR SCROLL ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = document.getElementById('main-nav')?.offsetHeight || 66;
        const y = target.getBoundingClientRect().top + window.pageYOffset - navH;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

/* ── ACTIVE NAV LINK on scroll ── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navH = document.getElementById('main-nav')?.offsetHeight || 66;

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - navH - 60) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(a => {
      const href = a.getAttribute('href').replace('#', '');
      a.style.color = href === current ? 'var(--deep-blue)' : '';
      a.style.fontWeight = href === current ? '700' : '';
    });
  }, { passive: true });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(currentLang);
  initReveal();
  initSmoothScroll();
  initActiveNav();
});

/* ── FREE SAMPLE: 방향 선택 ── */
function selectSampleDir(btn) {
  document.querySelectorAll('.sample-trial-dir .dir-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ── FREE SAMPLE: 글자 수 카운터 ── */
function countSampleChars() {
  const len = document.getElementById('sample-text').value.length;
  document.getElementById('sample-char-count').textContent = len;
}

/* ── FREE SAMPLE: 제출 ── */
async function submitSample() {
  const text  = document.getElementById('sample-text').value.trim();
  const name  = document.getElementById('sample-name').value.trim();
  const email = document.getElementById('sample-email').value.trim();
  const dir   = document.querySelector('.sample-trial-dir .dir-btn.active')?.textContent.trim() || '-';
  const msgs  = ALERT_MESSAGES[currentLang];

  if (!text) {
    alert(currentLang === 'ja' ? '翻訳したいテキストを入力してください。' : '번역할 텍스트를 입력해주세요.');
    return;
  }
  if (!name || !email) {
    alert(msgs.required.replace('연락처, ', '').replace('、電話番号', ''));
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert(msgs.email);
    return;
  }

  const btn = document.querySelector('#free-sample .btn-submit');
  if (btn) { btn.disabled = true; btn.querySelector('span').textContent = currentLang === 'ja' ? '送信中...' : '전송 중...'; }

  const formData = {
    _replyto: email,
    '의뢰유형': '무료 샘플 번역',
    '성함': name,
    '이메일': email,
    '번역방향': dir,
    '원문텍스트': text,
  };

  try {
    if (FORMSPREE_ID === 'YOUR_FORM_ID') {
      console.log('[GT-CnT Sample]', formData);
    } else {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('전송 실패');
    }
    document.getElementById('sample-text').value = '';
    document.getElementById('sample-name').value = '';
    document.getElementById('sample-email').value = '';
    countSampleChars();
    document.getElementById('sample-success').style.display = 'block';
    document.getElementById('sample-success').scrollIntoView({ behavior: 'smooth', block: 'center' });
    applyLanguage(currentLang);
  } catch (e) {
    alert(currentLang === 'ja' ? '送信に失敗しました。\ngtcosmed@gmail.com' : '전송에 실패했습니다.\ngtcosmed@gmail.com');
  } finally {
    if (btn) { btn.disabled = false; applyLanguage(currentLang); }
  }
}
