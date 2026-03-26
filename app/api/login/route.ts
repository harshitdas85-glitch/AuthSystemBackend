import dns from "dns"
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);
import React from 'react'
import { UserModel } from '@/models/usermodel';
import Connect from '@/lib/mongo';
import { hashToken } from "@/helper/helper";
import SessionModel from "@/models/sessionmodel";
import { NextRequest } from 'next/server';
import CreateToken from '@/helper/createToken';
import { NextResponse } from 'next/server';
import CreateAccessToken from "@/helper/CreateAccessToken";
import bcrypt from "bcrypt"
import { cookies } from 'next/headers';
export  async function POST(request:NextRequest) {
  
  try {
    await Connect()
   
    const req = await request.json()
    const {email,password} = req;
     if(!email || !password){
      return NextResponse.json({success:false,message:"error no email or password"},{status:400})
     }
     const user = await UserModel.findOne({email:email})
     if(!user){
       return NextResponse.json({success:false,message:"No user with this email"},{status:404})
     }
     
     const Compare = await bcrypt.compare(password,user.password)
       if(!Compare){
           return NextResponse.json({success:false,message:"Wrong Password"},{status:401})
       }
      const token = CreateToken({_id :user?._id,role:"user"})
         const hashedtoken = hashToken(token);
       const session = await SessionModel.create({
              user: user._id,
              refreshToken:hashedtoken, 
             })
      const access = CreateAccessToken({_id :user?._id,role:"user"})
      const cookie = await cookies()
      cookie.set('token',token,{
          httpOnly:true,
          secure:true,
          sameSite: 'lax',
          path:'/',
          maxAge: 7 * 24 * 60 * 60   
      })
       return NextResponse.json({success:true,newuser:{id:user._id,username:user.username,email:user.email},access},{status:200})
  
  
  } catch (error) {
    console.log(error)
     return NextResponse.json(
          {success:false, message: "Internal Server Error" },
          { status: 500 })
  }

}
