export const MODELS = [
  { id: 'nvidia/nemotron-3.5-lightning:free', name: 'Nemotron Lightning', hint: '高速・軽量' },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', name: 'Nemotron Ultra', hint: '高難度推論' },
  { id: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free', name: 'Nemotron Nano Omni', hint: 'マルチモーダル推論' },
  { id: 'google/gemma-4-26b-a4b-it:free', name: 'Gemma', hint: '汎用' },
  { id: 'nvidia/nemotron-3-super-120b-a12b:free', name: 'Nemotron Super', hint: '汎用・高性能' },
];

export const DEFAULT_SETTINGS = {
  model: MODELS[0].id,
  displayName: 'Luma',
  customInstructions: '',
  accent: '#111111',
  theme: 'system',
  font: 'system',
  webSearch: false,
};

export function uid(prefix = 'id') {
  return `${prefix}_${crypto.randomUUID()}`;
}
