<template>
	<header>
		<div class="header" :class="{ 'dark': webStore.isDark }">
        <div class="header-left">
            <button class="btn-menu menu-trigger"  @click="switchNav"></button>
            <div class="logo  menu-trigger" :class="[webStore.isDark?'white':'black']">
            </div>
            <div class="title menu-trigger"><i class="icon-dot"></i>{{webStore.mainTitle}}</div>
        </div>
        <div class="header-content" @mouseout="hideThreeMenu">
            <div class="crumbs">
                 {{webStore.subTitleDesc}}<i class="icon-chevron right" style="display:none"></i>
                 <span class="cur" @click="switchSubMenu">{{webStore.subTitle}}</span>
                 <template v-if="webStore.thirdMenu.length">
                    <i class="icon-chevron right"></i>
                    <span class="cur btn-subnav" @click="changeThree">{{webStore.threeTitle}}</span>
                 </template>
                 <div class="nav-list"  @mouseout="handleMouseOut">
                    <div class="second" v-show="state.subMenuShow">
                        <div class="title">Second Grade</div>
                        <ul @mouseover="subMenuMouseOver" @mouseout="handleSubMouseOut">
                          <li v-for="(it,index) in webStore.secondMenu.list" :key="index" :data-id="it.id" @click="switchThreeMenu(it)">{{it.name}}</li>
                        </ul>
                    </div>
                    <div class="third"  v-show="state.threeMenuShow"  @mouseover="showThreeMenu">
                        <div class="title">Third Grade</div>
                        <div class="third-bd">
                            <div class="item">
                                <ul>
                                    <li v-for="(item,index) in state.threeMenuList" :key="index" @click="clickThreeMenu(item)">{{item.name}}</li>
                                </ul>
                            </div>  
                        </div>
                    </div>
                    <div class="nav-secondary" v-show="state.secondaryShow">
                        <div class="second">
                          <ul>
                              <li v-for="(item,index) in state.threeMenuList" :key="index" @click="clickThreeMenu(item)">{{item.name}}</li>
                           </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="header-right">
                <ul class="navbar-nav">
                    <li><i class="icon icon-link"></i></li>
                    <li><i class="icon icon-news"></i></li>
                    <li><i class="icon icon-en"></i></li>
                </ul>
                <div class="themes">
                    <span class="btn-light"><i class="icon icon-light"></i></span>
                    <span class="btn-dark cur"><i class="icon icon-dark"></i></span>
                </div>
                <div class="user">
                  <!--userStore.user.avatar-->
                    <img src="@/assets/images/avatar.jpg" class="avatar">
                    <span class="name">{{userStore.user.username}}</span>
                </div>
                <div class="exit exitDiv" @click="outLogin">
                  <i class="icon icon-exit"></i>
                </div>
            </div>
        </div>
    </div>
	</header>
    <div class="model-select-pop" :class="{'show':state.isActive1, 'hide':state.isActive2}">
    <div class="hd">
      <button id="btn-close" class="btn btn-default" @click="switchNav">Cancel</button>
    </div>
    <div class="model-select">
      <table>
        <tr>
          <td v-for="(item,index) in state.navItems1" :key="index">
					<a  @click="goNavPage(item)">
						<i class="icon" :class="item.icon_class"></i>
						<span>{{item.name}}</span>
					</a>
				</td>
			</tr>
			<tr>
				<td v-for="(item,index) in state.navItems2" :key="index">
					<a  @click="goNavPage(item)">
						<i class="icon" :class="item.icon_class"></i>
						<span>{{item.name}}</span>
					</a>
				</td>
			</tr>
        <tr>
          <td v-for="(item,index) in state.navItems3" :key="index">
					<a  @click="goNavPage(item)">
						<i class="icon" :class="item.icon_class"></i>
						<span>{{item.name}}</span>
					</a>
				</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup>
//element-plus
import { ElMessageBox, ElSelect } from 'element-plus';
import { ElMessage } from 'element-plus';
import { useWebStore } from '@/store/web'
import { useUserStore } from '@/store/user'
import { logout, getMenus } from '../../utils/api/login';
import { useRouter } from 'vue-router'
import "../../assets/js/common.js";
//import mixin from '@/mixins/navLink.js'
//let { navItems1, navItems2, navItems3 } = mixin();
let webStore = useWebStore()
let userStore = useUserStore();


const state = reactive({
  navItems1: [],
  navItems2: [],
  navItems3: [],
  subMenuShow:false,
  threeMenuShow: false,
  secondaryShow:false,
  threeMenuList: [],
  isActive1: false,
  isActive2:true
})
//路由
let router = useRouter();

const isActive1 = ref(false);
const isActive2 = ref(true);

const switchNav = () => {
  state.isActive1 = ! state.isActive1 
  state.isActive2 = ! state.isActive2
}

const changeThree = () => {
  if (state.subMenuShow) {
    state.subMenuShow = false
    state.secondaryShow = true
  } else {
    state.secondaryShow = !state.secondaryShow
    console.log(state.secondaryShow)
  }
}

const handleMouseOut = (event) => {
  state.threeMenuShow=false
  event.stopPropagation()
}

const handleSubMouseOut = (event) => {
  event.stopPropagation()
}

const hideThreeMenu = () => {
  state.threeMenuShow=false
}

const clickThreeMenu = (item) => {
  webStore.setThreeTitle(item.name)
  state.subMenuShow=false
}
const showThreeMenu = () => {
  state.threeMenuShow = true
}

const subMenuMouseOver = (e) => {
  state.subMenuShow = true
  //state.threeMenuShow = true
  if (e.target.nodeName == 'LI') {
    let nodeId = e.target.dataset.id
    let list = webStore.secondMenu.list
    let targeItem=list.find((it) => {
      return it.id==nodeId
    })
    if (targeItem.children!=undefined) {
      state.threeMenuList = targeItem.children
      state.threeMenuShow = true
    } else {
      state.threeMenuList = []
      state.threeMenuShow = false
    }
  }
}

const switchThreeMenu = (item) => {
  if (item.children != undefined && item.children.length!=0) {
    state.threeMenuList = item.children
    state.threeMenuShow = true
    state.subMenuShow = true
  } else {
    state.subMenuShow = false
  }
  state.secondaryShow = false
 
  if (item.url == '/index/Quality/web') {
    webStore.$patch({
     subTitle: item.name,
     currentFrameUrl:'/Quality/Mobile/Web'
    })
  }
  if (item.url=='/index/Quality/master_standard') {
    webStore.$patch({
     subTitle: item.name,
     currentFrameUrl:'/CheckList/MS/Index/index'
    })
  }

  if (item.url=='/index/Quality/qis') {
    webStore.$patch({
     subTitle: item.name,
     currentFrameUrl:'/CheckList/Qis/Index'
    })
  }

  if (item.url=='/index/Quality/qie') {
    webStore.$patch({
     subTitle: item.name,
     currentFrameUrl:'/CheckList/Qis/Qie'
    })
  }
  state.isActive2 = true
  state.isActive1=false
}

const switchSubMenu = () => {
  state.subMenuShow = !state.subMenuShow
  state.secondaryShow=false
}

const goNavPage = (item) => {
  console.log(item);
  if (Array.isArray(item.children) && item.children.length > 0) {
    if (item.children[0].url === '/index/VendorScore/index') {
      webStore.setWebTheme(true)
    } else {
      webStore.setWebTheme(false)
    }
    getMenusById(item.children[0].id,item.children[0].url)
    webStore.setTitle(item.name);
    state.isActive2 = !state.isActive2
    state.isActive1 = !state.isActive1
  }
}

const getMenusById = (menu_id, menu_path) => {
  console.log("---101---" + menu_path)
  router.push(menu_path)
  getMenus({ id: menu_id }).then((res) => {
    webStore.setMenu(res.data)
	})
}


onBeforeMount(() => {
  let navList = webStore.moduleList
  state.navItems1 = navList.slice(0,3)
  state.navItems2 = navList.slice(4,7)
  state.navItems3 = navList.slice(8, 11)
})

//webStore中数据监听
const subscribe = webStore.$subscribe((mutation, store) => {
			if (store.thirdMenu) {
				state.threeMenuList = store.thirdMenu
			}
	}, { detached: false }
)


//退出登录
const outLogin = ()=>{
	ElMessageBox.confirm('确定退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
  }).then(() => {
      logout().then((res) => { 
        userStore.clearToken()
        webStore.setCurrentFrameUrl('')
        $cookies.remove('username')
        $cookies.remove('password')
        router.push("/login")
      })
    }).catch(() => {
      	ElMessage.info({
        	message: '已取消'
      	})
    })
}
</script>

<style>
@import "../../assets/css/header.css";
.dark {
  background-color: #151515;
}
</style>