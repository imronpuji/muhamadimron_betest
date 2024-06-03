import jwt from 'jsonwebtoken';

// Payload to be encoded in the token
const payload = {
    id: 'example',
};

const token = jwt.sign(payload, "lakjsdlfjlkasdfoiasjf", { expiresIn: '1h' }); 

console.log(token); // Output the generated token
