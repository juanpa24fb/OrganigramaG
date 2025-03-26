let width = 1000, height = 800;
let svg = d3.select("svg"), g = svg.append("g").attr("transform", "translate(100,100)");
let zoom = d3.zoom().scaleExtent([0.5, 2]).on("zoom", (event) => g.attr("transform", event.transform));
svg.call(zoom);

let links = [];
let nodesData = [];
// Definir el marcador de flecha


function actualizarOrganigrama() {
    fetch('/nodos')
        .then(response => response.json())
        
        .then(data => {
            let root = d3.stratify().id(d => d.id).parentId(d => d.parent_id)(data);
            let treeLayout = d3.tree().size([width - 200, height - 200]);
            treeLayout(root);

            g.selectAll("*").remove();
            
            // Dibujar enlaces (líneas)
links = g.selectAll(".link")
    .data(root.links())
    .enter()
    .append("path")
    .attr("class", d => d.target.data.tipo === "asesoria" ? "link dashed" : "link")
    .attr("d", d => lineaRecta(d))
    .attr("stroke", "black")  // Color de la línea
    .attr("fill", "none")
    .attr("marker-end", "url(#arrowhead)");  // Asignar la flecha al final
    g.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 35)  // Aumenta este valor para ajustarlo al tamaño del rectángulo
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")  // Forma de la flecha
    .attr("fill", "black");

            // Dibujar nodos
            nodesData = g.selectAll(".node")
                .data(root.descendants())
                .enter()
                .append("g")
                .attr("class", "node")
                .attr("transform", d => `translate(${d.x}, ${d.y})`)
                .call(d3.drag()
                    .on("drag", function(event, d) {
                        d.x += event.dx;
                        d.y += event.dy;
                        d3.select(this).attr("transform", `translate(${d.x}, ${d.y})`);
                        links.attr("d", d => lineaRecta(d)); // Actualiza líneas
                    })
                )
                .on("click", function(event, d) {
                    event.stopPropagation();
                    document.getElementById("parentId").value = d.data.id;
                });

            nodesData.each(function(d) {
                let node = d3.select(this);
                let textElement = node.append("text")
    .attr("x", 0)
    .attr("y", 5)
    .attr("text-anchor", "middle")
    .text(`${d.data.nombre} `)
    .style("cursor", "text")
    .attr("contenteditable", "true")
    .on("dblclick", function (event, d) {
        let textNode = d3.select(this);
        let input = document.createElement("input");
        input.type = "text";
        input.value = d.data.nombre;
        input.style.position = "absolute";
        input.style.left = `${event.pageX}px`;
        input.style.top = `${event.pageY}px`;

        document.body.appendChild(input);
        input.focus();

        input.addEventListener("blur", function () {
            d.data.nombre = input.value;
            textNode.text(d.data.nombre);
            document.body.removeChild(input);
        });

        input.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                input.blur();
            }
        });
    });

                
                let bbox = textElement.node().getBBox();
                let color = d.data.color || "#87CEEB"; // Celeste por defecto

                if (d.data.forma === "circle") {
                    node.append("circle")
                        .attr("r", 30)
                        .attr("fill", color)
                        .attr("stroke", "black")
                        .attr("stroke-width", 2);
                } else if (d.data.forma === "ellipse") {
                    node.append("ellipse")
                        .attr("rx", bbox.width / 2 + 10)
                        .attr("ry", 30)
                        .attr("fill", color)
                        .attr("stroke", "black")
                        .attr("stroke-width", 2);
                } else {
                    node.insert("rect", "text")
                        .attr("width", bbox.width + 20)
                        .attr("height", bbox.height + 10)
                        .attr("x", -((bbox.width + 20) / 2))
                        .attr("y", -(bbox.height / 2))
                        .attr("rx", 10)
                        .attr("ry", 10)
                        .attr("fill", color)
                        .attr("stroke", "black")
                        .attr("stroke-width", 2);
                }
            });

            nodesData.append("text")
                .attr("class", "deleteBtn")
                .attr("x", 40)
                .attr("y", -10)
                .text("❌")
                .style("cursor", "pointer")
                .on("click", function(event, d) {
                    event.stopPropagation();
                    fetch('/nodos/' + d.data.id, { method: 'DELETE' })
                        .then(() => actualizarOrganigrama());
                });
                nodesData = g.selectAll(".node")
    .data(root.descendants())
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${d.x}, ${d.y})`)
    .call(d3.drag()
        .on("drag", function(event, d) {
            d.x += event.dx;
            d.y += event.dy;
            d3.select(this).attr("transform", `translate(${d.x}, ${d.y})`);
            links.attr("d", d => lineaRecta(d)); // Actualiza líneas
        })
    )
    .on("click", function(event, d) {
        event.stopPropagation();

        // Quitar la clase "selected" de todos los nodos
        g.selectAll(".node").classed("selected", false);

        // Agregar la clase "selected" al nodo actual
        d3.select(this).classed("selected", true);

        // Actualizar el campo de parentId en el formulario
        document.getElementById("parentId").value = d.data.id;
    });
        });
}

// Función que dibuja solo líneas rectas (horizontal y vertical)
function lineaRecta(d) {
    let x1 = d.source.x,
        y1 = d.source.y,
        x2 = d.target.x,
        y2 = d.target.y;

    return `M${x1},${y1} L${x2},${y1} L${x2},${y2}`;
}

actualizarOrganigrama();

document.getElementById("nodeForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let nombre = document.getElementById("nombre").value;
    let tipo = document.getElementById("tipo").value;
    let forma = document.getElementById("forma").value;
    let color = document.getElementById("color").value;
    let parentId = document.getElementById("parentId").value;
    
    fetch('/nodos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, tipo, forma, color, parent_id: parentId || null })
    }).then(() => {
        actualizarOrganigrama();
        document.getElementById("nodeForm").reset();
    });
});