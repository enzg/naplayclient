import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import Merchants from '@/components/pages/merchants/Merchants'
import Index from '@/components/pages/Index'
import AddMerchants from '@/components/pages/merchants/Add'
import AddPointsToMerchant from '@/components/pages/merchants/AddPoints'
import AddCoinsToPlayer from '@/components/pages/merchants/AddCoins'
import EditMerchants from '@/components/pages/merchants/Edit'
import Agents from '@/components/pages/agents/Agents'
import AddAgents from '@/components/pages/agents/Add'
import EditAgents from '@/components/pages/agents/Edit'
import Managers from '@/components/pages/managers/Managers'
import SubManagers from '@/components/pages/managers/SubManagers'
import AddManagers from '@/components/pages/managers/Add'
import AddPointsToManager from '@/components/pages/managers/AddPoints'
import EditManagers from '@/components/pages/managers/Edit'
import Games from '@/components/pages/games/Games'
import AddGames from '@/components/pages/games/Add'
import EditGames from '@/components/pages/games/Edit'
import Players from '@/components/pages/players/Players'
import AddPlayers from '@/components/pages/players/Add'
import Numbers from '@/components/pages/numbers/Numbers'
import ChangePass from '@/components/pages/ChangePass'
import Profile from '@/components/pages/Profile'
import Bills from '@/components/pages/Bills'
import PlayerRegister from '@/components/pages/PlayerRegister'
import ReportGameList from '@/components/pages/reports/ReportGameList'
import ReportMatchList from '@/components/pages/reports/ReportMatchList'
import ReportRoomList from '@/components/pages/reports/ReportRoomList'
import ReportRoundList from '@/components/pages/reports/ReportRoundList'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Index
    }, {
      path: '/login',
      component: Login
    },
    {
      path: '/logout',
      component: Logout
    },
    {
      path: '/merchants',
      component: Merchants
    }, {
      path: '/merchants/add',
      component: AddMerchants
    },
    {
      path: '/merchants/addpoints/:username',
      component: AddPointsToMerchant
    },
    {
      path: '/merchants/addcoins/:username',
      component: AddCoinsToPlayer
    },
    {
      path: '/merchants/edit/:id',
      component: EditMerchants
    },
    {
      path: '/agents',
      component: Agents
    }, {
      path: '/agents/add',
      component: AddAgents
    },{
      path: '/agents/edit/:id',
      component: EditAgents
    },
    {
      path: '/managers',
      component: Managers
    },
    {
      path: '/submanagers/:username/:role',
      component: SubManagers
    },
    {
      path: '/managers/add',
      component: AddManagers
    },
    {
      path: '/managers/addpoints/:username',
      component: AddPointsToManager
    },
    {
      path: '/managers/edit/:id',
      component: EditManagers
    },
     {
      path: '/games',
      component: Games
    }, {
      path: '/games/add',
      component: AddGames
    },{
      path: '/games/edit/:id',
      component: EditGames
    },
     {
      path: '/players/:username/:msn',
      component: Players
    }, {
      path: '/players/add',
      component: AddPlayers
    }, {
      path: '/numbers',
      component: Numbers
    },{
      path: '/changepassword',
      component: ChangePass
    },{
      path: '/profile',
      component: Profile
    },
    {
      path: '/transfers/:username/:role',
      component:Bills
    },
    {
      path: '/playerregister',
      component: PlayerRegister
    },
    {
      path: '/reports/:msn',
      component: ReportGameList
    },
    {
      path: '/reports/:msn/:gameId',
      component: ReportRoomList
    },
    {
      path: '/reports/:msn/:gameId/:roomId',
      component: ReportMatchList
    },
    {
      path: '/reports/:msn/:gameId/:roomId/:matchId',
      component: ReportRoundList
    }
  ]
})
