import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach minimal user footprint data back to request pipeline
      req.user = { id: decoded.id, email: decoded.email };
      return next();
    } catch (error) {
      return res.status(401).json({ error: 'Not authorized, token validation failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token payload provided' });
  }
};