import json

MasterEquipmentEffectData_LENGTH = 2
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

with open('masterdata/equipment_MasterData.json', 'r', encoding='utf-8') as f:
    MasterEquipmentEffectData = json.load(f)

def get_equipment_list():
    return MasterEquipmentEffectData["EquipmentMain"]
    
def get_equipment_by_id(id):
    return [equipment for equipment in MasterEquipmentEffectData["EquipmentMain"] if equipment["equipmentId"] == id]

# equipmentId resourceId name postName text attribute
# 装备id 图标id 名称 词条名称 描述 属性
# maxHp4 maxAtk4 maxDef4
# 最大生命值 最大攻击力 最大防御力
def get_equipment_effect_list():
    equipment_effect = []
    for i in range(1,MasterEquipmentEffectData_LENGTH+1):
        if i == 1:
            i = ""
        with open(f'./masterdata/equipment_MasterEquipmentEffectData{i}.json', 'r',encoding="utf-8") as file:
            equipment_effect_data = json.load(file)[f"EquipmentEffect{i}"]
            equipment_effect += equipment_effect_data
    return equipment_effect

def get_equipment_effect_byId(equipment_effect, equipmentId):        
    return [effect for effect in equipment_effect if effect["equipmentId"] == equipmentId]

def get_equipment_effect_byIndex(equipment_effect, index):
    return [effect for effect in equipment_effect if effect["index"] == index]

def get_equipment_effect_byRarity(equipment_effect, rarity):
    return [effect for effect in equipment_effect if effect["rarity"] == rarity]

def get_equipment_max_index(equipment_effect):
    max_index = 0
    for effect in equipment_effect:
        if effect["index"] > max_index:
            max_index = effect["index"]
    return max_index

def get_equipment_max_rarity(equipment_effect):
    max_rarity = 0
    for effect in equipment_effect:
        if effect["rarity"] > max_rarity:
            max_rarity = effect["rarity"]
    return max_rarity

def get_equipment_effect_text(effect):
    effect_text = effect["text"]
    effect_text = effect_text.replace("{0}", str(abs(effect["effectValue"])))
    effect_text = effect_text.replace("{1-}", TARGET_TYPE_TEXT_CONVERT[effect["targetType"]])
    effect_text = effect_text.replace("{1}", str(effect["targetValue"]))
    effect_text = effect_text.replace("{2}", effect["endValue"])
    
    return effect_text.strip()

def get_equipment_effect_texts(equipmentId):
    equipment_effect = get_equipment_effect_list()
    equipment_effect_idgroup = get_equipment_effect_byId(equipment_effect, equipmentId)

    max_index = get_equipment_max_index(equipment_effect_idgroup)
    max_rarity = get_equipment_max_rarity(equipment_effect_idgroup)

    effects_text = []
    for i in range(1,max_index+1):
        effects = get_equipment_effect_byIndex(equipment_effect_idgroup,i)
        effects = get_equipment_effect_byRarity(effects,max_rarity)
        
        for e in effects:
            effects_text.append(get_equipment_effect_text(e))
    
    return "".join(effects_text[::2]+effects_text[1::2])

print(get_equipment_by_id(109136))
print(get_equipment_effect_texts(109136))