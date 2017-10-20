// const mock = {}
// require('fs').readdirSync(require('path').join(__dirname + '/src/mock')).forEach(function(file) {
//   Object.assign(mock, require('./src/mock/' + file))
// })
// module.exports = mock
module.exports = {
  [`POST /login`] (req, res) {
    // const { email, password } = req.body;
    // if (user.length > 0 && user[0].password === password) {
    //   const now = new Date()
    //   now.setDate(now.getDate() + 1)
    //   res.cookie('token', JSON.stringify({ id: user[0].id, deadline: now.getTime() }), {
    //     maxAge: 900000,
    //     httpOnly: true,
    //   })
    //   res.json({ success: true, message: 'Ok' })
    // } else {
    //   res.status(400).end()
    // }
    console.log(JSON.stringify(req.body));
    res.json({
      id: 1,
      name: 1,
      leave_left: {
        compensatory: 5,
        annual: 5,
      },
      status: 1,
      info: '服务器错误'
    });
  },
  [`POST /apply`] (req, res) {
    console.log(JSON.stringify(req.body));
    res.json({
      status: 1,
      leave_left: {
        compensatory: 1,
        annual: 1,
      },
    });
  },
  [`POST /apply/list`] (req, res) {
    console.log(JSON.stringify(req.body));
    res.json({
      status: 1,
      list: [
        {
          id: 0,
          from: '2017-10-10T09:42:53+08:00',
          to: '2017-10-17T00:00:00.000Z',
          requested: 3,
          status: 'pending',
          kind: 'annual',
        },
        {
          id: 1,
          from: new Date(),
          to: new Date(),
          requested: 3,
          status: 'approved',
          kind: 'annual',
        },
        {
          id: 2,
          from: new Date(),
          to: new Date(),
          requested: 3,
          status: 'pending',
          kind: 'annual',
        },
        {
          id: 3,
          from: new Date(),
          to: new Date(),
          requested: 3,
          status: 'pending',
          kind: 'annual',
        },
      ]
    });
  },
  [`POST /approval/list`] (req, res) {
    console.log(JSON.stringify(req.body));
    res.json({
      status: 1,
      list: [
        {
          id:1,
          reporter: '小明',
          kind: 'compensatory',
          from: new Date(),
          to: new Date(),
          requested: 3,
          createDate: new Date(),
          status: 'pending',
          reason: '病假',
          histories: [
            {
              action: '操作',
              date: '时间',
              person: '操作人'
            },
          ]
        },
        {
          id: 2,
          reporter: '小明',
          kind: 'compensatory',
          from: new Date(),
          to: new Date(),
          requested: 3,
          createDate: new Date(),
          status: 'approved',
          reason: '病假',
          histories: [
            {
              action: '操作',
              date: '时间',
              person: '操作人'
            },
          ]
        },
        {
          id: '3',
          reporter: '小明',
          kind: 'compensatory',
          from: new Date(),
          to: new Date(),
          requested: 3,
          createDate: new Date(),
          status: 'pending',
          reason: '病假',
          histories: [
            {
              action: '操作',
              date: '时间',
              person: '操作人',
              text:'附加信息'
            },
          ]
        },
      ]
    });
  },
  [`POST /approval`] (req, res) {
    console.log(JSON.stringify(req.body));
    res.json({
      status: 1,
    });
  },
  [`POST /apply/cancel`] (req, res) {
    console.log(JSON.stringify(req.body));
    res.json({
      status: 1,
      list: [
        {
          from: new Date(),
          to: new Date(),
          requested: 3,
          status: 'pending',
          kind: 'annual',
        },
        {
          from: new Date(),
          to: new Date(),
          requested: 3,
          status: 'pending',
          kind: 'annual',
        },
        {
          from: new Date(),
          to: new Date(),
          requested: 3,
          status: 'pending',
          kind: 'annual',
        },
        {
          from: new Date(),
          to: new Date(),
          requested: 3,
          status: 'pending',
          kind: 'annual',
        },
      ],
    });
  },
}
