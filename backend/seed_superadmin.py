import asyncio
import bcrypt
from prisma import Prisma

async def seed_super_admin():
    prisma = Prisma()
    await prisma.connect()

    email = "admin@proctor.com"
    name = "Super Admin"
    password = "Admin@123"
    
    # Hash password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    await prisma.user.upsert(
        where={"email": email},
        data={
            "create": {
                "email": email,
                "name": name,
                "password": hashed_password,
                "role": "SUPER_ADMIN",
            },
            "update": {
                "password": hashed_password,
            },
        },
    )
    print(f"Super Admin seeded: {email} / {password}")
    await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(seed_super_admin())
