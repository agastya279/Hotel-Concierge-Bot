#!/bin/sh
set -eu

: "${CLERK_PUBLISHABLE_KEY:?CLERK_PUBLISHABLE_KEY must be configured}"

cat > /usr/share/nginx/html/config.js <<EOF
// Generated at container startup. Only the public Clerk publishable key is exposed here.
window.__SEED_CONFIG__ = {
  apiBaseUrl: "",
  clerkPublishableKey: "${CLERK_PUBLISHABLE_KEY}",
  clerkProxyUrl: "",
};
EOF
