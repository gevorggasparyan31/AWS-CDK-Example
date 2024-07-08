import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppStack } from '../lib/aws-project-stack';
import * as config from '../config.json';

const app = new cdk.App();

const env = process.env.NODE_ENV || 'development';
const envConfig = config[env];

new AppStack(app, envConfig.stack_name, {
	env: {
		account: envConfig.account,
		region: envConfig.region,
	},
	stackConfig: envConfig,
});
