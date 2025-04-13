const MasterEquipmentEffectData_LENGTH = 2;

const TARGET_TYPE_TEXT_CONVERT = {
  1: "敵{1}体",
  2: "敵全体",
  3: "味方{1}体",
  4: "味方全体",
  5: "自身",
  10: "死亡した味方{1}体",
  11: "死亡した味方全体",
  12: "味方{1}属性全体",
  14: "自身以外の味方全体",
  20: "死亡した敵{1}体",
  21: "死亡した敵全体",
  22: "敵{1}属性全体",
  32: "{1}属性",
  41: "HPが高い敵単体",
  42: "HPが低い敵単体",
  43: "DEFが高い敵単体",
  44: "DEFが低い敵単体",
  51: "HPが高い敵単体",
  52: "HPが低い敵単体",
  53: "DEFが高い敵単体",
  54: "DEFが低い敵単体"
};

const cache = {
  equipmentMain: null,
  equipmentEffects: []
};

async function loadJson(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

async function getEquipmentList() {
  if (!cache.equipmentMain) {
    const data = await loadJson('masterdata/equipment_MasterData.json');
    cache.equipmentMain = data.EquipmentMain;
  }
  return cache.equipmentMain;
}

async function getEquipmentById(id) {
  const list = await getEquipmentList();
  return list.filter(equipment => equipment.equipmentId === id);
}

async function getEquipmentEffectList() {
  if (cache.equipmentEffects.length > 0) {
    return cache.equipmentEffects;
  }

  for (let i = 1; i <= MasterEquipmentEffectData_LENGTH; i++) {
    const suffix = i === 1 ? "" : i;
    const path = `./masterdata/equipment_MasterEquipmentEffectData${suffix}.json`;
    const data = await loadJson(path);
    const key = `EquipmentEffect${suffix}`;
    cache.equipmentEffects.push(...data[key]);
  }

  return cache.equipmentEffects;
}

function getEquipmentEffectById(effects, id) {
  return effects.filter(effect => effect.equipmentId === id);
}

function getEquipmentEffectByIndex(effects, index) {
  return effects.filter(effect => effect.index === index);
}

function getEquipmentEffectByRarity(effects, rarity) {
  return effects.filter(effect => effect.rarity === rarity);
}

function getMaxIndex(effects) {
  return effects.reduce((max, effect) => Math.max(max, effect.index), 0);
}

function getMaxRarity(effects) {
  return effects.reduce((max, effect) => Math.max(max, effect.rarity), 0);
}

function getEffectText(effect) {
  let text = effect.text || "";
  text = text.replace("{0}", Math.abs(effect.effectValue));
  text = text.replace("{1-}", TARGET_TYPE_TEXT_CONVERT[effect.targetType] || "");
  text = text.replace("{1}", effect.targetValue);
  text = text.replace("{2}", effect.endValue);
  return text.trim();
}

async function getEquipmentEffectTexts(equipmentId) {
  const allEffects = await getEquipmentEffectList();
  const idGroup = getEquipmentEffectById(allEffects, equipmentId);

  const maxIndex = getMaxIndex(idGroup);
  const maxRarity = getMaxRarity(idGroup);

  const texts = [];
  for (let i = 1; i <= maxIndex; i++) {
    let effects = getEquipmentEffectByIndex(idGroup, i);
    effects = getEquipmentEffectByRarity(effects, maxRarity);

    for (const e of effects) {
      texts.push(getEffectText(e));
    }
  }

  // 排序合并：奇偶交错
  const combinedText = texts.filter((_, i) => i % 2 === 0).join("") +
                       texts.filter((_, i) => i % 2 === 1).join("");
  return combinedText;
}