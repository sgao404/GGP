from . import db

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, index=True)
    clickpass = db.Column(db.String(80))
    portfoliopass = db.Column(db.String(80))
    permissions = db.Column(db.Integer, default=0)
    stat_id = db.Column(db.Integer, db.ForeignKey('stats.id'))
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))

    def __repr__(self):
        return '<User %r>' % self.username

class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    users = db.relationship('User', backref='role')

    def __repr__(self):
        return '<Role %r>' % self.name

class Stat(db.Model):
    __tablename__ = 'stats'
    id = db.Column(db.Integer, primary_key=True)
    creationtime = db.Column(db.Float)
    logintime = db.Column(db.Float)
    failtime = db.Column(db.Integer)
    users = db.relationship('User', backref='stat')
    
    def __repr__(self):
        return '<Stat %r>' % self.name