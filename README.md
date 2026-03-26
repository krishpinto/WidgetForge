# Widget

Built this because a junior of mine wanted a chatbot on his website 
and had no idea how to set one up. Figured a lot of people are 
probably in the same situation.

## What it does

You log in, paste your website URL or describe your website in a few lines. 
That gets scraped and turned into a system prompt. Then you bring your own 
API key — supports OpenAI, Gemini, Anthropic, and Grok — and it pulls up 
all the models available to you. Pick one, customise the bot, test it right 
there, and when you're happy you get a single script tag.

Paste that one line into your website. Done. 60 seconds.

The widget runs in a Shadow DOM so your site's styles won't interfere with it 
at all. Your API key is AES encrypted before storage and the database runs 
through Drizzle ORM on Supabase so there's no funny business with SQL injection.

## Running locally
```bash
git clone https://github.com/yourrepo/widget
cd widget
npm install
cp .env.example .env.local
# fill in your Supabase and encryption keys
npm run dev
```

## What's next

Planning to add no-code integrations for Webflow, Framer, WordPress etc. 
so people don't have to touch any code at all. Too much on my plate right 
now but it's coming.

---

*P.S. — started this in 60 seconds as a joke to see if I could. 
kind of just kept going.*
