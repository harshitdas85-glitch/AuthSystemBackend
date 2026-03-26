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
import { cookies, headers } from 'next/headers';
import { User } from "lucide-react";
export async function GET(request:NextRequest){
  await Connect()
      const id = request.headers.get('user-id')
      if(!id){
        return NextResponse.json({success:false,message:"No id"},{status:404});
      }
      const user = await UserModel.findById(id).select('-password');
      return NextResponse.json({success:true,user},{status:200});

}