const MasterTextData_LENGTH = 5;

async function loadJson(url) {
  const res = await fetch(url);
  return await res.json();
}

async function get_Text_list() {
  const textList = [];

  for (let i = 1; i <= MasterTextData_LENGTH; i++) {
    const suffix = i === 1 ? "" : i;
    const data = await loadJson(`./masterdata/character_MasterTextData${suffix}.json`);
    const key = `CharacterText${suffix}`;
    textList.push(...data[key]);
  }

  return textList;
}

// 缓存文本数据
let textListCache = null;

async function get_Text_byId(characterId) {
  if (!textListCache) {
    textListCache = await get_Text_list();
  }
  return textListCache.filter(text => text.characterId === characterId);
}

// 示例：获取 ID 为 100101 的文本
// get_Text_byId(100101).then(console.log);
