# HOW DO I USE THIS THING???

```bash
# 0. hold shift and open powershell in this folder

# 1. run the development server
pnpm run dev -- --open

# 2. Edit the files in /src (try notepad++)

# 2b. Stop the local web server
q

# 3. build the distribution
pnpm build

# 4. copy the files from /build to the server
scp -r .\build\* username@pi.local:/home/username/web/


in console f12: use this to check the local clickCounts
JSON.parse(localStorage.getItem("clickCounts"))




Fix: Set Up Prisma on Your Server

prisma database checks:
npx prisma db pull  # Syncs schema with database
npx prisma studio   # Opens Prisma GUI to check data

1. ssh into raspberry pi
ssh username@pi.local
password password

2. Check if the database is running:
ps aux | grep postgres
# or for MySQL
systemctl status mysql

If the database isn’t running, start it:
systemctl start postgresql  # for PostgreSQL
systemctl start mysql       # for MySQL

3. Ensure Prisma has the right database URL.
Edit the .env file in your deployed project:

nano .env

Ensure it has:
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

4. Apply migrations on the server:
npx prisma migrate deploy








TODO:
make middle mouse button clicks vallid clicks for clickCounts.
make server side click aggragator.

Purchase ChatGPT Pro?

RED
[#ff0000]

Dark RED
[#4a0317]

BLUE
[#0000ff]

Dark Blue
[#080c59]




Testing the Popup
If you need to reset and see the popup again:

Open your browser console (F12 → Console).

Run:

js
Copy
Edit
localStorage.removeItem("vizlabPopupSeen")
Refresh the page.

Now, the popup will show again!



GoAccess check it out for ngnix log viewer?
tracks what activity is going on, on your website.


```

