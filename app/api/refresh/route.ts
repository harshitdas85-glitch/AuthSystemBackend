import dns from "dns"
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);
import React from 'react'
import { UserModel } from '@/models/usermodel';
import jwt from "jsonwebtoken"
import Connect from '@/lib/mongo';
import { NextRequest } from 'next/server';
import CreateToken from '@/helper/createToken';
import { NextResponse } from 'next/server';
import CreateAccessToken from "@/helper/CreateAccessToken";
import bcrypt from "bcrypt"
import { hashToken } from "@/helper/helper";
import { cookies } from 'next/headers';
import SessionModel from "@/models/sessionmodel";
export async function GET(request:NextRequest){
     await Connect()
    const refreshtoken = request.cookies.get('token')?.value

    if(!refreshtoken){
        return  NextResponse.json(
      { message:"Refresh Token Not found" },
      { status: 401 })
    }
    const decoded =  jwt.verify(refreshtoken,process.env.JWT_SECRET!)
    if(!decoded){
        return  NextResponse.json(
            { message:"Token is Tampered" },
            { status: 401 })
        }
        const hashedtoken = hashToken(refreshtoken);
        const session = await SessionModel.findOne({
            refreshToken: hashedtoken,
            revoke:false
        })
        
        if(!session){
            return  NextResponse.json(
                { message:"Trying to access Revoked Refresh Token " },
                { status: 401 })
            }
            if (session.expiresAt < new Date()){ 
                session.revoke = true; 
                await session.save();
                return NextResponse.json(
                    { message: "Session expired" },
                    { status: 401 }
                );
            }
           
            const accessToken = CreateAccessToken({_id:decoded._id,role:decoded.role})
            const newRefreshToken = CreateToken({_id:decoded._id,role:decoded.role})
    const newRefreshTokenHash = hashToken(newRefreshToken);
   
    session.refreshToken = newRefreshTokenHash
    await session.save()
    const cookie = await cookies()
    cookie.set('token',newRefreshToken,{
        httpOnly:true,
        secure:true,
        sameSite: 'lax',
        path:'/',
        maxAge: 7 * 24 * 60 * 60
    })
    return  NextResponse.json(
      { success:true,accessToken},
      { status: 200 })
}