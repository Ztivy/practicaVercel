export default function handler(req, res) {
res.setHeader('Content-Type', 'application/json');
res.setHeader('Access-Control-Allow-Origin', '*');
res.status(200).json({
mensaje: 'Bienvenido a mi API desplegada en Vercel',
version: '1.0.0',
endpoints: {
usuarios: '/api/usuarios',
productos: '/api/productos',
},
timestamp: new Date().toISOString(),
});
}