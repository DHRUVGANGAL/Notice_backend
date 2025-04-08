const admin = require('../Models/admin');
const jwt = require("jsonwebtoken");
const { JWT_ADMIN_PASSWORD } = require("../config");
const { z } = require("zod");
const bcrypt = require('bcrypt');


const signup = async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    departmentName: z.string(),
    
  });
  
  const data = schema.safeParse(req.body);
  
  if (!data.success) {
    return res.status(400).json({
      message: data.error.issues[0].message
    });
  }
  
  
  const { email, password, firstName, lastName, departmentName } = data.data;
  
  try {
   
    const existingUser = await admin.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await admin.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      departmentName,
      
    });
    
    res.json({
      message: "Signup succeeded"
    });
  }
  catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

const signin = async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string()
  });
  
  const data = schema.safeParse(req.body);
  
  if (!data.success) {
    return res.status(400).json({
      message: data.error.issues[0].message
    });
  }
  
  
  const { email, password } = data.data;
  
  
  try {
    const user = await admin.findOne({ email });
    
    
    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }
    
   
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (passwordMatch) {
      const token = jwt.sign({
        id: user._id
      }, JWT_ADMIN_PASSWORD);
      
      res.json({
        token
      });
    } else {
      res.status(403).json({
        message: "Incorrect credentials"
      });
    }
  }
  catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};



// const authMiddleware = async(req, res, next)=> {
//     const token = req.headers.token;
//     const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
    

//     if (decoded) {
//         req.userId = decoded.id;
//         next()
//     } else {
//         res.status(403).json({
//             message: "You are not signed in"
//         })
//     }

// }




const authMiddleware = async(req, res, next) => {
  try {
    // Get the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: "No token provided"
      });
    }
    
    // Extract the token (remove the 'Bearer ' prefix)
    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);
    
    // Set the user ID in the request object
    req.userId = decoded.id;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(403).json({
      message: "Invalid or expired token"
    });
  }
}













module.exports = {
  signup,
  signin,
  authMiddleware
};


