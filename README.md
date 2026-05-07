# Clarity App — Setup Guide

## Step 1: Set Up EmailJS (Free — takes 5 minutes)

EmailJS lets the app send you an email directly from the browser with no backend needed.

### 1.1 Create your account
Go to https://www.emailjs.com and sign up for free.
The free plan gives you 200 emails/month — more than enough.

### 1.2 Add an Email Service
1. In the EmailJS dashboard, click **Email Services** → **Add New Service**
2. Choose **Gmail**
3. Click **Connect Account** and sign in with Anthony@bellhome.co
4. Name it anything (e.g. "clarity-gmail")
5. Copy the **Service ID** (looks like: service_abc1234)

### 1.3 Create an Email Template
1. Click **Email Templates** → **Create New Template**
2. Set it up like this:

**Subject:**
```
💛 Quiz Results — Your Son Just Finished
```

**Body (paste this exactly):**
```
Completed: {{timestamp}}
Questions flagged: {{score}}

━━━━━━━━━━━━━━━━━━━
WHAT SHOWED UP
━━━━━━━━━━━━━━━━━━━
{{summary}}

━━━━━━━━━━━━━━━━━━━
FULL ANSWER BREAKDOWN
━━━━━━━━━━━━━━━━━━━
{{full_answers}}

━━━━━━━━━━━━━━━━━━━
Sent automatically when he finished the quiz.
Made with love, for your son.
```

3. Set **To Email** to: Anthony@bellhome.co
4. Save the template and copy the **Template ID** (looks like: template_xyz7890)

### 1.4 Get your Public Key
1. Click your account name (top right) → **Account**
2. Under **API Keys**, copy your **Public Key**

### 1.5 Paste your keys into the app
Open `src/App.jsx` and find these 3 lines near the top:

```js
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";
```

Replace each placeholder with your real values. Save the file.

---

## Step 2: Deploy to Netlify (Free — takes 3 minutes)

### Option A: Drag & Drop (Easiest — no account needed beyond Netlify)

1. Open your terminal in this folder and run:
   ```
   npm install
   npm run build
   ```
   This creates a `dist/` folder.

2. Go to https://app.netlify.com
3. Sign up free (use your Google or GitHub account)
4. On the dashboard, find the **"drag and drop your site folder here"** box
5. Drag your `dist/` folder into it
6. Done — Netlify gives you a live URL instantly (e.g. https://sparkling-fox-abc123.netlify.app)

### Option B: Connect GitHub (Best for updates)

1. Push this folder to a GitHub repo
2. Go to https://app.netlify.com → **Add new site** → **Import from Git**
3. Connect GitHub, select your repo
4. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **Deploy site**

### Custom Domain (Optional)
If you want a cleaner URL (e.g. checkin.bellhome.co):
- In Netlify: **Domain settings** → **Add custom domain**
- Add a CNAME record in your DNS pointing to your Netlify URL

---

## Step 3: Share the Link

Send your son the Netlify URL however feels natural —
text, email, "hey check this out", whatever works.

The moment he answers the last question, you'll get an email at Anthony@bellhome.co
with everything he answered.

---

## Project Structure

```
clarity-app/
├── index.html          # Entry point
├── package.json        # Dependencies
├── vite.config.js      # Build config
├── src/
│   ├── main.jsx        # React mount
│   └── App.jsx         # The full app (edit this)
└── README.md           # This file
```
