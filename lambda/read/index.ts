import { DynamoDB } from 'aws-sdk';

const dynamoDb = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

exports.handler = async (event: any) => {
	if (event.pathParameters && event.pathParameters.id) {
		const params = {
			TableName: tableName,
			Key: {
				id: event.pathParameters.id,
			},
		};

		const result = await dynamoDb.get(params).promise();

		return {
			statusCode: 200,
			body: JSON.stringify(result.Item),
		};
	} else {
		const params = {
			TableName: tableName,
		};

		const result = await dynamoDb.scan(params).promise();

		return {
			statusCode: 200,
			body: JSON.stringify(result.Items),
		};
	}
};
