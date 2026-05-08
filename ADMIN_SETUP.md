# Testimonials Admin Panel — Setup & Usage Guide

Your free, password-protected admin panel for managing testimonials on your website. **No backend, no cost, no complicated setup.**

---

## 🚀 Quick Start

### 1. **File is Ready**
The `admin.html` file is already in your repository. You just need to:
- Push it to GitHub (if not already)
- Access it via: `https://jagadeesh5532.github.io/admin.html`

### 2. **Change Your Password**
**Important:** The demo password is `testadmin`. Change it:

1. Open `admin.html` in a text editor
2. Find line: `const ADMIN_PASSWORD = 'testadmin';`
3. Replace `testadmin` with your own password
4. Save and commit to GitHub

### 3. **Start Using It**
- Go to `https://jagadeesh5532.github.io/admin.html`
- Enter your password
- Start managing testimonials!

---

## 📋 How to Use

### **Adding a Testimonial**

1. Click the **"Add Testimonial"** tab
2. Fill in:
   - **Name/Family Name** — `The Patel Family` or `Michael & Jennifer Chen`
   - **Session Type** — Choose from dropdown (Portraits, Sports, Wedding, etc.)
   - **Rating** — Click the stars (1-5)
   - **Testimonial** — Paste or type what the client said
3. Click **"Add Testimonial"**
4. ✓ Success message appears

**That's it!** The testimonial is stored in your browser's memory and added to the JSON.

### **Viewing All Testimonials**

1. Click the **"View All"** tab
2. See all testimonials with quick **Edit** and **Delete** buttons
3. Click **Edit** to update a testimonial (it'll load into the form above)
4. Click **Delete** to remove one

### **Exporting to Your Website**

**The Key Step:** After adding/editing testimonials, you need to copy the JSON to GitHub so it appears on your website.

1. Click the **"Export JSON"** tab
2. You'll see all your testimonials formatted as JSON
3. Click **"Copy to Clipboard"** (green button)
4. Go to your GitHub repository
5. Open the `testimonials.json` file
6. Click the pencil icon (✏️) to edit
7. Delete ALL the existing content
8. Paste the copied JSON
9. Scroll to bottom → click **"Commit changes"**
10. ✓ Done! Your website will show the updated testimonials in a few seconds

---

## 📧 Receiving Submissions from Clients

### When a client submits via your website form:

1. **Formspree sends you an email** with their submission
2. **You copy the key details:**
   - Name
   - What they said (quote)
   - Type of session
   - Rating (if they gave one, otherwise default to 5)
3. **Open the admin panel** (`admin.html`)
4. **Paste into the form** and click Add
5. **Export and commit** (see steps above)
6. **Done!** It appears on your website

---

## 🔄 Complete Workflow

```
Client submits form
       ↓
Formspree emails you
       ↓
You read the email
       ↓
You open admin.html (password: [your password])
       ↓
Fill in form with client details
       ↓
Click "Add Testimonial"
       ↓
Go to "Export JSON" tab
       ↓
Copy the JSON
       ↓
Open testimonials.json on GitHub
       ↓
Paste & commit
       ↓
Website updates (refreshes in ~5 seconds)
```

**Time per testimonial:** ~2 minutes

---

## 🎯 Pro Tips

### **Bulk Import**
If you have multiple testimonials to add:
1. Fill in **all** of them in the admin panel
2. Copy the final JSON once
3. Paste into GitHub once
4. All appear at once

### **Edit Existing Testimonials**
1. Click "View All"
2. Click "Edit" on any testimonial
3. Change it in the form
4. Click "Add Testimonial" again (it replaces the old one)
5. Export & commit to GitHub

### **Backup Your Data**
The "Export JSON" tab always shows your current data. You can:
- Screenshot it
- Save it to a file
- Paste it somewhere safe

### **Session Types**
The dropdown includes common options:
- Portrait Session
- Sports Photography
- Candid Photography
- Wedding Photography
- Celebration Photography
- Festival Photography
- Travel Photography
- Other

You can customize these by editing the `<select>` in `admin.html` (line ~294).

---

## 🔐 Security Notes

- **Password is local** — Not sent to any server
- **Testimonials are stored in GitHub** — The admin panel reads/shows them, but you manually manage the JSON file
- **No backend needed** — Everything happens in your browser
- **Change your password** — Don't leave it as `testadmin`

---

## ❓ Troubleshooting

### "Testimonials won't load"
- Make sure `testimonials.json` exists in your repository root
- Check that the JSON is valid (no syntax errors)
- Try refreshing the page

### "Changes don't appear on my website"
- **Did you commit?** Go to `testimonials.json` on GitHub and commit the changes
- **Check the URL** — Make sure you're looking at the live website, not a cached version
- **Wait a few seconds** — GitHub Pages can take 5-10 seconds to update

### "I lost my testimonials"
- **Don't panic!** They're probably still in the JSON file on GitHub
- Go to GitHub → open `testimonials.json`
- Copy the contents
- Go back to admin panel
- The "View All" tab will show what's in the current file

### "Forgot my password"
- You'll need to edit `admin.html` on GitHub
- Find the line `const ADMIN_PASSWORD = ...`
- Change it to a new password you remember
- Commit the change

---

## 📞 Need Help?

The system is designed to be simple, but if something breaks:
1. **Check the browser console** for errors (F12 → Console tab)
2. **Verify `testimonials.json` is valid** — use [JSONLint.com](https://jsonlint.com)
3. **Make sure you committed changes** — changes to the JSON only appear after you commit on GitHub

---

## 🎉 That's It!

You now have a fully functional, free testimonial management system. 

**Next steps:**
1. ✅ Change your password
2. ✅ Test adding a testimonial
3. ✅ Export and commit
4. ✅ Verify it appears on your website
5. ✅ When clients submit, use this workflow

Enjoy! 🚀
