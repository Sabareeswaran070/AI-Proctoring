import requests

# Test sample endpoint (no auth needed or expects 401)
try:
    res = requests.get('http://localhost:8000/api/super-admin/students/bulk-import/sample')
    print("GET sample:", res.status_code)
except Exception as e:
    print("GET error", e)

# Create a small valid token by logging in as super admin
# Or just upload without auth and see what error it returns. If it returns 401, that's expected.
# But wait, earlier the user got an exception IN THE API endpoint, which means they WERE authenticated.
# The user's error was in line 215 of super_admin.py!
