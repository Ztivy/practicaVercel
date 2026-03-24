// api/usuarios.js
import supabase from '../lib/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(204).end();
  }

  const { method, query, body } = req;

  // ─── GET ───────────────────────────────────────────────
  if (method === 'GET') {
    if (query.id) {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', query.id)
        .single();

      if (error) return res.status(404).json({ error: 'Usuario no encontrado' });
      return res.status(200).json(data);
    }

    const { data, error } = await supabase.from('usuarios').select('*');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  // ─── POST ──────────────────────────────────────────────
  if (method === 'POST') {
    const { nombre, email, edad } = body;

    if (!nombre || !email) {
      return res.status(400).json({ error: 'nombre y email son requeridos' });
    }

    if (edad !== undefined && (typeof edad !== 'number' || edad < 0)) {
      return res.status(400).json({ error: 'edad debe ser un número positivo' });
    }

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, email, edad: edad ?? null }])
      .select()
      .single();

    if (error) {
      // Email duplicado
      if (error.code === '23505') {
        return res.status(409).json({ error: 'El email ya está registrado' });
      }
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(data);
  }

  // ─── PUT ───────────────────────────────────────────────
  if (method === 'PUT') {
    if (!query.id) {
      return res.status(400).json({ error: 'Se requiere ?id=N en la URL' });
    }

    const { nombre, email, edad } = body;

    if (!nombre && !email && edad === undefined) {
      return res.status(400).json({ error: 'Envía al menos un campo a actualizar' });
    }

    // Solo incluye los campos que vienen en el body
    const campos = {};
    if (nombre)           campos.nombre = nombre;
    if (email)            campos.email  = email;
    if (edad !== undefined) campos.edad = edad;

    const { data, error } = await supabase
      .from('usuarios')
      .update(campos)
      .eq('id', query.id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({ error: 'El email ya está registrado' });
      }
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json(data);
  }

  // ─── DELETE ────────────────────────────────────────────
  if (method === 'DELETE') {
    if (!query.id) {
      return res.status(400).json({ error: 'Se requiere ?id=N en la URL' });
    }

    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', query.id);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ mensaje: 'Usuario eliminado correctamente' });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Método ${method} no permitido` });
}