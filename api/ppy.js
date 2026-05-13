const TABLES = {
  discussion_post: 'exchange_posts',
  comment: 'exchange_comments',
  prompt: 'prompt_bank',
  pulse_vote: 'pulse_votes',
  feature_reflection: 'feature_reflections',
  copy_edit: 'copy_edit_notes',
  starter_response: 'starter_responses',
  onboarding_response: 'onboarding_responses',
  purpose_definition: 'purpose_definitions',
  lens_nomination: 'lens_nominations',
  event: 'interaction_events'
};

const ADMIN_TABLES = {
  posts: {
    table: 'exchange_posts',
    status: true,
    select: 'id,created_at,status,author,role,category,lens_id,title,body,likes_seed'
  },
  comments: {
    table: 'exchange_comments',
    status: true,
    select: 'id,created_at,status,post_id,target_seed_id,author,role,body'
  },
  prompts: {
    table: 'prompt_bank',
    status: true,
    select: 'id,created_at,status,question,context,lens_id,role,uses_seed'
  },
  features: {
    table: 'feature_reflections',
    status: true,
    select: 'id,created_at,status,feature_order,reflection,added_features'
  },
  copy_edits: {
    table: 'copy_edit_notes',
    status: true,
    select: 'id,created_at,status,section,label,current_wording,replacement_wording'
  },
  starters: {
    table: 'starter_responses',
    status: true,
    select: 'id,created_at,status,starter_index,response'
  },
  onboarding: {
    table: 'onboarding_responses',
    status: true,
    select: 'id,created_at,status,roles,youth_groups,purpose_response'
  },
  purpose_definitions: {
    table: 'purpose_definitions',
    status: true,
    select: 'id,created_at,status,definition'
  },
  nominations: {
    table: 'lens_nominations',
    status: true,
    select: 'id,created_at,status,name,definition,role'
  },
  pulse: {
    table: 'pulse_votes',
    status: false,
    select: 'id,created_at,prompt_key,lens_id'
  },
  events: {
    table: 'interaction_events',
    status: false,
    select: 'id,created_at,event_type,target_type,target_id,lens_id,payload'
  }
};

const MODERATABLE_STATUSES = new Set(['pending', 'approved', 'rejected', 'archived']);

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    const err = new Error('Supabase environment variables are not configured.');
    err.statusCode = 503;
    throw err;
  }
  return { url: url.replace(/\/$/, ''), key };
}

function adminToken() {
  const token = process.env.ADMIN_TOKEN;
  if (!token) {
    const err = new Error('Admin token is not configured.');
    err.statusCode = 503;
    throw err;
  }
  return token;
}

function requireAdmin(req) {
  const expected = adminToken();
  const header = req.headers.authorization || '';
  const provided = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!provided || provided !== expected) {
    const err = new Error('Admin authorization required.');
    err.statusCode = 401;
    throw err;
  }
}

async function supabase(path, options = {}) {
  const { url, key } = config();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      'content-type': 'application/json',
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const err = new Error(data?.message || `Supabase request failed: ${response.status}`);
    err.statusCode = response.status;
    err.details = data;
    throw err;
  }
  return data;
}

async function insert(table, row) {
  return supabase(table, {
    method: 'POST',
    headers: { prefer: 'return=representation' },
    body: JSON.stringify(row)
  });
}

async function update(table, id, row) {
  return supabase(`${table}?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { prefer: 'return=representation' },
    body: JSON.stringify(row)
  });
}

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(payload));
}

function sendText(res, status, text, contentType = 'text/plain; charset=utf-8') {
  res.statusCode = status;
  res.setHeader('content-type', contentType);
  res.setHeader('cache-control', 'no-store');
  res.end(text);
}

function cleanText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function lensId(value, fallback = 0) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(0, Math.min(8, n));
}

function approvedFilter(limit = 100) {
  return `status=eq.approved&order=created_at.desc&limit=${limit}`;
}

async function bootstrap() {
  const [posts, comments, prompts, pulse, likeEvents, reactionEvents] = await Promise.all([
    supabase(`exchange_posts?select=*&${approvedFilter(100)}`),
    supabase(`exchange_comments?select=*&${approvedFilter(250)}`),
    supabase(`prompt_bank?select=*&${approvedFilter(100)}`),
    supabase('pulse_votes?select=lens_id'),
    supabase('interaction_events?select=event_type,target_id&event_type=eq.post_like&limit=5000'),
    supabase('interaction_events?select=target_id,payload&event_type=eq.lens_reaction&limit=10000')
  ]);

  const pulseVotes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (const vote of pulse || []) {
    if (vote.lens_id >= 1 && vote.lens_id <= 8) pulseVotes[vote.lens_id] += 1;
  }

  // Tally accumulated likes from interaction_events
  const postLikes = {};
  for (const ev of likeEvents || []) {
    if (ev.event_type === 'post_like' && ev.target_id) {
      postLikes[ev.target_id] = (postLikes[ev.target_id] || 0) + 1;
    }
  }

  // Tally lens reactions: { '1': { resonates: 5, missing: 2 }, ... }
  const lensReactions = {};
  for (const ev of reactionEvents || []) {
    const lens = ev.target_id;
    const reaction = ev.payload && ev.payload.reaction;
    if (lens && reaction) {
      if (!lensReactions[lens]) lensReactions[lens] = {};
      lensReactions[lens][reaction] = (lensReactions[lens][reaction] || 0) + 1;
    }
  }

  return {
    posts: posts.map((p) => ({
      id: p.id,
      remoteId: p.id,
      author: p.author,
      role: p.role,
      cat: p.category,
      ap: p.lens_id || 0,
      title: p.title,
      body: p.body,
      likes: (p.likes_seed || 0) + (postLikes[p.id] || 0),
      liked: false,
      time: 'from the exchange',
      comments: comments
        .filter((c) => c.post_id === p.id)
        .map((c) => ({
          a: c.author,
          r: c.role,
          t: c.body,
          c: '#3B7A8F'
        }))
    })),
    prompts: prompts.map((p) => ({
      id: p.id,
      remoteId: p.id,
      q: p.question,
      ctx: p.context || '',
      ap: p.lens_id || 0,
      role: p.role || '',
      uses: p.uses_seed || 0,
      used: false
    })),
    pulseVotes,
    lensReactions
  };
}

function tableMeta(name) {
  const meta = ADMIN_TABLES[name];
  if (!meta) {
    const err = new Error('Unknown admin table.');
    err.statusCode = 400;
    throw err;
  }
  return meta;
}

function parseLimit(value, fallback = 200) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(1, Math.min(1000, n));
}

function csvEscape(value) {
  if (value === null || value === undefined) return '';
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function rowsToCsv(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  return [
    headers.map(csvEscape).join(','),
    ...rows.map((row) => headers.map((key) => csvEscape(row[key])).join(','))
  ].join('\n');
}

async function listAdminRows(query) {
  const type = cleanText(query.type, 'posts');
  const status = cleanText(query.status, 'pending');
  const limit = parseLimit(query.limit);
  const meta = tableMeta(type);
  const params = [
    `select=${meta.select}`,
    'order=created_at.desc',
    `limit=${limit}`
  ];

  if (meta.status && status !== 'all') {
    if (!MODERATABLE_STATUSES.has(status)) {
      const err = new Error('Unknown status.');
      err.statusCode = 400;
      throw err;
    }
    params.push(`status=eq.${encodeURIComponent(status)}`);
  }

  const rows = await supabase(`${meta.table}?${params.join('&')}`);
  return { type, status: meta.status ? status : 'all', rows };
}

async function exportAdminRows(query) {
  const type = cleanText(query.type, 'posts');
  const status = cleanText(query.status, 'all');
  const meta = tableMeta(type);
  const params = [
    `select=${meta.select}`,
    'order=created_at.desc',
    'limit=1000'
  ];

  if (meta.status && status !== 'all') {
    if (!MODERATABLE_STATUSES.has(status)) {
      const err = new Error('Unknown status.');
      err.statusCode = 400;
      throw err;
    }
    params.push(`status=eq.${encodeURIComponent(status)}`);
  }

  const rows = await supabase(`${meta.table}?${params.join('&')}`);
  return rowsToCsv(rows);
}

async function moderate(body) {
  const type = cleanText(body.type);
  const id = cleanText(body.id);
  const status = cleanText(body.status);
  const meta = tableMeta(type);

  if (!meta.status) {
    const err = new Error('This table does not support moderation status.');
    err.statusCode = 400;
    throw err;
  }
  if (!id || !MODERATABLE_STATUSES.has(status)) {
    const err = new Error('A valid id and status are required.');
    err.statusCode = 400;
    throw err;
  }

  return update(meta.table, id, { status });
}

async function record(body) {
  const type = cleanText(body.type);
  const payload = body.payload || {};

  if (type === 'discussion_post') {
    return insert(TABLES.discussion_post, {
      author: cleanText(payload.author, 'Anonymous'),
      role: cleanText(payload.role, 'Exchange participant'),
      category: cleanText(payload.category, 'question'),
      lens_id: lensId(payload.lens_id),
      title: cleanText(payload.title),
      body: cleanText(payload.body),
      status: 'approved'
    });
  }

  if (type === 'comment') {
    return insert(TABLES.comment, {
      post_id: payload.post_id && String(payload.post_id).includes('-') ? payload.post_id : null,
      target_seed_id: cleanText(payload.target_seed_id || payload.post_id),
      author: cleanText(payload.author, 'Anonymous'),
      role: cleanText(payload.role, 'Exchange participant'),
      body: cleanText(payload.body),
      status: 'approved'
    });
  }

  if (type === 'prompt') {
    return insert(TABLES.prompt, {
      question: cleanText(payload.question),
      context: cleanText(payload.context),
      lens_id: lensId(payload.lens_id),
      role: cleanText(payload.role),
      status: 'approved'
    });
  }

  if (type === 'pulse_vote') {
    return insert(TABLES.pulse_vote, {
      prompt_key: cleanText(payload.prompt_key, 'current_interest'),
      lens_id: lensId(payload.lens_id, 1)
    });
  }

  if (type === 'feature_reflection') {
    return insert(TABLES.feature_reflection, {
      feature_order: Array.isArray(payload.feature_order) ? payload.feature_order.map(String) : [],
      reflection: cleanText(payload.reflection),
      added_features: Array.isArray(payload.added_features) ? payload.added_features : [],
      status: 'approved'
    });
  }

  if (type === 'copy_edit') {
    return insert(TABLES.copy_edit, {
      section: cleanText(payload.section, 'Other'),
      label: cleanText(payload.label),
      current_wording: cleanText(payload.current_wording),
      replacement_wording: cleanText(payload.replacement_wording),
      status: 'approved'
    });
  }

  if (type === 'starter_response') {
    return insert(TABLES.starter_response, {
      starter_index: Number.parseInt(payload.starter_index, 10) || 0,
      response: cleanText(payload.response),
      status: 'approved'
    });
  }

  if (type === 'onboarding_response') {
    return insert(TABLES.onboarding_response, {
      roles: Array.isArray(payload.roles) ? payload.roles.map((role) => cleanText(role)).filter(Boolean) : [],
      youth_groups: Array.isArray(payload.youth_groups) ? payload.youth_groups.map((group) => cleanText(group)).filter(Boolean) : [],
      purpose_response: cleanText(payload.purpose_response),
      status: 'approved'
    });
  }

  if (type === 'purpose_definition') {
    return insert(TABLES.purpose_definition, {
      definition: cleanText(payload.definition),
      status: 'approved'
    });
  }

  if (type === 'lens_nomination') {
    const nomination = payload.payload || payload;
    return insert(TABLES.lens_nomination, {
      name: cleanText(nomination.name || payload.target_id),
      definition: cleanText(nomination.definition),
      role: cleanText(nomination.role),
      status: 'approved'
    });
  }

  return insert(TABLES.event, {
    event_type: type || 'unknown',
    target_type: cleanText(payload.target_type),
    target_id: cleanText(payload.target_id),
    lens_id: lensId(payload.lens_id),
    payload
  });
}

module.exports = async function handler(req, res) {
  try {
    const url = new URL(req.url, 'http://localhost');

    if (url.searchParams.get('admin') === '1') {
      requireAdmin(req);

      if (req.method === 'GET') {
        const query = Object.fromEntries(url.searchParams.entries());
        if (query.export === '1') {
          const csv = await exportAdminRows(query);
          res.setHeader('content-disposition', `attachment; filename="ppy-${query.type || 'posts'}-${query.status || 'all'}.csv"`);
          return sendText(res, 200, csv, 'text/csv; charset=utf-8');
        }
        return send(res, 200, await listAdminRows(query));
      }

      if (req.method === 'PATCH' || req.method === 'POST') {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const data = await moderate(body || {});
        return send(res, 200, { ok: true, data });
      }

      res.setHeader('allow', 'GET, PATCH, POST');
      return send(res, 405, { ok: false, error: 'Method not allowed' });
    }

    if (req.method === 'GET') {
      return send(res, 200, await bootstrap());
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const data = await record(body || {});
      return send(res, 200, { ok: true, data });
    }

    res.setHeader('allow', 'GET, POST');
    return send(res, 405, { ok: false, error: 'Method not allowed' });
  } catch (error) {
    return send(res, error.statusCode || 500, {
      ok: false,
      error: error.message,
      details: error.details
    });
  }
};
