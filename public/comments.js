// Guest comments for article pages: nickname + password per comment, one reply level, @mention tags.
(() => {
  const root = document.querySelector('[data-comments]');
  if (!root) return;
  const lang = root.dataset.lang === 'en' ? 'en' : 'ko';
  const page = root.dataset.page;
  const t = {
    ko: {
      title: '댓글', nickname: '닉네임', password: '비밀번호', body: '댓글을 남겨주세요', submit: '등록', reply: '답글', delete: '삭제',
      cancel: '취소', confirm: '확인', deleted: '삭제된 댓글입니다', empty: '아직 댓글이 없음. 첫 댓글을 남겨주세요',
      note: '회원가입 없이 닉네임과 비밀번호로 작성함. 비밀번호는 댓글을 지울 때 필요함', deletePassword: '작성할 때 입력한 비밀번호',
      loadError: '댓글을 불러오지 못했음', sending: '등록 중…',
      errors: {
        invalid_nickname: '닉네임은 2~20자로 입력해 주세요 (<, >, @ 제외)', reserved_nickname: '사용할 수 없는 닉네임임',
        invalid_password: '비밀번호는 4~64자로 입력해 주세요', invalid_body: '댓글은 1~1,000자로 입력해 주세요',
        rate_limited: '잠시 후 다시 시도해 주세요', wrong_password: '비밀번호가 맞지 않음', invalid_parent: '답글을 달 수 없는 댓글임',
        not_found: '이미 삭제된 댓글임', default: '요청을 처리하지 못했음. 잠시 후 다시 시도해 주세요',
      },
    },
    en: {
      title: 'Comments', nickname: 'Nickname', password: 'Password', body: 'Leave a comment', submit: 'Post', reply: 'Reply', delete: 'Delete',
      cancel: 'Cancel', confirm: 'Confirm', deleted: 'This comment was deleted', empty: 'No comments yet. Be the first to leave one',
      note: 'No sign-up needed: pick a nickname and password. You need the password to delete your comment', deletePassword: 'Password used when posting',
      loadError: 'Could not load comments', sending: 'Posting…',
      errors: {
        invalid_nickname: 'Use a 2–20 character nickname (no <, > or @)', reserved_nickname: 'That nickname is reserved',
        invalid_password: 'Use a 4–64 character password', invalid_body: 'Comments must be 1–1,000 characters',
        rate_limited: 'Please wait a moment and try again', wrong_password: 'Wrong password', invalid_parent: 'You cannot reply to this comment',
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
    const password = el('input', { type: 'password', placeholder: t.deletePassword, 'aria-label': t.deletePassword, maxlength: '64', required: true });
    const node = el('form', { class: 'comment-delete' }, password,
      el('button', { type: 'button', class: 'comment-link', onclick: () => node.remove() }, t.cancel),
      el('button', { type: 'submit', class: 'comment-link comment-danger' }, t.confirm), status);
    node.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        await call('DELETE', { id: comment.id, password: password.value });
        await load();
      } catch (error) { status.textContent = errorText(error.message); }
    });
    container.append(node);
    password.focus();
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
      el('p', { class: 'comments-note' }, t.note),
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
