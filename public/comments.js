// Guest comments for article and project pages: nickname + password per comment, one reply level, @mention tags.
// An optional data-intro on the section replaces the sign-up note with that bold line.
(() => {
  const root = document.querySelector('[data-comments]');
  if (!root) return;
  const lang = root.dataset.lang === 'en' ? 'en' : 'ko';
  const page = root.dataset.page;
  const t = {
    ko: {
      title: '?볤?', nickname: '?됰꽕??, password: '鍮꾨?踰덊샇', body: '?볤????④꺼二쇱꽭??, submit: '?깅줉', reply: '?듦?', delete: '??젣',
      cancel: '痍⑥냼', confirm: '?뺤씤', deleted: '??젣???볤??낅땲??, empty: '?꾩쭅 ?볤????놁쓬. 泥??볤????④꺼二쇱꽭??,
      note: '?뚯썝媛???놁씠 ?됰꽕?꾧낵 鍮꾨?踰덊샇濡??묒꽦?? ?볤???吏????媛숈? ?됰꽕?꾧낵 鍮꾨?踰덊샇媛 ?꾩슂??, deletePassword: '?묒꽦?????낅젰??鍮꾨?踰덊샇', deleteNickname: '?묒꽦?????낅젰???됰꽕??,
      loadError: '?볤???遺덈윭?ㅼ? 紐삵뻽??, sending: '?깅줉 以묅?,
      errors: {
        invalid_nickname: '?됰꽕?꾩? 2~20?먮줈 ?낅젰??二쇱꽭??(<, >, @ ?쒖쇅)', reserved_nickname: '?ъ슜?????녿뒗 ?됰꽕?꾩엫',
        invalid_password: '鍮꾨?踰덊샇??4~64?먮줈 ?낅젰??二쇱꽭??, invalid_body: '?볤?? 1~1,000?먮줈 ?낅젰??二쇱꽭??,
        rate_limited: '?좎떆 ???ㅼ떆 ?쒕룄??二쇱꽭??, wrong_credentials: '?됰꽕???먮뒗 鍮꾨?踰덊샇媛 留욎? ?딆쓬', invalid_parent: '?듦????????녿뒗 ?볤???,
        not_found: '?대? ??젣???볤???, default: '?붿껌??泥섎━?섏? 紐삵뻽?? ?좎떆 ???ㅼ떆 ?쒕룄??二쇱꽭??,
      },
    },
    en: {
      title: 'Comments', nickname: 'Nickname', password: 'Password', body: 'Leave a comment', submit: 'Post', reply: 'Reply', delete: 'Delete',
      cancel: 'Cancel', confirm: 'Confirm', deleted: 'This comment was deleted', empty: 'No comments yet. Be the first to leave one',
      note: 'No sign-up needed: pick a nickname and password. You need both to delete your comment', deletePassword: 'Password used when posting', deleteNickname: 'Nickname used when posting',
      loadError: 'Could not load comments', sending: 'Posting??,
      errors: {
        invalid_nickname: 'Use a 2??0 character nickname (no <, > or @)', reserved_nickname: 'That nickname is reserved',
        invalid_password: 'Use a 4??4 character password', invalid_body: 'Comments must be 1??,000 characters',
        rate_limited: 'Please wait a moment and try again', wrong_credentials: 'Nickname or password is incorrect', invalid_parent: 'You cannot reply to this comment',
        not_found: 'This comment was already deleted', default: 'Something went wrong. Please try again',
      },
    },
  }[lang];
  const dateFormat = new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : 'en-US', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  const storage = { get: (k) => { try { return localStorage.getItem(k) || ''; } catch { return ''; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  let items = [];

  const el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'class') node.className = value;
      else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
      else if (value !== false && value != null) node.setAttribute(key, value === true ? '' : value);
    }
    for (const child of children) if (child != null) node.append(child);
    return node;
  };
  const errorText = (code) => t.errors[code] || t.errors.default;
  async function call(method, body) {
    const response = await fetch(method === 'GET' ? `/api/comments?page=${encodeURIComponent(page)}` : '/api/comments', {
      method, headers: body ? { 'Content-Type': 'application/json' } : undefined, body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'default');
    return data;
  }

  function form({ parentId = null, replyTo = null, onCancel } = {}) {
    const status = el('p', { class: 'comment-status', role: 'status', 'aria-live': 'polite' });
    const nickname = el('input', { name: 'nickname', placeholder: t.nickname, 'aria-label': t.nickname, maxlength: '20', autocomplete: 'nickname', required: true, value: storage.get('fluxscope-nickname') });
    const password = el('input', { name: 'password', type: 'password', placeholder: t.password, 'aria-label': t.password, maxlength: '64', autocomplete: 'new-password', required: true });
    const body = el('textarea', { name: 'body', placeholder: t.body, 'aria-label': t.body, maxlength: '1000', rows: parentId ? '3' : '4', required: true });
    const trap = el('input', { name: 'website', tabindex: '-1', autocomplete: 'off', class: 'comment-trap', 'aria-hidden': 'true' });
    const submit = el('button', { type: 'submit', class: 'comment-submit' }, t.submit);
    const node = el('form', { class: parentId ? 'comment-form comment-form-reply' : 'comment-form' },
      replyTo ? el('p', { class: 'comment-replying' }, el('span', { class: 'comment-mention' }, `@${replyTo.nickname}`)) : null,
      el('div', { class: 'comment-fields' }, nickname, password), body, trap,
      el('div', { class: 'comment-actions' }, onCancel ? el('button', { type: 'button', class: 'comment-link', onclick: onCancel }, t.cancel) : null, submit),
      status);
    node.addEventListener('submit', async (event) => {
      event.preventDefault();
      submit.disabled = true;
      status.textContent = t.sending;
      try {
        const { comment } = await call('POST', { page, parentId, replyToId: replyTo?.id ?? null, nickname: nickname.value, password: password.value, body: body.value, website: trap.value });
        storage.set('fluxscope-nickname', nickname.value.trim());
        items.push(comment);
        render();
      } catch (error) {
        status.textContent = errorText(error.message);
        submit.disabled = false;
      }
    });
    return node;
  }

  function deleteForm(comment, container) {
    const status = el('p', { class: 'comment-status', role: 'status', 'aria-live': 'polite' });
    const nickname = el('input', { name: 'nickname', placeholder: t.deleteNickname, 'aria-label': t.deleteNickname, maxlength: '20', autocomplete: 'nickname', required: true, value: storage.get('fluxscope-nickname') });
    const password = el('input', { name: 'password', type: 'password', placeholder: t.deletePassword, 'aria-label': t.deletePassword, maxlength: '64', autocomplete: 'current-password', required: true });
    const node = el('form', { class: 'comment-delete' }, nickname, password,
      el('button', { type: 'button', class: 'comment-link', onclick: () => node.remove() }, t.cancel),
      el('button', { type: 'submit', class: 'comment-link comment-danger' }, t.confirm), status);
    node.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        await call('DELETE', { id: comment.id, nickname: nickname.value, password: password.value });
        await load();
      } catch (error) { status.textContent = errorText(error.message); }
    });
    container.append(node);
    (nickname.value ? password : nickname).focus();
  }

  function commentNode(comment, thread) {
    const node = el('li', { class: comment.parentId ? 'comment comment-child' : 'comment', id: `comment-${comment.id}` });
    if (comment.deleted) {
      node.append(el('p', { class: 'comment-removed' }, t.deleted));
      return node;
    }
    const tools = el('div', { class: 'comment-tools' });
    tools.append(
      el('button', { type: 'button', class: 'comment-link', onclick: () => openReply(thread, comment) }, t.reply),
      el('button', { type: 'button', class: 'comment-link', onclick: () => { if (!node.querySelector('.comment-delete')) deleteForm(comment, node); } }, t.delete));
    node.append(
      el('div', { class: 'comment-head' }, el('strong', { class: 'comment-author' }, comment.nickname), el('time', { datetime: comment.createdAt }, dateFormat.format(new Date(comment.createdAt)))),
      el('p', { class: 'comment-body' }, comment.mention ? el('span', { class: 'comment-mention' }, `@${comment.mention}`) : null, comment.mention ? ' ' : null, comment.body),
      tools);
    return node;
  }

  function openReply(thread, target) {
    thread.querySelector(':scope > .comment-form-reply')?.remove();
    const replyForm = form({ parentId: Number(thread.dataset.root), replyTo: target, onCancel: () => replyForm.remove() });
    thread.append(replyForm);
    replyForm.querySelector(storage.get('fluxscope-nickname') ? 'input[name="password"]' : 'input[name="nickname"]').focus();
  }

  function render() {
    const roots = items.filter((c) => c.parentId == null);
    const list = el('ol', { class: 'comment-list' });
    for (const rootComment of roots) {
      const thread = el('div', { class: 'comment-thread', 'data-root': String(rootComment.id) });
      const item = commentNode(rootComment, thread);
      const replies = items.filter((c) => c.parentId === rootComment.id);
      if (replies.length) item.append(el('ol', { class: 'comment-replies' }, ...replies.map((reply) => commentNode(reply, thread))));
      item.append(thread);
      list.append(item);
    }
    const visible = items.filter((c) => !c.deleted).length;
    root.replaceChildren(
      el('h2', { class: 'comments-title' }, t.title, el('span', { class: 'comments-count' }, String(visible))),
      // A page with its own intro line (project pages) shows that instead of the sign-up note.
      root.dataset.intro ? el('p', { class: 'comments-intro', style: 'margin:0 0 1rem;font-weight:700' }, root.dataset.intro) : el('p', { class: 'comments-note' }, t.note),
      form(),
      roots.length ? list : el('p', { class: 'comments-empty' }, t.empty));
  }

  async function load() {
    try {
      items = (await call('GET')).comments;
      render();
    } catch {
      root.replaceChildren(el('h2', { class: 'comments-title' }, t.title), el('p', { class: 'comments-empty' }, t.loadError));
    }
  }
  load();
})();
