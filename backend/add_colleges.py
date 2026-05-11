import asyncio
from core.db import prisma

async def main():
    await prisma.connect()
    colleges = [
        {"name": "College of Engineering, Guindy (CEG)", "code": "CEG"},
        {"name": "Thiagarajar College of Engineering (TCE)", "code": "TCE"},
        {"name": "PSG College of Technology (PSG)", "code": "PSG"}
    ]
    
    for c in colleges:
        try:
            # Check if exists to avoid unique constraint errors
            existing = await prisma.institution.find_first(where={"code": c["code"]})
            if existing:
                print(f"College {c['name']} already exists with ID: {existing.id}")
            else:
                res = await prisma.institution.create(data=c)
                print(f"Added {res.name} with ID: {res.id}")
        except Exception as e:
            print(f"Failed to add {c['name']}: {e}")
            
    await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
