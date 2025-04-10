import json
import msgpack
import requests
from icecream import ic

class Do_data_utils():
    def __init__(self):
        self.bass_url = "https://tonofura-web-r.deepone-online.com/deep-one/api/"
        
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/244.178.44.111 Safari/537.36",
        }
        self.proxy = {
            "http": "http://127.0.0.1:7890",
            "https": "http://127.0.0.1:7890",
        }
        self.session = requests.Session()
        self.session.proxies = self.proxy

        self.masterdata_group = ["characterLink","character","user","quest","shop","present","item","equipment","memorial","mission","linearMission","room","pvp","tower","story"]
        self.md5_data = {}
        self.masterdata = {}
    
    def get_md5_data(self):
        url = "https://tonofura-web-r.deepone-online.com/deep-one/api/version/getMd5Data"
        response = self.session.get(url)
        if response.status_code == 200:
            self.md5_data = response.json()
            with open("md5_data.json", "w") as f:
                json.dump(self.md5_data, f, indent=4)
            return self.md5_data
        else:
            print(f"Failed to get md5 data. Status code: {response.status_code}")
            return None
    
    def get_masterdata(self,path):
        url = self.bass_url + path
        response = self.session.get(url)
        if response.status_code == 200:
            self.masterdata[path] = msgpack.unpackb(response.content)
            return self.masterdata[path]
        else:
            print(f"Failed to get masterdata. Status code: {response.status_code}")
            print(url)
            return None
    
    def save_masterdata(self,path):
        self.get_masterdata(path)
        if path in self.masterdata:
            save_path = path.replace("/", "_").replace("get", "")
            with open(f"masterdata/{save_path}.json", "w",encoding="utf-8") as f:
                json.dump(self.masterdata[path], f, ensure_ascii=False,indent=4)
        else:
            print(f"Masterdata {path} not found.")

utils = Do_data_utils()
# utils.save_masterdata("character/getMasterData")
# utils.save_masterdata("character/getMasterCharacterMainData")
# utils.save_masterdata("character/getMasterSkillData")
# utils.save_masterdata("character/getMasterSkillEffectData")
# utils.save_masterdata("character/getMasterSkillEffectData2")

# utils.save_masterdata("character/getMasterAbilityData")
# utils.save_masterdata("character/getMasterAbilityEffectData")
# utils.save_masterdata("character/getMasterAbilityEffectData2")
# utils.save_masterdata("character/getMasterAbilityEffectData3")
# utils.save_masterdata("character/getMasterAbilityEffectData4")
# utils.save_masterdata("character/getMasterAbilityEffectData5")
# utils.save_masterdata("character/getMasterAbilityEffectData6")

