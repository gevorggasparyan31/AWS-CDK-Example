import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

interface AppStackProps extends cdk.StackProps {
  stackConfig: {
    table_name: string;
    api_gateway_name: string;
  };
}

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const { table_name, api_gateway_name } = props.stackConfig;

    // DynamoDB table
    const table = new dynamodb.Table(this, table_name, {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    // Lambda function for Create operation
    const createFunction = new lambda.Function(this, 'CreateFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'create.handler',
      code: lambda.Code.fromAsset('lambda/create'),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Lambda function for Read operation
    const readFunction = new lambda.Function(this, 'ReadFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'read.handler',
      code: lambda.Code.fromAsset('lambda/read'),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Lambda function for Update operation
    const updateFunction = new lambda.Function(this, 'UpdateFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'update.handler',
      code: lambda.Code.fromAsset('lambda/update'),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Lambda function for Delete operation
    const deleteFunction = new lambda.Function(this, 'DeleteFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'delete.handler',
      code: lambda.Code.fromAsset('lambda/delete'),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Grant permissions to Lambda functions
    table.grantReadWriteData(createFunction);
    table.grantReadWriteData(readFunction);
    table.grantReadWriteData(updateFunction);
    table.grantReadWriteData(deleteFunction);

    // API Gateway
    const api = new apigateway.RestApi(this, api_gateway_name, {
      restApiName: 'Items Service',
      description: 'This service serves items.',
    });

    // Integrate Lambda functions with API Gateway
    const items = api.root.addResource('items');
    items.addMethod('POST', new apigateway.LambdaIntegration(createFunction));
    items.addMethod('GET', new apigateway.LambdaIntegration(readFunction));

    const item = items.addResource('{id}');
    item.addMethod('GET', new apigateway.LambdaIntegration(readFunction)); // Read single item
    item.addMethod('PUT', new apigateway.LambdaIntegration(updateFunction)); // Update item
    item.addMethod('DELETE', new apigateway.LambdaIntegration(deleteFunction)); // Delete item
  }
}
