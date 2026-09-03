import { MODELS } from './config.js';

const KEY = 'luma.openrouter.key';
const SETTINGS = 'luma.settings';

export function getApiKey() { return localStorage.getItem(KEY) || ''; }
export function setApiKey(value) { value ? localStorage.setItem(KEY, value) : localStorage.removeItem(KEY); }
export function loadSettings(defaults) {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(SETTINGS) || '{}') }; }
  catch { return { ...defaults }; }
}
export function saveSettings(settings) { localStorage.setItem(SETTINGS, JSON.stringify(settings)); }

function systemPrompt(settings) {
  return [
    'You are Luma, a helpful AI assistant. Answer in Japanese unless the user requests another language.',
    'Use Markdown when it improves readability. When providing HTML or SVG, put complete code in a fenced code block.',
    settings.customInstructions?.trim(),
  ].filter(Boolean).join('\n\n');
}

export async function askOpenRouter({ messages, model, settings, attachments = [] }) {
  const key = getApiKey();
  if (!key) throw new Error('OpenRouter APIキーを設定してください。設定 → API から入力できます。');

  const last = messages[messages.length - 1];
  const multimodal = [];
  for (const item of attachments) {
    if (item.kind === 'image' && item.dataUrl) {
      multimodal.push({ type: 'image_url', image_url: { url: item.dataUrl } });
    }
    if (item.extractedText) {
      multimodal.push({ type: 'text', text: `\n\n【添付ファイル: ${item.name}】\n${item.extractedText}` });
    }
  }
  multimodal.push({ type: 'text', text: last?.content || '' });

  const payload = {
    model: model || MODELS[0].id,
    messages: [
      { role: 'system', content: systemPrompt(settings) },
      ...messages.slice(0, -1),
      { role: 'user', content: multimodal.length === 1 ? multimodal[0].text : multimodal },
    ],
    temperature: 0.7,
  };

  if (settings.webSearch) payload.plugins = [{ id: 'web', engine: 'native' }];

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': location.origin,
      'X-Title': 'Luma',
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || `OpenRouter error (${res.status})`);
  return data;
}

export function extractText(response) {
  const content = response?.choices?.[0]?.message?.content;
  if (Array.isArray(content)) return content.map(x => x?.text || '').join('');
  return content || '回答を取得できませんでした。';
}
