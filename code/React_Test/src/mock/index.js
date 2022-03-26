import Mock from 'mockjs'

Mock.mock(/\/serviceAccount\/selectAccount/,"get",require("./selectAccount.json"))
Mock.mock(/\/publicFouce\/selectList/,"post",require("./selectList.json"))
Mock.mock(/\/lableuser\/allLable/,"post",require("./allLable.json"))
Mock.mock(/\/material\/imagetext\/index/,"get",require("./imagetext.json"))
Mock.mock(/\/material\/image\/index/,"get",require("./image.json"))
Mock.mock(/\/material\/sound\/index/,"get",require("./sound.json"))
Mock.mock(/\/material\/video\/index/,"get",require("./video.json"))
Mock.mock(/\/publicMenu\/selectAllMenu/,"get",require("./selectAllMenu.json"))
Mock.mock(/\/material\/imagetext\/info/,"get",require("./imagetextInfo.json"))
Mock.mock(/\/material\/image\/info/,"get",require("./imageInfo.json"))
Mock.mock(/\/serviceAccount\/selectAll/,"get",require("./selectAll.json"))
Mock.mock(/\/banner/,"get",require("./getYesterDayKeyIndicator.json"))
Mock.mock(/\/analysis\/user\/getYesterDayKeyIndicator/,"get",require("./getYesterDayKeyIndicator.json"))
Mock.mock(/\/analysis\/user\/getChartByCondition/,"get",require("./getChartByCondition.json"))
Mock.mock(/\/analysis\/user\/getListByCondition/,"get",require("./getListByCondition.json"))
Mock.mock(/\/analysis\/message\/getListByCondition/,"get",require("./getListByCondition.json"))
Mock.mock(/\/analysis\/menu\/getYesterDayKeyIndicator/,"get",require("./getMenuYesterDayKeyIndicator.json"))
Mock.mock(/\/analysis\/menu\/getChartByCondition/,"get",require("./getMenuChartByCondition.json"))
Mock.mock(/\/analysis\/menu\/getListByCondition/,"get",require("./getMenuListByCondition.json"))