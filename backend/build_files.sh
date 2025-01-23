echo "Starting Build for BlogGums 2.0 Backend Engine!"
echo "Installing Required Libraries"
python3 -m pip install -r requirements.txt
python3 manage.py collectstatic --noinput --clear
echo "BUILD END"