from app import create_app, db
from flask_migrate import Migrate
from flask_script import Manager

app = create_app()
migrate = Migrate(app, db)

manager = Manager(app)
manager.add_command('db', Migrate)

if __name__ == "__main__":
    manager.run()
