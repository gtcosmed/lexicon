/* ════════════════════════════════════════
   GT-CnT — main.js
   ════════════════════════════════════════ */

/* ── FORMSPREE 설정 ── */
const FORMSPREE_ID = 'xjgjplrg';
const FORMSPREE_URL = 'https://formspree.io/f/' + FORMSPREE_ID;

/* ── LANGUAGE ── */
const LANG_KEY = 'gt-cnt-lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'ko';

const ALERT_MSG = {
  ko: { required: '필수 항목을 모두 입력해주세요.', email: '올바른 이메일 주소를 입력해주세요.' },
  ja: { required: '必須項目をすべて入力してください。', email: '正しいメールアドレスを入力してください。' }
};

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang === 'ja' ? 'ja' : 'ko';
  document.body.setAttribute('data-lang', lang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  document.querySelectorAll('[data-ko],[data-ja]').forEach(el => {
    if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
      const ph = el.getAttribute('data-placeholder-' + lang);
      if (ph) el.placeholder = ph;
      return;
    }
    const val = el.getAttribute('data-' + lang);
    if (!val) return;
    if (val.includes('<') || val.includes('&')) {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });

  document.title = lang === 'ja'
    ? 'GT-CnT | 日韓翻訳・通訳サービス'
    : 'GT-CnT | 한일 번역·통역 서비스';
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

/* ── Formspree 전송 공통 함수 ── */
async function sendToFormspree(data, successCallback) {
  try {
    const res = await fetch(FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('error');
    successCallback();
  } catch (e) {
    alert(currentLang === 'ja'
      ? '送信に失敗しました。gtcosmed@gmail.comまで直接ご連絡ください。'
      : '전송에 실패했습니다. gtcosmed@gmail.com 으로 직접 문의해주세요.');
  }
}

/* ── 탭 전환 ── */
function switchTab(tab) {
  const isText = tab === 'text';
  document.getElementById('panel-text').style.display      = isText ? 'block' : 'none';
  document.getElementById('panel-interpret').style.display = isText ? 'none' : 'block';
  document.getElementById('form-success').style.display    = 'none';
  document.getElementById('tab-text').classList.toggle('active', isText);
  document.getElementById('tab-interpret').classList.toggle('active', !isText);
}

/* ── 번역 방향 선택 ── */
function selectDir(btn) {
  document.querySelectorAll('.dir-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ── 번역 분야 선택 ── */
function selectField(btn) {
  document.querySelectorAll('.field-btn').forEach(b => {
    b.style.background = '#fff'; b.style.color = 'var(--text-sub)'; b.style.borderColor = 'var(--border)';
  });
  btn.style.background = 'var(--light-blue)'; btn.style.color = 'var(--deep-blue)'; btn.style.borderColor = 'var(--deep-blue)';
}

/* ── 통역 유형 선택 ── */
function selectType(btn) {
  document.querySelectorAll('.type-btn').forEach(b => {
    b.style.background = '#fff'; b.style.color = 'var(--text-sub)'; b.style.borderColor = 'var(--border)';
  });
  btn.style.background = 'var(--light-blue)'; btn.style.color = 'var(--deep-blue)'; btn.style.borderColor = 'var(--deep-blue)';
}

/* ── 글자 수 카운터 ── */
function countChars() {
  const el = document.getElementById('source-text');
  if (el) document.getElementById('char-count').textContent = el.value.length.toLocaleString();
}

/* ── 무료 상담 신청 폼 제출 ── */
function submitForm(type) {
  const isText = type === 'text';
  const nameId  = isText ? 'name'      : 'int-name';
  const phoneId = isText ? 'phone'     : 'int-phone';
  const emailId = isText ? 'email'     : 'int-email';

  const name  = (document.getElementById(nameId)?.value  || '').trim();
  const phone = (document.getElementById(phoneId)?.value || '').trim();
  const email = (document.getElementById(emailId)?.value || '').trim();
  const msgs  = ALERT_MSG[currentLang];

  if (!name || !phone || !email) { alert(msgs.required); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert(msgs.email); return; }

  let data = { _replyto: email, _subject: 'GT-CnT 상담 신청' };

  if (isText) {
    const dirBtn   = document.querySelector('#panel-text .dir-btn.active');
    const fieldBtn = [...document.querySelectorAll('#panel-text .field-btn')].find(b => b.style.background && !b.style.background.includes('255, 255, 255'));
    data['의뢰유형']   = '번역 의뢰';
    data['성함']       = name;
    data['연락처']     = phone;
    data['이메일']     = email;
    data['번역방향']   = dirBtn ? dirBtn.textContent.trim() : '-';
    data['번역분야']   = fieldBtn ? fieldBtn.textContent.trim() : '-';
    data['원문내용']   = (document.getElementById('source-text')?.value || '').trim() || '-';
    data['희망납기일'] = document.getElementById('deadline')?.value || '-';
  } else {
    const typeBtn = [...document.querySelectorAll('#panel-interpret .type-btn')].find(b => b.style.background && !b.style.background.includes('255, 255, 255'));
    data['의뢰유형'] = '통역 의뢰';
    data['성함']     = name;
    data['연락처']   = phone;
    data['이메일']   = email;
    data['통역유형'] = typeBtn ? typeBtn.textContent.trim() : '-';
    data['예정일정'] = document.getElementById('int-date')?.value || '-';
    data['통역내용'] = (document.getElementById('int-content')?.value || '').trim() || '-';
  }

  sendToFormspree(data, () => {
    document.getElementById('panel-text').style.display      = 'none';
    document.getElementById('panel-interpret').style.display = 'none';
    document.getElementById('form-success').style.display    = 'block';
    document.getElementById('form-success').scrollIntoView({ behavior: 'smooth', block: 'center' });
    applyLanguage(currentLang);
  });
}

/* ── 폼 초기화 ── */
function resetForm() {
  document.getElementById('form-success').style.display = 'none';
  switchTab('text');
  ['name','phone','email','source-text','deadline','int-name','int-phone','int-email','int-date','int-content'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  countChars();
}

/* ── 무료 샘플 방향 선택 ── */
function selectSampleDir(btn) {
  document.querySelectorAll('.sample-trial-dir .dir-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

/* ── 무료 샘플 글자 수 ── */
function countSampleChars() {
  const el = document.getElementById('sample-text');
  if (el) document.getElementById('sample-char-count').textContent = el.value.length;
}

/* ── 무료 샘플 신청 폼 제출 ── */
function submitSample() {
  const text  = (document.getElementById('sample-text')?.value  || '').trim();
  const name  = (document.getElementById('sample-name')?.value  || '').trim();
  const email = (document.getElementById('sample-email')?.value || '').trim();
  const dir   = document.querySelector('.sample-trial-dir .dir-btn.active')?.textContent.trim() || '-';
  const msgs  = ALERT_MSG[currentLang];

  if (!text) {
    alert(currentLang === 'ja' ? '翻訳したいテキストを入力してください。' : '번역할 텍스트를 입력해주세요.');
    return;
  }
  if (!name || !email) { alert(msgs.required); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert(msgs.email); return; }

  const data = {
    _replyto: email,
    _subject: 'GT-CnT 무료 샘플 신청',
    '의뢰유형': '무료 샘플 번역',
    '성함':     name,
    '이메일':   email,
    '번역방향': dir,
    '원문텍스트': text
  };

  sendToFormspree(data, () => {
    document.getElementById('sample-text').value  = '';
    document.getElementById('sample-name').value  = '';
    document.getElementById('sample-email').value = '';
    countSampleChars();
    document.getElementById('sample-success').style.display = 'block';
    document.getElementById('sample-success').scrollIntoView({ behavior: 'smooth', block: 'center' });
    applyLanguage(currentLang);
  });
}

/* ── 스크롤 페이드업 ── */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.service-card,.strength-card,.step-item,.stat-item,.info-point,.portfolio-case,.blog-card').forEach(el => {
    el.classList.add('reveal'); observer.observe(el);
  });
}

/* ── 부드러운 앵커 스크롤 ── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = document.getElementById('main-nav')?.offsetHeight || 66;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.pageYOffset - navH, behavior: 'smooth' });
      }
    });
  });
}

/* ── 초기화 ── */
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage(currentLang);
  initReveal();
  initSmoothScroll();
});
