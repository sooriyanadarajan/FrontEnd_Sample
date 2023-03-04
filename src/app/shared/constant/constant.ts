export const Constants = {

    //Auth
    login: 'login',
    logout: 'logout',

    //User
    allUser: 'getAllUser',
    viewUser: 'getUser',
    createUser: 'createUser',
    tradeDecision: 'tradeDecision/',
    dailyProfilt: 'dailyprofitgraph/',
    tradeFXDecision: 'fx/fxDecision/',
    dailyFXProfilt: 'fx/fxDailyProfitGraph/',
    signalAccuracy: 'signalAccuracy/',
    fxsignalAccuracy: 'fxSignalAccuracy/',
    currentAssets: 'currentAssets/',
    notification: 'getallnotifications/',
    deleteNotification: 'deleteallnotifications/',
    activityLog: 'activityLog/',
    authorizedDevices: 'authorizedDevices/',
    removeDevice: 'removeDevice/',
    deleteActivityLog: 'deleteActivityLog/',
    updateUser: 'detailsUpdate/',
    userSubscription: 'bots/listPaymentHistory/',
    cancelSubscription: 'bots/cancelPayment/',
    confirmEmail:'confirmEmail/',
    g2fVerify:"g2fVerify",
    coinHolding:'coinHoldingGraph/',
    updateDeviceStatus:'updateDeviceStatus/',
    verifyPin:'checkPinCode',

    //Wallet
    allBalance: 'getAllBalance/',
    fxAllBalance: 'getFxBalance/',
    spotAllBalance: 'spotAccountDetails/',
    depositAddress: 'getDepositAddress/',
    convertOrder: 'convertOrder/',
    transferFund: 'fundTransfer/',
    depositHistory: 'getDepositHistory/',
    convertHistory: 'getconvertHistory/',
    transferHistory: 'fundTransferHistory/',

    //Security
    changePassword: 'changePassword',
    get2F: "getG2F",
    changeG2FStatus: "changeG2FStatus",
    getActiveLog: "getActivityLog",
    activeStatus2FA: "profile",
    updatePin:'updateProfile',
    screenLock:'screenLock',

    //Coupan
    listAllCoupan: "coupon/listAllCoupon",
    createCoupan: "coupon/createCoupon",
    updateCoupan: "coupon/updateCoupon",
    deleteCoupan: "coupon/deleteCoupon/",
    changeCoupanStatus: "coupon/changeCouponStatus/",

    //Bots
    listAllBots: "bots/listAllBot",
    createBots: "bots/createBot",
    updateBots: "bots/updateBot",
    deleteBots: "bots/deleteBot/",
    changeBotStatus: "bots/changeBotStatus/",

     //Spot trade
     coinList:'getSpotTradePair',
     currentPrice:'priceInfo/',
     accountBalance:'accountBalance/',
     createOrder:'newManualTrade/',
     activeTradeList:'activeTrade/',
     editActiveTrade:'editActiveTrade/',
     manualSell:'manualSell/',
     canelActiveOrder:'cancelActiveTrade/',
     openTradeList:'currentOrders/',
     cancelOpenOder:'cancelOrder/',
     spotTradeHistory:'tradeHistory/',
     deleteTrade:'tradeDelete/',
     configBotEdit:'configbot/spot/update/',
     configBotList:'configbot/spot/list/',
     configBotAdd:'configbot/spot/add/',
 
     //FX
     createFxOrder:'fx/createOrder/',
     changeLeverage:'fx/changeLeverage/',
     changeMarginType:'fx/changeMarginType/',
     accountInfo:'fx/getaccountDetails/',
     changePosition:'fx/changePositionMode/',
     getMode:'fx/getPositionMode/',
     activePosition:'fx/getActivePositions/',
     changeMarginValue:'fx/modifyPositionMargin/',
     tradeHistory:'fx/tradehistory/',
     removeTrade:'fx/deleteTrade/',
     openOrders:'fx/getAllOpenOrders/',
     cancelOder:'fx/cancelOrder/',
     updateTarget:'configbot/fx/updateTarget/',
     addTarget:'configbot/fx/addTarget/',
     updateConfigBot:'configbot/fx/update/',
     deleteTarget:'configbot/fx/deleteTarget/',
     tradePair:'fx/getFxTradePair',
     fxBotList:'configbot/fx/list/',
     botList:'bots/listAvailableBot/FX/',
     availableBots:'bots/listAvailableBot/',
     configBotFxAdd:'configbot/fx/add/',

    //TradePair
    getSpotTradePair: "getSpotTradePair",
    updateSpotTradePair: "updateSpotTradePair",
    getFxTradePair: "fx/getFxTradePair",
    updateFxTradePair: "fx/updateFxTradePair",
    importSmartTradePair:'importTradePair',
    importFxTradePair:'fx/importFxTradePair',

    //History
    paymentHistory: "listPaymentHistory",
    fxTradeHistory:"history/fxtrade",
    spotHistory:"history/spottrade",
    spotActiveTrade:"history/activeTrade",
    fxOpenPosition:"history/openposition",

    //Sub Admin
    createSubAdmin:'createSubAdmin',
    listSubAdmin:'listSubAdmin',
    updateSubAdmin:'updateSubAdminDetails',
    addSignalAccess:'addSignalAccess',
    removeSignalAccess:'removeSignalAccess',

    //Site Setting
    createSiteSetting:'siteSettings/create',
    siteSettingList:'siteSettings/list',
    updateSiteSetting:'siteSettings/update',
    deleteSiteSetting:'siteSettings/delete/',

    //Admin Dashboard
    dashboardUser:'dashboard/user',
    dashboardBot:'dashboard/bots',
    dashboardPayment:'dashboard/payment',
    dashboardSmarttrade:'dashboard/spottrade',
    dashboardFx:'dashboard/fxtrade',

    //Bot Signals
    createSpotBotSignal:'createSpotSignal',
    createFxBotSignal:'createFxSignal',
    listSpotBotSignal:'listSpotSignal',
    listFxBotSignal:'listFxSignal',
    deleteSpotBotSignal:'deleteSpotSignal/',
    deleteFxBotSignal:'deleteFxSignal/',
    allBotlist:'botList',

    //Notification
    sendNotification:'sendNotification',
    listNotification:'listNotification',
    deleteAdminNotification:'deleteNotification/',


    //PaymentCoin
    listPaymentCoin:"coins/listCoin",
    createPaymentCoin:"coins/createCoin",
    updatePaymentCoin:"coins/updateCoin",
    deletePaymentCoin:"coins/deleteCoin/",
    statusPaymentCoin:"coins/changeCoinStatus/"

}