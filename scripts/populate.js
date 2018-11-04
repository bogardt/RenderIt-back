const request = require('sync-request');

const templateUser = {
  username: 'toto',
  name: 'tutu',
  password: 'toto',
  email: 'test@test.org',
  role: 'admin'
};

for (let i = 0; i < 100; i += 1) {
  templateUser.email = i + templateUser.email;
  const res = request('POST', `http://localhost:4000/api/users`, {
    json: templateUser
  });
  console.log(res);
}
