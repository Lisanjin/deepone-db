import json

MasterTextData_LENGTH = 5

def get_Text_list():
    text_list = []
    for i in range(1,MasterTextData_LENGTH+1):
        if i == 1:
            i = ""
        with open(f'./masterdata/character_MasterTextData{i}.json', 'r',encoding="utf-8") as file:
            data = json.load(file)[f"CharacterText{i}"]
            text_list += data
    return text_list

text_list = get_Text_list()


def get_Text_byId(characterId):
    return [text for text in text_list if text["characterId"] == characterId]
