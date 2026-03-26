import dns from "dns"
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);
import React from 'react'
import { UserModel } from '@/models/usermodel';
import { NextRequest } from 'next/server';
import CreateToken from '@/helper/createToken';
import Connect from '@/lib/mongo';
import { NextResponse } from 'next/server';
import bcrypt from "bcrypt"
import { cookies } from 'next/headers';
import jwt from "jsonwebtoken";
export async function proxy(request:NextRequest){
    await Connect()
   const token =  request.headers.get('Accesstoken')
  const url = request.nextUrl
  if(!token){
    return NextResponse.json({success:false,message:"No token"},{status:404});
  }
  console.log(token)
  const decoded  = jwt.verify(token,process.env.JWT_SECRET!);
           console.log(decoded)
       const reqHeaders = new Headers(request.headers);
    reqHeaders.set('user-id', decoded._id);

    return NextResponse.next({ request: { headers: reqHeaders } })
 
}

export const config = {
  matcher: [
    '/api/auth/getme',
   
  ]
};