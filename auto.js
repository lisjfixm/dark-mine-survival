/* =====================================================================
 * 實驗性粗糙自動遊玩腳本（Dark Mine Survival）
 *
 * 重要限制：本成品是編譯後的 Unity WebGL，前端讀不到血量、背包、任務、
 * 敵人等內部狀態。這個腳本只能依固定節奏合成觸控／滑鼠事件，在畫面上
 * 「盲打」虛擬搖桿與操作區，不會讀取遊戲狀態、也不會規劃路徑，可能原地
 * 卡住或誤觸按鈕。它不是智能 bot；真正的引擎內 AI 需要 Unity 原始碼。
 *
 * 預設關閉；開關狀態保存在 localStorage。桌面橫版為主要驗證情境，直向
 * 旋轉畫面的座標對應可能偏移。
 * ===================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "darkmine.auto";
  var TICK_MS = 280;

  // 邏輯畫面 1280x720 參考座標（與引擎 CanvasScaler 一致）。
  var ZONES = {
    stickOrigin: { x: 170, y: 585 },   // 左下虛擬搖桿
    stickForward: { x: 170, y: 500 },  // 前推位置
    action: { x: 1110, y: 560 },       // 右下操作／互動區
    prompt: { x: 640, y: 360 }         // 畫面中央，用來關閉提示面板
  };

  var btn = null;
  var active = false;
  var timer = null;
  var cycle = 0;
  var stickHeld = false;
  var touchId = 1;

  function canvas() {
    return document.getElementById("unity-canvas") ||
           document.querySelector("canvas#unity-canvas, canvas");
  }

  // 邏輯座標 -> 用戶端座標（依 canvas 目前版面比例換算）。
  function toClient(lx, ly) {
    var c = canvas();
    if (!c) return { x: lx, y: ly };
    var rect = c.getBoundingClientRect();
    return {
      x: rect.left + (lx / 1280) * rect.width,
      y: rect.top + (ly / 720) * rect.height
    };
  }

  function touchPoint(x, y, id) {
    return {
      identifier: id,
      target: canvas(),
      clientX: x, clientY: y,
      pageX: x, pageY: y,
      screenX: x, screenY: y,
      force: 0.5, radiusX: 10, radiusY: 10
    };
  }

  function dispatchTouch(type, x, y, id) {
    var c = canvas();
    if (!c || typeof TouchEvent === "undefined") return;
    var t = touchPoint(x, y, id);
    var list = (type === "touchend" || type === "touchcancel") ? [] : [t];
    var evt = new TouchEvent(type, {
      bubbles: true, cancelable: true,
      touches: list, targetTouches: list, changedTouches: [t]
    });
    c.dispatchEvent(evt);
  }

  function dispatchMouse(type, x, y) {
    var c = canvas();
    if (!c) return;
    var evt = new MouseEvent(type, {
      bubbles: true, cancelable: true,
      clientX: x, clientY: y, button: 0
    });
    c.dispatchEvent(evt);
  }

  function press(lx, ly) {
    var p = toClient(lx, ly);
    var id = touchId++;
    dispatchTouch("touchstart", p.x, p.y, id);
    dispatchMouse("mousedown", p.x, p.y);
    return id;
  }

  function move(lx, ly, id) {
    var p = toClient(lx, ly);
    dispatchTouch("touchmove", p.x, p.y, id);
    dispatchMouse("mousemove", p.x, p.y);
  }

  function release(lx, ly, id) {
    var p = toClient(lx, ly);
    dispatchTouch("touchend", p.x, p.y, id);
    dispatchMouse("mouseup", p.x, p.y);
  }

  function tap(zone) {
    var id = press(zone.x, zone.y);
    release(zone.x, zone.y, id);
  }

  function holdStick() {
    if (stickHeld) return;
    press(ZONES.stickOrigin.x, ZONES.stickOrigin.y);
    move(ZONES.stickForward.x, ZONES.stickForward.y, touchId - 1);
    stickHeld = true;
  }

  function releaseStick() {
    if (!stickHeld) return;
    release(ZONES.stickForward.x, ZONES.stickForward.y, touchId - 1);
    stickHeld = false;
  }

  // 固定循環：前進一段 -> 操作區點一下 -> 每三輪點一次中央關面板。
  function tick() {
    if (!window.unityInstance) return; // 還在載入，先不操作
    cycle++;

    if (cycle % 4 === 0) {
      releaseStick();
      tap(ZONES.action);
    } else if (cycle % 4 === 2) {
      holdStick();
    }
    if (cycle % 12 === 0) {
      tap(ZONES.prompt);
    }
  }

  function start() {
    if (timer) return;
    active = true;
    cycle = 0;
    timer = setInterval(tick, TICK_MS);
    render();
  }

  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
    releaseStick();
    active = false;
    render();
  }

  function render() {
    if (!btn) return;
    btn.textContent = active ? "自動遊玩：開" : "自動遊玩：關";
    btn.classList.toggle("on", active);
  }

  function init() {
    btn = document.getElementById("auto-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (active) stop(); else start();
      try { localStorage.setItem(STORAGE_KEY, active ? "1" : "0"); } catch (e) {}
    });

    var saved = "0";
    try { saved = localStorage.getItem(STORAGE_KEY) || "0"; } catch (e) {}
    if (saved === "1") start();
    render();
  }

  window.DarkMineAuto = {
    setActive: function (on) { on ? start() : stop(); },
    isActive: function () { return active; }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
