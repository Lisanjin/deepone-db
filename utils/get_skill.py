import json
from icecream import ic

ability_group_id = 100103

with open('./masterdata/character_MasterAbilityData.json', 'r',encoding="utf-8") as file:
    ability_data = json.load(file)

def get_AbilityGroup(ability_group_id):
    group_list = []
    for group in ability_data["CharacterAbilityGroup"]:
        if group["abilityGroupId"] == ability_group_id:
            group["ability_name"] = get_AbilityName(group["abilityId"])
            group_list.append(group)

    return group_list

def get_AbilityName(abilityId):
    for AbilityMain in ability_data["CharacterAbilityMain"]:
        if AbilityMain["abilityId"] == abilityId:
            return AbilityMain["name"]
    return None

def get_AbilityEffect(abilityId):
    # try:
        
        ability_effect = []
        for i in range(1,7):
            # AbilityEffectData
            if i == 1:
                i = ""
            with open(f'./masterdata/character_MasterAbilityEffectData{i}.json', 'r',encoding="utf-8") as file:
                ability_effect_data = json.load(file)[f"CharacterAbilityEffect{i}"]
                ability_effect += ability_effect_data

        for effect in ability_effect:
            if effect["a"] == abilityId:
                return effect
    # except Exception as e:
    #     print(f"Error: {e}")
    #     print(f"{i}")

# ic(get_AbilityGroup(ability_group_id))

ic(get_AbilityEffect(10010301))