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
        
    def character_getMasterCharacterMainData(self):
        url = "https://tonofura-web-r.deepone-online.com/deep-one/api/character/getMasterCharacterMainData"
        response = self.session.get(url)
        if response.status_code == 200:
            self.character_MasterCharacterMainData = msgpack.unpackb(response.content)
            return self.character_MasterCharacterMainData
        else:
            print(f"Failed to get masterdata. Status code: {response.status_code}")
            print(url)
            return None
        
    def character_getMasterData(self):
        url = "https://tonofura-web-r.deepone-online.com/deep-one/api/character/getMasterData"
        response = self.session.get(url)
        if response.status_code == 200:
            self.character_MasterData = msgpack.unpackb(response.content)
            return self.character_MasterData
        else:
            print(f"Failed to get masterdata. Status code: {response.status_code}")
            print(url)
            return None
        
utils = Do_data_utils()
with open("masterdata/character_MasterData.json", "w",encoding="utf-8") as f:
    json.dump(utils.character_getMasterData(), f, ensure_ascii=False,indent=4)

with open("masterdata/character_MasterCharacterMainData.json", "w",encoding="utf-8") as f:
    json.dump(utils.character_getMasterCharacterMainData(), f, ensure_ascii=False,indent=4)

    