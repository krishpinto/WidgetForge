/**
 * widget.js — Embeddable AI Chat Widget
 * ─────────────────────────────────────
 * Drop-in floating chat widget. Zero dependencies. Vanilla JS.
 * Uses Shadow DOM so the host site's CSS can NEVER touch this widget.
 *
 * V2 mode (secure — recommended):
 *   <script
 *     src="https://yourapp.vercel.app/widget.js"
 *     data-bot-id="bot_abc123">
 *   </script>
 *   Bot config (key, prompt, model) is looked up from the DB by botId.
 *   Nothing sensitive is exposed in the HTML.
 *
 * V1 mode (legacy — still supported):
 *   <script
 *     src="https://yourapp.vercel.app/widget.js"
 *     data-provider="gemini"
 *     data-key="sk-xxx"
 *     data-model="gemini-2.5-flash"
 *     data-prompt="You are a helpful assistant..."
 *     data-api-endpoint="https://yourapp.vercel.app/api/chat">
 *   </script>
 */

(function () {
  "use strict";

  // ─────────────────────────────────────────────────────────────
  // 1. READ CONFIG FROM THE SCRIPT TAG
  //    We find the <script> tag that loaded THIS file, then read
  //    its data-* attributes. This is how the host site passes
  //    config without any JS on their side.
  // ─────────────────────────────────────────────────────────────

  const scriptTag =
    document.currentScript ||
    (function () {
      // Fallback for async/defer — find our script tag by src
      const scripts = document.querySelectorAll("script[src*='widget.js']");
      return scripts[scripts.length - 1];
    })();

  // ── Detect V2 vs V1 mode ──
  // V2: script tag has data-bot-id → secure mode, config lives in DB
  // V1: script tag has data-key → legacy mode, config in attributes
  const botId = scriptTag?.getAttribute("data-bot-id") || "";
  const isV2 = !!botId;

  const config = {
    // V2 only
    botId,

    // V1 only (ignored in V2 mode)
    provider: scriptTag?.getAttribute("data-provider") || "gemini",
    key: scriptTag?.getAttribute("data-key") || "",
    model: scriptTag?.getAttribute("data-model") || "gemini-2.5-flash",
    prompt: scriptTag?.getAttribute("data-prompt") || "You are a helpful assistant.",

    // Shared
    primaryColor: scriptTag?.getAttribute("data-primary-color") || "#6366f1",
    apiEndpoint:
      scriptTag?.getAttribute("data-api-endpoint") ||
      (scriptTag && scriptTag.src ? new URL(scriptTag.src).origin : "http://localhost:3000") + "/api/chat",
    title: scriptTag?.getAttribute("data-title") || "AI Assistant",
  };

  // ─────────────────────────────────────────────────────────────
  // 2. CREATE THE HOST CONTAINER + SHADOW DOM
  //    We inject a <div> into the page's <body>.
  //    Then we attach a Shadow Root to it.
  //    Everything inside the shadow is completely isolated —
  //    the host site's CSS resets, font families, z-index wars —
  //    none of that bleeds in here.
  // ─────────────────────────────────────────────────────────────

  const hostContainer = document.createElement("div");
  hostContainer.id = "ai-widget-host";

  // Minimal host styles — just positioning, no visual styling
  // (visual styling happens INSIDE the shadow)
  hostContainer.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483647; /* Max z-index — always on top */
    font-family: sans-serif;
  `;

  let shadow;
  try {
    shadow = hostContainer.attachShadow({ mode: "open" });
  } catch (e) {
    // Shadow DOM not supported (very rare, IE11 only basically)
    console.warn(
      "[AI Widget] Shadow DOM unavailable. Host site styles may affect the widget."
    );
    shadow = hostContainer; // Fallback: render directly (styles may leak)
  }

  document.body.appendChild(hostContainer);

  // ─────────────────────────────────────────────────────────────
  // 3. STYLES (injected into shadow — fully isolated)
  //    These styles ONLY apply inside the shadow DOM.
  //    We use CSS custom properties so the primary color from
  //    config can be injected dynamically.
  // ─────────────────────────────────────────────────────────────

  const styles = document.createElement("style");
  styles.textContent = `
    /* ── Reset (inside shadow only) ── */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    /* ── CSS Variables ── */
    :host, .widget-root {
      --primary: ${config.primaryColor};
      --primary-glow: ${config.primaryColor}33;
      --bg-base: #0d0d0f;
      --bg-surface: #141416;
      --bg-elevated: #1c1c1f;
      --bg-hover: #222226;
      --border: #2a2a2f;
      --border-subtle: #1e1e22;
      --text-primary: #f0f0f2;
      --text-secondary: #8b8b96;
      --text-muted: #4a4a55;
      --user-bubble: #1e1e2e;
      --bot-bubble: #141416;
      --radius-sm: 8px;
      --radius-md: 14px;
      --radius-lg: 20px;
      --radius-full: 9999px;
      --font: -apple-system, 'SF Pro Text', 'Segoe UI', system-ui, sans-serif;
      --font-mono: 'SF Mono', 'Fira Code', monospace;
      --shadow-lg: 0 24px 64px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4);
      --shadow-btn: 0 4px 20px rgba(0,0,0,0.5);
      --transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* ── Floating Toggle Button ── */
    .widget-toggle {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-full);
      background: var(--primary);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px var(--primary-glow), var(--shadow-btn);
      transition: transform var(--transition), box-shadow var(--transition);
      position: relative;
      outline: none;
    }

    .widget-toggle:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px var(--primary-glow), var(--shadow-btn);
    }

    .widget-toggle:active {
      transform: scale(0.96);
    }

    /* Pulse ring animation on the button */
    .widget-toggle::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: var(--radius-full);
      background: var(--primary);
      opacity: 0.15;
      animation: pulse-ring 2.5s ease-out infinite;
    }

    @keyframes pulse-ring {
      0%   { transform: scale(1);   opacity: 0.2; }
      60%  { transform: scale(1.4); opacity: 0;   }
      100% { transform: scale(1.4); opacity: 0;   }
    }

    .toggle-icon {
      width: 22px;
      height: 22px;
      fill: #fff;
      transition: opacity 0.15s ease, transform 0.2s ease;
      position: absolute;
    }

    .toggle-icon.close-icon {
      opacity: 0;
      transform: rotate(-45deg);
    }

    .widget-root.open .toggle-icon.open-icon {
      opacity: 0;
      transform: rotate(45deg);
    }

    .widget-root.open .toggle-icon.close-icon {
      opacity: 1;
      transform: rotate(0deg);
    }

    /* ── Chat Panel ── */
    .chat-panel {
      position: absolute;
      bottom: 68px; /* sits above the toggle button */
      right: 0;
      width: 380px;
      height: 540px;
      background: var(--bg-base);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: var(--font);
      
      /* Hidden state */
      opacity: 0;
      transform: translateY(12px) scale(0.97);
      pointer-events: none;
      transition: opacity var(--transition), transform var(--transition);
    }

    .widget-root.open .chat-panel {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    /* ── Panel Header ── */
    .panel-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 18px;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      flex-shrink: 0;
    }

    .header-avatar {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .header-avatar svg {
      width: 16px;
      height: 16px;
      fill: #fff;
    }

    .header-info {
      flex: 1;
    }

    .header-title {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }

    .header-status {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 1px;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #22c55e;
      animation: blink 2s ease-in-out infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }

    .status-text {
      font-size: 11px;
      color: var(--text-muted);
    }

    .model-badge {
      font-size: 10px;
      font-family: var(--font-mono);
      color: var(--text-muted);
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      padding: 2px 7px;
      border-radius: var(--radius-sm);
      letter-spacing: 0.02em;
    }

    /* ── Messages Area ── */
    .messages-area {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    }

    /* Custom scrollbar — only visible inside shadow */
    .messages-area::-webkit-scrollbar {
      width: 4px;
    }
    .messages-area::-webkit-scrollbar-track {
      background: transparent;
    }
    .messages-area::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 4px;
    }

    /* ── Message Bubbles ── */
    .message {
      display: flex;
      flex-direction: column;
      max-width: 88%;
      animation: msg-in 0.2s ease;
    }

    @keyframes msg-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .message.user {
      align-self: flex-end;
      align-items: flex-end;
    }

    .message.bot {
      align-self: flex-start;
      align-items: flex-start;
    }

    .bubble {
      padding: 9px 13px;
      border-radius: var(--radius-md);
      font-size: 13.5px;
      line-height: 1.55;
      color: var(--text-primary);
      word-break: break-word;
    }

    .message.user .bubble {
      background: var(--primary);
      border-bottom-right-radius: 4px;
      color: #fff;
    }

    .message.bot .bubble {
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-bottom-left-radius: 4px;
    }

    .message-time {
      font-size: 10px;
      color: var(--text-muted);
      margin-top: 3px;
      padding: 0 4px;
    }

    /* ── Typing Indicator ── */
    .typing-indicator {
      display: none;
      align-self: flex-start;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-md);
      border-bottom-left-radius: 4px;
      padding: 10px 14px;
      gap: 4px;
      align-items: center;
    }

    .typing-indicator.visible {
      display: flex;
    }

    .typing-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--text-muted);
      animation: typing-bounce 1.2s ease-in-out infinite;
    }

    .typing-dot:nth-child(2) { animation-delay: 0.15s; }
    .typing-dot:nth-child(3) { animation-delay: 0.30s; }

    @keyframes typing-bounce {
      0%, 80%, 100% { transform: translateY(0);   opacity: 0.4; }
      40%            { transform: translateY(-5px); opacity: 1;   }
    }

    /* ── Empty / Welcome State ── */
    .welcome-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
      gap: 12px;
      color: var(--text-secondary);
    }

    .welcome-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }

    .welcome-icon svg {
      width: 20px;
      height: 20px;
      fill: var(--primary);
    }

    .welcome-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .welcome-sub {
      font-size: 12.5px;
      color: var(--text-secondary);
      line-height: 1.5;
      max-width: 220px;
    }

    /* ── Input Area ── */
    .input-area {
      padding: 12px 14px;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      display: flex;
      align-items: flex-end;
      gap: 8px;
      flex-shrink: 0;
    }

    .chat-input {
      flex: 1;
      background: var(--bg-elevated);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 9px 12px;
      font-size: 13.5px;
      font-family: var(--font);
      color: var(--text-primary);
      resize: none;
      outline: none;
      min-height: 38px;
      max-height: 120px;
      line-height: 1.5;
      transition: border-color 0.15s ease;
    }

    .chat-input::placeholder {
      color: var(--text-muted);
    }

    .chat-input:focus {
      border-color: var(--primary);
    }

    .send-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      background: var(--primary);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.15s ease, transform var(--transition);
      outline: none;
    }

    .send-btn:hover {
      opacity: 0.85;
    }

    .send-btn:active {
      transform: scale(0.93);
    }

    .send-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
      transform: none;
    }

    .send-btn svg {
      width: 15px;
      height: 15px;
      fill: #fff;
    }

    /* ── Branding Footer ── */
    .branding {
      text-align: center;
      padding: 6px;
      font-size: 10px;
      color: var(--text-muted);
      background: var(--bg-surface);
      border-top: 1px solid var(--border-subtle);
    }

    .branding a {
      color: var(--text-muted);
      text-decoration: none;
    }

    .branding a:hover {
      color: var(--text-secondary);
    }

    /* ── Mobile Responsive ── */
    @media (max-width: 440px) {
      .chat-panel {
        width: calc(100vw - 24px);
        right: -8px;
        height: 480px;
      }
    }
  `;

  // ─────────────────────────────────────────────────────────────
  // 4. BUILD THE HTML STRUCTURE (injected into shadow)
  //    All the markup lives here. We create it as a string and
  //    set innerHTML on a wrapper div inside the shadow.
  // ─────────────────────────────────────────────────────────────

  const root = document.createElement("div");
  root.className = "widget-root";

  root.innerHTML = `
    <!-- Floating Chat Panel -->
    <div class="chat-panel" role="dialog" aria-label="AI Chat Widget" aria-modal="true">
      
      <!-- Header -->
      <div class="panel-header">
        <div class="header-avatar">
          <!-- Sparkle / AI icon -->
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L9.5 9.5H2L8 13.5L5.5 21L12 17L18.5 21L16 13.5L22 9.5H14.5L12 2Z"/>
          </svg>
        </div>
        <div class="header-info">
          <div class="header-title">${config.title}</div>
          <div class="header-status">
            <span class="status-dot"></span>
            <span class="status-text">Online</span>
          </div>
        </div>
        <span class="model-badge">${config.model}</span>
      </div>

      <!-- Messages -->
      <div class="messages-area" id="w-messages">

        <!-- Welcome state — shown when no messages yet -->
        <div class="welcome-state" id="w-welcome">
          <div class="welcome-icon">
            <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
          </div>
          <div class="welcome-title">How can I help?</div>
          <div class="welcome-sub">Ask me anything. I'm here and ready.</div>
        </div>

        <!-- Typing indicator — shown while bot is thinking -->
        <div class="typing-indicator" id="w-typing">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>

      <!-- Input Row -->
      <div class="input-area">
        <textarea
          class="chat-input"
          id="w-input"
          placeholder="Message..."
          rows="1"
          aria-label="Type a message"
        ></textarea>
        <button class="send-btn" id="w-send" aria-label="Send message">
          <!-- Send arrow icon -->
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>

      <!-- Tiny branding footer -->
      <div class="branding">
        Powered by <a href="#" target="_blank">YourApp</a>
      </div>
    </div>

    <!-- Floating Toggle Button (bottom-right) -->
    <button class="widget-toggle" id="w-toggle" aria-label="Toggle chat">
      <!-- Chat bubble icon (open state) -->
      <svg class="toggle-icon open-icon" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
      <!-- Close X icon (close state) -->
      <svg class="toggle-icon close-icon" viewBox="0 0 24 24">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>
  `;

  // ─────────────────────────────────────────────────────────────
  // 5. ATTACH STYLES + ROOT INTO SHADOW DOM
  // ─────────────────────────────────────────────────────────────

  shadow.appendChild(styles);
  shadow.appendChild(root);

  // ─────────────────────────────────────────────────────────────
  // 6. STATE + DOM REFS
  // ─────────────────────────────────────────────────────────────

  let isOpen = false;
  let isLoading = false;

  // Conversation history — we send this whole array to /api/chat
  // so the bot has memory of previous messages in the session.
  const conversationHistory = [];

  const toggleBtn  = shadow.getElementById("w-toggle");
  const messagesEl = shadow.getElementById("w-messages");
  const inputEl    = shadow.getElementById("w-input");
  const sendBtn    = shadow.getElementById("w-send");
  const welcomeEl  = shadow.getElementById("w-welcome");
  const typingEl   = shadow.getElementById("w-typing");

  // ─────────────────────────────────────────────────────────────
  // 7. TOGGLE OPEN / CLOSE
  // ─────────────────────────────────────────────────────────────

  function toggleChat() {
    isOpen = !isOpen;
    root.classList.toggle("open", isOpen);

    if (isOpen) {
      // Wait for animation to finish, then focus the input
      setTimeout(() => inputEl.focus(), 220);
    }
  }

  toggleBtn.addEventListener("click", toggleChat);

  // Close if user hits Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) toggleChat();
  });

  // ─────────────────────────────────────────────────────────────
  // 8. AUTO-RESIZE TEXTAREA
  //    As user types more lines, textarea grows up to max-height.
  //    The CSS handles the max-height cap.
  // ─────────────────────────────────────────────────────────────

  inputEl.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });

  // ─────────────────────────────────────────────────────────────
  // 9. SEND ON ENTER (Shift+Enter = newline, Enter = send)
  // ─────────────────────────────────────────────────────────────

  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener("click", sendMessage);

  // ─────────────────────────────────────────────────────────────
  // 10. RENDER A MESSAGE BUBBLE
  //     Called both for user messages (immediately) and bot
  //     messages (after the API responds).
  // ─────────────────────────────────────────────────────────────

  function renderMessage(role, text) {
    // Hide the welcome state once first message is sent
    if (welcomeEl) welcomeEl.style.display = "none";

    const msgEl = document.createElement("div");
    msgEl.className = `message ${role}`;

    const time = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    msgEl.innerHTML = `
      <div class="bubble">${escapeHTML(text)}</div>
      <span class="message-time">${time}</span>
    `;

    // Insert BEFORE the typing indicator (typing indicator is always last)
    messagesEl.insertBefore(msgEl, typingEl);

    // Scroll to bottom
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // ─────────────────────────────────────────────────────────────
  // 11. SEND MESSAGE + CALL /api/chat
  //     For now this just echoes a fake response (no API wired).
  //     Once /api/chat is built, swap the TODO section.
  // ─────────────────────────────────────────────────────────────

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text || isLoading) return;

    // Clear + reset input
    inputEl.value = "";
    inputEl.style.height = "auto";

    // Show user bubble immediately
    renderMessage("user", text);

    // Add to history
    conversationHistory.push({ role: "user", content: text });

    // Lock UI while waiting
    setLoading(true);

    try {
      // ── Build the request body based on mode ──
      // V2: send only botId — server looks up key + prompt from DB
      // V1: send full config — server uses it directly
      const requestBody = isV2
        ? {
            botId: config.botId,
            messages: conversationHistory,
          }
        : {
            provider: config.provider,
            key: config.key,
            model: config.model,
            systemPrompt: config.prompt,
            messages: conversationHistory,
          };

      const response = await fetch(config.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "API request failed");
      }

      const data = await response.json();
      const reply = data.reply;

      conversationHistory.push({ role: "assistant", content: reply });
      renderMessage("bot", reply);
    } catch (err) {
      renderMessage(
        "bot",
        "Something went wrong. Please check your connection."
      );
      console.error("[AI Widget] Chat error:", err);
    } finally {
      setLoading(false);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 12. LOADING STATE — show/hide typing indicator, disable input
  // ─────────────────────────────────────────────────────────────

  function setLoading(state) {
    isLoading = state;
    sendBtn.disabled = state;
    inputEl.disabled = state;
    typingEl.classList.toggle("visible", state);

    if (state) {
      // Scroll to show typing indicator
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 13. UTILS
  // ─────────────────────────────────────────────────────────────

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Prevent XSS — escape user-provided text before injecting as HTML
  function escapeHTML(str) {
    const div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
})();