// src/routes/api/click-counts/+server.js
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database.js'; // Ensure this path is correct
export const prerender = false;

export async function GET() {
    try {
        const clickCounts = await db.click.findMany(); // Ensure table name is correct
        return json(clickCounts);
    } catch (error) {
        console.error('Database query failed:', error); // Logs error in terminal
        return json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST({ request }) {
    try {
        const { linkHref } = await request.json();

        if (!linkHref) {
            return json({ error: "Invalid data" }, { status: 400 });
        }

        await db.click.upsert({
            where: { link: linkHref },
            update: { count: { increment: 1 } },
            create: { link: linkHref, count: 1 }
        });

        return json({ success: true });
    } catch (error) {
        console.error("Error updating click count:", error);
        return json({ error: "Internal server error" }, { status: 500 });
    }
}
