import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth';
import { printDocs } from '../controllers/documentController';

export default (router: Router) => {

  router.post('/print-document', authenticateToken, printDocs);

  return router; 
};

