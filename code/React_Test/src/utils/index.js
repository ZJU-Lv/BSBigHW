// 获取url的参数
const queryString = () => {
    let _queryString= {};
    const _query = window.location.search.substr(1);
    const _vars = _query.split('&');
    _vars.forEach((v, i) => {
        const _pair = v.split('=');
        if (!_queryString.hasOwnProperty(_pair[0])) {
            _queryString[_pair[0]] = decodeURIComponent(_pair[1]);
        } else if (typeof _queryString[_pair[0]] === 'string') {
            const _arr = [_queryString[_pair[0]], decodeURIComponent(_pair[1])];
            _queryString[_pair[0]] = _arr;
        } else {
            _queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
        }
    });
    return _queryString;
};
if (window.location.href.indexOf("token") >= 0) { //判断url地址中是否包含link字符串
    let returnObj = queryString();
    //console.log(returnObj)
    localStorage.setItem('Authorization', returnObj.token);//存储token,以便到处使用
    localStorage.setItem('orgCode', returnObj.orgCode);//存储token,以便到处使用
    localStorage.setItem('roleId', returnObj.roleId);//存储token,以便到处使用
    localStorage.setItem('username', returnObj.username);//存储token,以便到处使用
    window.location.href = window.location.origin + "/#/information";
}

// 判读是否为IE浏览器
function isIE() {
    return navigator.appName == "Microsoft Internet Explorer";
}

// 判断IE版本
function IEVersion() {
    return parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""));
}

// 自定义Map对象
function Map() {

    this.keys = new Array();
    this.data = new Object();

    this.set = function(key, value) {
        if (this.data[key] == null) {
            if (this.keys.indexOf(key) == -1) {
                this.keys.push(key);
            }
        }
        this.data[key] = value;
    }

    this.get = function(key) {
        return this.data[key];
    }
}

var map = new Map();


