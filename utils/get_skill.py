import json

MasterSkillEffectData_LENGTH = 2
Effect_KEY_MAP = {
    'a': 'skillId',
    'b': 'level',
    'c': 'index',
    'd': 'text',
    'e': 'shortText',
    'f': 'actionType',
    'g': 'effectType',
    'h': 'effectValue',
    'i': 'effectLimit',
    'j': 'effectConditionType',
    'k': 'effectConditionValue',
    'l': 'occurrenceRate',
    'm': 'successRate',
    'n': 'targetType',
    'o': 'targetValue',
    'p': 'endType',
    'q': 'endValue',
    "releaseDate": "releaseDate"
}
TARGET_TYPE_TEXT_CONVERT= {
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
}

with open('./masterdata/character_MasterSkillData.json', 'r',encoding="utf-8") as file:
    skill_data = json.load(file)

def get_SkillEffect_list():
    skill_effect = []
    for i in range(1,MasterSkillEffectData_LENGTH+1):
        if i == 1:
            i = ""
        with open(f'./masterdata/character_MasterSkillEffectData{i}.json', 'r',encoding="utf-8") as file:
            skill_effect_data = json.load(file)[f"CharacterSkillEffect{i}"]
            skill_effect += skill_effect_data
    skill_effect = [{Effect_KEY_MAP[k]: v for k, v in effect.items()} for effect in skill_effect]
    return skill_effect

def get_SkillEffect_byId(effect_list,skillId):        
    return [effect for effect in effect_list if effect["skillId"] == skillId]

def get_SkillEffect_byIndex(effect_list,index):
    return [effect for effect in effect_list if effect["index"] == index]

def get_SkillEffect_byLevel(effect_list,level):
    return [effect for effect in effect_list if effect["level"] == level]

def get_skill_max_level(effect_list):
    max_level = 0
    for effect in effect_list:
        if effect["level"] > max_level:
            max_level = effect["level"]
    return max_level

def get_skill_max_index(effect_list):
    max_index = 0
    for effect in effect_list:
        if effect["index"] > max_index:
            max_index = effect["index"]
    return max_index

def get_skill_effect(skillId,level : int = None):
    skill_effect = get_SkillEffect_list()
    skill_effect_id_group = get_SkillEffect_byId(skill_effect,skillId)

    max_index = get_skill_max_index(skill_effect_id_group)

    return_list = []
    for i in range(1,max_index+1):
        skill_effect = get_SkillEffect_byIndex(skill_effect_id_group,i)
        if level == None:
            level = get_skill_max_level(skill_effect)
        skill_effect = get_SkillEffect_byLevel(skill_effect,level)
        return_list += skill_effect
    return return_list

def get_skill_text(effects):
    return_effect_text = ""
    for effect in effects:
        effect_text = effect["text"]
        effect_text = effect_text.replace("{0}", str(abs(effect["effectValue"])))
        effect_text = effect_text.replace("{1-}", TARGET_TYPE_TEXT_CONVERT[effect["targetType"]])
        effect_text = effect_text.replace("{1}", str(effect["targetValue"]))
        effect_text = effect_text.replace("{2}", effect["endValue"])
        return_effect_text += effect_text + "\n"
    return return_effect_text.strip()

def get_skill_effect_texts(skillId):
    effects = get_skill_effect(skillId)   
    effect_text = get_skill_text(effects)
    return effect_text

def get_SkillName(skillId):
    for skill in skill_data["CharacterSkillMain"]:
        if skill["skillId"] == skillId:
            return skill["name"]
    return None
