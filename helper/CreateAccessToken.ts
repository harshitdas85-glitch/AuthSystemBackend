import dns from "dns"
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['1.1.1.1', '8.8.8.8']);
import jwt from 'jsonwebtoken'

export default  function CreateAccessToken({_id,role}:{_id:any,role:string}):string{
     const token =   jwt.sign({
        _id:_id,
        role:role,
        
     },process.env.JWT_SECRET! ,{
        expiresIn: '15m'
     })

     return token
}