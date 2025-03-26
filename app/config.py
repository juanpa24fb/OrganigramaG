import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://Cristian:Cristian081620469@localhost/organigrama")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
