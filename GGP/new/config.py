import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
	SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard to guess string'
	SQLALCHEMY_COMMIT_ON_TEARDOWN = True
	SQL_USERNAME = os.environ.get('SQL_USERNAME') or 'root'
	SQL_PASSWORD = os.environ.get('SQL_PASSWORD') or '352298gsd'
	SEND_FILE_MAX_AGE_DEFAULT = 0
	SQLALCHEMY_TRACK_MODIFICATIONS = True
	
	@staticmethod
	def init_app(app):
		pass

class DevelopmentConfig(Config):
	DEBUG = True
	SQLALCHEMY_DATABASE_URI = 'mysql://'+SQL_USERNAME+':'+SQL_PASSWORD+'@localhost/ggp'

class TestingConfig(Config):
	TESTING = True
	SQLALCHEMY_DATABASE_URI = 'mysql://'+SQL_USERNAME+':'+SQL_PASSWORD+'@localhost/ggp'

class ProductionConfig(Config):
	SQLALCHEMY_DATABASE_URI = 'mysql://'+SQL_USERNAME+':'+SQL_PASSWORD+'@localhost/ggp'

config = {
	'development': DevelopmentConfig,
	'testing': TestingConfig,
	'production': ProductionConfig,
	'default': DevelopmentConfig
}