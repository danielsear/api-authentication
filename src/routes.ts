import { Router } from 'express'
import { UserController } from './controllers/UserController'
import { LoginController } from './controllers/LoginController'
import { authMiddleware } from './middlewares/authMiddleware'

const routes = Router()

routes.post('/user', new UserController().create)
routes.post('/login', new LoginController().login)
routes.get('/list', new UserController().list)


routes.use(authMiddleware)
//routes.get('/profile', authMiddleware,new LoginController().getProfile)
routes.get('/profile', new LoginController().getProfile)






export default routes
