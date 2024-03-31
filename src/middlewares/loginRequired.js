import jwt from 'jsonwebtoken';
import User from '../models/User';

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      errors: ['Login required'],
    });
  }

  const [, token] = authorization.split(' '); // captura o token do head

  try {
    const dados = jwt.verify(token, process.env.TOKEN_SECRET); /* Verifica se o token
    no head equivale ao token no .env e envia para dados */
    const { id, email } = dados; // retira id e email dos dados

    const user = await User.findOne({ /* Verifica se existe um usuário com id e
    Email igual ao do token */
      where: {
        id,
        email,
      },
    });

    if (!user) { // Caso o email seja alterado, será preciso um novo token
      return res.status(401).json({
        errors: ['Usuário inválido'],
      });
    }

    req.userId = id;
    req.userEmail = email;
    return next();
  } catch (e) {
    return res.status(401).json({
      errors: ['Token expirado ou inválido'],
    });
  }
};
