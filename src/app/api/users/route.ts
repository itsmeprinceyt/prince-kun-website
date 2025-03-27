import { NextResponse } from "next/server";
import pool from "@/lib/db";

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

async function fetchDiscordNames(userId: string): Promise<string | null> {
    try {
        const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
            headers: {
                Authorization: `Bot ${DISCORD_BOT_TOKEN}`
            }
        });

        if (!response.ok) {
            console.error(`Failed to fetch Discord user ${userId}: `, response.status);
            return null;
        }

        const data = await response.json();
        return data.global_name || data.username;
    } catch (error) {
        console.log(`Error fetching Discord username: `, error);
        return null;
    }
}
export async function GET() {
    let connection;
    try {
        connection = await pool.getConnection();

        const [rows] = await pool.query(`SELECT * FROM users LIMIT 20`);
        const users = [...(rows as { user_id: string; pp_cash: number; refer_tickets: number; total_purchases: number; total_referred: number; spv: number }[])];
        const usersWithNames = await Promise.all(
            users.map(async (user) => {
                const username = await fetchDiscordNames(user.user_id);
                return { ...user, username: username || "Unknown" };
            })
        );

        return NextResponse.json(usersWithNames);
    } catch (error) {
        console.error("Error fetching users: ", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    } finally {
        if (connection) connection.release();
    }
}
