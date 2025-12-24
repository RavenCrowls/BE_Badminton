const { Users, Roles, ImagesUsers } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../services/emailservice');

const createUsers = async (req, res) => {
  const { name, username, password, email, gender, address, phonenumber, roleid } = req.body;
  try {
    // Tạo ra một chuỗi ngẫu nhiên
    const salt = bcrypt.genSaltSync(10);
    // Mã hóa chuỗi ngẫu nhiên + password
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUsers = await Users.create({
      name,
      username,
      password: hashedPassword,
      email,
      gender,
      address,
      phonenumber,
      roleid
    });
    res.status(201).send(newUsers);
  } catch (error) {
    res.status(500).send(error);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({
    where: { username }
  });
  const isAuth = bcrypt.compareSync(password, user.password);
  if (isAuth) {
    const token = jwt.sign({ username: user.username, roleid: user.roleid, userid: user.id }, 'badmintonweb', {
      expiresIn: 60 * 60
    });
    res.status(200).send({
      message: 'Login successfully',
      token
    });
  } else {
    res.status(401).send({
      message: 'Login failed'
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userslist = await Users.findAll({
      include: [
        {
          model: Roles,
          attributes: ['name', 'description']
        },
        {
          model: ImagesUsers,
          attributes: ['url']
        }
      ]
    });
    res.status(200).send(userslist);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getDetailUsers = async (req, res) => {
  const { id } = req.params;
  try {
    const detailUsers = await Users.findOne({
      where: { id: id },
      include: [
        {
          model: Roles,
          attributes: ['name', 'description']
        },
        {
          model: ImagesUsers,
          attributes: ['url']
        }
      ]
    });
    res.status(200).send(detailUsers);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getDetailUsersByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const detailUsers = await Users.findOne({
      where: { username: username },
      include: [
        {
          model: Roles,
          attributes: ['name', 'description']
        },
        {
          model: ImagesUsers,
          attributes: ['url']
        }
      ]
    });
    res.status(200).send(detailUsers);
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateUsers = async (req, res) => {
  const { id } = req.params;
  const { name, username, password, email, gender, address, phonenumber, roleid } = req.body;
  try {
    const detailUsers = await Users.findOne({
      where: { id }
    });
    detailUsers.name = name;
    detailUsers.username = username;
    detailUsers.password = password;
    detailUsers.email = email;
    detailUsers.gender = gender;
    detailUsers.address = address;
    detailUsers.phonenumber = phonenumber;
    detailUsers.roleid = roleid;
    await detailUsers.save();
    res.status(200).send(detailUsers);
  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteUsers = async (req, res) => {
  const { id } = req.params;
  try {
    await Users.destroy({
      where: { id }
    });
    res.status(200).send('Deleted successfully');
  } catch (error) {
    res.status(500).send(error);
  }
};

const changePassword = async (req, res) => {
  const { oldpass, newpass, passagain } = req.body;
  const userid = req.user.userid;
  const user = await Users.findOne({
    where: { id: userid }
  });
  if (!user) {
    return res.status(404).send('User not found');
  }
  const isMatch = bcrypt.compareSync(oldpass, user.password);
  if (!isMatch) {
    return res.status(401).send('Old password is incorrect');
  }
  if (newpass !== passagain) {
    return res.status(400).send('New password and confirmation do not match');
  }
  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(newpass, salt);
  await user.save();
  res.status(200).send('Password changed successfully');
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await Users.findOne({
    where: { email }
  });
  if (!user) {
    return res.status(404).send('User not found');
  }

  // 2. Tạo mật khẩu mới ngẫu nhiên gồm số
  const newPassword = Math.floor(100000 + Math.random() * 900000).toString(); // 6 chữ số

  // 3. Băm mật khẩu
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 4. Cập nhật vào database
  user.password = hashedPassword;
  await user.save();
  // 5. Gửi email với mật khẩu mới
  const sendmail = sendEmail(
    email,
    'Password Reset',
    `Your new password is: ${newPassword}`,
    `<p>Your new password is: <strong>${newPassword}</strong></p>`
  );
  res.status(200).send('Password reset link sent to your email');
};

const getUsersByRoleId = async (req, res) => {
  const { roleid } = req.params;
  try {
    const users = await Users.findAll({
      where: { roleid: roleid },
      include: [
        {
          model: Roles,
          attributes: ['name', 'description']
        },
        {
          model: ImagesUsers,
          attributes: ['url']
        }
      ]
    });
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createUsers,
  getAllUsers,
  getDetailUsers,
  updateUsers,
  deleteUsers,
  login,
  getDetailUsersByUsername,
  changePassword,
  forgotPassword,
  getUsersByRoleId
};
