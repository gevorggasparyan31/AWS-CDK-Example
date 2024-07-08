import { DynamoDB } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

exports.handler = async (event: any) => {
	const item = JSON.parse(event.body);
	item.id = uuidv4();

	const params = {
		TableName: tableName,
		Item: item,
	};

	await dynamoDb.put(params).promise();

	return {
		statusCode: 201,
		body: JSON.stringify(item),
	};
};
