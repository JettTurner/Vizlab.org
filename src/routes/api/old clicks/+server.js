import { json } from "@sveltejs/kit";
import { db } from "$lib/server/database"; // Ensure this path matches
export const prerender = false;

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

export async function GET() {
    try {
        const clicks = await db.click.findMany();
        //console.log("Click counts from DB:", clicks);  // Log DB results
        return json(clicks);
    } catch (error) {
        console.error("Error fetching click counts:", error);
        return json({ error: "Failed to fetch click counts" }, { status: 500 });
    }
}




