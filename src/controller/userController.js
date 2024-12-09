import User from "../model/User.js";
import encryption from "../config/encryption/encryption.js";
import JwtToken from 'jsonwebtoken';

const { decrypt } = encryption;

export const registerUser = async (req, res) => {
  const { encrypt } = encryption;

  let { name, email, referredBy, password } = req.body;
  password = encrypt(password, process.env.KEY);
  try {
    const referrer = await User.findById(referredBy);

    if (referrer && referrer.referrals.length >= 8) {
      return res.status(400).json({ message: "Referrer has reached limit." });
    }

    const user = await User.create({
      name,
      email,
      referredBy: referrer ? referrer._id : null,
      password,
    });
    ``;

    if (referrer) {
      referrer.referrals.push(user._id);
      await referrer.save();
    }

    res.status(201).json({ message: "User registered successfully!", user });
  } catch (error) {
    res.status(500).json({ message: "Registration failed.", error });
  }
};

export const login = async (req, res) => {
  
  try {
    let user = await User.findOne({ email: req.body.email });
    console.log(user);
    
    if (!user || decrypt(user.password, process.env.KEY) != req.body.password) {
      return res.status(403).json({ Message: "Invalide Credential" });
    }
    return res.status(200).json(
      JwtToken.sign(user.toJSON(), process.env.JWT_KEY, {
        expiresIn: 10000,
      })
    );
  } catch (err) {
    return res.json({ Error: err });
  }
};

export const varify = async (req,res,next)=>{
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, No token provided." });
  }
  try {
    const decoded = JwtToken.verify(token, process.env.JWT_KEY);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Invalid token" });
  }
}

export const singleUser = async (req,res)=>{
  try{
      return res.status(200).json(await User.findById(req.params.id))
  }catch(err){
    console.log("There is Error");
    
  }
}
