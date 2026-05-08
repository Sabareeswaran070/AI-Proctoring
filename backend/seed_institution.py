import asyncio
from core.db import prisma

async def seed():
    await prisma.connect()
    count = await prisma.institution.count()
    if count == 0:
        await prisma.institution.create(
            data={
                "name": "Standard University of Technology",
                "code": "SUT-001"
            }
        )
        print("Seeded default institution.")
    else:
        print(f"Database already has {count} institutions.")
    await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(seed())
