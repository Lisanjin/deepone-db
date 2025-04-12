const MasterSkillEffectData_LENGTH = 2;

const Skill_Effect_KEY_MAP = {
  a: 'skillId', b: 'level', c: 'index', d: 'text', e: 'shortText', f: 'actionType',
  g: 'effectType', h: 'effectValue', i: 'effectLimit', j: 'effectConditionType',
  k: 'effectConditionValue', l: 'occurrenceRate', m: 'successRate', n: 'targetType',
  o: 'targetValue', p: 'endType', q: 'endValue', releaseDate: 'releaseDate',
};

const Skill_TARGET_TYPE_TEXT_CONVERT = {
  1: "敵{1}体", 2: "敵全体", 3: "味方{1}体", 4: "味方全体", 5: "自身",
  10: "死亡した味方{1}体", 11: "死亡した味方全体", 12: "味方{1}属性全体",
  14: "自身以外の味方全体", 20: "死亡した敵{1}体", 21: "死亡した敵全体",
  22: "敵{1}属性全体", 32: "{1}属性", 41: "HPが高い敵単体", 42: "HPが低い敵単体",
  43: "DEFが高い敵単体", 44: "DEFが低い敵単体", 51: "HPが高い敵単体",
  52: "HPが低い敵単体", 53: "DEFが高い敵単体", 54: "DEFが低い敵単体"
};

async function loadJson(url) {
  const res = await fetch(url);
  return await res.json();
}

let skillData = null;
let skillEffectList = null;  // 缓存 SkillEffect 数据

async function get_SkillData() {
  if (!skillData) {
    skillData = await loadJson('masterdata/character_MasterSkillData.json');
  }
  return skillData;
}

async function get_SkillEffect_list() {
  if (skillEffectList) return skillEffectList;

  const allEffects = [];
  for (let i = 1; i <= MasterSkillEffectData_LENGTH; i++) {
    const suffix = i === 1 ? "" : i;
    const data = await loadJson(`masterdata/character_MasterSkillEffectData${suffix}.json`);
    const key = `CharacterSkillEffect${suffix}`;
    const effects = data[key].map(effect =>
      Object.fromEntries(Object.entries(effect).map(([k, v]) => [Skill_Effect_KEY_MAP[k], v]))
    );
    allEffects.push(...effects);
  }
  skillEffectList = allEffects;
  return allEffects;
}

function get_SkillEffect_byId(effects, skillId) {
  return effects.filter(effect => effect.skillId === skillId);
}

function get_SkillEffect_byIndex(effects, index) {
  return effects.filter(effect => effect.index === index);
}

function get_SkillEffect_byLevel(effects, level) {
  return effects.filter(effect => effect.level === level);
}

function get_skill_max_level(effects) {
  return Math.max(...effects.map(effect => effect.level));
}

function get_skill_max_index(effects) {
  return Math.max(...effects.map(effect => effect.index));
}

async function get_skill_effect(skillId, level = null) {
  const allEffects = await get_SkillEffect_list();
  const group = get_SkillEffect_byId(allEffects, skillId);
  const maxIndex = get_skill_max_index(group);

  const result = [];
  for (let i = 1; i <= maxIndex; i++) {
    let effects = get_SkillEffect_byIndex(group, i);
    const lvl = level !== null ? level : get_skill_max_level(effects);
    effects = get_SkillEffect_byLevel(effects, lvl);
    result.push(...effects);
  }
  return result;
}

function get_skill_text(effects) {
  return effects.map(effect => {
    let text = effect.text;
    text = text.replace("{0}", Math.abs(effect.effectValue));
    text = text.replace("{1-}", Skill_TARGET_TYPE_TEXT_CONVERT[effect.targetType]);
    text = text.replace("{1}", effect.targetValue);
    text = text.replace("{2}", effect.endValue);
    return text;
  }).join("\n");
}

async function get_skill_effect_texts(skillId) {
  const effects = await get_skill_effect(skillId);
  return get_skill_text(effects);
}

async function get_SkillName(skillId) {
  const data = await get_SkillData();
  const skill = data.CharacterSkillMain.find(skill => skill.skillId === skillId);
  return skill ? skill.name : null;
}
