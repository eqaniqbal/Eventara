from fastapi import FastAPI, HTTPException, Depends, Form, UploadFile, File, Path
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from datetime import datetime
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from passlib.context import CryptContext
from dotenv import load_dotenv

# -------------------------
# LOAD ENV
# -------------------------
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

# -------------------------
# DATABASE CONNECTION
# -------------------------
def get_db():
    conn = psycopg2.connect(DATABASE_URL)
    try:
        yield conn
    finally:
        conn.close()

# -------------------------
# PASSWORD HASHING
# -------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def safe_truncate(password: str, max_bytes: int = 72) -> str:
    encoded = password.encode('utf-8')
    if len(encoded) <= max_bytes:
        return password
    return encoded[:max_bytes].decode('utf-8', errors='ignore')

def hash_password(password: str) -> str:
    truncated = safe_truncate(password)
    return pwd_context.hash(truncated)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    truncated = safe_truncate(plain_password)
    return pwd_context.verify(truncated, hashed_password)

# -------------------------
# FASTAPI APP
# -------------------------
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"]
)

# Serve uploads folder
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# -------------------------
# SCHEMAS
# -------------------------
class RegisterUser(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "attendee"

class LoginUser(BaseModel):
    email: EmailStr
    password: str

# -------------------------
# USER REGISTRATION
# -------------------------
@app.post("/register")
def register_user(user: RegisterUser):
    with psycopg2.connect(DATABASE_URL) as conn:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Email already registered")
        hashed_pw = hash_password(user.password)
        cursor.execute(
            
            "INSERT INTO users (name, email, password, role) VALUES (%s, %s, %s, %s) RETURNING id, name, email, role",
            (
                user.name,
                user.email.strip().lower(),   # ✅ store lowercase email
                hashed_pw,
                user.role
            )
        )
        conn.commit()#save changes
        new_user = cursor.fetchone()
        return {"message": "User registered successfully", "user": new_user}

# -------------------------
# USER LOGIN
# -------------------------
@app.post("/login")
def login_user(user: LoginUser):
    with psycopg2.connect(DATABASE_URL) as conn:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute(
    "SELECT * FROM users WHERE LOWER(email) = LOWER(%s)",
    (user.email.strip(),)
)
        db_user = cursor.fetchone()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        if not verify_password(user.password, db_user["password"]):
            raise HTTPException(status_code=401, detail="Incorrect password")
        return {
            "message": "Login successful",
            "user": {
                "id": db_user["id"],
                "name": db_user["name"],
                "email": db_user["email"],
                "role": db_user["role"]
            }
        }

# -------------------------
# CREATE EVENT
# -------------------------
@app.post("/events")
async def create_event(
    host_id: str = Form(...),
    title: str = Form(...),
    description: str = Form(""),
    date: str = Form(...),
    time: str = Form(...),
    location: str = Form(...),
    capacity: int = Form(...),
    price: float = Form(0),
    image: UploadFile = File(None),
    conn=Depends(get_db)
):
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    banner_url = None

    if image:
        os.makedirs("uploads", exist_ok=True)
        upload_path = f"uploads/{image.filename}"
        with open(upload_path, "wb") as f:
            f.write(await image.read())
        banner_url = f"/uploads/{image.filename}"

    cursor.execute(
        """
        INSERT INTO events
        (host_id, title, description, date, time, location, capacity, remaining_seats, price, banner_url)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING *
        """,
        (host_id, title, description, date, time, location, capacity, capacity, price, banner_url)
    )
    event = cursor.fetchone()
    conn.commit()
    return {"message": "Event created", "event": event}

# -------------------------
# GET ALL EVENTS
# -------------------------
@app.get("/events")
def get_all_events():
    with psycopg2.connect(DATABASE_URL) as conn:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT * FROM events ORDER BY date, time")
        events = cursor.fetchall()
        return {"events": events}

# -------------------------
# UPDATE EVENT
# -------------------------
@app.put("/events/{event_id}")
async def update_event(
    event_id: str = Path(...),
    title: str = Form(...),
    description: str = Form(""),
    date: str = Form(...),
    time: str = Form(...),
    location: str = Form(...),
    capacity: int = Form(...),
    price: float = Form(0),
    image: UploadFile = File(None),
    conn=Depends(get_db)
):
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    # Check event exists
    cursor.execute("SELECT * FROM events WHERE id = %s", (event_id,))
    existing_event = cursor.fetchone()
    if not existing_event:
        raise HTTPException(status_code=404, detail="Event not found")

    banner_url = existing_event["banner_url"]

    if image:
        os.makedirs("uploads", exist_ok=True)
        upload_path = f"uploads/{image.filename}"
        with open(upload_path, "wb") as f:
            f.write(await image.read())
        banner_url = f"/uploads/{image.filename}"

    cursor.execute(
        """
        UPDATE events
        SET title=%s, description=%s, date=%s, time=%s, location=%s,
            capacity=%s, remaining_seats=%s, price=%s, banner_url=%s
        WHERE id=%s
        RETURNING *
        """,
        (title, description, date, time, location, capacity, capacity, price, banner_url, event_id)
    )
    updated_event = cursor.fetchone()
    conn.commit()
    return {"message": "Event updated", "event": updated_event}

# -------------------------
# DELETE EVENT
# -------------------------
@app.delete("/events/{event_id}")
def delete_event(event_id: str):
    with psycopg2.connect(DATABASE_URL) as conn:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("DELETE FROM events WHERE id = %s RETURNING id", (event_id,))
        deleted = cursor.fetchone()
        conn.commit()
        if not deleted:
            raise HTTPException(status_code=404, detail="Event not found")
        return {"message": "Event deleted successfully"}

# -------------------------
# SHOW BOOKINGS FOR USER
# -------------------------
@app.get("/bookings/{user_id}")
def get_user_bookings(user_id: str, conn=Depends(get_db)):
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        """
        SELECT b.id, b.event_id, b.user_id, b.status, b.amount_paid,
               e.title, e.date, e.time, e.location
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        WHERE b.user_id = %s
        ORDER BY e.date, e.time
        """,
        (user_id,)
    )
    bookings = cursor.fetchall()
    return {"bookings": bookings}



@app.get("/events/{event_id}")
def get_event(event_id: int):
    with psycopg2.connect(DATABASE_URL) as conn:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("SELECT * FROM events WHERE id = %s", (event_id,))
        event = cursor.fetchone()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        return {"event": event}

# -------------------------
# USER CANCEL REQUEST
# -------------------------
@app.post("/bookings/cancel-request/{booking_id}")
def create_cancel_request(
    booking_id: str = Path(...),
    reason: str = Form(...),
    conn=Depends(get_db)
):
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    # Check booking exists and is cancellable
    cursor.execute(
        "SELECT * FROM bookings WHERE id = %s AND status='booked'",
        (booking_id,)
    )
    booking = cursor.fetchone()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found or cannot cancel")

    # Check existing pending refund
    cursor.execute(
        "SELECT * FROM refunds WHERE booking_id = %s AND status='pending'",
        (booking_id,)
    )
    existing = cursor.fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="Refund request already pending")

    cursor.execute(
        "INSERT INTO refunds (booking_id, reason, status) VALUES (%s, %s, 'pending') RETURNING *",
        (booking_id, reason)
    )
    refund = cursor.fetchone()
    conn.commit()
    return {"message": "Cancel request sent to owner", "refund": refund}

# -------------------------
# CREATE BOOKING
# -------------------------
@app.post("/bookings/{event_id}/{user_id}")
def book_event(
    event_id: str = Path(...),
    user_id: str = Path(...),
    quantity: int = Form(1),
    conn=Depends(get_db)
):
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    # Validate quantity
    if quantity < 1:
        raise HTTPException(status_code=400, detail="Quantity must be at least 1")

    # Check if user already has an active booking
    cursor.execute(
        """
        SELECT * FROM bookings 
        WHERE event_id=%s AND user_id=%s AND status='booked'
        """,
        (event_id, user_id)
    )
    if cursor.fetchone():
        raise HTTPException(
            status_code=400,
            detail="You have already booked this event"
        )

    # Check seat availability
    cursor.execute(
        "SELECT remaining_seats, price FROM events WHERE id=%s",
        (event_id,)
    )
    event = cursor.fetchone()

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if event["remaining_seats"] < quantity:
        raise HTTPException(
            status_code=400,
            detail="Not enough seats available"
        )

    # Update remaining seats
    new_seats = event["remaining_seats"] - quantity
    cursor.execute(
        "UPDATE events SET remaining_seats=%s WHERE id=%s",
        (new_seats, event_id)
    )

    # Calculate total price
    total_amount = event["price"] * quantity

    # Create booking
    cursor.execute(
        """
        INSERT INTO bookings 
        (event_id, user_id, quantity, status, amount_paid)
        VALUES (%s, %s, %s, 'booked', %s)
        RETURNING *
        """,
        (event_id, user_id, quantity, total_amount)
    )

    booking = cursor.fetchone()
    conn.commit()

    return {
        "message": "Booking successful",
        "booking": booking,
        "remaining_seats": new_seats
    }

# -------------------------
# APPROVE / REJECT REFUNDS
# -------------------------
@app.post("/refunds/{refund_id}/approve")
@app.post("/refunds/{refund_id}/approve")
def approve_refund(refund_id: str, conn=Depends(get_db)):
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute(
        """
        SELECT r.id, r.booking_id, b.event_id, b.quantity
        FROM refunds r
        JOIN bookings b ON r.booking_id = b.id
        WHERE r.id=%s AND r.status='pending'
        """,
        (refund_id,)
    )
    refund = cursor.fetchone()

    if not refund:
        raise HTTPException(
            status_code=404,
            detail="Refund request not found or already processed"
        )

    # Approve refund
    cursor.execute(
        "UPDATE refunds SET status='approved' WHERE id=%s",
        (refund_id,)
    )

    # Update booking
    cursor.execute(
        "UPDATE bookings SET status='refunded' WHERE id=%s",
        (refund["booking_id"],)
    )

    # Restore seats correctly
    cursor.execute(
        """
        UPDATE events
        SET remaining_seats = remaining_seats + %s
        WHERE id=%s
        """,
        (refund["quantity"], refund["event_id"])
    )

    conn.commit()

    return {"message": "Refund approved successfully"}

@app.post("/refunds/{refund_id}/reject")
def reject_refund(refund_id: str, conn=Depends(get_db)):
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute("SELECT * FROM refunds WHERE id=%s AND status='pending'", (refund_id,))
    refund = cursor.fetchone()
    if not refund:
        raise HTTPException(status_code=404, detail="Refund request not found or already processed")
    cursor.execute("UPDATE refunds SET status='rejected' WHERE id=%s RETURNING *", (refund_id,))
    rejected_refund = cursor.fetchone()
    conn.commit()
    return {"message": "Refund rejected", "refund": rejected_refund}

# -------------------------
# GET PENDING REFUNDS FOR OWNER
# -------------------------
@app.get("/refunds/pending/{owner_id}")
def get_pending_refunds(owner_id: str, conn=Depends(get_db)):
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    cursor.execute(
        """
        SELECT r.id, r.booking_id, r.reason, r.status, b.user_id, u.name AS user_name,
               e.id AS event_id, e.title AS event_title
        FROM refunds r
        JOIN bookings b ON r.booking_id = b.id
        JOIN events e ON b.event_id = e.id
        JOIN users u ON b.user_id = u.id
        WHERE e.host_id = %s AND r.status='pending'
        ORDER BY r.id DESC
        """,
        (owner_id,)
    )
    requests = cursor.fetchall()
    return {"requests": requests}

# -------------------------
# GET ALL RESERVATIONS FOR OWNER
# -------------------------
@app.get("/reservations/owner/{owner_id}")
def get_owner_reservations(owner_id: str, conn=Depends(get_db)):
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    cursor.execute(
        """
        SELECT
            b.id AS booking_id,
            b.booking_time,
            b.status,
            b.quantity,
            b.amount_paid,
            u.name AS user_name,
            u.email AS user_email,
            e.title AS event_title,
            e.date,
            e.time,
            e.location
        FROM bookings b
        JOIN events e ON b.event_id = e.id
        JOIN users u ON b.user_id = u.id
        WHERE e.host_id = %s
        ORDER BY b.booking_time DESC
        """,
        (owner_id,)
    )

    reservations = cursor.fetchall()
    return {"reservations": reservations}
# -------------------------
# HOME ROUTE
# -------------------------
@app.get("/")
def home():
    return {"message": "FastAPI backend running!"}







