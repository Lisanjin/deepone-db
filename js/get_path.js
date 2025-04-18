function GenerateMd5(t) {
    var obj = new Object();
    obj.key = t;
    obj.HEX_CHR = "0123456789abcdef";
    obj.rhex = function(t) {
            //console.log(this.HEX_CHR);
            for (var e = "", i = 0; i <= 3; i++)
                e += this.HEX_CHR.charAt(t >> 8 * i + 4 & 15) + this.HEX_CHR.charAt(t >> 8 * i & 15);
            return e
        },
        obj.add = function(t, e) {
            var i = (65535 & t) + (65535 & e);
            return (t >> 16) + (e >> 16) + (i >> 16) << 16 | 65535 & i
        },
        obj.rol = function(t, e) {
            return t << e | t >>> 32 - e
        },
        obj.cmn = function(t, e, i, a, n, o) {
            return this.add(this.rol(this.add(this.add(e, t), this.add(a, o)), n), i)
        },
        obj.ff = function(t, e, i, a, n, o, r) {
            return this.cmn(e & i | ~e & a, t, e, n, o, r)
        },
        obj.gg = function(t, e, i, a, n, o, r) {
            return this.cmn(e & a | i & ~a, t, e, n, o, r)
        },
        obj.hh = function(t, e, i, a, n, o, r) {
            return this.cmn(e ^ i ^ a, t, e, n, o, r)
        },
        obj.ii = function(t, e, i, a, n, o, r) {
            return this.cmn(i ^ (e | ~a), t, e, n, o, r)
        },
        obj.str2blks_MD5 = function(t) {
            for (var e = 1 + (t.length + 8 >> 6), i = new Array(16 * e), a = 0; a < 16 * e; a++)
                i[a] = 0;
            for (a = 0; a < t.length; a++)
                i[a >> 2] |= t.charCodeAt(a) << a % 4 * 8;
            return i[a >> 2] |= 128 << a % 4 * 8,
                i[16 * e - 2] = 8 * t.length,
                i
        },
        obj.getMD5 = function() {
            t = '47cd76e43f74bbc2e1baaf194d07e1fa' + this.key;
            for (var e = this.str2blks_MD5(t), i = 1732584193, a = -271733879, n = -1732584194, o = 271733878, r = 0; r < e.length; r += 16) {
                var s = i,
                    c = a,
                    l = n,
                    u = o;
                i = this.ff(i, a, n, o, e[r + 0], 7, -680876936),
                    o = this.ff(o, i, a, n, e[r + 1], 12, -389564586),
                    n = this.ff(n, o, i, a, e[r + 2], 17, 606105819),
                    a = this.ff(a, n, o, i, e[r + 3], 22, -1044525330),
                    i = this.ff(i, a, n, o, e[r + 4], 7, -176418897),
                    o = this.ff(o, i, a, n, e[r + 5], 12, 1200080426),
                    n = this.ff(n, o, i, a, e[r + 6], 17, -1473231341),
                    a = this.ff(a, n, o, i, e[r + 7], 22, -45705983),
                    i = this.ff(i, a, n, o, e[r + 8], 7, 1770035416),
                    o = this.ff(o, i, a, n, e[r + 9], 12, -1958414417),
                    n = this.ff(n, o, i, a, e[r + 10], 17, -42063),
                    a = this.ff(a, n, o, i, e[r + 11], 22, -1990404162),
                    i = this.ff(i, a, n, o, e[r + 12], 7, 1804603682),
                    o = this.ff(o, i, a, n, e[r + 13], 12, -40341101),
                    n = this.ff(n, o, i, a, e[r + 14], 17, -1502002290),
                    a = this.ff(a, n, o, i, e[r + 15], 22, 1236535329),
                    i = this.gg(i, a, n, o, e[r + 1], 5, -165796510),
                    o = this.gg(o, i, a, n, e[r + 6], 9, -1069501632),
                    n = this.gg(n, o, i, a, e[r + 11], 14, 643717713),
                    a = this.gg(a, n, o, i, e[r + 0], 20, -373897302),
                    i = this.gg(i, a, n, o, e[r + 5], 5, -701558691),
                    o = this.gg(o, i, a, n, e[r + 10], 9, 38016083),
                    n = this.gg(n, o, i, a, e[r + 15], 14, -660478335),
                    a = this.gg(a, n, o, i, e[r + 4], 20, -405537848),
                    i = this.gg(i, a, n, o, e[r + 9], 5, 568446438),
                    o = this.gg(o, i, a, n, e[r + 14], 9, -1019803690),
                    n = this.gg(n, o, i, a, e[r + 3], 14, -187363961),
                    a = this.gg(a, n, o, i, e[r + 8], 20, 1163531501),
                    i = this.gg(i, a, n, o, e[r + 13], 5, -1444681467),
                    o = this.gg(o, i, a, n, e[r + 2], 9, -51403784),
                    n = this.gg(n, o, i, a, e[r + 7], 14, 1735328473),
                    a = this.gg(a, n, o, i, e[r + 12], 20, -1926607734),
                    i = this.hh(i, a, n, o, e[r + 5], 4, -378558),
                    o = this.hh(o, i, a, n, e[r + 8], 11, -2022574463),
                    n = this.hh(n, o, i, a, e[r + 11], 16, 1839030562),
                    a = this.hh(a, n, o, i, e[r + 14], 23, -35309556),
                    i = this.hh(i, a, n, o, e[r + 1], 4, -1530992060),
                    o = this.hh(o, i, a, n, e[r + 4], 11, 1272893353),
                    n = this.hh(n, o, i, a, e[r + 7], 16, -155497632),
                    a = this.hh(a, n, o, i, e[r + 10], 23, -1094730640),
                    i = this.hh(i, a, n, o, e[r + 13], 4, 681279174),
                    o = this.hh(o, i, a, n, e[r + 0], 11, -358537222),
                    n = this.hh(n, o, i, a, e[r + 3], 16, -722521979),
                    a = this.hh(a, n, o, i, e[r + 6], 23, 76029189),
                    i = this.hh(i, a, n, o, e[r + 9], 4, -640364487),
                    o = this.hh(o, i, a, n, e[r + 12], 11, -421815835),
                    n = this.hh(n, o, i, a, e[r + 15], 16, 530742520),
                    a = this.hh(a, n, o, i, e[r + 2], 23, -995338651),
                    i = this.ii(i, a, n, o, e[r + 0], 6, -198630844),
                    o = this.ii(o, i, a, n, e[r + 7], 10, 1126891415),
                    n = this.ii(n, o, i, a, e[r + 14], 15, -1416354905),
                    a = this.ii(a, n, o, i, e[r + 5], 21, -57434055),
                    i = this.ii(i, a, n, o, e[r + 12], 6, 1700485571),
                    o = this.ii(o, i, a, n, e[r + 3], 10, -1894986606),
                    n = this.ii(n, o, i, a, e[r + 10], 15, -1051523),
                    a = this.ii(a, n, o, i, e[r + 1], 21, -2054922799),
                    i = this.ii(i, a, n, o, e[r + 8], 6, 1873313359),
                    o = this.ii(o, i, a, n, e[r + 15], 10, -30611744),
                    n = this.ii(n, o, i, a, e[r + 6], 15, -1560198380),
                    a = this.ii(a, n, o, i, e[r + 13], 21, 1309151649),
                    i = this.ii(i, a, n, o, e[r + 4], 6, -145523070),
                    o = this.ii(o, i, a, n, e[r + 11], 10, -1120210379),
                    n = this.ii(n, o, i, a, e[r + 2], 15, 718787259),
                    a = this.ii(a, n, o, i, e[r + 9], 21, -343485551),
                    i = this.add(i, s),
                    a = this.add(a, c),
                    n = this.add(n, l),
                    o = this.add(o, u)
            }
            return this.rhex(i) + this.rhex(a) + this.rhex(n) + this.rhex(o)
        }
    return obj;
}


function get_real_path(str1){
        e='';
        i='';
        a='';
        n='';
        if (str1.charAt(0)=='c' || str1.charAt(0)=='d' || str1.charAt(0)== 'e' || str1.charAt(0)=='f'){
            e = str1.substring(6,8)+'/';
            i = str1.substring(2,4) + "/";
            a = str1.substring(4,6) + "/";
            n = str1.substring(0,2) + "/" ;}
        else if (str1.charAt(0)=='8' || str1.charAt(0) =='9' || str1.charAt(0)=='a' || str1.charAt(0) =='b'){
            e = str1.substring(4,6)+ "/";
            i = str1.substring(0,2)+ "/";
            a = str1.substring(6,8)+ "/";
            n = str1.substring(2,4)+ "/";}
        else if (parseInt(str1.charAt(0))>=4 && parseInt(str1.charAt(0))<=7){
            e = str1.substring(2,4)+ "/";
            i = str1.substring(6,8)+ "/";
            a = str1.substring(0,2)+ "/";}
        else if (parseInt(str1.charAt(0))>=0 && parseInt(str1.charAt(0))<=3){
            e = str1.substring(0,2)+ "/";
            i = str1.substring(4,6)+ "/";}
        return  e + i + a + n;
}