const TABLES = {
  discussion_post: 'exchange_posts',
  comment: 'exchange_comments',
  spark: 'sparks',
  prompt: 'prompt_bank',
  pulse_vote: 'pulse_votes',
  feature_reflection: 'feature_reflections',
  copy_edit: 'copy_edit_notes',
  starter_response: 'starter_responses',
  event: 'interaction_events'
};

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

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.end(JSON.stringify(payload));
}

function cleanText(value, fallback = '') {
  return String(value ?? fallback).trim();
}

function lensId(value, fallback = 0) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.max(0, Math.min(7, n));
}

function approvedFilter(limit = 100) {
  return `status=eq.approved&order=created_at.desc&limit=${limit}`;
}

async function bootstrap() {
  const [posts, sparks, prompts, pulse] = await Promise.all([
    supabase(`exchange_posts?select=*&${approvedFilter(100)}`),
    supabase(`sparks?select=*&${approvedFilter(100)}`),
    supabase(`prompt_bank?select=*&${approvedFilter(100)}`),
    supabase('pulse_votes?select=lens_id')
  ]);

  const pulseVotes = [0, 0, 0, 0, 0, 0, 0, 0];
  for (const vote of pulse || []) {
    if (vote.lens_id >= 1 && vote.lens_id <= 7) pulseVotes[vote.lens_id] += 1;
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
      likes: p.likes_seed || 0,
      liked: false,
      time: 'from the exchange',
      comments: []
    })),
    sparks: sparks.map((s) => ({
      id: s.id,
      remoteId: s.id,
      text: s.text,
      ap: s.lens_id || 0,
      likes: s.likes_seed || 0,
      liked: false,
      time: 'from the exchange'
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
    pulseVotes
  };
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
      body: cleanText(payload.body)
    });
  }

  if (type === 'comment') {
    return insert(TABLES.comment, {
      post_id: payload.post_id && String(payload.post_id).includes('-') ? payload.post_id : null,
      target_seed_id: cleanText(payload.target_seed_id || payload.post_id),
      author: cleanText(payload.author, 'Anonymous'),
      role: cleanText(payload.role, 'Exchange participant'),
      body: cleanText(payload.body)
    });
  }

  if (type === 'spark') {
    return insert(TABLES.spark, {
      text: cleanText(payload.text),
      lens_id: lensId(payload.lens_id)
    });
  }

  if (type === 'prompt') {
    return insert(TABLES.prompt, {
      question: cleanText(payload.question),
      context: cleanText(payload.context),
      lens_id: lensId(payload.lens_id),
      role: cleanText(payload.role)
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
      added_features: Array.isArray(payload.added_features) ? payload.added_features : []
    });
  }

  if (type === 'copy_edit') {
    return insert(TABLES.copy_edit, {
      section: cleanText(payload.section, 'Other'),
      label: cleanText(payload.label),
      current_wording: cleanText(payload.current_wording),
      replacement_wording: cleanText(payload.replacement_wording)
    });
  }

  if (type === 'starter_response') {
    return insert(TABLES.starter_response, {
      starter_index: Number.parseInt(payload.starter_index, 10) || 0,
      response: cleanText(payload.response)
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
}
