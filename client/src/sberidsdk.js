/*! sberid-sdk - v2.0.0 - 2020-10-15
* Copyright (c) 2020 Сбер ID; Используя данное SDK вы соглашаетесь с Пользовательским соглашением, размещенным по адресу: https://www.sberbank.ru/common/img/uploaded/files/sberbank_id/agreement_sdk.pdf */
(function (exports) {
    'use strict';

    var BROWSER_ALIASES_MAP = {
        'Amazon Silk': 'amazon_silk',
        'Android Browser': 'android',
        Bada: 'bada',
        BlackBerry: 'blackberry',
        Chrome: 'chrome',
        Chromium: 'chromium',
        Electron: 'electron',
        Epiphany: 'epiphany',
        Firefox: 'firefox',
        Focus: 'focus',
        Generic: 'generic',
        Googlebot: 'googlebot',
        'Internet Explorer': 'ie',
        'K-Meleon': 'k_meleon',
        Maxthon: 'maxthon',
        'Microsoft Edge': 'edge',
        'MZ Browser': 'mz',
        'NAVER Whale Browser': 'naver',
        Opera: 'opera',
        'Opera Coast': 'opera_coast',
        'Opera Touch': 'opera_touch',
        PhantomJS: 'phantomjs',
        Puffin: 'puffin',
        QupZilla: 'qupzilla',
        Safari: 'safari',
        Sailfish: 'sailfish',
        'Samsung Internet for Android': 'samsung_internet',
        SeaMonkey: 'seamonkey',
        Sleipnir: 'sleipnir',
        Swing: 'swing',
        Tizen: 'tizen',
        'UC Browser': 'uc',
        Vivaldi: 'vivaldi',
        'WebOS Browser': 'webos',
        WeChat: 'wechat',
        'Yandex Browser': 'yandex',
        Roku: 'roku',
    };
    var BROWSER_MAP = {
        amazon_silk: 'Amazon Silk',
        android: 'Android Browser',
        bada: 'Bada',
        blackberry: 'BlackBerry',
        chrome: 'Chrome',
        chromium: 'Chromium',
        electron: 'Electron',
        epiphany: 'Epiphany',
        firefox: 'Firefox',
        focus: 'Focus',
        generic: 'Generic',
        googlebot: 'Googlebot',
        ie: 'Internet Explorer',
        k_meleon: 'K-Meleon',
        maxthon: 'Maxthon',
        edge: 'Microsoft Edge',
        mz: 'MZ Browser',
        naver: 'NAVER Whale Browser',
        opera: 'Opera',
        opera_coast: 'Opera Coast',
        opera_touch: 'Opera Touch',
        phantomjs: 'PhantomJS',
        puffin: 'Puffin',
        qupzilla: 'QupZilla',
        safari: 'Safari',
        sailfish: 'Sailfish',
        samsung_internet: 'Samsung Internet for Android',
        seamonkey: 'SeaMonkey',
        sleipnir: 'Sleipnir',
        swing: 'Swing',
        tizen: 'Tizen',
        uc: 'UC Browser',
        vivaldi: 'Vivaldi',
        webos: 'WebOS Browser',
        wechat: 'WeChat',
        yandex: 'Yandex Browser'
    };
    var PLATFORMS_MAP = {
        tablet: 'tablet',
        mobile: 'mobile',
        desktop: 'desktop',
        tv: 'tv'
    };
    var APP_MAP = {
        messenger: 'Facebook Messenger',
        facebook: 'Facebook',
        twitter: 'Twitter',
        line: 'Line',
        wechat: 'Wechat',
        instagram: 'Instagram',
        electron: 'Electron Application',
        outlook: 'Microsoft Outlook',
        pinterest: 'Pinterest App',
        thunderbird: 'Thunderbird',
        webview: 'Webview Based Browser',
        yaapp: 'Yandex App',
    };
    var OS_MAP = {
        WindowsPhone: 'Windows Phone',
        Windows: 'Windows',
        MacOS: 'macOS',
        iOS: 'iOS',
        Android: 'Android',
        WebOS: 'WebOS',
        BlackBerry: 'BlackBerry',
        Bada: 'Bada',
        Tizen: 'Tizen',
        Linux: 'Linux',
        ChromeOS: 'Chrome OS',
        PlayStation4: 'PlayStation 4',
        Roku: 'Roku',
    };
    var ERROR_MESSAGES = {
        invalid_request: 'В запросе отсутствуют обязательные атрибуты',
        unauthorized_client: 'АС - источник запроса не зарегистрирована или заблокирована в банке либо значение атрибута client_id не соответствует формату',
        unsupported_response_type: 'Значение атрибута response_type не равно« code»',
        invalid_scope: 'Значение атрибута scope не содержит параметр openid в начальной позиции либо запрошенный scope содержит значения, недоступные для АС - источника запроса',
        access_denied: 'Клиент отказался от передачи согласий',
        invalid_state: 'Значение атрибута state не соответствует изначальному',
        window_closed: 'Клиент закрыл окно авторизации через Сбер ID'
    };

    var CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    var Utils = (function () {
        function Utils() { }

        /**
         * Получить первый соответствующий элемент для строки
         * @param {RegExp} regexp
         * @param {String} ua
         * @return {Array|{index: number, input: string}|*|boolean|string}
         */
        Utils.getFirstMatch = function (regexp, ua) {
            var match = ua.match(regexp);

            return (match && match.length > 0 && match[1]) || '';
        };

        /**
         * Получить второй соответствующий элемент для строки
         * @param {RegExp} regexp
         * @param {String} ua
         * @return {Array|{index: number, input: string}|*|boolean|string}
         */
        Utils.getSecondMatch = function (regexp, ua) {
            var match = ua.match(regexp);

            return (match && match.length > 1 && match[2]) || '';
        };

        /**
         * Array::map polyfill
         *
         * @param  {Array} arr
         * @param  {Function} iterator
         * @return {Array}
         */
        Utils.map = function (arr, iterator) {
            var result = [];

            if (Array.prototype.map) {
                return Array.prototype.map.call(arr, iterator);
            }
            for (var i = 0; i < arr.length; i += 1) {
                result.push(iterator(arr[i]));
            }
            return result;
        };

        /**
       * Array::find polyfill
       *
       * @param  {Array} arr
       * @param  {Function} predicate
       * @return {Array}
       */
        Utils.find = function (arr, predicate) {
            if (Array.prototype.find) {
                return Array.prototype.find.call(arr, predicate);
            }
            for (var i = 0; i < arr.length; i += 1) {
                var value = arr[i];
                if (predicate(value, i)) {
                    return value;
                }
            }
            return undefined;
        }

        /**
         * Получить псевдоним для имени браузера
         *
         * @example
         *   getBrowserAlias('Microsoft Edge') // edge
         *
         * @param  {string} browserName
         * @return {string}
         */
        Utils.getBrowserAlias = function (browserName) {
            return BROWSER_ALIASES_MAP[browserName];
        };

        /**
         * Получить название для псевдонима браузера
         *
         * @example
         *   getBrowserAlias('edge') // Microsoft Edge
         *
         * @param  {string} browserAlias
         * @return {string}
         */
        Utils.getBrowserTypeByAlias = function (browserAlias) {
            return BROWSER_MAP[browserAlias] || '';
        };

        /**
         * Получить параметры из адресной строки браузера
         * @param {String|undefined} url
         *
         * @return {Object}
         */
        Utils.getUrlSearchParams = function (url) {
            var queryString = url ? (url.split('?')[1] || url) : window.location.search.slice(1);
            var result = {};

            if (queryString) {
                queryString = queryString.split('#')[0];
                var params = queryString.split('&');
                for (var i = 0; i < params.length; i += 1) {
                    var param = params[i].split('=');
                    var paramName = param[0];
                    var paramValue = typeof param[1] === 'undefined' ? true : param[1];

                    if (paramName.match(/\[(\d+)?\]$/)) {
                        var key = paramName.replace(/\[(\d+)?\]/, '');
                        if (!result[key]) {
                            result[key] = [];
                        }

                        if (paramName.match(/\[\d+\]$/)) {
                            var index = /\[(\d+)\]/.exec(paramName)[1];
                            result[key][index] = paramValue;
                        } else {
                            result[key].push(paramValue);
                        }
                    } else {
                        if (!result[paramName]) {
                            result[paramName] = paramValue;
                        } else if (result[paramName] && typeof result[paramName] === 'string') {
                            result[paramName] = [result[paramName]];
                            result[paramName].push(paramValue);
                        } else {
                            result[paramName].push(paramValue);
                        }
                    }
                }
            }

            return result;
        };

        /**
         * Проверить что мы пришли с обратным редиректом на страницу партнера
         * 
         * @return {Boolean}
         */
        Utils.isOIDCRedirect = function () {
            var params = Utils.getUrlSearchParams();

            return (params.code || params.error) && params.state;
        };

        /**
         * Получить адрес с параметрами
         * @param {String|undefined} url
         * @param {Object} parameters
         *
         * @return {String}
         */
        Utils.buildUrl = function (url, parameters) {
            var qs = ''
            for (var key in parameters) {
                var value = parameters[key];
                qs += key + '=' + value + '&';
            }
            if (qs.length > 0) {
                qs = qs.substring(0, qs.length - 1);
            }

            if (url) {
                return url + '?' + qs;
            }

            return qs;
        }

        /**
         * Проверить декодированы ли управляющие последовательности символов в строке
         * @param {String} uri
         * @returns {boolean}
         */
        Utils.isEncoded = function (uri) {
            uri = uri || '';

            return uri !== decodeURIComponent(uri);
        };

        /**
         * Генерация слуйчной строки
         * @param {Internet} size - длина строки
         * @return {String} - случайная строка
         */
        Utils.generateRandom = function (size) {
            var buffer = new Uint8Array(size);
            if (typeof window !== 'undefined' && !!window.crypto) {
                window.crypto.getRandomValues(buffer);
            } else {
                for (var i = 0; i < size; i += 1) {
                    buffer[i] = (Math.random() * CHARSET.length) | 0;
                }
            }

            return Utils.bufferToString(buffer);
        };

        /**
         * Преобразования массива случайный числе в строку
         * @param {Uint8Array} buffer - массив числе
         * @return {String} - строка
         */
        Utils.bufferToString = function (buffer) {
            var state = [];
            for (var i = 0; i < buffer.byteLength; i += 1) {
                var index = buffer[i] % CHARSET.length;
                state.push(CHARSET[index]);
            }
            return state.join('');
        };

        /**
         * Форматирование строки с добавлением дополнительных параметров
         * @param {String} str - исходная строка
         */
        Utils.stringFormat = function (str, params) {
            if (typeof params === 'object' && typeof str !== 'undefined') {
                Object.keys(params).forEach(function (k) {
                    str = str.replace(new RegExp(':' + k + ':', 'g'), params[k]);
                });

                return str;
            }

            return str;
        };

        /**
         * Открыть модальное окно
         */
        Utils.openDialog = function (url, params) {
            var defaultParams = {
                directories: 'no',
                status: 'no',
                menubar: 'no',
                scrollbars: 'yes',
                resizable: 'no',
                width: 600,
                height: 600,
                centered: true
            };
            params = params || {};
            Object.keys(defaultParams).forEach(function (k) {
                params[k] = params.hasOwnProperty(k) ? params[k] : defaultParams[k];
            });

            if (params.centered) {
                params.left = window.screen.width / 2 - params.width / 2;
                params.top = window.screen.height / 2 - params.height / 2;
            }
            var w = window.open(url, '_blank', Object.keys(params).map(function (k) {
                return k + '=' + params[k];
            }).join(','));

            var closeCallbacks = [];
            var closeInterval = setInterval(function () {
                if (w && w.closed) {
                    clearInterval(closeInterval);
                    closeCallbacks.forEach(function (c) {
                        c && c();
                    });
                }
            });

            if (w) {
                w.onclose = function (callback) {
                    closeCallbacks.push(callback);
                };
            }

            return w;
        };

        /**
         * Преобразовать стили из объкта в строку
         * @param {Object} obj - стили CSS
         * @return {string}
         */
        Utils.objToCss = function (obj) {
            if (!obj) {
                return '';
            }

            return JSON.stringify(obj, null, '\t')
                .replace(/"/g, '')
                .replace(/,\n/g, ';')
                .replace(/\}/g, '')
                .replace(/\{/g, '')
        };

        Utils.getMeta = function (metaName) {
            const metas = document.getElementsByTagName('meta');

            for (var i = 0; i < metas.length; i += 1) {
                if (metas[i].getAttribute('name') === metaName) {
                    return metas[i].getAttribute('content');
                }
            }

            return '';
        }

        return Utils;
    })();

      /**
       * Модуль для работы с куками
       */
      var Cookies = (function () {
          function Cookies() {}
          /**
           * Возвращает cookie с именем name, если есть, если нет, то undefined
           * @param {string} name - название cookie
           * @returns {*|undefined}
           */
          Cookies.get = function (name) {
              var matches = document.cookie.match(new RegExp(
                  '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
              ));
              return matches ? decodeURIComponent(matches[1]) : undefined;
          };
          /**
           * Устанавливает cookie с именем name
           * @param {string} name - название cookie
           * @param {string|number} value - значение cookie (строка)
           * @param {object} props - объект с дополнительными свойствами для установки cookie:
           * @property {Number|Data} [expires] - Время истечения cookie. Интерпретируется по-разному, в зависимости от типа:
              Если число - количество секунд до истечения.
              Если объект типа Date - точная дата истечения.
              Если expires в прошлом, то cookie будет удалено.
              Если expires отсутствует или равно 0, то cookie будет установлено как сессионное и исчезнет при закрытии браузера.
           * @property {String} path - Путь для cookie.
           * @property {String} domain - Домен для cookie.
           * @property {Boolean} secure - Пересылать cookie только по защищенному соединению.
           */
          Cookies.set = function (name, value, props) {
              props = props || {};

              var expires = props.expires;

              if (typeof expires === 'number' && expires) {
                  var d = new Date();
                  d.setTime(d.getTime() + expires * 1000);
                  expires = props.expires = d;
              }
              if (expires && expires.toUTCString) {
                  props.expires = expires.toUTCString();
              }

              name = encodeURIComponent(String(name))
                  .replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
                  .replace(/[\(\)]/g, escape);

              value = encodeURIComponent(String(value))
                  .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

              var updatedCookie = name + '=' + value;

              for (var propName in props) {
                  if (!props[propName]) {
                      continue;
                  }
                  updatedCookie += '; ' + propName;

                  if (props[propName] === true) {
                      continue;
                  }

                  // Considers RFC 6265 section 5.2:
                  // ...
                  // 3.  If the remaining unparsed-attributes contains a %x3B (";") character:
                  // Consume the characters of the unparsed-attributes up to, not including, the first %x3B (";") character.
                  updatedCookie += '=' + props[propName].split(';')[0];
              }

              document.cookie = updatedCookie;
          };

          /**
           * Удаляет cookie с именем name
           * @param {String} name - название cookie
           */
          Cookies.delete = function (name) {
              Cookies.set(name, '', {
                  expires: -1
              });
          }

          return Cookies;
      })();

    var commonVersionIdentifier = /version\/(\d+(\.?_?\d+)+)/i;

    var browserParsersList = [
        /* Googlebot */
        {
            test: [/googlebot/i],
            describe: function (ua) {
                var browser = {
                    name: 'Googlebot'
                };
                var version = Utils.getFirstMatch(/googlebot\/(\d+(\.\d+))/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        /* Opera < 13.0 */
        {
            test: [/opera/i],
            describe: function (ua) {
                var browser = {
                    name: 'Opera'
                };
                var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:opera)[\s/](\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        /* Opera > 13.0 */
        {
            test: [/opr\/|opios/i],
            describe: function (ua) {
                var browser = {
                    name: 'Opera'
                };
                var version = Utils.getFirstMatch(/(?:opr|opios)[\s/](\S+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        /* Opera Touch */
        {
            test: [/opt/i],
            describe: function (ua) {
                var browser = {
                    name: 'Opera Touch'
                };
                var version = Utils.getFirstMatch(/(?:opt)[\s/](\S+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/SamsungBrowser/i],
            describe: function (ua) {
                var browser = {
                    name: 'Samsung Internet for Android'
                };
                var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:SamsungBrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/Whale/i],
            describe: function (ua) {
                var browser = {
                    name: 'NAVER Whale Browser'
                };
                var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:whale)[\s/](\d+(?:\.\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/MZBrowser/i],
            describe: function (ua) {
                var browser = {
                    name: 'MZ Browser'
                };
                var version = Utils.getFirstMatch(/(?:MZBrowser)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/focus/i],
            describe: function (ua) {
                var browser = {
                    name: 'Focus'
                };
                var version = Utils.getFirstMatch(/(?:focus)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/swing/i],
            describe: function (ua) {
                var browser = {
                    name: 'Swing'
                };
                var version = Utils.getFirstMatch(/(?:swing)[\s/](\d+(?:\.\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/coast/i],
            describe: function (ua) {
                var browser = {
                    name: 'Opera Coast'
                };
                var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:coast)[\s/](\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/yabrowser/i],
            describe: function (ua) {
                var browser = {
                    name: 'Yandex Browser'
                };
                var version = Utils.getFirstMatch(/(?:yabrowser)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/ucbrowser/i],
            describe: function (ua) {
                var browser = {
                    name: 'UC Browser'
                };
                var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:ucbrowser)[\s/](\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/Maxthon|mxios/i],
            describe: function (ua) {
                var browser = {
                    name: 'Maxthon'
                };
                var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:Maxthon|mxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/epiphany/i],
            describe: function (ua) {
                var browser = {
                    name: 'Epiphany'
                };
                var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:epiphany)[\s/](\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/puffin/i],
            describe: function (ua) {
                var browser = {
                    name: 'Puffin'
                };
                var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:puffin)[\s/](\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/sleipnir/i],
            describe: function (ua) {
                var browser = {
                    name: 'Sleipnir'
                };
                var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:sleipnir)[\s/](\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/k-meleon/i],
            describe: function (ua) {
                var browser = {
                    name: 'K-Meleon'
                };
                var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/(?:k-meleon)[\s/](\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/micromessenger/i],
            describe: function (ua) {
                var browser = {
                    name: 'WeChat'
                };
                var version = Utils.getFirstMatch(/(?:micromessenger)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/msie|trident/i],
            describe: function (ua) {
                var browser = {
                    name: 'Internet Explorer'
                };
                var version = Utils.getFirstMatch(/(?:msie |rv:)(\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/\sedg\//i],
            describe: function (ua) {
                var browser = {
                    name: 'Microsoft Edge'
                };
                var version = Utils.getFirstMatch(/\sedg\/(\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/edg([ea]|ios)/i],
            describe: function (ua) {
                var browser = {
                    name: 'Microsoft Edge'
                };
                var version = Utils.getSecondMatch(/edg([ea]|ios)\/(\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/vivaldi/i],
            describe: function (ua) {
                var browser = {
                    name: 'Vivaldi'
                };
                var version = Utils.getFirstMatch(/vivaldi\/(\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/seamonkey/i],
            describe: function (ua) {
                var browser = {
                    name: 'SeaMonkey'
                };
                var version = Utils.getFirstMatch(/seamonkey\/(\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/sailfish/i],
            describe: function (ua) {
                var browser = {
                    name: 'Sailfish'
                };
                var version = Utils.getFirstMatch(/sailfish\s?browser\/(\d+(\.\d+)?)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/silk/i],
            describe: function (ua) {
                var browser = {
                    name: 'Amazon Silk'
                };
                var version = Utils.getFirstMatch(/silk\/(\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/phantom/i],
            describe: function (ua) {
                var browser = {
                    name: 'PhantomJS'
                };
                var version = Utils.getFirstMatch(/phantomjs\/(\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/slimerjs/i],
            describe: function (ua) {
                var browser = {
                    name: 'SlimerJS'
                };
                var version = Utils.getFirstMatch(/slimerjs\/(\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
            describe: function (ua) {
                var browser = {
                    name: 'BlackBerry'
                };
                var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/blackberry[\d]+\/(\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/(web|hpw)[o0]s/i],
            describe: function (ua) {
                var browser = {
                    name: 'WebOS Browser'
                };
                var version = Utils.getFirstMatch(commonVersionIdentifier, ua) || Utils.getFirstMatch(/w(?:eb)?[o0]sbrowser\/(\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/bada/i],
            describe: function (ua) {
                var browser = {
                    name: 'Bada'
                };
                var version = Utils.getFirstMatch(/dolfin\/(\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/tizen/i],
            describe: function (ua) {
                var browser = {
                    name: 'Tizen'
                };
                var version = Utils.getFirstMatch(/(?:tizen\s?)?browser\/(\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/qupzilla/i],
            describe: function (ua) {
                var browser = {
                    name: 'QupZilla'
                };
                var version = Utils.getFirstMatch(/(?:qupzilla)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/firefox|iceweasel|fxios/i],
            describe: function (ua) {
                var browser = {
                    name: 'Firefox'
                };
                var version = Utils.getFirstMatch(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/electron/i],
            describe: function (ua) {
                var browser = {
                    name: 'Electron',
                };
                var version = Utils.getFirstMatch(/(?:electron)\/(\d+(\.?_?\d+)+)/i, ua);

                if (version) {
                    browser.version = version;
                }

                return browser;
            },
        },
        {
            test: [/chromium/i],
            describe: function (ua) {
                var browser = {
                    name: 'Chromium'
                };
                var version = Utils.getFirstMatch(/(?:chromium)[\s/](\d+(\.?_?\d+)+)/i, ua) || Utils.getFirstMatch(commonVersionIdentifier, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        {
            test: [/chrome|crios|crmo/i],
            describe: function (ua) {
                var browser = {
                    name: 'Chrome'
                };
                var version = Utils.getFirstMatch(/(?:chrome|crios|crmo)\/(\d+(\.?_?\d+)+)/i, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        /* Android Browser */
        {
            test: function (parser) {
                var notLikeAndroid = !parser.test(/like android/i);
                var butAndroid = parser.test(/android/i);
                return notLikeAndroid && butAndroid;
            },
            describe: function (ua) {
                var browser = {
                    name: 'Android Browser'
                };
                var version = Utils.getFirstMatch(commonVersionIdentifier, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        /* PlayStation 4 */
        {
            test: [/playstation 4/i],
            describe: function (ua) {
                var browser = {
                    name: 'PlayStation 4'
                };
                var version = Utils.getFirstMatch(commonVersionIdentifier, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        /* Safari */
        {
            test: [/safari|applewebkit/i],
            describe: function (ua) {
                var browser = {
                    name: 'Safari'
                };
                var version = Utils.getFirstMatch(commonVersionIdentifier, ua);
                if (version) {
                    browser.version = version;
                }
                return browser;
            }
        },
        /* Something else */
        {
            test: [/.*/i],
            describe: function (ua) {
                /* Here we try to make sure that there are explicit details about the device
                 * in order to decide what regexp exactly we want to apply
                 * (as there is a specific decision based on that conclusion)
                 */
                var regexpWithoutDeviceSpec = /^(.*)\/(.*) /;
                var regexpWithDeviceSpec = /^(.*)\/(.*)[ \t]\((.*)/;
                var hasDeviceSpec = ua.search('\\(') !== -1;
                var regexp = hasDeviceSpec ? regexpWithDeviceSpec : regexpWithoutDeviceSpec;
                return {
                    name: Utils.getFirstMatch(regexp, ua),
                    version: Utils.getSecondMatch(regexp, ua)
                };
            }
        },
    ];
    var appParsersList = [
        /* Facebook Messenger */
        {
            test: [/\bFB[\w_]+\/(Messenger|MESSENGER)/],
            describe: function () {
                return {
                    name: APP_MAP.messenger
                };
            }
        },
        /* Facebook */
        {
            test: [/\bFB[\w_]+\//],
            describe: function () {
                return {
                    name: APP_MAP.facebook
                };
            }
        },
        /* Twitter */
        {
            test: [/\bTwitter/i],
            describe: function () {
                return {
                    name: APP_MAP.twitter
                };
            }
        },
        /* Line */
        {
            test: [/\bLine\//i],
            describe: function () {
                return {
                    name: APP_MAP.line
                };
            }
        },
        /* Wechat */
        {
            test: [/\bMicroMessenger\//i],
            describe: function () {
                return {
                    name: APP_MAP.wechat
                };
            }
        },
        /* Instagram */
        {
            test: [/\bInstagram/i],
            describe: function (ua) {
                return {
                    name: APP_MAP.instagram
                };
            }
        },
        /* Electron Application */
        {
            test: [/\bElectron/i],
            describe: function () {
                return {
                    name: APP_MAP.electron
                };
            }
        },
        /* Outlook */
        {
            test: [/\bOutlook/i],
            describe: function () {
                return {
                    name: APP_MAP.outlook
                };
            }
        },
        /* Pinterest App */
        {
            test: [/\bPinterest/i],
            describe: function () {
                return {
                    name: APP_MAP.pinterest
                };
            }
        },
        /* Thunderbird App */
        {
            test: [/\bThunderbird/i],
            describe: function () {
                return {
                    name: APP_MAP.thunderbird
                };
            }
        },
        /* Webview Based Browser */
        {
            test: [/\bwebview/i, /; wv/],
            describe: function () {
                return {
                    name: APP_MAP.webview
                };
            }
        },
        /* Yandex App Browser */
        {
            test: [/\bYaApp/i, /\bYandexSearch/i],
            describe: function () {
                return {
                    name: APP_MAP.yaapp
                };
            }
        }
    ];
    var osParsersList = [
        {
            test: [/Roku\/DVP/],
            describe: function (ua) {
                var version = Utils.getFirstMatch(/Roku\/DVP-(\d+\.\d+)/i, ua);
                return {
                    name: OS_MAP.Roku,
                    version: version
                };
            },
        },
        /* Windows Phone */
        {
            test: [/windows phone/i],
            describe: function (ua) {
                var version = Utils.getFirstMatch(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i, ua);
                return {
                    name: OS_MAP.WindowsPhone,
                    version: version
                };
            }
        },
        /* Windows */
        {
            test: [/windows/i],
            describe: function (ua) {
                var version = Utils.getFirstMatch(/Windows ((NT|XP)( \d\d?.\d)?)/i, ua);
                return {
                    name: OS_MAP.Windows,
                    version: version
                };
            }
        },
        /* Firefox on iPad */
        {
            test: [/Macintosh(.*?) FxiOS(.*?)\//],
            describe: function (ua) {
                var result = {
                    name: OS_MAP.iOS,
                };
                var version = Utils.getSecondMatch(/(Version\/)(\d[\d.]+)/, ua);
                if (version) {
                    result.version = version;
                }
                return result;
            },
        },
        /* macOS */
        {
            test: [/macintosh/i],
            describe: function (ua) {
                var version = Utils.getFirstMatch(/mac os x (\d+(\.?_?\d+)+)/i, ua).replace(/[_\s]/g, '.');
                return {
                    name: OS_MAP.MacOS,
                    version: version
                };
            }
        },
        /* iOS */
        {
            test: [/(ipod|iphone|ipad)/i],
            describe: function (ua) {
                var version = Utils.getFirstMatch(/os (\d+([_\s]\d+)*) like mac os x/i, ua).replace(/[_\s]/g, '.');
                return {
                    name: OS_MAP.iOS,
                    version: version
                };
            }
        },
        /* Android */
        {
            test: function (parser) {
                var notLikeAndroid = !parser.test(/like android/i);
                var butAndroid = parser.test(/android/i);
                return notLikeAndroid && butAndroid;
            },
            describe: function (ua) {
                var version = Utils.getFirstMatch(/android[\s/-](\d+(\.\d+)*)/i, ua);
                var os = {
                    name: OS_MAP.Android,
                    version: version
                };
                return os;
            }
        },
        /* WebOS */
        {
            test: [/(web|hpw)[o0]s/i],
            describe: function (ua) {
                var version = Utils.getFirstMatch(/(?:web|hpw)[o0]s\/(\d+(\.\d+)*)/i, ua);
                var os = {
                    name: OS_MAP.WebOS
                };
                if (version && version.length) {
                    os.version = version;
                }
                return os;
            }
        },
        /* BlackBerry */
        {
            test: [/blackberry|\bbb\d+/i, /rim\stablet/i],
            describe: function (ua) {
                var version = Utils.getFirstMatch(/rim\stablet\sos\s(\d+(\.\d+)*)/i, ua) ||
                    Utils.getFirstMatch(/blackberry\d+\/(\d+([_\s]\d+)*)/i, ua) ||
                    Utils.getFirstMatch(/\bbb(\d+)/i, ua);
                return {
                    name: OS_MAP.BlackBerry,
                    version: version
                };
            }
        },
        /* Bada */
        {
            test: [/bada/i],
            describe: function (ua) {
                var version = Utils.getFirstMatch(/bada\/(\d+(\.\d+)*)/i, ua);
                return {
                    name: OS_MAP.Bada,
                    version: version
                };
            }
        },
        /* Tizen */
        {
            test: [/tizen/i],
            describe: function (ua) {
                var version = Utils.getFirstMatch(/tizen[/\s](\d+(\.\d+)*)/i, ua);
                return {
                    name: OS_MAP.Tizen,
                    version: version
                };
            }
        },
        /* Linux */
        {
            test: [/linux/i],
            describe: function () {
                return {
                    name: OS_MAP.Linux
                };
            }
        },
        /* Chrome OS */
        {
            test: [/CrOS/],
            describe: function () {
                return {
                    name: OS_MAP.ChromeOS
                };
            }
        },
        /* Playstation 4 */
        {
            test: [/PlayStation 4/],
            describe: function (ua) {
                var version = Utils.getFirstMatch(/PlayStation 4[/\s](\d+(\.\d+)*)/i, ua);
                return {
                    name: OS_MAP.PlayStation4,
                    version: version
                };
            }
        },
    ];
    var platformParsersList = [
        /* Googlebot */
        {
            test: [/googlebot/i],
            describe: function () {
                return {
                    type: 'bot',
                    vendor: 'Google'
                };
            }
        },
        /* Huawei */
        {
            test: [/huawei/i],
            describe: function (ua) {
                var model = Utils.getFirstMatch(/(can-l01)/i, ua) && 'Nova';
                var platform = {
                    type: PLATFORMS_MAP.mobile,
                    vendor: 'Huawei'
                };
                if (model) {
                    platform.model = model;
                }
                return platform;
            }
        },
        /* Nexus Tablet */
        {
            test: [/nexus\s*(?:7|8|9|10).*/i],
            describe: function () {
                return {
                    type: PLATFORMS_MAP.tablet,
                    vendor: 'Nexus'
                };
            }
        },
        /* iPad */
        {
            test: [/ipad/i],
            describe: function () {
                return {
                    type: PLATFORMS_MAP.tablet,
                    vendor: 'Apple',
                    model: 'iPad'
                };
            }
        },
        /* Firefox on iPad */
        {
            test: [/Macintosh(.*?) FxiOS(.*?)\//],
            describe: function () {
                return {
                    type: PLATFORMS_MAP.tablet,
                    vendor: 'Apple',
                    model: 'iPad',
                };
            },
        },
        /* Amazon Kindle Fire */
        {
            test: [/kftt build/i],
            describe: function () {
                return {
                    type: PLATFORMS_MAP.tablet,
                    vendor: 'Amazon',
                    model: 'Kindle Fire HD 7'
                };
            }
        },
        /* Another Amazon Tablet with Silk */
        {
            test: [/silk/i],
            describe: function () {
                return {
                    type: PLATFORMS_MAP.tablet,
                    vendor: 'Amazon'
                };
            }
        },
        /* Tablet */
        {
            test: [/tablet/i],
            describe: function () {
                return {
                    type: PLATFORMS_MAP.tablet
                };
            }
        },
        /* iPod/iPhone */
        {
            test: function (parser) {
                var iDevice = parser.test(/ipod|iphone/i);
                var likeIDevice = parser.test(/like (ipod|iphone)/i);
                return iDevice && !likeIDevice;
            },
            describe: function (ua) {
                var model = Utils.getFirstMatch(/(ipod|iphone)/i, ua);
                return {
                    type: PLATFORMS_MAP.mobile,
                    vendor: 'Apple',
                    model: model
                };
            }
        },
        /* Nexus Mobile */
        {
            test: [/nexus\s*[0-6].*/i, /galaxy nexus/i],
            describe: function () {
                return {
                    type: PLATFORMS_MAP.mobile,
                    vendor: 'Nexus'
                };
            }
        },
        /* Mobile */
        {
            test: [/[^-]mobi/i],
            describe: function () {
                return {
                    type: PLATFORMS_MAP.mobile
                };
            }
        },
        /* BlackBerry */
        {
            test: function (parser) {
                return parser.getBrowserName(true) === 'blackberry';
            },
            describe: function () {
                return {
                    type: PLATFORMS_MAP.mobile,
                    vendor: 'BlackBerry'
                };
            }
        },
        /* Bada */
        {
            test: function (parser) {
                return parser.getBrowserName(true) === 'bada';
            },
            describe: function () {
                return {
                    type: PLATFORMS_MAP.mobile
                };
            }
        },
        /* Windows Phone */
        {
            test: function (parser) {
                return parser.getBrowserName() === 'windows phone';
            },
            describe: function () {
                return {
                    type: PLATFORMS_MAP.mobile,
                    vendor: 'Microsoft'
                };
            }
        },
        /* Android Tablet */
        {
            test: function (parser) {
                var osMajorVersion = Number(String(parser.getOSVersion()).split('.')[0]);
                return parser.getOSName(true) === 'android' && (osMajorVersion >= 3);
            },
            describe: function () {
                return {
                    type: PLATFORMS_MAP.tablet
                };
            }
        },
        /* Android Mobile */
        {
            test: function (parser) {
                return parser.getOSName(true) === 'android';
            },
            describe: function () {
                return {
                    type: PLATFORMS_MAP.mobile
                };
            }
        },
        /* desktop */
        {
            test: function (parser) {
                return parser.getOSName(true) === 'macos';
            },
            describe: function () {
                return {
                    type: PLATFORMS_MAP.desktop,
                    vendor: 'Apple'
                };
            }
        },
        /* Windows */
        {
            test: function (parser) {
                return parser.getOSName(true) === 'windows';
            },
            describe: function () {
                return {
                    type: PLATFORMS_MAP.desktop
                };
            }
        },
        /* Linux */
        {
            test: function (parser) {
                return parser.getOSName(true) === 'linux';
            },
            describe: function () {
                return {
                    type: PLATFORMS_MAP.desktop
                };
            }
        },
        /* PlayStation 4 */
        {
            test: function (parser) {
                return parser.getOSName(true) === 'playstation 4';
            },
            describe: function () {
                return {
                    type: PLATFORMS_MAP.tv
                };
            }
        },
        /* Roku */
        {
            test: function (parser) {
                return parser.getOSName(true) === 'roku';
            },
            describe: function () {
                return {
                    type: PLATFORMS_MAP.tv,
                };
            },
        },
    ];

    var Parser = (function () {

        /**
         * Создать экземпляр Parser
         *
         * @param {String} UA Строка User-Agent
         *
         * @throw {Error} в случае пустой строки UA
         *
         * @constructor
         */
        function Parser(UA) {
            if (UA === void (0) || UA === null || UA === '') {
                throw new Error('UserAgent parameter can\'t be empty ');
            }
            this._ua = UA;
            this.parsedResult = {};
            this.parse();
        };

        /**
         * Получить строку UserAgent текущего экземпляра Parser
         * @return {String} - UserAgent текущего экземпляра Parser
         */
        Parser.prototype.getUA = function () {
            return this._ua;
        };

        /**
         * Проверьть строку UserAgent на регулярное выражение
         * @param {RegExp} regex
         *
         * @return {Boolean} - результат проверки UserAgent
         */
        Parser.prototype.test = function (regex) {
            return regex.test(this._ua);
        };

        /**
         * Разобрать иформацию о браузере
         * @return {Object}
         */
        Parser.prototype.parseBrowser = function () {
            var vm = this;
            this.parsedResult.browser = {};
            var browserDescriptor = Utils.find(browserParsersList, function (_browser) {
                if (typeof _browser.test === 'function') {
                    return _browser.test(vm);
                }
                if (_browser.test instanceof Array) {
                    return _browser.test.some(function (condition) {
                        return vm.test(condition);
                    });
                }
                throw new Error('Browser\'s test function is not valid');
            });

            if (browserDescriptor) {
                this.parsedResult.browser = browserDescriptor.describe(this.getUA());
            }

            return this.parsedResult.browser;
        };

        /**
         * Получить иформацию о браузере
         * @return {Object}
         */
        Parser.prototype.getBrowser = function () {
            if (this.parsedResult.browser) {
                return this.parsedResult.browser;
            }

            return this.parseBrowser();
        };

        /**
         * Получить имя браузера
         * @param {Boolean} [toLowerCase] вернуть значение в нижнем регистре
         * @return {String} Имя браузера или пустая строка
         */
        Parser.prototype.getBrowserName = function (toLowerCase) {
            if (toLowerCase) {
                return String(this.getBrowser().name).toLowerCase() || '';
            }

            return this.getBrowser().name || '';
        };

        /**
         * Получить версию браузера
         * @return {String} версия браузера
         */
        Parser.prototype.getBrowserVersion = function () {
            return this.getBrowser().version;
        };

        /**
         * Разобрать инфрмацию о ОС
         * @return {*|{}}
         */
        Parser.prototype.parseOS = function () {
            var vm = this;
            this.parsedResult.os = {};
            var os = Utils.find(osParsersList, function (_os) {
                if (typeof _os.test === 'function') {
                    return _os.test(vm);
                }
                if (_os.test instanceof Array) {
                    return _os.test.some(function (condition) {
                        return vm.test(condition);
                    });
                }
                throw new Error('OS\'s test function is not valid');
            });
            if (os) {
                this.parsedResult.os = os.describe(this.getUA());
            }

            return this.parsedResult.os;
        };

        /**
         * Получить инфрмацию о ОС
         * @return {Object}
         *
         * @example
         * this.getOS();
         * {
         *   name: 'macOS',
         *   version: '10.11.12'
         * }
         */
        Parser.prototype.getOS = function () {
            if (this.parsedResult.os) {
                return this.parsedResult.os;
            }

            return this.parseOS();
        };

        /**
         * Получить имя ОС
         * @param {Boolean} [toLowerCase] вернуть значение в нижнем регистре
         * @return {String} имя ОС
         */
        Parser.prototype.getOSName = function (toLowerCase) {
            var name = this.getOS().name;

            if (toLowerCase) {
                return String(name).toLowerCase() || '';
            }
            return name || '';
        };

        /**
         * Получить версию ОС
         * @return {String} полная версия с точками ('10.11.12', '5.6'и т.д.)
         */
        Parser.prototype.getOSVersion = function () {
            return this.getOS().version;
        };

        /**
         * Разобрать информацию о приложении из котогоро запущен браузер
         * @return {{}}
         */
        Parser.prototype.parseApp = function () {
            var _this = this;
            this.parsedResult.app = {};
            var app = Utils.find(appParsersList, function (_app) {
                if (typeof _app.test === 'function') {
                    return _app.test(_this);
                }
                if (_app.test instanceof Array) {
                    return _app.test.some(function (condition) {
                        return _this.test(condition);
                    });
                }
                throw new Error("Browser's test function is not valid");
            });
            if (app) {
                this.parsedResult.app = app.describe(this.getUA());
            }
            return this.parsedResult.app;
        };

        /**
         * Получить информацию о приложении из котогоро запущен браузер
         * @return {*|{}}
         */
        Parser.prototype.getApp = function () {
            if (this.parsedResult.app) {
                return this.parsedResult.app;
            }

            return this.parseApp();
        };

        /**
         * Получить название приложения
         * @param {Boolean} [toLowerCase] вернуть значение в нижнем регистре
         * @return {String} Имя приложения или пустая строка
         *
         * @public
         */
        Parser.prototype.getAppName = function (toLowerCase) {
            if (toLowerCase) {
                return String(this.getApp().name).toLowerCase() || '';
            }
            return this.getApp().name || '';
        };

        /**
         * Разобрать информацию о платформе
         * @return {{}}
         */
        Parser.prototype.parsePlatform = function () {
            var vm = this;
            this.parsedResult.platform = {};
            var platform = Utils.find(platformParsersList, function (_platform) {
                if (typeof _platform.test === 'function') {
                    return _platform.test(vm);
                }
                if (_platform.test instanceof Array) {
                    return _platform.test.some(function (condition) {
                        return vm.test(condition);
                    });
                }
                throw new Error('Platform\'s test function is not valid');
            });
            if (platform) {
                this.parsedResult.platform = platform.describe(this.getUA());
            }

            return this.parsedResult.platform;
        };

        /**
         * Получить информацию о платформе
         * @return {{}}
         */
        Parser.prototype.getPlatform = function () {
            if (this.parsedResult.platform) {
                return this.parsedResult.platform;
            }
            return this.parsePlatform();
        };

        /**
         * Получить название платформы
         * @param {Boolean} [toLowerCase] вернуть значение в нижнем регистре
         * @return {*} название платформы
         */
        Parser.prototype.getPlatformType = function (toLowerCase) {
            var type = this.getPlatform().type;

            if (toLowerCase) {
                return String(type).toLowerCase() || '';
            }

            return type || '';
        };

        /**
         * Разобрать полную информацию
         * @return {Parser}
         */
        Parser.prototype.parse = function () {
            this.parseBrowser();
            this.parseOS();
            this.parsePlatform();
            this.parseApp();
            return this;
        };

        /**
         * Получите полную информацию
         * @return {ParsedResult}
         */
        Parser.prototype.getResult = function () {
            return Object.assign({}, this.parsedResult);
        };

        return Parser;
    })();

    var Bowser = (function () {
        function Bowser() { }
        /**
         * Создает экземпляр {@link module: parser: Parser}
         *
         * @param {String} UA Строка User-Agent
         * @returns {Parser}
         * @throws {Error} когда UA не является строкой
         *
         * @example
         * var parser = Bowser.getParser(window.navigator.userAgent);
         * var result = parser.getResult();
         */
        Bowser.getParser = function (UA, skipParsing) {
            if (typeof UA !== 'string') {
                throw new Error('UserAgent should be a string');
            }

            return new Parser(UA);
        };
        /**
         * Создает экземпляр {@link Parser} и немедленно запускает {@link Parser.getResult}
         *
         * @param UA Строка User-Agent
         * @return {ParsedResult}
         *
         * @example
         * var result = Bowser.parse(window.navigator.userAgent);
         */
        Bowser.parse = function (UA) {
            return (new Parser(UA)).getResult();
        };

        return Bowser;
    })();

    var BrowsingModeDetector = (function () {
        /**
         * Создать экземпляр BrowsingModeDetector
         *
         * @constructor
         */
        function BrowsingModeDetector() {
            this._browsingInIncognitoMode = void 0;
        }

        /**
         * Получить режим работы браузера
         */
        BrowsingModeDetector.prototype.getBrowsingMode = function () {
            return this._browsingInIncognitoMode;
        };

        /**
         * Установить режим работы браузера в режиме икогнито
         */
        BrowsingModeDetector.prototype.browsingInIncognitoMode = function () {
            this._browsingInIncognitoMode = true;
        };

        /**
         * Установить режим работы браузера в нормальном режиме
         */
        BrowsingModeDetector.prototype.browsingInNormalMode = function () {
            this._browsingInIncognitoMode = false;
        };

        /**
         * @param {Function} callback - функция обратного вызова
         * @returns {boolean}
         */
        BrowsingModeDetector.prototype.run = function (callback) {
            var vm = this;
            (new BrowserFactory())
                .browser(this)
                .detectBrowsingMode();

            this.retry(
                function () {
                    return typeof vm._browsingInIncognitoMode !== 'undefined';
                },
                function () {
                    callback(vm._browsingInIncognitoMode);
                }
            );
        };

        BrowsingModeDetector.prototype.retry = function (ready, callback) {
            var iteration = 0;
            var maxRetry = 50;
            var interval = 10;
            var isTimeout = false;

            var id = window.setInterval(
                function () {
                    if (ready()) {
                        window.clearInterval(id);
                        callback(isTimeout);
                    }
                    if (iteration++ > maxRetry) {
                        window.clearInterval(id);
                        isTimeout = true;
                        callback(isTimeout);
                    }
                },
                interval
            );
        };

        return BrowsingModeDetector;
    })();

    var BrowserFactory = (function () {
        /**
         * Создать экземпляр BrowserFactory
         *
         * @constructor
         */
        function BrowserFactory() {
            this._browser = void 0;
        }

        /**
         * Получить экземпляр функции для тестирования режима работы браузера
         * @param {BrowsingModeDetector} BrowsingModeDetector 
         */
        BrowserFactory.prototype.browser = function (BrowsingModeDetector) {
            if (typeof this._browser === 'object') {
                return this._browser;
            }

            this._browser = this._resolve(BrowsingModeDetector);

            return this._browser;
        };

        /**
         * @param {BrowsingModeDetector} BrowsingModeDetector
         * @returns {*}
         * @private
         */
        BrowserFactory.prototype._resolve = function (BrowsingModeDetector) {
            if (/constructor/i.test(window.HTMLElement) || navigator.vendor && navigator.vendor.indexOf('Apple') > -1) {
                return new SafariBrowser(BrowsingModeDetector);
            } else if ('MozAppearance' in document.documentElement.style) {
                return new FirefoxBrowser(BrowsingModeDetector);
            } else if (window.webkitRequestFileSystem) {
                return new WebkitBrowser(BrowsingModeDetector);
            } else if (window.PointerEvent || window.MSPointerEvent) {
                return new IE10EdgeBrowser(BrowsingModeDetector);
            } else {
                return new OtherBrowser(BrowsingModeDetector);
            }
        };

        return BrowserFactory;
    })();


    /**
     * @param {BrowsingModeDetector} BrowsingModeDetector
     * @returns {WebkitBrowser}
     * @constructor
     */
    var WebkitBrowser = function (BrowsingModeDetector) {
        this.BrowsingModeDetector = BrowsingModeDetector;

        this.detectBrowsingMode = function () {
            var self = this;

            var callbackWhenWebkitRequestFileSystemIsON = function () {
                try {
                    self.storageEstimateWrapper().then(function (result) {
                        // var usage = (result || {}).usage;
                        var quota = (result || {}).quota;
                        if (quota < 120000000) {
                            self.BrowsingModeDetector.browsingInIncognitoMode();
                        } else {
                            self.BrowsingModeDetector.browsingInNormalMode();
                        }
                    });
                } catch (error) {
                    self.BrowsingModeDetector.browsingInNormalMode();
                }
            };

            var callbackWhenWebkitRequestFileSystemIsOFF = function (e) {
                self.BrowsingModeDetector.browsingInIncognitoMode();
            };

            window.webkitRequestFileSystem(
                window.TEMPORARY,
                1,
                callbackWhenWebkitRequestFileSystemIsON,
                callbackWhenWebkitRequestFileSystemIsOFF
            );
        };

        this.storageEstimateWrapper = function () {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                // We've got the real thing! Return its response.
                return navigator.storage.estimate();
            }

            if ('webkitTemporaryStorage' in navigator &&
                'queryUsageAndQuota' in navigator.webkitTemporaryStorage) {
                // Return a promise-based wrapper that will follow the expected interface.
                return new Promise(function (resolve, reject) {
                    navigator.webkitTemporaryStorage.queryUsageAndQuota(
                        function (usage, quota) {
                            resolve({
                                usage: usage,
                                quota: quota
                            })
                        },
                        reject
                    );
                });
            }

            // If we can't estimate the values, return a Promise that resolves with NaN.
            return Promise.resolve({
                usage: NaN,
                quota: NaN
            });
        }

        return this;
    };

    /**
     * @param {BrowsingModeDetector} BrowsingModeDetector
     * @returns {FirefoxBrowser}
     * @constructor
     */
    var FirefoxBrowser = function (BrowsingModeDetector) {
        this.BrowsingModeDetector = BrowsingModeDetector;

        this.detectBrowsingMode = function () {
            var db;
            var self = this;

            var callbackWhenIndexedDBWorking = function (e) {
                if (typeof self.BrowsingModeDetector.getBrowsingMode() === "undefined") {
                    self.BrowsingModeDetector.retry(
                        function () {
                            return db.readyState === 'done';
                        },
                        function (isTimeout) {
                            if (isTimeout) {
                                return callbackWhenIndexedDBNotWorking(e);
                            }

                            if (db.result) {
                                self.BrowsingModeDetector.browsingInNormalMode();
                            }
                        }
                    );
                }
            };

            var callbackWhenIndexedDBNotWorking = function (e) {
                // On Firefox ESR versions, actually IndexedDB don't works.
                self.BrowsingModeDetector.browsingInIncognitoMode();
            };

            db = indexedDB.open("i");
            db.onsuccess = callbackWhenIndexedDBWorking;
            db.onerror = callbackWhenIndexedDBNotWorking;
        };

        return this;
    };

    /**
     * @param {BrowsingModeDetector} BrowsingModeDetector
     * @returns {IE10EdgeBrowser}
     * @constructor
     */
    var IE10EdgeBrowser = function (BrowsingModeDetector) {
        this.BrowsingModeDetector = BrowsingModeDetector;

        this.detectBrowsingMode = function () {
            this.BrowsingModeDetector.browsingInNormalMode();

            try {
                if (!window.indexedDB) {
                    this.BrowsingModeDetector.browsingInIncognitoMode();
                }
            } catch (e) {
                this.BrowsingModeDetector.browsingInIncognitoMode();
            }
        };

        return this;
    };

    /**
     * @param {BrowsingModeDetector} BrowsingModeDetector
     * @returns {SafariBrowser}
     * @constructor
     */
    var SafariBrowser = function (BrowsingModeDetector) {
        this.BrowsingModeDetector = BrowsingModeDetector;

        function tryFillLocalStorage(chunkSize) {
            var size = chunkSize / 4;
            var content = (new Array(size + 1)).join('aあ');
            var blob = {
                size: chunkSize,
                payload: content
            };

            blob.lastModifiedDate = new Date();
            blob.name = (~~(Math.random() * 100000) + 100000) + '.txt';

            try {
                localStorage.setItem(blob.name, JSON.stringify(blob));
            } catch (e) {
                try {
                    localStorage.removeItem(blob.name);
                } catch (e) { }

                return false;
            }

            try {
                localStorage.removeItem(blob.name);
            } catch (e) { }

            return true;
        }

        this.detectBrowsingMode = function () {
            if (window.safariIncognito || !navigator.cookieEnabled) {
                this.BrowsingModeDetector.browsingInIncognitoMode();
                return;
            }

            try {
                window.openDatabase(null, null, null, null);
                window.localStorage.setItem('test', 1);

            } catch (e) {
                this.BrowsingModeDetector.browsingInIncognitoMode();
            }

            if (typeof this.BrowsingModeDetector.getBrowsingMode() === 'undefined') {
                window.localStorage.removeItem('test');
                // normal mode having max 5 MB in localStorage space,
                // yes NORMAL MODE having max 5 MB
                var LOCAL_STORAGE_DATA_SIZE = 1024 * 1024 * 5; // 5MB
                if (tryFillLocalStorage(LOCAL_STORAGE_DATA_SIZE)) {
                    this.BrowsingModeDetector.browsingInIncognitoMode();
                } else {
                    this.BrowsingModeDetector.browsingInNormalMode();
                }
            }
        };

        return this;
    };

    var OtherBrowser = function (BrowsingModeDetector) {
        this.BrowsingModeDetector = BrowsingModeDetector;

        this.detectBrowsingMode = function () {
            this.BrowsingModeDetector.browsingInNormalMode();
        };
    };

    var SberidUniversallink = (function () {
        /**
         * Создать экземпляр SberidUniversallink
         * @param {Object} config - настройки
         * @constructor
         */
        function SberidUniversallink(config) {
            this._config = config || {};
            this._params = {};
            if (typeof this._config.needAdditionalRedirect === "undefined") {
                this._config.needAdditionalRedirect = true;
            }
            if (this._config.params) {
                this._params = Utils.getUrlSearchParams(this._config.params);
            }
            this.redirect = {
                android: {
                    chrome: "com.android.chrome",
                    yandex: "com.yandex.browser",
                    opera: "com.opera.browser",
                    firefox: "org.mozilla.firefox",
                    samsung_internet: "com.sec.android.app.sbrowser",
                },
                ios: {
                    chrome: {
                        https: "googlechromes://",
                        http: "googlechrome://",
                    },
                    yandex: {
                        https: "yandexbrowser-open-url://https://",
                        http: "yandexbrowser-open-url://http://",
                    },
                    opera_touch: {
                        https: "touch-https://",
                        http: "touch-http://",
                    },
                    firefox: {
                        https: "firefox://open-url%3Furl%3Dhttps%3A%2F%2F",
                        http: "firefox://open-url%3Furl%3Dhttp%3A%2F%2F",
                    },
                },
            };
            this.universalLinkUrl =
                config.universalLinkUrl ||
                "https://online.sberbank.ru/CSAFront/oidc/sberbank_id/authorize.do";
            this.baseUrl =
                config.baseUrl ||
                "https://online.sberbank.ru/CSAFront/oidc/authorize.do";
            this.deeplinkUrl =
                config.deeplinkUrl || "sberbankidlogin://sberbankidsso";

            this.init();
        }

        /**
         * Проверить является ли браузер разрешенным
         * @param {String} alias псевдоним браузера
         * @return {boolean} - входит ли браузер в список разрешенных
         */
        SberidUniversallink.prototype.isAllowedBrowser = function (alias) {
            var browsers = [
                "chrome",
                "yandex",
                "firefox",
                "samsung_internet",
                "opera",
                "opera_touch",
            ];

            return browsers.indexOf(alias) !== -1;
        };

        /**
         * Получить дополнительный параметр редиректа
         * @param {String} os - название операционной системы
         * @param {String} browser - алиас браузера
         */
        SberidUniversallink.prototype.setAddionalRedirect = function (
            os,
            browser
        ) {
            var protocol = "https";
            var redirectUri = Utils.isEncoded(this._params.redirect_uri) ?
                decodeURIComponent(this._params.redirect_uri) :
                this._params.redirect_uri;

            if (redirectUri) {
                protocol = redirectUri.indexOf("https://") ? "https" : "http";
            }

            if (this.redirect.hasOwnProperty(os)) {
                if (this.redirect[os].hasOwnProperty(browser)) {
                    if (os === "android") {
                        this._params.package = this.redirect[os][browser];
                    } else if (os === "ios") {
                        this._params.ext_redirect_uri =
                            this.redirect[os][browser][protocol] +
                            (redirectUri || "").replace(/^https?:\/\//, "");
                    }
                }
            }
        };

        /**
         * Функция обратного вызова для опредения режима работы браузера
         * @param {Boolean} isPrivate режим работы браузера
         */
        SberidUniversallink.prototype.browsingModeDetectorCallback = function (
            isPrivate
        ) {
            var isUniversalLink = false;
            var browser = Bowser.getParser(window.navigator.userAgent);
            var result = browser.getResult();
            var alias = Utils.getBrowserAlias(browser.getBrowserName());

            if (this._config.needAdditionalRedirect) {
                this.setAddionalRedirect(browser.getOSName(true), alias);
            }

            if (!isPrivate && !result.app.name) {
                if (browser.getOSName(true) === "ios") {
                    if (
                        alias === "safari" ||
                        (this.isAllowedBrowser(alias) &&
                            this._config.needAdditionalRedirect)
                    ) {
                        isUniversalLink = true;
                    }
                } else if (
                    browser.getOSName(true) === "android" &&
                    this.isAllowedBrowser(alias)
                ) {
                    isUniversalLink = true;
                } else {
                    isUniversalLink = false;
                }
            }

            var deeplink = Utils.buildUrl(this.deeplinkUrl, this._params);
            var link = Utils.buildUrl(
                isUniversalLink ? this.universalLinkUrl : this.baseUrl,
                this._params
            );

            var response = {
                isPrivate: isPrivate,
                isUniversalLink: isUniversalLink,
                isWebview: !!result.app.name,
                os: browser.getOSName(true),
                browser: alias,
                link: link,
                deeplink: deeplink,
                universalLinkUrl: this.universalLinkUrl,
                defaultLinkUrl: this.baseUrl,
                deeplinkUrl: this.deeplinkUrl,
                oidc: this._params,
            };

            if (this._config.selector) {
                var $linkElement = document.querySelectorAll(this._config.selector);

                if ($linkElement.length > 0) {
                    for (var i = 0; i < $linkElement.length; i += 1) {
                        $linkElement[i].setAttribute("href", link);
                    }
                }
            }

            if (this._config.formSelector) {
                var $formElement = document.querySelectorAll(
                    this._config.formSelector
                );
                if ($formElement.length > 0) {
                    for (var i = 0; i < $formElement.length; i += 1) {
                        $formElement[i].setAttribute("value", isUniversalLink);
                    }
                }
            }

            if (
                this._config.callback &&
                typeof this._config.callback === "function"
            ) {
                this._config.callback(response);
            }
        };

        SberidUniversallink.prototype.init = function () {
            this._browsingModeDetector = new BrowsingModeDetector();
            try {
                this._browsingModeDetector.run(
                    this.browsingModeDetectorCallback.bind(this)
                );
            } catch (error) {
                this.browsingModeDetectorCallback(false);
            }
        };

        return SberidUniversallink;
    })();

    var SberidSDK1 = (function () {
        /**
         * Создать экземпляр SberidSDK
         * @param {Object} config - настройки модуля
         * @property {Boolean} mweb2app - формировать ли универсальную ссылку
         * @property {Object} universallink - параметры для формирование универсальных ссылок
         * @property {Object} oidc - параметры oidc
         * @property {String} display - режим отображения страницы авторизации через Сбер ID (popup - высплывающе окно, page - в текущем окне)
         * @property {Object} style - параметры стилизации кнопок
         * @property {Object} sa - параметры отправки Sber Analytics
         * @property {Boolean} generateState - включить генерацию и проверку state на фронте
         * @param {Function} onSuccessCallback - функция обратного вызова при успешной авторизации
         * @param {Function} onErrorCallback - функция обратного вызова при ошибки авторизации
         * @constructor
         */
        var SberidSDK = function(config, onSuccessCallback, onErrorCallback) {
            var SA_API_KEY = 'J6rR7rO7bL1hG2hO1qQ0tH3aT2iW7fX4gN8aO8tG8lU8rF8pB1';

            this.BUTTON_TEXT = {
                default: 'Войти по Сбер ID',
                resume: 'Продолжить со Сбер ID',
                login: 'Сбер ID',
                fill: 'Заполнить со Сбер ID'
            };

            this.BUTTON_THEME = {
                default: {
                    backgroundColor: '#21A038',
                    borderColor: '#21A038',
                    color: '#fff',
                    fill: '#fff',
                    borderRadius: 4
                },
                white: {
                    backgroundColor: '#fff',
                    borderColor: '#767676',
                    color: '#000000',
                    fill: '#21A038',
                    borderRadius: 4
                }
            };

            this.BUTTON_SIZE = {
                default: {
                    padding: 22,
                    fontSize: 16,
                    lineHeight: 19,
                    height: 48
                },
                small: {
                    padding: 16,
                    fontSize: 14,
                    lineHeight: 16,
                    height: 32
                },
                long: {
                    padding: 26,
                    fontSize: 16,
                    lineHeight: 19,
                    height: 64
                }
            };

            this.VERSION = '2.0.0';

            this.onSuccessCallback = onSuccessCallback;
            this.onErrorCallback = onErrorCallback;

            this.parser = Bowser.getParser(window.navigator.userAgent);

            this.mergeTheme(config);

            var sa = Object.assign({}, {
                url: 'https://sa.online.sberbank.ru:8098/metrics/partners',
                init: 'none',
                enable: false
            }, config.sa || {});

            this.config.sa = Object.assign({}, sa);

            if (this.config.sa.enable) {
                var sberId = (this.config.oidc && this.config.oidc.client_id) || (this.config.sa.clientId) || '';

                var saParams = {
                    url: this.config.sa.url,
                    buffer: 1,
                    apiKey: SA_API_KEY,
                    sberId: sberId,
                    subId: ''
                }
                if (this.config.sa.init === 'auto') {
                    this.initSberAnalytics(saParams);
                }
            }

            this.onInit();
        };

        /**
         * Инициализация модуля SberidSDK
         */
        SberidSDK.prototype.onInit = function () {
            var platform = this.parser.getPlatformType(true);

            if (this.config.selector) {
                this.sbButton = document.getElementsByClassName(this.config.selector)[0];
            } else {
                this.sbButton = this.createButton();
                this.setOIDCParams(this.config.oidc);

                if (this.config.container) {
                    var container = document.getElementsByClassName(this.config.container);
                    for (var i = 0; i < container.length; i += 1) {
                        container[i].appendChild(this.sbButton);
                    }
                }

                if (this.config.sa.enable) {
                    this.submitSberAnalytics('Login', 'sberid_Login_Show', 'Show', '', '', this.config.style);
                }
            }

            if (this.config.display === 'popup' && platform === 'desktop') {
                this.addEventListener();
            }

            if (this.config.sa.enable) {
                var vm = this;
                this.sbButton.addEventListener('click', function () {
                    vm.submitSberAnalytics('Login', 'sberid_Login_Button_Click', 'Click');
                });
            }
        }

        SberidSDK.prototype.getVersion = function () {
            return this.VERSION;
        }

        SberidSDK.prototype.addEventListener = function () {
            var vm = this;
            this.w = void 0;

            this.sbButton.addEventListener('click', function (e) {
                var url = vm.sbButton.getAttribute('href');
                vm.w = vm.openDialog(url, vm.closeCallback.bind(vm));
                vm.windowStatus = 'opened';
                e.preventDefault();

                return false;
            });

            if (window.addEventListener) {
                window.addEventListener('message', vm.listener.bind(vm));
            } else {
                window.attachEvent('onmessage', vm.listener.bind(vm));
            }
        };

        SberidSDK.prototype.setOIDCParams = function (params) {
            params = params || '';

            if (typeof params === 'string') {
                params = Utils.getUrlSearchParams(params);
            }

            if (params.redirect_uri && !Utils.isEncoded(params.redirect_uri)) {
                params.redirect_uri = encodeURIComponent(params.redirect_uri);
            }

            var customParams = {
                display: this.config.display || 'page'
            };

            if (this.config.generateState && this.config.display === 'popup' && !Utils.isOIDCRedirect()) {
                var state = this.generateState();
                Cookies.set('sbid_state', state, {
                    path: '/'
                });

                customParams.state = state;
            }

            var oidcParams = Utils.buildUrl(
                '',
                Object.assign({}, params, customParams) || {}
            );

            if (this.config.mweb2app) {
                new SberidUniversallink(Object.assign({}, this.config.universallink || {}, {
                    params: oidcParams,
                    callback: this.sbUniversallinkCallback.bind(this)
                }));
            } else {
                this.sbUniversallinkCallback({
                    isUniversalLink: false,
                    link: ((this.config.universallink || {}).baseUrl || 'https://online.sberbank.ru/CSAFront/oidc/authorize.do') + '?' + oidcParams
                })
            }
        };

        /**
         * Объединение свойств для генерации кнопок
         * @param {Object} config - настройки модуля
         */
        SberidSDK.prototype.mergeTheme = function (config) {
            var custom = {
                'font-family': 'SB Sans, Roboto, San Francisco, sans-serif',
                'font-weight': 400
            };

            if (config.style && config.style.custom) {
                custom = Object.assign({}, custom, config.style.custom);

                if (custom.height < 28) {
                    custom.height = 28;
                }

                if (custom.height > 64) {
                    custom.height = 64;
                }
            }

            var style = Object.assign({}, {
                theme: 'default',
                text: 'default',
                size: 'default',
                custom: custom
            }, config.style || {});

            if (Object.keys(this.BUTTON_THEME).indexOf(style.theme) === -1) {
                style.theme = 'default';
            }
            if (Object.keys(this.BUTTON_TEXT).indexOf(style.text) === -1) {
                style.text = 'default';
            }
            if (Object.keys(this.BUTTON_SIZE).indexOf(style.size) === -1) {
                style.text = 'default';
            }

            this.config = Object.assign({}, config, {
                style: style
            });

            var browserName = this.parser.getBrowserName(true);

            if (browserName === 'internet explorer') {
                this.config.display = 'page';
            }

            this.theme = Object.assign({}, this.BUTTON_THEME[this.config.style.theme], this.BUTTON_SIZE[this.config.style.size], custom);
        };

        /**
         * Генерация state
         */
        SberidSDK.prototype.generateState = function () {
            var MAX_STATE_LENGTH = 43;

            return Utils.generateRandom(MAX_STATE_LENGTH);
        }

        /**
         * Функция обратного вызова для модуля SberidUniversallink
         * @param {Object} params - результат работы модуля SberidUniversallink
         */
        SberidSDK.prototype.sbUniversallinkCallback = function (params) {
            this.sbButton.setAttribute('href', params.link);
        };

        /**
         * Проверка state
         * @param {String} state - значение state которе пришло в ответе
         */
        SberidSDK.prototype.checkState = function (state) {
            var sbidState = Cookies.get('sbid_state');

            if (state && sbidState !== state) {
                if (this.w) {
                    this.windowStatus = 'closed';
                    this.w.close();
                }

                if (typeof this.onErrorCallback === 'function') {
                    this.onErrorCallback({
                        code: 'error',
                        error: 'invalid_state',
                        description: ERROR_MESSAGES['invalid_state']
                    });
                }

                Cookies.delete('sbid_state');

                return false;
            }

            return true;
        };

        /**
         * Подписка на события дочернего открытого окна авторизации
         * @param {Object} event - ответ дочернего окна
         */
        SberidSDK.prototype.listener = function (event) {
            var message = {};

            try {
                message = JSON.parse(event.data)
            } catch (error) {
                console.warn('Ошибка при обработке postMessage', event.data)
            }

            if (this.config.generateState && !this.checkState(message.state)) {
                return;
            }

            if (message && (message.status === 'success' || message.status === 'error')) {
                if (this.w) {
                    this.windowStatus = 'closed';
                    this.w.close();
                }

                if (message.status === 'success' && typeof this.onSuccessCallback === 'function') {
                    if (this.config.sa.enable) {
                        this.submitSberAnalytics('Login', 'sberid_Login_Auth_Result', 'Result', 'success');
                    }

                    this.onSuccessCallback(message);
                }

                if (message.status === 'error' && typeof this.onErrorCallback === 'function') {
                    if (this.config.sa.enable) {
                        var description = message.error + '_' + message.description;
                        this.submitSberAnalytics('Login', 'sberid_Login_Auth_Result', 'Result', 'fail', description);
                    }

                    this.onErrorCallback(message);
                }
            }
        };

        /**
         * Получить стили для логотипа на кнопке
         * @return {{logoHeight: string, logoWidth: string, logoFill: *}}
         */
        SberidSDK.prototype.getLogoStyle = function () {
            var style = {
                logoHeight: '16px',
                logoWidth: '16px',
                logoFill: this.BUTTON_THEME[this.config.style.theme].fill
            };

            if (this.theme.height >= 34) {
                style.logoWidth = '22px';
                style.logoHeight = '22px'
            }

            if (this.theme.height >= 50) {
                style.logoWidth = '26px';
                style.logoHeight = '26px'
            }

            return style;
        };

        /**
         * Получить стили текста на кнопке
         * @return {{"margin-left": string, color: *, "font-weight": (*|number), "text-decoration": string, "font-size": string, "font-family": string}}
         */
        SberidSDK.prototype.getTextStyle = function () {
            var defaultStyle = {
                'font-family': this.theme['font-family'] || 'Roboto',
                'font-weight': this.theme['font-weight'] || 400,
                'text-decoration': 'none',
                color: this.theme.color,
                'font-size': '14px',
                'margin-left': '8px'
            };

            if (this.theme.height >= 32) {
                defaultStyle['font-size'] = '16px';
            }

            return defaultStyle;
        };

        /**
         * Получить стили кнопки
         * @return {{"background-color": *, "border-radius": string, border: string, padding: string, "box-shadow": (*|string), "text-decoration": string, display: string, "justify-content": string, "align-items": string, height: string}}
         */
        SberidSDK.prototype.getButtonStyle = function () {
            var defaultStyle = {
                'text-decoration': 'none',
                height: (this.theme.height - 2) + 'px',
                'background-color': this.theme.backgroundColor,
                display: 'inline-flex',
                'align-items': 'center',
                padding: '0 ' + this.theme.padding + 'px',
                'justify-content': 'center',
                'border-radius': this.theme.borderRadius + 'px',
                border: '1px solid ' + this.theme.borderColor,
                'box-shadow': this.theme['box-shadow'] || 'none'
            };

            if (this.config.style.size === 'long') {
                defaultStyle.display = 'flex';
            }

            return defaultStyle;
        };

        /**
         * Создать кнопку авторизации через SberID
         * @return {HTMLAnchorElement}
         */
        SberidSDK.prototype.createButton = function () {
            var sbButton = document.createElement('a');
            sbButton.className = 'sbid-button sbid-button--theme-' + this.config.style.theme + ' sbid-button--size-' + this.config.style.size;
            sbButton.id = 'i-sbid-button';
            sbButton.setAttribute('style', Utils.objToCss(this.getButtonStyle()));
            sbButton.innerHTML = Utils.stringFormat('<span class="sbid-button__logo"><svg style="display: block" width=":logoWidth:" height=":logoHeight:" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M13 0C16.0927 0 18.9337 1.08103 21.1657 2.88421L18.6371 4.74793C17.0315 3.64848 15.0899 3.00354 13 3.00354C7.48924 3.00354 3.00587 7.48999 3.00587 13.0013C3.00587 18.5126 7.48924 22.9965 13 22.9965C18.5134 22.9965 22.9968 18.5126 22.9968 13.0013C22.9968 12.9118 22.9941 12.8223 22.9924 12.7328L25.7912 10.6699C25.9289 11.4245 26 12.2055 26 13.0013C26 20.1807 20.1795 26 13 26C5.82135 26 0 20.1807 0 13.0013C0 5.81931 5.82135 0 13 0ZM23.2856 5.05241C23.9006 5.84651 24.4262 6.71169 24.8456 7.63565L13.0002 16.3673L8.05093 13.2628V9.52921L13.0002 12.6337L23.2856 5.05241Z" fill=":logoFill:"/></svg></span><span style=":textStyle:" class="sbid-button__text">:text:</span>', Object.assign({
                text: this.BUTTON_TEXT[this.config.style.text],
                textStyle: Utils.objToCss(this.getTextStyle())
            }, this.getLogoStyle()));

            return sbButton;
        };

        /**
         * Открытие модального окна авторизации
         * @param {String} url - адрес страницы открываемой в окне
         * @param {Function} closeCallback - функция обратного вызова при закрытии окна
         * @param {Object} params - параметры окнаа
         * @return {Window}
         */
        SberidSDK.prototype.openDialog = function (url, closeCallback, params) {
            var w = Utils.openDialog(url, params);
            var i = setInterval(function () {
                if (!w || w.closed) {
                    clearInterval(i);
                    closeCallback && closeCallback();
                }
            }, 100);

            return w;
        };

        /**
         * Функция обратного вызова при закрытии окна
         */
        SberidSDK.prototype.closeCallback = function () {
            if (this.windowStatus !== 'closed') {
                this.windowStatus = 'closed';
                if (typeof this.onErrorCallback === 'function') {
                    if (this.config.sa.enable) {
                        var description = 'window_closed_' + ERROR_MESSAGES['window_closed'];
                        this.submitSberAnalytics('Login', 'sberid_Login_Auth_Result', 'Result', 'fail', description);
                    }

                    this.onErrorCallback({
                        code: 'error',
                        error: 'window_closed',
                        description: ERROR_MESSAGES['window_closed']
                    });
                }
            }
        };

        SberidSDK.prototype.successWindowListener = function () {
            var params = Utils.getUrlSearchParams();

            if (window.opener && (params.code || params.error)) {
                var params = Utils.getUrlSearchParams();
                var message = Object.assign({
                    status: 'success'
                }, params);

                if (message.error) {
                    message.status = 'error';
                    message.description = ERROR_MESSAGES[message.code] || 'Что-то пошло не так';
                }
                try {
                    window.opener.postMessage(JSON.stringify(Object.assign(message, params)), window.opener.location.href);
                } catch (e) {
                    console.log('Ошибка: ', e)
                }
            }
        };

        SberidSDK.prototype.initSberAnalytics = function (saParams) {
            try {
                window.sberbankIdAnalytics = new this.initSberAnalytics(saParams) || [];
            } catch (e) {
                console.info('Ошибка при инициализации SberAnalytics', e);
                window.sberbankIdAnalytics = [];
            }
        }

        SberidSDK.prototype.submitSberAnalytics = function (eventCategory, eventAction, eventType, result, description, extendedProperties) {
            var sdkVersion = 'js_' + this.getVersion();
            var clientName = this.config.sa.clientName || Utils.getMeta('title');
            var url = window.location.href;

            try {
                var params = {
                    eventCategory: eventCategory,
                    eventAction: eventAction,
                    eventType: eventType,
                    properties: {
                        merchUrl: url,
                        merchantTitle: clientName,
                        sdkVersion: sdkVersion
                    }
                };

                if (result) {
                    params.properties.result = result;
                }

                if (description) {
                    params.properties.errorDescription = description;
                }

                if (extendedProperties) {
                    params.properties = Object.assign({}, params.properties, extendedProperties);
                }

                window.sberbankIdAnalytics.push(params);
            } catch (e) {
                console.info('Ошибка при отправки события (' + eventCategory + ', ' + eventAction + ', ' + eventType + ') в sber analytics', e);
            }
        }

        return SberidSDK;
    })();

    if (!Object.assign) {
        Object.defineProperty(Object, 'assign', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (target, firstSource) {
                'use strict';
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert first argument to object');
                }

                var to = Object(target);
                for (var i = 1; i < arguments.length; i++) {
                    var nextSource = arguments[i];
                    if (nextSource === undefined || nextSource === null) {
                        continue;
                    }

                    var keysArray = Object.keys(Object(nextSource));
                    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                        var nextKey = keysArray[nextIndex];
                        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                        if (desc !== undefined && desc.enumerable) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
                return to;
            }
        });
    }

    exports.SberSDK1 = SberidSDK1;
}(typeof exports === 'object' && exports || this));