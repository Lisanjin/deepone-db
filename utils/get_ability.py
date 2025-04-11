import json

MasterAbilityEffectData_LENGTH = 6
Effect_KEY_MAP = {
    'a': 'abilityId',
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
ATTRIBUTE_TEXT_CONVERT= {
    1: "火",
    2: "水",
    3: "風",
    4: "雷",
    5: "光",
    6: "闇"
}

with open('./masterdata/character_MasterAbilityData.json', 'r',encoding="utf-8") as file:
    ability_data = json.load(file)

def get_AbilityGroup(ability_group_id):
    group_list = []
    for group in ability_data["CharacterAbilityGroup"]:
        if group["abilityGroupId"] == ability_group_id:
            group_list.append(group)
    return group_list

def get_AbilityEffect_list():
    ability_effect = []
    for i in range(1,MasterAbilityEffectData_LENGTH+1):
        if i == 1:
            i = ""
        with open(f'./masterdata/character_MasterAbilityEffectData{i}.json', 'r',encoding="utf-8") as file:
            ability_effect_data = json.load(file)[f"CharacterAbilityEffect{i}"]
            ability_effect += ability_effect_data
    ability_effect = [{Effect_KEY_MAP[k]: v for k, v in effect.items()} for effect in ability_effect]
    return ability_effect

def get_AbilityEffect_byId(ability_effect,abilityId):        
    return [effect for effect in ability_effect if effect["abilityId"] == abilityId]

def get_AbilityEffect_byIndex(effect_list,index):
    return [effect for effect in effect_list if effect["index"] == index]

def get_AbilityEffect_byLevel(effect_list,level):
    return [effect for effect in effect_list if effect["level"] == level]

def get_max_level(effect_list):
    max_level = 0
    for effect in effect_list:
        if effect["level"] > max_level:
            max_level = effect["level"]
    return max_level

def get_max_index(effect_list):
    max_index = 0
    for effect in effect_list:
        if effect["index"] > max_index:
            max_index = effect["index"]
    return max_index

def get_effect(abilityId,level : int = None):
    ability_effect = get_AbilityEffect_list()
    ability_effect_id_group = get_AbilityEffect_byId(ability_effect,abilityId)

    max_index = get_max_index(ability_effect_id_group)

    return_list = []
    for i in range(1,max_index+1):
        ability_effect = get_AbilityEffect_byIndex(ability_effect_id_group,i)
        if level == None:
            level = get_max_level(ability_effect)
        ability_effect = get_AbilityEffect_byLevel(ability_effect,level)
        return_list += ability_effect
    return return_list

def get_text(effects):
    return_effect_text = ""
    for effect in effects:
        effect_text = effect["text"]
        effect_text = effect_text.replace("{0}", str(effect["effectValue"]))
        effect_text = effect_text.replace("{1-}", TARGET_TYPE_TEXT_CONVERT[effect["targetType"]])
        effect_text = effect_text.replace("{1}", str(effect["targetValue"]))
        effect_text = effect_text.replace("{2}", effect["endValue"])
        return_effect_text += effect_text + "\n"
    return return_effect_text.strip()

def get_effect_texts(group_id):
    ability_list  = get_AbilityGroup(group_id)
    effect_texts = []
    for ability in ability_list:
        effects = get_effect(ability["abilityId"])
        effect_texts.append(get_text(effects))
    return effect_texts

print(get_effect_texts(100104))