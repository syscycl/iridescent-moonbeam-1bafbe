# Namecheap Deployment Guide for Syscycl.com
## Step-by-Step to Go Live on Your Domain

---

# ⚡ OPTION 1: Namecheap Shared Hosting (RECOMMENDED — Most Professional)

**Cost:** ~$20/year (Stellar plan) | **Time:** 15 minutes | **Result:** https://www.syscycl.com

---

## Step 1: Get Namecheap Shared Hosting

1. Log in to your Namecheap account: https://namecheap.com
2. Go to **Hosting → Shared Hosting**
3. Select the **Stellar** plan (cheapest, sufficient for this site)
4. During checkout, choose **syscycl.com** as the domain
5. Complete purchase
6. Wait 5-10 minutes for hosting to activate (you'll get an email)

---

## Step 2: Upload Website Files via cPanel

1. In your Namecheap account, go to **Dashboard → Manage** next to your hosting
2. Click **Go to cPanel**
3. In cPanel, find **File Manager** (usually under Files section)
4. Click **File Manager** → opens in new tab
5. Navigate to: `public_html/` folder
6. **IMPORTANT:** Delete the default `index.html` file in public_html
7. Click **Upload** (top menu)
8. Upload ALL files from the `dist` folder we provided:

```
Upload these files to public_html/:
├── index.html
├── instagram-qr-code.jpg
├── social-post-1-launch.png
├── social-post-2-educational.png
├── social-post-3-thankyou.png
├── social-post-4-codaily.png
├── social-post-5-partnership.png
├── social-post-6-consent.png
├── syscycl-horizontal-banner.png
├── syscycl-official-logo.png
├── syscycl-story-template.png
├── syscycl-instagram-reel.mp4
├── syscycl-logo.png
├── bottle-collection-hero.jpg
├── brantford-community.jpg
└── assets/
    ├── index-[hash].css
    └── index-[hash].js
```

**Note:** Upload the contents of the `dist` folder, NOT the `dist` folder itself. The `index.html` must be directly in `public_html/`.

---

## Step 3: Configure Domain to Point to Hosting

1. In Namecheap, go to **Domain List → Manage** next to `syscycl.com`
2. Go to **Advanced DNS** tab
3. Ensure these records exist (they should be auto-created with hosting):

```
Type     Host       Value                            TTL
─────────────────────────────────────────────────────────
A        @          [Your Hosting IP Address]        Automatic
CNAME    www        syscycl.com.                     Automatic
```

4. If not present, add them manually:
   - **A Record:** Host = `@`, Value = `Your server's IP` (found in cPanel right sidebar)
   - **CNAME Record:** Host = `www`, Value = `syscycl.com.`
5. Save changes

---

## Step 4: Enable SSL (HTTPS)

1. In cPanel, find **SSL/TLS** or **Let's Encrypt SSL**
2. Click **Let's Encrypt**
3. Select `syscycl.com` and `www.syscycl.com`
4. Click **Install**
5. Wait 2-5 minutes
6. Your site is now accessible at `https://www.syscycl.com`

---

## Step 5: Verify Everything Works

Open these URLs in your browser:
- https://syscycl.com
- https://www.syscycl.com
- https://syscycl.com/#/dashboard
- https://syscycl.com/#/assets

All should load the Syscycl Management Platform.

---

# ⚡ OPTION 2: Netlify + Namecheap DNS (FREE — Best Performance)

**Cost:** FREE | **Time:** 10 minutes | **Result:** https://www.syscycl.com with global CDN

---

## Step 1: Upload to Netlify

1. Go to https://app.netlify.com/drop
2. Drag and drop the entire `dist` folder from the zip file
3. Netlify instantly gives you a URL like: `https://syscycl-abc123.netlify.app`
4. Copy this Netlify URL — you'll need it

---

## Step 2: Add Custom Domain in Netlify

1. In your Netlify site dashboard, go to **Site Settings → Domain Management**
2. Click **Add Custom Domain**
3. Enter: `syscycl.com`
4. Click **Verify** → **Add Domain**
5. Netlify will show you DNS records to configure

---

## Step 3: Update DNS in Namecheap

1. Log in to Namecheap → **Domain List → Manage** next to `syscycl.com`
2. Go to **Advanced DNS** tab
3. Delete any existing A records and CNAME records
4. Add these records from Netlify:

```
Type     Host       Value                                    TTL
─────────────────────────────────────────────────────────────────
A        @          75.2.60.5                                Automatic
CNAME    www        [your-netlify-site].netlify.app.         Automatic
```

5. Save changes
6. Back in Netlify, click **Verify DNS Configuration**
7. Wait 5-30 minutes for DNS propagation

---

## Step 4: Enable HTTPS (Auto)

1. In Netlify **Domain Management**, scroll to **HTTPS**
2. Netlify automatically provisions a free SSL certificate
3. Click **Force HTTPS** to redirect all HTTP to HTTPS
4. Done — your site is secure

---

# ⚡ OPTION 3: Namecheap URL Redirect (FASTEST — 2 Minutes)

**Cost:** FREE | **Time:** 2 minutes | **Note:** URL changes in browser

Use this ONLY if you want the site live immediately while setting up proper hosting.

---

## Step 1: Set Up Redirect

1. Log in to Namecheap → **Domain List → Manage** next to `syscycl.com`
2. Go to **Advanced DNS** tab
3. Find the **URL Redirect Record** or **Redirect Domain** section
4. Add:

```
Type          Host    Value                                    TTL
─────────────────────────────────────────────────────────────────
URL Redirect  @       https://zahhkbruaqvac.kimi.page/         Automatic
URL Redirect  www     https://zahhkbrauqvac.kimi.page/         Automatic
```

5. Save changes
6. Wait 5 minutes
7. Visit `www.syscycl.com` — it redirects to the live site

**⚠️ Limitation:** The browser URL will show `zahhkbruaqvac.kimi.page` not `syscycl.com`. This is temporary.

---

# 📧 SETTING UP PROFESSIONAL EMAIL with Your Domain

Since you own `syscycl.com`, you can now use `hello@syscycl.com` instead of `syscycl@gmail.com`.

## Option A: Namecheap Private Email (~$15/year)

1. In Namecheap, go to **Hosting → Private Email**
2. Select **Starter** plan
3. Choose `syscycl.com` as domain
4. Create mailbox: `hello@syscycl.com`
5. You can also create: `tanisha@syscycl.com`, `support@syscycl.com`
6. Access email via webmail or connect to Gmail/Outlook

## Option B: Google Workspace (~$84/year — Most Professional)

1. Go to https://workspace.google.com
2. Sign up with `syscycl.com`
3. Verify domain ownership (add TXT record in Namecheap DNS)
4. Create `hello@syscycl.com`
5. Full Gmail, Google Drive, Calendar included

## Option C: Zoho Mail (FREE for up to 5 users)

1. Go to https://www.zoho.com/mail
2. Sign up with `syscycl.com`
3. Verify domain (add CNAME in Namecheap)
4. Create `hello@syscycl.com` for FREE
5. Best budget option

---

# 📋 QUICK REFERENCE: Namecheap DNS Records

Once hosting is set up, these are the records you need in Namecheap **Advanced DNS**:

```
# For Namecheap Shared Hosting:
Type     Host    Value                           TTL
──────────────────────────────────────────────────────
A        @       [Your cPanel IP]                Automatic
CNAME    www     syscycl.com.                    Automatic

# For Netlify (replace with your actual Netlify URL):
A        @       75.2.60.5                       Automatic
CNAME    www     [your-site].netlify.app.        Automatic

# For email (Zoho Mail example):
CNAME    zb      business.zoho.com.              Automatic
MX       @       mx.zoho.com.                    10
MX       @       mx2.zoho.com.                   20
TXT      @       v=spf1 include:zoho.com ~all    Automatic
```

---

# ✅ POST-DEPLOYMENT CHECKLIST

After going live, verify these:

- [ ] https://www.syscycl.com loads the website
- [ ] https://syscycl.com (without www) also works
- [ ] http:// redirects to https:// (SSL working)
- [ ] All pages load: /, /dashboard, /operations, /assets, etc.
- [ ] Instagram QR code displays correctly
- [ ] Footer social links work
- [ ] WhatsApp chat button appears
- [ ] Pre-launch banners show on all dashboard pages
- [ ] Registration form works
- [ ] Mobile view is properly aligned

---

# 🆘 TROUBLESHOOTING

**Problem:** Site shows "Index of /" or directory listing
**Fix:** Ensure `index.html` is directly in `public_html/`, not in a subfolder

**Problem:** "404 Not Found" on page refresh
**Fix:** This is a React SPA. You need to add an `.htaccess` file in `public_html/`:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```

**Problem:** Changes not showing after upload
**Fix:** Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

**Problem:** DNS not propagating
**Fix:** Wait up to 30 minutes. Check at https://whatsmydns.net

---

# 📞 NEED HELP?

If you get stuck at any step:
1. Namecheap Live Chat: https://www.namecheap.com/help-center/
2. Namecheap Knowledge Base: https://www.namecheap.com/support/knowledgebase/
3. Send me a screenshot of where you're stuck

---

**My recommendation: Go with Option 2 (Netlify) — it's FREE, faster, has automatic SSL, and better performance than Namecheap shared hosting. Just follow the 4 steps above.**
