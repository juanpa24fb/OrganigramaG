from flask import Blueprint, render_template, request, jsonify
from .models import db, Nodo

nodos_bp = Blueprint('nodos', __name__)

@nodos_bp.route('/')
def home():
    return render_template('index.html')

@nodos_bp.route('/nodos', methods=['GET'])
def obtener_nodos():
    nodos = Nodo.query.all()
    data = [{'id': n.id, 'nombre': n.nombre, 'tipo': n.tipo, 'color': n.color, 'parent_id': n.parent_id, 'x': n.x, 'y': n.y} for n in nodos]
    return jsonify(data)

@nodos_bp.route('/nodos', methods=['POST'])
def crear_nodo():
    data = request.json
    nuevo_nodo = Nodo(nombre=data['nombre'], tipo=data['tipo'], color=data.get('color', '#ffffff'), parent_id=data.get('parent_id'))
    db.session.add(nuevo_nodo)
    db.session.commit()
    return jsonify({'mensaje': 'Nodo creado', 'id': nuevo_nodo.id}), 201

@nodos_bp.route('/nodos/<int:id>', methods=['PUT'])
def actualizar_nodo(id):
    data = request.json
    nodo = Nodo.query.get(id)
    if nodo:
        nodo.nombre = data.get('nombre', nodo.nombre)
        nodo.tipo = data.get('tipo', nodo.tipo)
        nodo.color = data.get('color', nodo.color)
        nodo.x = data.get('x', nodo.x)
        nodo.y = data.get('y', nodo.y)
        db.session.commit()
        return jsonify({'mensaje': 'Nodo actualizado'}), 200
    return jsonify({'error': 'Nodo no encontrado'}), 404

@nodos_bp.route('/nodos/<int:id>', methods=['DELETE'])
def eliminar_nodo(id):
    nodo = Nodo.query.get(id)
    if nodo:
        db.session.delete(nodo)
        db.session.commit()
        return jsonify({'mensaje': 'Nodo eliminado'}), 200
    return jsonify({'error': 'Nodo no encontrado'}), 404
