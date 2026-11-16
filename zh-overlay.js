/* =====================================================================
 * 中文 overlay 覆蓋層（Dark Mine Survival）
 *
 * 重要限制：成品是編譯後的 Unity WebGL，遊戲內英文文本畫在 canvas 上，
 * 前端無法讀取目前顯示的是哪一句，也無法移除畫面上的英文。本層只做兩件
 * 不改二進位的事：
 *   1. 在已知 HUD 區域以 HTML 系統字型貼繁中標籤（座標為 1280x720 邏輯
 *      框架估計值，需實機校準，見下方 ZONES）；
 *   2. 提供詞彙對照面板，列出提取到的英文文本與繁中翻譯供查閱。
 *
 * 覆蓋層預設關閉；開關狀態保存在 localStorage。標籤不攔截觸控／滑鼠事件，
 * 只有對照面板本身可互動。
 * ===================================================================== */
(function () {
  "use strict";

  var STORAGE_KEY = "darkmine.zh";

  // ---- HUD 區域標籤（1280x720 邏輯框架估計座標） -----------------------
  // x/y 為邏輯座標；align 控制文字對齊。這些位置依 HUD GameObject 名稱與
  // 常見橫版配置推估，未在 WebGL 實機對準；若標籤偏離實際圖示，改這裡的
  // 數值即可，不需動遊戲成品。
  var ZONES = [
    { id: "health",  label: "血量", x: 24,   y: 18,  align: "left"   },
    { id: "fuel",    label: "燃料", x: 210,  y: 18,  align: "left"   },
    { id: "mission", label: "任務", x: 640,  y: 20,  align: "center" },
    { id: "bag",     label: "背包", x: 1188, y: 56,  align: "right"  },
    { id: "stick",   label: "移動", x: 170,  y: 660, align: "center" },
    { id: "action",  label: "互動", x: 1110, y: 660, align: "center" },
    { id: "hint",    label: "提示", x: 640,  y: 470, align: "center" }
  ];

  // ---- 詞彙對照（英文 -> 繁中；保留 {0}/{1}/{2}/{0:0} 佔位） -------------
  var GROUPS = [
    {
      title: "介面標籤",
      items: [
        ["Close the door", "關上門"],
        ["Close the gate", "關上柵門"],
        ["Buy", "購買"],
        ["Backpack", "背包"],
        ["Inventory", "物品欄"],
        ["Car Door", "車門"],
        ["Car Engine Start", "啟動車輛引擎"],
        ["Crosshair", "準星"],
        ["Click to look around", "點擊環顧四周"],
        ["fuel station", "加油站"],
        ["to sell", "出售"],
        ["before you go", "出發前"],
        ["Map", "地圖"],
        ["Mission", "任務"],
        ["Menu", "選單"],
        ["Merchant", "商人"]
      ]
    },
    {
      title: "提示與任務",
      items: [
        ["{0} scrap", "{0} 廢料"],
        ["{0} scrap  -  bag is empty", "{0} 廢料 - 背包是空的"],
        ["{0} scrap  -  bag is worth {1} more", "{0} 廢料 - 背包還值 {1}"],
        ["{0} scrap each at a merchant", "商店每件收購 {0} 廢料"],
        ["{0} x{1}  -  sells for {2} scrap", "{0} ×{1} - 可賣 {2} 廢料"],
        ["{0} x{1}", "{0} ×{1}"],
        ["{0}  -  done, +{1} scrap", "{0} - 完成，+{1} 廢料"],
        ["{0}  -  need {1} more scrap", "{0} - 還差 {1} 廢料"],
        ["{0}  -  {1} of {2} complete", "{0} - 已完成 {1}/{2}"],
        ["{0}  -  {1} scrap", "{0} - {1} 廢料"],
        ["{0}  ({1}/{2})", "{0}（{1}/{2}）"],
        ["{0} back in the bag  -  {1} left in the house", "{0} 放回背包 - 屋內還剩 {1}"],
        ["{0} left in the house - all {1} of them are home", "{0} 屋內還剩 {1} 人，全部在家"],
        ["{0} left in the house - {1} of {2}", "{0} 屋內還剩 {1}/{2}"],
        ["{0} of {1} complete", "已完成 {0}/{1}"],
        ["Bag full  -  no room for", "背包已滿，無法再裝："],
        ["Bag full - {0} {1} left on the floor", "背包已滿，{0} {1} 掉在地上"],
        ["Camp cleared  -  they were guarding a stash", "營地已清剿 - 他們守著一批藏貨"],
        ["Fuel low - {0:0} m of range left", "燃料不足 - 剩 {0:0} 公尺航程"],
        ["Load the coal into the cart ({0})", "把煤裝上礦車（{0}）"],
        ["Get in and drive", "上車開走"],
        ["Go to Section...", "前往礦區…"],
        ["Go back down the shaft for another load.", "回礦井再裝一趟。"],
        ["Pick it, then press BUY.", "選取後按「購買」。"],
        ["bought. Press CLOSE and get on with the job.", "已購買。按「關閉」繼續工作。"],
        ["- done", "- 完成"],
        ["- sold out", "- 已售罄"],
        ["- the merchant will not take this", "- 商人不收這個"],
        ["need the {0} - it is ringed on the merchant's shelf at {1} scrap", "需要 {0} - 商人貨架上標價 {1} 廢料"],
        ["You were knocked out  -  you woke up back at the yard", "你被擊倒了 - 在院子裡醒來"],
        ["no rifle yet - buy one at the store", "還沒有步槍 - 到商店買一把"],
        ["Empty - buy ammunition at the store", "子彈用盡 - 到商店買彈藥"],
        ["Empty - press [R] to reload", "子彈用盡 - 按 [R] 裝彈"],
        ["A box of ammunition. One box reloads the magazine.", "一盒彈藥。一盒可補滿彈匣。"],
        ["Scrap for a full tank.", "廢料換滿油箱。"],
        ["This job wants {0} more scrap, and there is nothing in your bag worth selling.", "這份工作還差 {0} 廢料，但背包裡沒有可賣的東西。"],
        ["This job wants {0} more scrap.  The {1} in …", "這份工作還差 {0} 廢料。{1}…"],
        ["Bag starting kit: {0} x{1}", "背包初始配備：{0} ×{1}"],
        ["[Camp] '{0}' awake with {1} raider(s)", "[營地]「{0}」有 {1} 名掠奪者"],
        ["[Stuck] rescue {0}: put the player back at {1}", "[卡住] 救援 {0}：把玩家送回 {1}"],
        ["This panel must be closed first.", "必須先關閉這個面板。"],
        ["You cannot climb in through a shut door.", "門關著，爬不進去。"],
        ["Distance  {0:0} m", "距離 {0:0} 公尺"]
      ]
    },
    {
      title: "道具與資源",
      items: [
        ["Scrap", "廢料"],
        ["Coal", "煤"],
        ["Ore", "礦石"],
        ["Rock", "岩石"],
        ["Bag", "背包"],
        ["Cart", "礦車"],
        ["Van / Truck", "廂型車"],
        ["Fuel", "燃料"],
        ["Ammunition", "彈藥"],
        ["Rifle", "步槍"],
        ["Pickaxe / Axe", "十字鎬／斧頭"],
        ["Fist", "拳頭"],
        ["Stash", "藏貨"],
        ["Raider", "掠奪者"],
        ["Shaft", "礦井"],
        ["Camp", "營地"]
      ]
    }
  ];

  var layer = null;
  var legend = null;
  var zhBtn = null;
  var legendBtn = null;
  var active = false;
  var legendOpen = false;

  // ---- 版面：與強制橫版腳本同一套邏輯框架 -------------------------------
  function frame() {
    var vw = Math.max(1, window.innerWidth);
    var vh = Math.max(1, window.innerHeight);
    var rotated = vh > vw * 1.02;
    return {
      vw: vw,
      rotated: rotated,
      lw: rotated ? vh : vw,
      lh: rotated ? vw : vh
    };
  }

  function layout() {
    if (!layer) return;
    var f = frame();
    layer.style.width = f.lw + "px";
    layer.style.height = f.lh + "px";
    layer.style.transform = f.rotated
      ? "translate(" + f.vw + "px, 0) rotate(90deg)"
      : "";
    layer.style.setProperty("--s", Math.min(f.lw / 1280, f.lh / 720) + "px");
  }

  function buildLayer() {
    layer = document.createElement("div");
    layer.id = "zh-layer";
    layer.setAttribute("aria-hidden", "true");

    ZONES.forEach(function (z) {
      var el = document.createElement("div");
      el.className = "zh-zone zh-" + z.id;
      el.textContent = z.label;
      el.style.left = (z.x / 1280 * 100) + "%";
      el.style.top = (z.y / 720 * 100) + "%";
      if (z.align === "center") el.style.transform = "translateX(-50%)";
      else if (z.align === "right") el.style.transform = "translateX(-100%)";
      layer.appendChild(el);
    });

    legend = document.createElement("div");
    legend.id = "zh-legend";
    var head = document.createElement("div");
    head.className = "zh-legend-head";
    head.textContent = "詞彙對照（英文原文仍在遊戲畫面上）";
    var close = document.createElement("button");
    close.type = "button";
    close.className = "zh-legend-close";
    close.textContent = "關閉";
    close.addEventListener("click", function () { setLegend(false); });
    head.appendChild(close);
    legend.appendChild(head);

    GROUPS.forEach(function (g) {
      var h = document.createElement("div");
      h.className = "zh-legend-group";
      h.textContent = g.title;
      legend.appendChild(h);
      g.items.forEach(function (pair) {
        var row = document.createElement("div");
        row.className = "zh-legend-row";
        var en = document.createElement("span");
        en.className = "zh-en";
        en.textContent = pair[0];
        var zh = document.createElement("span");
        zh.className = "zh-zh";
        zh.textContent = pair[1];
        row.appendChild(en);
        row.appendChild(zh);
        legend.appendChild(row);
      });
    });

    layer.appendChild(legend);
    document.body.appendChild(layer);
    layout();
  }

  function render() {
    if (zhBtn) {
      zhBtn.textContent = active ? "中文覆蓋：開" : "中文覆蓋：關";
      zhBtn.classList.toggle("on", active);
    }
    if (layer) layer.classList.toggle("on", active);
    if (legendBtn) legendBtn.classList.toggle("on", legendOpen);
  }

  function setActive(on) {
    active = on;
    try { localStorage.setItem(STORAGE_KEY, on ? "1" : "0"); } catch (e) {}
    render();
  }

  function setLegend(on) {
    legendOpen = on;
    if (legend) legend.classList.toggle("open", on);
    render();
  }

  function init() {
    buildLayer();

    zhBtn = document.getElementById("zh-toggle");
    legendBtn = document.getElementById("zh-legend");

    if (zhBtn) {
      zhBtn.addEventListener("click", function () { setActive(!active); });
    }
    if (legendBtn) {
      legendBtn.addEventListener("click", function () { setLegend(!legendOpen); });
    }

    var saved = "0";
    try { saved = localStorage.getItem(STORAGE_KEY) || "0"; } catch (e) {}
    active = saved === "1";

    window.addEventListener("resize", layout);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", layout);
    window.addEventListener("orientationchange", function () {
      layout();
      requestAnimationFrame(layout);
      setTimeout(layout, 300);
    });

    render();
  }

  window.DarkMineZh = {
    setActive: function (on) { setActive(!!on); },
    isActive: function () { return active; },
    setLegend: setLegend,
    isLegendOpen: function () { return legendOpen; }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
