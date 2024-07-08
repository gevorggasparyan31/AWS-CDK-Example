import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

exports.handler = async (event: any) => {
	const id = event.pathParameters.id;

	const params = {
		TableName: tableName,
		Key: { id },
	};

	await dynamoDb.delete(params).promise();

	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'Item deleted' }),
	};
};
