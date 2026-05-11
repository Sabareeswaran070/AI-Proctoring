import asyncio
from core.db import prisma

async def main():
    await prisma.connect()
    institutions = await prisma.institution.find_many()
    print("Institutions count:", len(institutions))
    for i in institutions:
        print(f"ID: {i.id}, Name: {i.name}")
    await prisma.disconnect()

asyncio.run(main())
