from flask import request, jsonify, Blueprint
from .models import db, Staff,  Student, Payment, Fee, BusPayment, BusDestination, Term, Gallery, Event, Notification, student_bus_destination, Staff
from flask import current_app as app
import logging
from datetime import datetime

routes = Blueprint('routes', __name__)

logging.basicConfig(level=logging.DEBUG)

@routes.route('/register_student', methods=['POST'])
def register_student():
    data = request.get_json()
    admission_number = data['admission_number']
    name = data['name']
    grade = data['grade']
    term_fee = data['term_fee']
    use_bus = data['use_bus']
    
    student = Student(
        name=name,
        admission_number=admission_number,
        grade=grade,
        term_fee=term_fee,
        use_bus=use_bus,
    )
    # Set default password as admission_number
    student.set_password(admission_number)
    db.session.add(student)
    db.session.commit()
    
    return jsonify({"message": "Student registered successfully"}), 201

@routes.route('/register_staff', methods=['POST'])
def register_staff():
    data = request.get_json()
    name = data['name']
    phone = data['phone']
    role = data['role']
    password = data.get('password', 'defaultpassword')  # Set default password if not provided
    
    staff = Staff(
        name=name,
        phone=phone,
        role=role,
    )
    staff.set_password(password)  # Set password using bcrypt
    db.session.add(staff)
    db.session.commit()
    
    return jsonify({"message": "Staff registered successfully"}), 201

@routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier')  # admission_number or name
    password = data.get('password')
    
    # Check if it's a student login
    student = Student.query.filter_by(admission_number=identifier).first()
    if student and student.check_password(password):
        return jsonify({"message": "Student login successful"}), 200

    # Check for staff login
    staff = Staff.query.filter_by(name=identifier).first()
    if staff and staff.check_password(password):
        return jsonify({"message": "Staff login successful"}), 200

    return jsonify({"message": "Invalid credentials"}), 401

@routes.route('/delete_staff/<int:id>', methods=['DELETE'])
def delete_staff(id):
    staff = Staff.query.get_or_404(id)
    db.session.delete(staff)
    db.session.commit()
    
    return jsonify({"message": "Staff deleted successfully"}), 200

@routes.route('/fees', methods=['POST'])
def create_fee():
    data = request.get_json()
    term_id = data['term_id']
    grade = data['grade']
    amount = data['amount']

    fee = Fee(term_id=term_id, grade=grade, amount=amount)
    db.session.add(fee)
    db.session.commit()

    return jsonify({
        'message': 'Fee record created successfully',
        'fee': {
            'term_id': term_id,
            'grade': grade,
            'amount': amount
        }
    })

@routes.route('/students', methods=['GET'])
def get_students():
    students = Student.query.all()
    return jsonify([student.name for student in students])

@routes.route('/students/<int:id>', methods=['GET'])
def get_student(id):
    student = Student.query.get(id)
    if student:
        return jsonify({
            'id': student.id,
            'name': student.name,
            'grade': student.grade,
            'balance': student.balance,
            'bus_balance': student.bus_balance,
            'is_boarding': student.is_boarding
        })
    return jsonify({"error": "Student not found"}), 404

@routes.route('/payments', methods=['POST'])
def create_payment():
    data = request.get_json()
    student_id = data['student_id']
    amount = data['amount']
    payment_method = data['payment_method']

    payment = Payment(student_id=student_id, amount=amount, method=payment_method)
    db.session.add(payment)
    
    student = Student.query.get(student_id)
    if student:
        student.balance -= amount
    
    db.session.commit()
    
    return jsonify({
        'message': 'Payment created successfully',
        'payment': {
            'student_id': student_id,
            'amount': amount,
            'payment_date': payment.date
        }
    })

@routes.route('/get_student_bus_destinations/<int:student_id>', methods=['GET'])
def get_student_bus_destinations(student_id):
    student = Student.query.get(student_id)
    if not student:
        return jsonify({"error": "Student not found"}), 404

    bus_destinations = student.bus_destinations  # Use the relationship to get bus destinations
    result = [{
        'bus_destination': destination.name,
        'charge': destination.charge
    } for destination in bus_destinations]
    
    return jsonify(result), 200

@routes.route('/create-term', methods=['POST'])
def create_term():
    data = request.get_json()
    name = data['name']
    start_date = datetime.strptime(data['start_date'], '%Y-%m-%d')
    end_date = datetime.strptime(data['end_date'], '%Y-%m-%d')

    term = Term(name=name, start_date=start_date, end_date=end_date)
    db.session.add(term)
    db.session.commit()
    
    return jsonify({"message": "Term created successfully", "term": {
        'id': term.id,
        'name': term.name,
        'start_date': term.start_date,
        'end_date': term.end_date
    }})

@routes.route('/terms', methods=['GET'])
def get_terms():
    terms = Term.query.all()
    return jsonify([{
        'id': term.id,
        'name': term.name,
        'start_date': term.start_date,
        'end_date': term.end_date
    } for term in terms])

@routes.route('/bus-payments', methods=['POST'])
def create_bus_payment():
    data = request.get_json()
    student_id = data['student_id']
    amount = data['amount']
    term_id = data['term_id']
    destination_id = data.get('destination_id', None)

    bus_payment = BusPayment(
        student_id=student_id,
        term_id=term_id,
        amount=amount,
        destination_id=destination_id
    )
    db.session.add(bus_payment)
    db.session.commit()

    # Update the student's bus balance
    bus_payment.update_student_bus_balance()

    return jsonify({
        'message': 'Bus payment created successfully',
        'bus_payment': {
            'student_id': student_id,
            'amount': amount,
            'payment_date': bus_payment.payment_date
        }
    })

@routes.route('/bus-destinations', methods=['GET'])
def get_bus_destinations():
    destinations = BusDestination.query.all()
    return jsonify([{
        'id': destination.id,
        'name': destination.name,
        'charge': destination.charge
    } for destination in destinations])

@routes.route('/assign-student-to-bus', methods=['POST'])
def assign_student_to_bus():
    data = request.get_json()
    student_id = data['student_id']
    destination_id = data['destination_id']

    student = Student.query.get(student_id)
    destination = BusDestination.query.get(destination_id)

    if not student or not destination:
        return jsonify({"error": "Student or Bus Destination not found"}), 404

    # Check if the student is already assigned to this destination
    if destination in student.bus_destinations:
        return jsonify({"message": "Student is already assigned to this bus destination"})

    # Assign the student to the bus destination
    student.bus_destinations.append(destination)
    db.session.commit()

    return jsonify({"message": "Student assigned to bus destination successfully"})

@routes.route('/fees/<int:term_id>', methods=['GET'])
def get_fees_for_term(term_id):
    fees = Fee.query.filter_by(term_id=term_id).all()
    return jsonify([{
        'id': fee.id,
        'grade': fee.grade,
        'amount': fee.amount,
        'is_paid': fee.is_paid
    } for fee in fees])

@routes.route('/gallery', methods=['POST'])
def add_gallery_item():
    data = request.get_json()
    image_url = data['image_url']
    description = data.get('description', None)

    gallery_item = Gallery(image_url=image_url, description=description)
    db.session.add(gallery_item)
    db.session.commit()

    return jsonify({
        'message': 'Gallery item added successfully',
        'gallery_item': {
            'image_url': image_url,
            'description': description
        }
    })

@routes.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
    return jsonify([{
        'id': event.id,
        'title': event.title,
        'date': event.date,
        'destination': event.destination
    } for event in events])

@routes.route('/events', methods=['POST'])
def create_event():
    data = request.get_json()
    title = data['title']
    description = data['description']
    date = datetime.strptime(data['date'], '%Y-%m-%d %H:%M:%S')  # Convert string to datetime
    destination = data['destination']

    event = Event(title=title, description=description, date=date, destination=destination)
    db.session.add(event)
    db.session.commit()

    return jsonify({
        'message': 'Event created successfully',
        'event': {
            'title': title,
            'description': description,
            'date': event.date,
            'destination': destination
        }
    })

@routes.route('/notifications', methods=['GET'])
def get_notifications():
    notifications = Notification.query.all()
    return jsonify([{
        'id': notification.id,
        'message': notification.message,
        'date': notification.date
    } for notification in notifications])

@routes.route('/notifications', methods=['POST'])
def add_notification():
    data = request.get_json()
    message = data['message']

    notification = Notification(message=message)
    db.session.add(notification)
    db.session.commit()

    return jsonify({
        'message': 'Notification added successfully',
        'notification': {
            'message': message,
            'date': notification.date
        }
    })

