from prisma import Prisma
import asyncio
import json

async def main():
    db = Prisma()
    await db.connect()
    
    # Check alerts
    alerts = await db.query_raw('SELECT id, "studentId" FROM "Alert" LIMIT 10')
    print("Alerts Sample:")
    print(json.dumps(alerts, indent=2))
    
    # Check users
    users_count = await db.user.count()
    print(f"Total Users: {users_count}")
    
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
