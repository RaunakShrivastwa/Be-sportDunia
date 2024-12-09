import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

class EncryptDecrypt {
  encrypt = (text, key) => {
    const cipher = crypto.createCipher(process.env.ALGO, key);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  };

  decrypt = (encryptedText, key) => {
    const decipher = crypto.createDecipher(process.env.ALGO, key);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  };

  isValidPassword = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    return regex.test(password);
  };
}

export default new EncryptDecrypt();
