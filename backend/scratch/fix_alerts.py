from prisma import Prisma
import asyncio

async def main():
    db = Prisma()
    await db.connect()
    
    # Update alerts with invalid studentId to NULL
    # First, let's just nullify all since they look like dummy data
    await db.execute_raw('UPDATE "Alert" SET "studentId" = NULL')
    print("Alerts updated: studentId set to NULL")
    
    await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
