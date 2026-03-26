Auth System (Next.js + JWT + MongoDB)
📌 Overview

Secure authentication system using Next.js, JWT, and MongoDB sessions with cookie-based refresh tokens.

-Features  

User Register & Login 

Access Token (short-lived)

Refresh Token (HTTP-only cookie)  

Refresh Token Rotation  

Session Storage in DB  

Logout (single + all devices)    

🛡️ Security  

HTTP-only, Secure cookies    

Refresh token hashed in DB  

Token reuse detection  

Session revocation support  

Fixed session expiry (expiresAt)  

TTL index for auto cleanup  

🔄 Token Flow

Login → session created in DB  

Refresh token stored in cookie 

Access token used for APIs  

Refresh → new refresh token issued (old revoked)  

⏳ Session Model  
{  
  user,  
  refreshToken, // hashed  
  revoke,  
  expiresAt  
}  

🍪 Cookie Config  
{  
  httpOnly: true,  
  secure: true,  
  sameSite: "lax",  
  path: "/",  
  maxAge: //7 days  
}  

⚙️ Endpoints  
POST /api/register  
POST /api/login  
GET /api/refresh  
GET /api/auth/logout  
GET /api/auth/logout-all  
GET /api/auth/getme  

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

#Use PostMan TO Test  
