============================================================
  PUBLISH WITH VAISHU  -  STARTUP GUIDE (Windows)
============================================================

These helper files let you run the website by double-clicking,
without typing anything in a terminal.

All three files live in the project folder:
  C:\Publish with vaisu\

------------------------------------------------------------
  HOW TO START THE PROJECT
------------------------------------------------------------
1. Double-click  START.bat
2. The first time, it installs dependencies automatically
   (this can take a couple of minutes - please wait).
3. It starts the development server and, after a few seconds,
   opens the website in your default browser at:
       http://localhost:3000
4. Keep the black window OPEN while you use the site.
   That window IS the running server.

If port 3000 is already busy, START.bat detects it, stops the
old process, and starts a fresh server automatically.

------------------------------------------------------------
  HOW TO STOP THE PROJECT
------------------------------------------------------------
Option A (recommended):
   In the running server window, press  Ctrl + C , then close it.

Option B:
   Double-click  STOP.bat
   It stops the server and frees port 3000.

------------------------------------------------------------
  HOW TO RESTART THE PROJECT
------------------------------------------------------------
Double-click  RESTART.bat
   It stops the current server, waits 3 seconds, and starts it
   again automatically.

------------------------------------------------------------
  TROUBLESHOOTING
------------------------------------------------------------
- "Node.js was not found": install Node.js from https://nodejs.org
  then double-click START.bat again.
- The page won't load right away: give it 5-15 seconds the first
  time while it compiles, then refresh the browser.
- Still stuck on port 3000: double-click STOP.bat, then START.bat.

------------------------------------------------------------
  LOGIN CREDENTIALS (development)
------------------------------------------------------------
ADMIN  (sign in at  http://localhost:3000/admin/login )
   Email:    admin@vaishu.in
   Password: admin@vaishu123

   Note: the project stores only a bcrypt HASH of the admin
   password (ADMIN_PASSWORD_HASH in .env.local). The password
   above is the documented development default that matches that
   hash. To change it, generate a new hash and update .env.local.

TEST CUSTOMER  (sign in at  http://localhost:3000/login )
   Email:    subash.test@example.com
   Password: testpass123

   Note: this account was created during testing and lives in the
   Supabase database (not in a project file). Email is verified.

OTHER SEED USERS
   supabase/seed.sql also inserts sample customers
   (arun@example.com, divya@example.com, etc.) but with a
   PLACEHOLDER password hash ("seed-placeholder"), so they
   CANNOT log in. They exist only to populate sample data.

============================================================
