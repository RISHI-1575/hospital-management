from flask import Flask, request, jsonify, render_template, redirect, session
from datetime import datetime, timedelta
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "secret_key"

# Database connection
def db_connection():
    conn = sqlite3.connect('hospital.db')
    conn.row_factory = sqlite3.Row
    return conn

# Initialize database
def init_db():
    conn = db_connection()
    cursor = conn.cursor()

    # Users table
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL
    )''')

    # Beds table
    cursor.execute('''CREATE TABLE IF NOT EXISTS beds (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hospital_name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'available',
        patient_id INTEGER
    )''')

    # Inventory table
    cursor.execute('''CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        expiry_date DATE NOT NULL
    )''')

    # Appointments table
    cursor.execute('''CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        contact TEXT NOT NULL,
        slot_time DATETIME NOT NULL,
        status TEXT NOT NULL DEFAULT 'waiting'
    )''')

    conn.commit()
    conn.close()

# Routes for authentication
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        conn = db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()

        if user and check_password_hash(user['password'], password):
            session['user_id'] = user['id']
            session['role'] = user['role']
            if user['role'] == 'admin':
                return redirect('/admin')
            else:
                return redirect('/user')
        else:
            return "Invalid credentials. Try again!"

    return render_template('index.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = generate_password_hash(request.form['password'])
        role = request.form['role']

        conn = db_connection()
        cursor = conn.cursor()

        try:
            cursor.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', 
                           (username, password, role))
            conn.commit()
            return redirect('/')
        except sqlite3.IntegrityError:
            return "Username already exists. Try a different one."

    return render_template('signup.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')

# Routes for admin
@app.route('/admin')
def admin_dashboard():
    if 'role' in session and session['role'] == 'admin':
        return render_template('admin.html')
    return redirect('/')

# Routes for user
@app.route('/user')
def user_dashboard():
    if 'role' in session and session['role'] == 'user':
        return render_template('user.html')
    return redirect('/')

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
