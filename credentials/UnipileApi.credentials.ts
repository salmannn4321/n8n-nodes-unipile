import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class UnipileApi implements ICredentialType {
	name = 'unipileApi';
	displayName = 'Unipile API';
	documentationUrl = 'https://developer.unipile.com';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			hint: 'Found in your Unipile dashboard under API Keys',
		},
		{
			displayName: 'DSN',
			name: 'dsn',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'e.g. api1.unipile.com:13111',
			hint: 'Found in your Unipile dashboard — do not include https://',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-KEY': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://{{$credentials.dsn}}',
			url: '/api/v1/accounts',
			method: 'GET',
			headers: {
				'accept': 'application/json',
			},
		},
	};
}