from datetime import datetime
from app import create_app, db
from app.models import Staff
import bcrypt

def seed_admin():
    # Check if an admin already exists
    existing_admin = Staff.query.filter_by(role="Administrator").first()
    if existing_admin:
        print("Admin already exists. Skipping seed.")
        return

    # Admin details
    admin_name = "Admin User"
    admin_phone = "0000000000"
    admin_password =bcrypt.generate_password_hash('password1234').decode('utf-8')
    admin_role = "Administrator"

    # Hash the password using bcrypt
    hashed_password = bcrypt.generate_password_hash(admin_password).decode('utf-8')  # Hash the password

    # Create admin user
    admin = Staff(
        name=admin_name,
        phone=admin_phone,
        password=hashed_password.decode('utf-8'),  # Decode for database storage
        role=admin_role
    )

    # Add and commit the admin user to the database
    db.session.add(admin)
    db.session.commit()
    print(f"Admin user '{admin_name}' seeded successfully!")

if __name__ == "__main__":
    # Create the Flask app and push the context
    app = create_app()
    with app.app_context():
        db.drop_all()  # Drop all tables (for testing only; remove in production)
        db.create_all()  # Recreate tables
        seed_admin()
