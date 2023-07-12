import express, { json } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const PORT = 5500;

app.use(express.json());
let refeshTokens = []

app.post('/refeshToken', (req, res) => {
    const refeshToken = req.body.token;
    if (!refeshToken) res.status(401);
    if (!refeshTokens.includes(refeshToken)) res.status(403);
    jwt.verify(refeshToken, process.env.REFESH_TOKEN_SECRET, (err, data) => {
        console.log(err, data);
        if (err) res.sendStatus(403);
        const accessToken = jwt.sign({ username: data.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
        res.json({ accessToken });
    })

})

app.post('/login', (req, res) => {
    const data = req.body;
    console.log({ data });
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });
    const refeshToken = jwt.sign(data, process.env.REFESH_TOKEN_SECRET);
    refeshTokens.push(refeshToken);
    res.json({ accessToken, refeshToken });
})


app.post('/logout', (req, res) => {
    const refeshToken = req.body.token;
    refeshTokens = refeshTokens.filter(refToken => refToken !== refeshToken);
    res.status(200);
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})