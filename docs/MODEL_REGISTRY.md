# LUMA AI Model Registry

The UI must use friendly display names. Raw provider model IDs belong in the registry, not in presentation components.

## Initial registry

| Display name | Provider | Model ID | Initial status |
|---|---|---|---|
| Nemotron Lightning | NVIDIA / OpenRouter | `nvidia/nemotron-3.5-lightning:free` | enabled |
| Nemotron Ultra | NVIDIA / OpenRouter | `nvidia/nemotron-3-ultra-550b-a55b:free` | enabled |
| Nemotron Nano Omni | NVIDIA / OpenRouter | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | enabled |
| Gemma | Google / OpenRouter | `google/gemma-4-26b-a4b-it:free` | enabled |
| Nemotron Super | NVIDIA / OpenRouter | `nvidia/nemotron-3-super-120b-a12b:free` | enabled |

These IDs are the initial planned configuration supplied for LUMA. Availability, capabilities, limits, and provider behavior must be verified at implementation time and may change.

## Registry shape

```ts
interface ModelDefinition {
  id: string;
  displayName: string;
  provider: string;
  description: string;
  capabilities: Array<
    | "text"
    | "vision"
    | "file"
    | "reasoning"
    | "search-context"
  >;
  availability: "enabled" | "disabled";
}
```

## Selection behavior

- Persist the selected model ID with each user message.
- Persist the model used for each assistant response.
- Switching models affects future requests and does not rewrite historical messages.
- The selected model should be visible in the composer.
- If a model becomes unavailable, preserve historical model metadata and show an actionable unavailable state.

## Future model management

The registry should make it easy to:

- Add a model
- Disable a model
- Rename a display label
- Update capabilities
- Change provider metadata
- Replace a provider model ID

Do not couple the application to a fixed five-model list.

## Model auto-selection

A future `Auto` mode may choose a model based on task type, but it is not required for the first release. Manual model switching is the defining LUMA feature and must remain explicit and reliable.
