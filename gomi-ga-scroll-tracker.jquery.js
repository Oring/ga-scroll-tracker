/**
  * Google Analytics Scroll Depth Tracker (preset : jQuery)
  * 현재는 GTM 자체적으로 지원함.
  * https://www.youtube.com/watch?v=mcQdCl-B3lw [Google Tag Manager Scroll Depth Trigger]
  * https://www.simoahava.com/analytics/scroll-depth-trigger-google-tag-manager/ [The Scroll Depth Trigger In Google Tag Manager]
  *
  *
  * @param {Number} num % 단위 [default : 10 (ex. 10%, 20%, 30% ... )]
  * @param {String} gaCat Google Analytics Event Category 값
  * @param {String} gaAct Google Analytics Event Action 값
  */

function GomiScrollTracker(num = 10, gaCat = '스크롤', gaAct = 'scroll-down') {
  /* 문서 총 길이 Document Height */
  var DH;

  /* 뷰포트 높이 Viewport Height */
  var VH;

  /* 뷰포트 위치 Viewport Position */
  var VP;

  /* 몇 % 단위 */
  var pUnit = num;

  /* 몇 % */
  var items = [];

  /* 현재 몇 번째 위치 */
  var pPosition;

  Init = {
    _start: function () {
      VH = jQuery(window).height();
      DH = jQuery(document).height();
      VP = jQuery(window).scrollTop();

      //console.log(`DH : ${DH}, VH : ${VH}, VP : ${VP}, 100% = ${DH-VH}px`);
      var i = 0;
      var percent = 0;
      while (percent <= 100) {
        items[i] = {
          _n:					i,
          _percent:		i * pUnit,
          _position:	(DH - VH) * i * pUnit / 100,
          _flag:			false,
          _GA:				function () {
            if (!items[pPosition]._flag) {
              gtag('event', gaAct, { 'event_label': this._percent + '%', 'event_category': gaCat, 'non_interaction': true });

              // ga('send', 'event', gaCat, gaAct, this._percent + '%', { nonInteraction: true }); // ga -> gtag 로 변경
              /* console.log(`ga('send','event','스크롤','scroll-down',${this._percent}+'%', {nonInteraction: true});`); */
            }

            this._flag = true;
          },
        };
        i++;
        percent = i * pUnit;
      } // End while
    }, // End _start
  }; // End Init

  Actions = {
    _sendGA:	function () {
      if (!items[pPosition]._flag) {
        items[pPosition]._GA();
      }
    },
  };

  Event = {
    _getPosition: function (VP) {
      items.forEach(function (item) {
        /* 뷰위치가 섹션 위치보다 아래일 경우 && flag를 안찍은 경우 */
        if (VP >= item._position && item._flag == false) {
          pPosition = item._n;
          Actions._sendGA();
          /* console.log(`item._n = ${item._n}, VP = ${VP}, item._position = ${item._position}`);*/
        }
      });
    }, // End _getPosition
  }; // End Event

  jQuery(window).scroll(function () {
    VH =	jQuery(window).height();
    VP = jQuery(window).scrollTop();
    DH = jQuery(document).height();
    /* console.log(`DH : ${DH}, VH : ${VH}, VP : ${VP}`); */
    Event._getPosition(VP);

  }); // End $scroll

  Init._start();
}
