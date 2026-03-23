// api/productos.js
const productos = [
{ id: 1, nombre: 'Laptop Pro', precio: 25000, categoria: 'Electrónica' },
{ id: 2, nombre: 'Teclado Mecánico', precio: 1800, categoria: 'Periféricos'
},
{ id: 3, nombre: 'Monitor 4K', precio: 8500, categoria: 'Electrónica' },
];
export default function handler(req, res) {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Content-Type', 'application/json');
const { method, query } = req;
if (method === 'GET') {
// Filtrar por categoría si se pasa ?categoria=X
if (query.categoria) {
const filtrados = productos.filter(
p => p.categoria.toLowerCase() === query.categoria.toLowerCase()
);
return res.status(200).json(filtrados);
}
return res.status(200).json(productos);
}
res.setHeader('Allow', ['GET']);
res.status(405).json({ error: `Método ${method} no permitido` });
}