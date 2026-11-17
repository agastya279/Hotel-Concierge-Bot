---
name: Groq speech model terms
description: Groq Orpheus text-to-speech may be gated by organization terms acceptance.
---

Groq Orpheus text-to-speech can return `model_terms_required` until an organization admin accepts the selected model's terms in Groq Console. This can block speech playback even when Groq chat and recommendations already work.

**Why:** A live Aria speech check encountered this provider-side gate after the replacement Groq key was configured.

**How to apply:** Keep the error actionable by returning the selected model's terms-acceptance URL. After the organization admin accepts, retest speech generation; do not silently switch providers.
