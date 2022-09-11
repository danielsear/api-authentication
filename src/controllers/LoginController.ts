
import { Request, Response } from "express";
import { BadRequestError, UnauthorizedError } from "../helpers/api-erros";
import { userRepository } from "../repositories/userRepository";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



export class LoginController {
  async login(req: Request, res: Response){
    const {password, email} = req.body

    const user = await userRepository.findOneBy({email})

    if(!user){
      throw new BadRequestError('E-mail ou senha inválidos.')
    }

    const verifyPassword = await bcrypt.compare(password,user.password)

    if(!verifyPassword){
        throw new BadRequestError('E-mail ou senha inválidos.')
    }

    const token = jwt.sign({id: user.id}, process.env.JWT_PASS ?? ' ',{
      expiresIn: '8h'
    })

    const {password: _, ...userlogin} = user

    return res.status(200).json({
      user: userlogin,
      token
    })
  }

  async getProfile(req: Request, res: Response){
    
    return res.json(req.user)
    
  }
}