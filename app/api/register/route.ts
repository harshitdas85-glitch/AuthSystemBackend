import dns from "dns"
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);
import React from 'react'
import { hashToken } from "@/helper/helper";
import { UserModel } from '@/models/usermodel';
import { NextRequest } from 'next/server';
import CreateToken from '@/helper/createToken';
import CreateAccessToken from "@/helper/CreateAccessToken";
import Connect from '@/lib/mongo';
import { NextResponse } from 'next/server';
import bcrypt from "bcrypt"
import { cookies } from 'next/headers';
import SessionModel from "@/models/sessionmodel";

export async function POST(request:NextRequest){
     
    try {
        await Connect()
        const req = await request.json();
        const {username,email ,password} = req
    if(!email || !password || !username){
        return NextResponse.json({success:false,message:"error no email or password"},{status:404})
       }
    const check = await UserModel.findOne(
      {
       $or:[
        {email:email},
        {username:username}
    
       ]
    })
    if(check){
        return NextResponse.json({success:false,message:"User already exists"},{status:404})
    }
    const hashedpass = await bcrypt.hash(password,10);

    const newuser = await UserModel.create({username:username,email:email,password:hashedpass});
       const token =  CreateToken({_id:newuser._id,role:'user'})
       const hashedtoken = hashToken(token);
       const session = await SessionModel.create({
        user: newuser._id,
        refreshToken:hashedtoken, 
       })
       const access = CreateAccessToken({_id:newuser._id,role:'user'})
        const cookie = await cookies()
        cookie.set('token',token,{
             httpOnly:true,
            secure:true,
            sameSite: 'lax',
            path:'/',
            maxAge: 7 * 24 * 60 * 60   
        })
        return NextResponse.json({success:true,newuser:{id:newuser._id,username:newuser.username,email:newuser.email},access},{status:200})
    
} catch (error) {
    console.log(error)
    return NextResponse.json(
      { message:"Internal Server Error" },
      { status: 500 })
}
}