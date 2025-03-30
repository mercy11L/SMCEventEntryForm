import os

@app.route('/submit', methods=['POST'])
def submit_form():
    # Get data from the form
    name = request.form['name']
    email = request.form['email']

    # Generate PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="User Details", ln=True, align='C')
    pdf.ln(10)  # Line break
    pdf.cell(200, 10, txt=f"Name: {name}", ln=True)
    pdf.cell(200, 10, txt=f"Email: {email}", ln=True)

    # Save the file with absolute path
    file_path = os.path.join(os.getcwd(), "user_details.pdf")
    pdf.output(file_path)

    # Send the file
    return send_file(file_path, as_attachment=True)
