from app import db


class Nodo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(7), nullable=True)  # Hexadecimal del color
    parent_id = db.Column(db.Integer, db.ForeignKey('nodo.id'), nullable=True)
    x = db.Column(db.Float, nullable=True)  # Coordenada X
    y = db.Column(db.Float, nullable=True)  # Coordenada Y
    x1 = db.Column(db.Float, nullable=True)  # Coordenada X de inicio de la línea
    y1 = db.Column(db.Float, nullable=True)  # Coordenada Y de inicio de la línea
    x2 = db.Column(db.Float, nullable=True)  # Coordenada X de fin de la línea
    y2 = db.Column(db.Float, nullable=True)  # Coordenada Y de fin de la línea