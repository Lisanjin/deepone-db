const MasterAbilityEffectData_LENGTH = 6;

const Effect_KEY_MAP = {
  a: 'abilityId', b: 'level', c: 'index', d: 'text', e: 'shortText', f: 'actionType',
  g: 'effectType', h: 'effectValue', i: 'effectLimit', j: 'effectConditionType',
  k: 'effectConditionValue', l: 'occurrenceRate', m: 'successRate', n: 'targetType',
  o: 'targetValue', p: 'endType', q: 'endValue', releaseDate: 'releaseDate',
};

const TARGET_TYPE_TEXT_CONVERT = {
  1: "敵{1}体", 2: "敵全体", 3: "味方{1}体", 4: "味方全体", 5: "自身",
  10: "死亡した味方{1}体", 11: "死亡した味方全体", 12: "味方{1}属性全体",
  14: "自身以外の味方全体", 20: "死亡した敵{1}体", 21: "死亡した敵全体",
  22: "敵{1}属性全体", 32: "{1}属性", 41: "HPが高い敵単体", 42: "HPが低い敵単体",
  43: "DEFが高い敵単体", 44: "DEFが低い敵単体", 51: "HPが高い敵単体",
  52: "HPが低い敵単体", 53: "DEFが高い敵単体", 54: "DEFが低い敵単体"
};

const ATTRIBUTE_TEXT_CONVERT = {
  1: "火", 2: "水", 3: "風", 4: "雷", 5: "光", 6: "闇"
};

async function loadJson(url) {
  const res = await fetch(url);
  return await res.json();
}

let abilityData = null;
// 新增缓存变量
let abilityMainCache = null;
let abilityEffectList = null;

async function get_AbilityGroup(abilityGroupId) {
  if (!abilityData) {
    abilityData = await loadJson('masterdata/character_MasterAbilityData.json');
  }
  return abilityData.CharacterAbilityGroup.filter(group => group.abilityGroupId === abilityGroupId);
}

// 加载 CharacterAbilityMain 映射
async function get_AbilityMainMap() {
    if (abilityMainCache) return abilityMainCache;
    if (!abilityData) {
        abilityData = await loadJson('masterdata/character_MasterAbilityData.json');
    }
    const map = new Map();
    for (const main of abilityData.CharacterAbilityMain) {
        map.set(main.abilityId, main);
    }
    abilityMainCache = map;
    return map;
}

async function get_AbilityEffect_list() {
  if (abilityEffectList) return abilityEffectList;

  const allEffects = [];
  for (let i = 1; i <= MasterAbilityEffectData_LENGTH; i++) {
    const suffix = i === 1 ? "" : i;
    const data = await loadJson(`masterdata/character_MasterAbilityEffectData${suffix}.json`);
    const key = `CharacterAbilityEffect${suffix}`;
    const effects = data[key].map(effect =>
      Object.fromEntries(Object.entries(effect).map(([k, v]) => [Effect_KEY_MAP[k], v]))
    );
    allEffects.push(...effects);
  }
  abilityEffectList = allEffects;
  return allEffects;
}

function get_AbilityEffect_byId(effects, abilityId) {
  return effects.filter(effect => effect.abilityId === abilityId);
}

function get_AbilityEffect_byIndex(effects, index) {
  return effects.filter(effect => effect.index === index);
}

function get_AbilityEffect_byLevel(effects, level) {
  return effects.filter(effect => effect.level === level);
}

function get_max_level(effects) {
  return Math.max(...effects.map(effect => effect.level));
}

function get_max_index(effects) {
  return Math.max(...effects.map(effect => effect.index));
}

async function get_effect(abilityId, level = null) {
  const allEffects = await get_AbilityEffect_list();
  const effectGroup = get_AbilityEffect_byId(allEffects, abilityId);
  const maxIndex = get_max_index(effectGroup);

  const result = [];
  for (let i = 1; i <= maxIndex; i++) {
    let effects = get_AbilityEffect_byIndex(effectGroup, i);
    const lvl = level !== null ? level : get_max_level(effects);
    effects = get_AbilityEffect_byLevel(effects, lvl);
    result.push(...effects);
  }
  return result;
}

function get_text(effects) {
  return effects.map(effect => {
    let text = effect.text;
    text = text.replace("{0}", Math.abs(effect.effectValue));
    
    let targetTypeText = TARGET_TYPE_TEXT_CONVERT[effect.targetType];
    let targetValueProcessed = effect.targetValue;
    const attributeTypes = [12, 22, 32];
    if (attributeTypes.includes(effect.targetType)) {
      targetValueProcessed = ATTRIBUTE_TEXT_CONVERT[effect.targetValue] || effect.targetValue;
    }
    
    text = text.replace("{1-}", targetTypeText);
    text = text.replace("{1}", targetValueProcessed);
    text = text.replace("{2}", effect.endValue);
    return text;
  }).join('\n');
}

// 递归获取能力文本（包含 addAbilityId 扩展）
async function get_ability_text_recursive(abilityId, visited = new Set()) {
    if (visited.has(abilityId)) return '';
    visited.add(abilityId);

    const effects = await get_effect(abilityId);
    let text = get_text(effects);

    const mainMap = await get_AbilityMainMap();
    const mainData = mainMap.get(abilityId);
    if (mainData && mainData.addAbilityId && mainData.addAbilityId !== 0) {
        const addText = await get_ability_text_recursive(mainData.addAbilityId, visited);
        if (addText) {
          text = text ? `${text}。\n${addText}` : addText;
        }
    }
    return text;
}

// 修改后的 get_effect_texts
async function get_effect_texts(groupId) {
    const abilityList = await get_AbilityGroup(groupId);
    const effectTexts = [];

    for (const ability of abilityList) {
        const text = await get_ability_text_recursive(ability.abilityId);
        effectTexts.push(text);
    }

    return effectTexts;
}

// Optional: 手动清除缓存（开发调试用）
function clearAbilityCache() {
  abilityData = null;
  abilityEffectList = null;
  abilityMainCache = null;   // 新增
}
