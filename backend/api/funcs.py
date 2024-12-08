import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_email(reciever, title, msg):
    # Email configuration
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_user = 'elahinexustech@gmail.com'
    smtp_password = 'mckj pemg enik pjwh'
    
    # Email content
    from_email = 'elahinexustech@gmail.com'
    to_email = reciever
    subject = title
    body = msg
    
    # Create the email message
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))  # Use 'plain' for plain text
    
    # Connect to the SMTP server and send the email
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Upgrade the connection to secure
        server.login(smtp_user, smtp_password)
        server.send_message(msg)
        return True
    except Exception as e:
        return False
    finally:
        server.quit()
    return 0