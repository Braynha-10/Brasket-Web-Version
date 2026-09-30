import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import argon2 from 'argon2';
import dotenv from 'dotenv';
import { query, initDb } from './db.js';

dotenv.config();

const app = Fastify({ logger: true });

app.register(fastifyCors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
});

app.register(fastifyCookie);
app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'super-secret-dev-key'
});

app.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// === AUTH ROUTES ===
app.post('/api/auth/register', async (req, reply) => {
  const { email, password } = req.body;
  if (!email || !password) return reply.code(400).send({ error: "Email e senha são obrigatórios" });

  try {
    const passwordHash = await argon2.hash(password);
    const result = await query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );
    
    const user = result.rows[0];
    const token = app.jwt.sign({ id: user.id, email: user.email });
    
    reply
      .setCookie('token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30 // 30 dias
      })
      .send({ user: { id: user.id, email: user.email } });
  } catch (error) {
    if (error.code === '23505') { // unique violation
      return reply.code(409).send({ error: "E-mail já cadastrado" });
    }
    app.log.error(error);
    reply.code(500).send({ error: "Erro interno do servidor" });
  }
});

app.post('/api/auth/login', async (req, reply) => {
  const { email, password } = req.body;
  if (!email || !password) return reply.code(400).send({ error: "Email e senha são obrigatórios" });

  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return reply.code(401).send({ error: "Credenciais inválidas" });

    const user = result.rows[0];
    const valid = await argon2.verify(user.password_hash, password);
    if (!valid) return reply.code(401).send({ error: "Credenciais inválidas" });

    const token = app.jwt.sign({ id: user.id, email: user.email });
    
    reply
      .setCookie('token', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30
      })
      .send({ user: { id: user.id, email: user.email } });
  } catch (error) {
    app.log.error(error);
    reply.code(500).send({ error: "Erro interno do servidor" });
  }
});

app.post('/api/auth/logout', async (req, reply) => {
  reply.clearCookie('token').send({ message: "Logout realizado" });
});

app.get('/api/auth/me', { onRequest: [app.authenticate] }, async (req, reply) => {
  reply.send({ user: req.user });
});

// === SAVES ROUTES ===
app.get('/api/saves', { onRequest: [app.authenticate] }, async (req, reply) => {
  try {
    const result = await query(
      'SELECT slot_id, version, metadata, updated_at FROM saves WHERE user_id = $1 ORDER BY slot_id ASC',
      [req.user.id]
    );
    reply.send({ saves: result.rows });
  } catch (error) {
    app.log.error(error);
    reply.code(500).send({ error: "Erro ao buscar saves" });
  }
});

app.get('/api/saves/:slotId', { onRequest: [app.authenticate] }, async (req, reply) => {
  const { slotId } = req.params;
  try {
    const result = await query(
      'SELECT * FROM saves WHERE user_id = $1 AND slot_id = $2',
      [req.user.id, slotId]
    );
    if (result.rows.length === 0) return reply.code(404).send({ error: "Save não encontrado" });
    reply.send({ save: result.rows[0] });
  } catch (error) {
    app.log.error(error);
    reply.code(500).send({ error: "Erro ao buscar save" });
  }
});

app.post('/api/saves/:slotId', { onRequest: [app.authenticate] }, async (req, reply) => {
  const { slotId } = req.params;
  const { league_data, career_data, metadata } = req.body;
  
  if (!league_data || !career_data) {
    return reply.code(400).send({ error: "Dados inválidos" });
  }

  try {
    const result = await query(
      `INSERT INTO saves (user_id, slot_id, league_data, career_data, metadata, version, updated_at)
       VALUES ($1, $2, $3, $4, $5, 1, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, slot_id) 
       DO UPDATE SET 
         league_data = EXCLUDED.league_data, 
         career_data = EXCLUDED.career_data, 
         metadata = EXCLUDED.metadata,
         version = saves.version + 1,
         updated_at = CURRENT_TIMESTAMP
       RETURNING slot_id, version, metadata, updated_at`,
      [req.user.id, slotId, league_data, career_data, metadata || {}]
    );
    
    reply.send({ save: result.rows[0] });
  } catch (error) {
    app.log.error(error);
    reply.code(500).send({ error: "Erro ao salvar jogo" });
  }
});

const start = async () => {
  try {
    await initDb();
    const port = process.env.PORT || 3000;
    await app.listen({ port, host: '0.0.0.0' });
    console.log(\`Servidor rodando na porta \${port}\`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
