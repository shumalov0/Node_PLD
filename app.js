
import express from 'express';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const filePath = process.argv[2];


if (filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Faylı oxuma zamanı xəta:', err);
    } else {
      console.log('Faylın məzmunu:', data);
    }
  });
}


app.get('/', (req, res) => {
  res.send('Fayl Oxuyucu Serverinə Xoş Gəldiniz');
});


app.get('/file', (req, res) => {
  const { name: fileName } = req.query;
  if (!fileName) return res.status(400).send('Fayl adı tələb olunur');

  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).send('Fayl tapılmadı');
    }
    res.send(data);
  });
});


app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    uptime: `${process.uptime()} seconds`,
    environment: NODE_ENV,
    arguments: process.argv.slice(2),
  });
});


app.use(express.static('public'));


app.use(express.json());
app.post('/upload', (req, res) => {
  const { fileName, content } = req.body;
  if (!fileName || !content) return res.status(400).send('Fayl adı və məzmun tələb olunur');

  fs.writeFile(fileName, content, (err) => {
    if (err) return res.status(500).send('Fayl yazılarkən xəta baş verdi');
    res.send('Fayl uğurla yükləndi');
  });
});


app.listen(PORT, () => {
  console.log(`Server ${NODE_ENV} mühitində ${PORT} portunda işləyir.`);
  if (NODE_ENV === 'production') {
    console.log('Production mühitində işə salındı.');
  } else {
    console.log('Development mühitində işə salındı.');
  }
});
