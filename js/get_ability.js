const MasterAbilityEffectData_LENGTH = 6;

const Effect_KEY_MAP = {
  a: 'abilityId',
  b: 'level',
  c: 'index',
  d: 'text',
  e: 'shortText',
  f: 'actionType',
  g: 'effectType',
  h: 'effectValue',
  i: 'effectLimit',
  j: 'effectConditionType',
  k: 'effectConditionValue',
  l: 'occurrenceRate',
  m: 'successRate',
  n: 'targetType',
  o: 'targetValue',
  p: 'endType',
  q: 'endValue',
  releaseDate: 'releaseDate',
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

let abilityData;

async function get_AbilityGroup(abilityGroupId) {
  if (!abilityData) {
    abilityData = await loadJson('masterdata/character_MasterAbilityData.json');
  }
  return abilityData.CharacterAbilityGroup.filter(group => group.abilityGroupId === abilityGroupId);
}

async function get_AbilityEffect_list() {
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
    text = text.replace("{1-}", TARGET_TYPE_TEXT_CONVERT[effect.targetType]);
    text = text.replace("{1}", effect.targetValue);
    text = text.replace("{2}", effect.endValue);
    return text;
  }).join('\n');
}

async function get_effect_texts(groupId) {
  const abilityList = await get_AbilityGroup(groupId);
  const effectTexts = [];

  for (const ability of abilityList) {
    const effects = await get_effect(ability.abilityId);
    const text = get_text(effects);
    effectTexts.push(text);
  }

  return effectTexts;
}

// console.log();
// Example usage
// get_effect_texts(100104).then(console.log);
