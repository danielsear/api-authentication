
import { Request, Response } from "express";
import { BadRequestError } from "../helpers/api-erros";
import { userRepository } from "../repositories/userRepository";
import bcrypt from 'bcrypt'


export class UserController {
  async create(req: Request, res: Response){
    const {name, password, email} = req.body

    const userExists = await userRepository.findOneBy({email})

    if(userExists){
      throw new BadRequestError('Email ja existe.')
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const newUser = userRepository.create({
      name, 
      email,
      password : hashPassword
    })

    await userRepository.save(newUser)

    const {password: _ , ...user} = newUser

    return res.status(201).json(user)

  }

  async list(req: Request, res: Response){
    try {
      const users = await userRepository.find()


      if(!users){
        return res.status(400).json({message: 'Nenhum usuário encontrado.'})
      }

      const userlist = users.map(user => {
        const newUser = {
          name: user.name,
          email: user.email,
          id: user.id
        }
        return newUser
      })
      return res.status(200).json(userlist)


    } catch (error) {
      return res.status(500).json({message: 'Internal Server Error.'})
    }
  }
}