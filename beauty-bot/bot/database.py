import aiosqlite
import datetime

DB_PATH = "beauty_bot.db"

async def init_db():
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY,
                color_type TEXT,
                face_shape TEXT,
                archetype TEXT,
                is_subscribed INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS wardrobe_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                item_type TEXT,
                color TEXT,
                style TEXT,
                season TEXT,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS analyses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                free_text TEXT,
                full_text TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (user_id)
            )
        """)
        await db.commit()

async def get_user(user_id):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM users WHERE user_id = ?", (user_id,)) as cursor:
            return await cursor.fetchone()

async def create_user(user_id):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("INSERT OR IGNORE INTO users (user_id) VALUES (?)", (user_id,))
        await db.commit()

async def update_user_analysis(user_id, color_type, face_shape, archetype):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "UPDATE users SET color_type = ?, face_shape = ?, archetype = ? WHERE user_id = ?",
            (color_type, face_shape, archetype, user_id)
        )
        await db.commit()

async def set_subscribed(user_id, is_subscribed=1):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("UPDATE users SET is_subscribed = ? WHERE user_id = ?", (is_subscribed, user_id))
        await db.commit()

async def add_wardrobe_item(user_id, item_type, color, style, season, description):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO wardrobe_items (user_id, item_type, color, style, season, description) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, item_type, color, style, season, description)
        )
        await db.commit()

async def get_wardrobe(user_id):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM wardrobe_items WHERE user_id = ?", (user_id,)) as cursor:
            return await cursor.fetchall()

async def save_analysis(user_id, free_text, full_text):
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute(
            "INSERT INTO analyses (user_id, free_text, full_text) VALUES (?, ?, ?)",
            (user_id, free_text, full_text)
        )
        await db.commit()

async def get_last_analysis(user_id):
    async with aiosqlite.connect(DB_PATH) as db:
        db.row_factory = aiosqlite.Row
        async with db.execute("SELECT * FROM analyses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1", (user_id,)) as cursor:
            return await cursor.fetchone()
