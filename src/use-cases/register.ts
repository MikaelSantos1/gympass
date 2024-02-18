import { prisma } from "@/lib/prisma"
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";
import { User } from "@prisma/client";
interface RegisterUseCaseParams{
    name:string;
    email:string
    password:string
}
interface RegisterUseCaseResponse {
    user:User
}
export class  RegisterUseCase{
    constructor(private usersRepository:UsersRepository){
        
    }

    async  execute({email,name,password}:RegisterUseCaseParams):Promise<RegisterUseCaseResponse>{
        const password_hash = await hash(password,6)
        const usersWithSameEmail = await this.usersRepository.findByEmail(email)
        console.log(usersWithSameEmail)
       
    if (usersWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return {
      user,
    }
    } 
}
