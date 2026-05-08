import asyncio
import os
import bcrypt
from prisma import Prisma
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

async def main() -> None:
    prisma = Prisma()
    await prisma.connect()

    # 0. Seed Super Admin
    admin_email = "admin@proctor.com"
    admin_password = "Admin@123"
    salt = bcrypt.gensalt()
    hashed_admin_password = bcrypt.hashpw(admin_password.encode('utf-8'), salt).decode('utf-8')
    
    await prisma.user.upsert(
        where={"email": admin_email},
        data={
            "create": {
                "email": admin_email,
                "name": "Super Admin",
                "password": hashed_admin_password,
                "role": "SUPER_ADMIN",
            },
            "update": {
                "password": hashed_admin_password,
            },
        },
    )
    print(f"Upserted Super Admin: {admin_email}")

    # 1. Create Institutions
    institutions = [
        {"name": "Stanford Tech University", "code": "STU-001"},
        {"name": "MIT Global Institute", "code": "MIT-G-002"},
        {"name": "Oxford Digital Academy", "code": "ODA-003"},
    ]
    
    inst_objs = []
    for inst in institutions:
        obj = await prisma.institution.upsert(
            where={"code": inst["code"]},
            data={
                "create": inst,
                "update": inst,
            }
        )
        inst_objs.append(obj)
        print(f"Upserted Institution: {inst['name']}")

    # 2. Seed test roles
    roles = ["SUPER_ADMIN", "COLLEGE_ADMIN", "DEPT_ADMIN", "FACULTY", "STUDENT"]
    
    # Hash a simple test password
    test_salt = bcrypt.gensalt()
    default_test_password = bcrypt.hashpw("Test@123".encode('utf-8'), test_salt).decode('utf-8')

    # Create 10 students for each institution
    for inst in inst_objs:
        for i in range(1, 11):
            email = f"student{i}@{inst.code.lower()}.com"
            await prisma.user.upsert(
                where={"email": email},
                data={
                    "create": {
                        "email": email,
                        "name": f"Student {i} ({inst.name})",
                        "password": default_test_password,
                        "role": "STUDENT",
                        "institutionId": inst.id
                    },
                    "update": {
                        "institutionId": inst.id
                    }
                }
            )
        
        # Create one faculty for each institution
        faculty_email = f"faculty@{inst.code.lower()}.com"
        faculty = await prisma.user.upsert(
            where={"email": faculty_email},
            data={
                "create": {
                    "email": faculty_email,
                    "name": f"Prof. Smith ({inst.name})",
                    "password": default_test_password,
                    "role": "FACULTY",
                    "institutionId": inst.id
                },
                "update": {
                    "institutionId": inst.id
                }
            }
        )

        # 3. Create Exams
        exam = await prisma.exam.create(
            data={
                "title": f"Intro to Computer Science - {inst.name}",
                "description": "Final term examination",
                "startTime": datetime.now() - timedelta(hours=1),
                "endTime": datetime.now() + timedelta(hours=2),
                "status": "ONGOING",
                "institutionId": inst.id,
                "proctorId": faculty.id
            }
        )
        print(f"Created Exam: {exam.title}")

        # 4. Create some Alerts
        await prisma.alert.create(
            data={
                "examId": exam.id,
                "studentId": "some-student-id", # Placeholder
                "title": "Multiple Face Detected",
                "desc": f"Suspicious activity in {exam.title}",
                "type": "CRITICAL",
                "severity": 8
            }
        )

    print("\nDatabase expanded seeding completed.")
    await prisma.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
