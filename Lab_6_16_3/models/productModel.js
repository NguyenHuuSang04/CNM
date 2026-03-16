const {
  ScanCommand,
  GetCommand,
  PutCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { docClient, tableName } = require("../config/dynamodb");

function normalizeText(text = "") {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function levenshteinDistance(a, b) {
  const s1 = normalizeText(a);
  const s2 = normalizeText(b);

  if (!s1.length) return s2.length;
  if (!s2.length) return s1.length;

  const matrix = Array.from({ length: s2.length + 1 }, () =>
    Array(s1.length + 1).fill(0)
  );

  for (let i = 0; i <= s2.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= s1.length; j += 1) matrix[0][j] = j;

  for (let i = 1; i <= s2.length; i += 1) {
    for (let j = 1; j <= s1.length; j += 1) {
      const cost = s2[i - 1] === s1[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[s2.length][s1.length];
}

function isApproximateNameMatch(name, query) {
  const normalizedName = normalizeText(name);
  const normalizedQuery = normalizeText(query);

  if (!normalizedQuery) {
    return true;
  }

  if (
    normalizedName.includes(normalizedQuery) ||
    normalizedQuery.includes(normalizedName)
  ) {
    return true;
  }

  const nameTokens = normalizedName.split(/\s+/).filter(Boolean);
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  if (
    queryTokens.every((queryToken) =>
      nameTokens.some((nameToken) => nameToken.includes(queryToken))
    )
  ) {
    return true;
  }

  const distance = levenshteinDistance(normalizedName, normalizedQuery);
  const threshold = Math.max(1, Math.ceil(normalizedQuery.length * 0.35));
  return distance <= threshold;
}

async function getAll(searchQuery = "") {
  const result = await docClient.send(
    new ScanCommand({
      TableName: tableName,
    })
  );

  const items = result.Items || [];
  const filteredItems = searchQuery
    ? items.filter((item) => isApproximateNameMatch(item.name, searchQuery))
    : items;

  return filteredItems.sort((a, b) => a.name.localeCompare(b.name));
}

async function getById(id) {
  const result = await docClient.send(
    new GetCommand({
      TableName: tableName,
      Key: { id },
    })
  );

  return result.Item;
}

async function create(product) {
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: product,
      ConditionExpression: "attribute_not_exists(id)",
    })
  );

  return product;
}

async function update(id, product) {
  const payload = { ...product, id };

  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: payload,
    })
  );

  return payload;
}

async function remove(id) {
  const result = await docClient.send(
    new DeleteCommand({
      TableName: tableName,
      Key: { id },
      ReturnValues: "ALL_OLD",
    })
  );

  return result.Attributes;
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
