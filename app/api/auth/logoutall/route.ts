import dns from "dns"
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);
import React from 'react'
import { UserModel } from '@/models/usermodel';
import Connect from '@/lib/mongo';
import { NextRequest } from 'next/server';
import jwt from "jsonwebtoken"
import { hashToken } from "@/helper/helper";
import CreateToken from '@/helper/createToken';
import { NextResponse } from 'next/server';
import CreateAccessToken from "@/helper/CreateAccessToken";
import bcrypt from "bcrypt"
import { cookies } from 'next/headers';
import SessionModel from "@/models/sessionmodel";
export async function GET(request:NextRequest){
 const token =  request.cookies.get('token')?.value
  if(!token){
    return NextResponse.json({success:false,message:"No token"},{status:400});
  }
  const decoded = jwt.verify(token,process.env.JWT_SECRET!)

  const session = await SessionModel.updateMany({
    user:decoded._id,revoke:false},{
        revoke:true    
});


 const cookieStore = await cookies();
  cookieStore.set("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0
  });

   return NextResponse.json({success:true,message:"Logout from All successful"},{status:200})

  

}