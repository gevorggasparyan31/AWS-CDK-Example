import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

exports.handler = async (event: any) => {
	const id = event.pathParameters.id;
	const item = JSON.parse(event.body);

	const params = {
		TableName: tableName,
		Key: { id },
		UpdateExpression: 'set #name = :name, #value = :value',
		ExpressionAttributeNames: {
			'#name': 'name',
			'#value': 'value',
		},
		ExpressionAttributeValues: {
			':name': item.name,
			':value': item.value,
		},
		ReturnValues: 'ALL_NEW',
	};

	const result = await dynamoDb.update(params).promise();

	return {
		statusCode: 200,
		body: JSON.stringify(result.Attributes),
	};
};
