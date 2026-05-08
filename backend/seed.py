import asyncio
import os
import bcrypt
from prisma import Prisma
from dotenv import load_dotenv

load_dotenv()

async def main() -> None:
    prisma = Prisma()
    await prisma.connect()

    # Seed test roles (excluding Super Admin which is already created)
    other_roles = ["COLLEGE_ADMIN", "DEPT_ADMIN", "FACULTY", "STUDENT"]
    
    for role in other_roles:
        email = f"{role.lower().replace('_', '')}@test.com"
        name = f"Test {role.replace('_', ' ').title()}"
        
        # Hash a simple test password
        test_salt = bcrypt.gensalt()
        default_test_password = bcrypt.hashpw("Test@123".encode('utf-8'), test_salt).decode('utf-8')
        
        await prisma.user.upsert(
            where={"email": email},
            data={
                "create": {
                    "email": email,
                    "name": name,
                    "password": default_test_password,
                    "role": role,
                },
                "update": {
                    "password": default_test_password,
                },
            },
        )
        print(f"Upserted {role}: {email}")

    print("\nDatabase seeding completed.")
    await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
