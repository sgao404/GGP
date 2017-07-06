from flask import Flask, render_template, flash, session, url_for, request, redirect, abort, jsonify
from flask_bootstrap import Bootstrap
from flask import Markup
from cms import Content, gen_port, gen_tooltip
from flask_wtf import Form
from flask_wtf.csrf import CSRFProtect
from wtforms import StringField, PasswordField, SubmitField, HiddenField, RadioField
from wtforms.validators import InputRequired, Length, Regexp, Email
from flask_sqlalchemy import SQLAlchemy
from flask_script import Shell, Manager
from flask_migrate import Migrate, MigrateCommand
from werkzeug.utils import secure_filename
from werkzeug.debug import DebuggedApplication
import json
import os, sys
from flask_debugtoolbar import DebugToolbarExtension
import hashlib

# cms delivery
TOPIC_DICT = Content()
P_LIST = gen_port()
TIP_DICT = gen_tooltip()
P_MAP = P_LIST # key/img map

UPLOAD_FOLDER = '/static/images/click'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])
basedir = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__)
#csrf = CSRFProtect(app)
app.debug = True
app.wsgi_app = DebuggedApplication(app.wsgi_app, True)
app.config['SECRET_KEY'] = ''
toolbar = DebugToolbarExtension(app)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
bootstrap = Bootstrap(app)
manager = Manager(app)
app.config['SQLALCHEMY_DATABASE_URI'] ='sqlite:///' + os.path.join(basedir,'dbb','data.sqlite')
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
db = SQLAlchemy(app)

migrate = Migrate(app,db)
manager.add_command('db', MigrateCommand)

'''
python __init__.py shell
from __init__ import db
db.create_all()

from __init__ import User
user_sida = User(username='gaosida', )
db.session.add(user_sida)
db.session.commit()
'''
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, index=True)
    clickpoints1 = db.Column(db.String(80))
    clickpoints2 = db.Column(db.String(80))
    clickimg1 = db.Column(db.String(80))
    clickimg2 = db.Column(db.String(80))
    portfolio = db.Column(db.String(80))

    def __init__(self, username, clickpoints1, clickpoints2, portfolio, clickimg1, clickimg2):
        self.username = username
        self.clickpoints1 = clickpoints1
        self.clickpoints2 = clickpoints2
        self.clickimg1 = clickimg1
        self.clickimg2 = clickimg2
        self.portfolio = portfolio

    def __repr__(self):
        return '<User %r>' % self.username


@app.route('/')
def homepage():
    return render_template("main.html") 

class SignupForm(Form):
    username = StringField('Username',validators=[
        InputRequired(), Length(6,12), Regexp('^[A-Za-z][A-Za-z0-9_.]*$', 0,
                                            'Usernames must have only letters, '
                                            'numbers, dots or underscores. And length between 6 to 10.')])
    clickpoints1 = HiddenField('clickpoints1',validators=[
        InputRequired(), Length(6,6), Regexp('[A-Za-z0-9,]*$', 0,'Invalid Click-Image Password!')])
    clickpoints2 = HiddenField('clickpoints2',validators=[
        InputRequired(), Length(6,6), Regexp('[A-Za-z0-9,]*$', 0,'Invalid Click-Image Password!')])
    portfolio = HiddenField('portfolio',validators=[
        InputRequired(), Length(24,24), Regexp('[A-Za-z0-9.,]*$', 0,'Invalid Portfolio Password!')])
    submit = SubmitField('')
    
@app.route('/signup/', methods=['POST','GET'])
def signup():
    form = SignupForm()
    try:
        if form.validate_on_submit():
            '''
            flash(form.username.data)
            flash(form.clickpoints1.data)
            flash(form.clickpoints2.data)
            flash(form.portfolio.data)
            flash('You can now login.','success')
            '''

            # hash three password before to database
            cp1 = hashlib.sha256(str(form.clickpoints1.data)).hexdigest()
            cp2 = hashlib.sha256(str(form.clickpoints2.data)).hexdigest()
            pp = hashlib.sha256(str(form.portfolio.data)).hexdigest()

            if User.query.filter_by(username=form.username.data).first():
                flash('Username already in use.')

            #if user_exist is not None and 
            user = User(username=form.username.data,
                        clickpoints1=form.clickpoints1.data,
                        clickpoints2=form.clickpoints2.data,
                        portfolio=form.portfolio.data,
                        clickimg1='images/cat.jpg',
                        clickimg2='images/gd.jpg')

            db.session.add(user)
            db.session.commit()
            return redirect(url_for('login'))
        return render_template('signup.html',collection=P_LIST, form=form)
    except Exception as e:
        db.session.rollback()
        return render_template("500.html",error=str(e))


'''
@app.route('/checkusername/', methods=['POST'])
def checkusername():
    if request.is_xhr:
        return json.dumps({'status':'OK','msg':'Username is availiable!'})
'''

@app.route('/dashboard/')
def dashboard():
    flash("helwowo sldsaldlad")
    return render_template('dashboard.html', TOPIC_DICT = TOPIC_DICT)

class LoginForm(Form):
    username = StringField('Username',validators=[
        InputRequired(), Length(1,64), Regexp('^[A-Za-z][A-Za-z0-9_.]*$', 0,
                                            'Usernames must have only letters, '
                                            'numbers, dots or underscores')])
    clickpoints = HiddenField('clickpoints')
    portfolio = HiddenField('portfolio')
 
@app.route('/login/', methods=['GET','POST'])
def login():
    form = LoginForm()
    status = 'username'
    try:
        if form.validate_on_submit():
            if User.query.filter_by(username=form.username.data).first():
                status = 'click'
                #flash(Markup('<h1>Valid username</h1>. Now enter your graphical password!'),'success')
        return render_template('login.html',form=form,status=status,collection=P_LIST)
    except Exception as e:
        return render_template("500.html",error=str(e))

'''
@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out.')
    return redirect(url_for('main.html'))
'''

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500


if __name__ == "__main__":
    db.create_all()
    manager.run()

