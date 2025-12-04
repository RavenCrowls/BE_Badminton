require('dotenv').config();
const express = require('express');
const path = require('path');
const { sequelize } = require('./models');
const { rootRouter } = require('./routers');
const { supabase } = require('./supabase');
const app = express();
const cors = require('cors');
app.use(cors());

// cài ứng dụng sử dụng kiểu json
app.use(express.json());

// cài đặt static file
const publicPathDirectory = path.join(__dirname, './public');
app.use(express.static(publicPathDirectory));

// cài đặt router
app.use('/api/v1', rootRouter);

// kết nối supabase (kiểm tra qua Storage buckets)
app.get('/health/db', async (req, res) => {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    res.json({ ok: true, db: true, buckets: Array.isArray(data) ? data.map((b) => b.name) : [] });
  } catch (error) {
    console.error('Supabase client failed:', error);
    res.status(500).json({ ok: false, error: 'Supabase client failed' });
  }
});

// lắng nghe sự kiện kết nối
app.listen(3000, async () => {
  console.log('App listening on http://localhost:3000');
  try {
    await sequelize.authenticate();
    console.log('Kết nối thành công đến cơ sở dữ liệu MySQL.');
  } catch (error) {
    console.error('Không thể kết nối đến cơ sở dữ liệu MySQL:', error);
  }
});
