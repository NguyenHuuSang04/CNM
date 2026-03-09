const { docClient } = require('../config/dynamodb');
const {
    ScanCommand,
    GetCommand,
    PutCommand,
    UpdateCommand,
    DeleteCommand,
} = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'Products';

class ProductModel {
    /** Return all products from the table. */
    static async getAll() {
        const result = await docClient.send(new ScanCommand({ TableName: TABLE_NAME }));
        return result.Items || [];
    }

    /** Return a single product by its string ID, or null if not found. */
    static async getById(id) {
        const result = await docClient.send(
            new GetCommand({ TableName: TABLE_NAME, Key: { id } })
        );
        return result.Item || null;
    }

    /**
     * Levenshtein edit distance between two strings.
     */
    static levenshtein(a, b) {
        const m = a.length,
            n = b.length;
        const dp = Array.from({ length: m + 1 }, (_, i) => [i]);
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        for (let i = 1; i <= m; i++)
            for (let j = 1; j <= n; j++)
                dp[i][j] = a[i - 1] === b[j - 1] ?
                dp[i - 1][j - 1] :
                1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        return dp[m][n];
    }

    /**
     * Fuzzy case-insensitive search by name.
     * Matches if: (1) product name contains the keyword as substring, OR
     * (2) every keyword word either appears in the name or is within
     *     edit-distance floor(wordLen/3) of some word in the product name.
     */
    static async searchByName(keyword) {
        const all = await this.getAll();
        const kw = keyword.toLowerCase().trim();
        if (!kw) return all;
        const kwWords = kw.split(/\s+/);
        return all.filter((p) => {
            if (!p.name) return false;
            const name = p.name.toLowerCase();
            // 1. Direct substring match
            if (name.includes(kw)) return true;
            // 2. Fuzzy: every keyword word must loosely match something in the name
            const nameWords = name.split(/\s+/);
            return kwWords.every((kWord) => {
                if (name.includes(kWord)) return true;
                const threshold = Math.floor(kWord.length / 3);
                if (threshold === 0) return false;
                return nameWords.some(
                    (nWord) => this.levenshtein(kWord, nWord) <= threshold
                );
            });
        });
    }

    /**
     * Create a new product.
     * Throws ConditionalCheckFailedException if the id already exists.
     */
    static async create({ id, name, image, price, quantity }) {
        await docClient.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: {
                    id,
                    name,
                    image: image || '',
                    price: parseFloat(price),
                    quantity: parseInt(quantity, 10),
                },
                ConditionExpression: 'attribute_not_exists(id)',
            })
        );
        return { id, name, image, price: parseFloat(price), quantity: parseInt(quantity, 10) };
    }

    /**
     * Update an existing product's mutable fields.
     * Throws ConditionalCheckFailedException if the product does not exist.
     */
    static async update(id, { name, price, quantity, image }) {
        const expressions = [];
        const attrNames = {};
        const attrValues = {};

        if (name !== undefined) {
            expressions.push('#nm = :name');
            attrNames['#nm'] = 'name'; // 'name' is a DynamoDB reserved word
            attrValues[':name'] = name;
        }
        if (price !== undefined) {
            expressions.push('price = :price');
            attrValues[':price'] = parseFloat(price);
        }
        if (quantity !== undefined) {
            expressions.push('quantity = :quantity');
            attrValues[':quantity'] = parseInt(quantity, 10);
        }
        if (image !== undefined) {
            expressions.push('image = :image');
            attrValues[':image'] = image;
        }

        const params = {
            TableName: TABLE_NAME,
            Key: { id },
            UpdateExpression: `SET ${expressions.join(', ')}`,
            ExpressionAttributeValues: attrValues,
            ConditionExpression: 'attribute_exists(id)',
        };
        if (Object.keys(attrNames).length > 0) {
            params.ExpressionAttributeNames = attrNames;
        }

        await docClient.send(new UpdateCommand(params));
        return this.getById(id);
    }

    /**
     * Delete a product by ID.
     * Throws ConditionalCheckFailedException if the product does not exist.
     */
    static async delete(id) {
        await docClient.send(
            new DeleteCommand({
                TableName: TABLE_NAME,
                Key: { id },
                ConditionExpression: 'attribute_exists(id)',
            })
        );
    }
}

module.exports = ProductModel;