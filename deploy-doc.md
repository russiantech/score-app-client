<!-- Vercel deployment + custom subdomain works seamlessly with your current setup (Vite + React frontend, API on your VPS/cPanel) -->

# ✅ ARCHITECTURE YOU CURRENTLY HAVE (GOOD)

From our thread:

* ✅ Frontend → Vite/React → deployed on **Vercel**
* ✅ Backend API → FastAPI → running on **your VPS/cPanel**
* ✅ Custom subdomain → `studentscores.simplylovely.ng` → should point to Vercel
* ✅ Main domain + other subdomains → remain on cPanel (untouched)

That’s perfectly fine. Subdomain → Vercel will NOT break others.

---

# ✅ STEP 1 — Vercel Project Setup (Frontend)

## In Vercel:

1. Import project from GitHub
2. Framework preset:

   ```
   Vite
   ```
3. Build settings:

```
Build command: npm run build
Output directory: dist
Install command: npm install
```

---

## ✅ For Vite — ensure this exists

### vite.config.ts

```ts
export default defineConfig({
  plugins: [react()],
})
```

Do NOT hardcode base path unless deploying to a folder.

---

# ✅ STEP 2 — Environment Variables (CRITICAL)

If your frontend calls your API:

## In Vercel → Project → Settings → Environment Variables

Add:

```
VITE_API_BASE_URL=https://api-studentscores.simplylovely.ng
```

(or whatever your backend URL is)

Then redeploy.

---

# ✅ STEP 3 — Fix SPA Routing (Very Important)

React Router apps will break on refresh without this.

Create:

## vercel.json

```
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

This ensures:

```
/dashboard
/parent
/student/123
```

all load correctly.

---

# ✅ STEP 4 — Add Domain in Vercel

In Vercel → Project → Settings → Domains

Add:

```
studentscores.simplylovely.ng
```

Vercel will show:

```
CNAME → 6c526daad9ac88d6.vercel-dns-017.com
```

Keep that value — you’ll use it next.

---

# ✅ STEP 5 — DNS Setup in cPanel (THIS FIXES YOUR ERROR)

You already hit the classic DNS rule:

> ❌ CNAME cannot exist with other records of same name

So we must clean it properly.

---

## 🔧 In cPanel → Zone Editor → Filter: studentscores

### ❌ DELETE ALL of these:

```
studentscores.simplylovely.ng   A
studentscores.simplylovely.ng   TXT
studentscores.simplylovely.ng   MX
studentscores.simplylovely.ng   anything else
```

Only for this subdomain — not others.

---

## ✅ ADD ONLY THIS:

```
Type:   CNAME
Name:   studentscores
Value:  6c526daad9ac88d6.vercel-dns-017.com.
TTL:    14400
```

Save.

---

# ✅ STEP 6 — Fix WWW Version

Delete:

```
www.studentscores.simplylovely.ng   A   198.54.120.178
```

Add:

```
Type:   CNAME
Name:   www.studentscores
Value:  studentscores.simplylovely.ng.
```

---

# ✅ STEP 7 — Wait for Propagation

Typical:

```
10–30 minutes
```

Check Vercel domain page — should switch to:

```
Valid Configuration ✅
```

---

# ✅ STEP 8 — Enable HTTPS (Auto)

Vercel auto issues SSL once DNS resolves.

No manual SSL needed.

---

# ✅ STEP 9 — Backend CORS (Do Not Forget)

Your FastAPI must allow your Vercel domain.

Example:

```python
origins = [
    "https://studentscores.simplylovely.ng",
    "https://studentscores.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Restart backend.

---

# ✅ STEP 10 — Test Checklist

After propagation:

## Test:

```
https://studentscores.simplylovely.ng
```

Check:

* ✅ Loads app
* ✅ Refresh works
* ✅ Login works
* ✅ API calls succeed
* ✅ No CORS errors
* ✅ HTTPS valid
* ✅ No mixed content warnings

---

# ⚠️ OPTIONAL — Performance Improvements

Your Vite build showed:

```
540 KB chunk
```

Later you can split:

```
dynamic import()
route-based code splitting
```

But not required for launch.

---

# ✅ RESULT AFTER THIS

You get:

```
Frontend → Vercel CDN (fast globally)
Backend → VPS/cPanel
Domain → subdomain only → Vercel
Main domain → unchanged
Auto SSL
Auto deploy on git push
