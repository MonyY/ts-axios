import axios from '../../src/index'
axios({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'axios'
  }
})

axios.request({
  url: '/extend/post',
  method: 'post',
  data: {
    msg: 'request'
  }
})


axios.get('/extend/get')
axios.options('/extend/options')
axios.delete('/extend/delete')
axios.head('/extend/head')
axios.post('/extend/post', { msg: 'post' })
axios.put('/extend/put', { msg: 'put' })
axios.patch('/extend/patch', { msg: 'patch' })

axios('/extend/post', {
  method: 'post',
  data: {
    msg: '2 params'
  }
})

interface ResponseData<T = any> {
  code: number
  result: T
  message: string
}

interface User {
  name: string,
  age: number
}

function getUser<T>() {
  return axios<ResponseData<T>>('/extend/user')
    .then(res => res.data)
    .catch(e => console.log(e))
}

async function test() {
  const user = await getUser<User>()
  if (user) {
    console.log(user)
  }
}

test()

axios('/extend/post', {
  method: 'post',
  data: {
    msg: '2 params'
  }
})
