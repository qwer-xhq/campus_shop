import * as loginApi from './api/login'
import {authValidate} from './api/authorizaiton'
import * as recommendApi from './api/recommend'
import * as goodsApi from './api/goods' // 导入商品的Api
import * as catesApi from './api/categories' // 导入商品分类Api
import * as userApi from './api/user' // 用户Api
import * as collectApi from './api/collect'
import * as commentApi from './api/comment'

export default {...loginApi, authValidate, ...recommendApi, ...goodsApi, ...catesApi, ...userApi, ...collectApi, ...commentApi}