import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class Unipile implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Unipile',
		name: 'unipile',
		icon: 'file:unipile.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
		description: 'Automate LinkedIn outreach and messaging via Unipile API',
		defaults: { name: 'Unipile' },
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'unipileApi',
				required: true,
			},
		],

		properties: [

			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'LinkedIn', value: 'linkedin' },
				],
				default: 'linkedin',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['account'] } },
				options: [
					{
						name: 'List All Accounts',
						value: 'listAccounts',
						description: 'Get all connected accounts — use this to find your Account ID',
						action: 'List all connected accounts',
					},
				],
				default: 'listAccounts',
			},

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['linkedin'] } },
				options: [
					{
						name: 'Get Conversations',
						value: 'getConversations',
						description: 'Get a list of all LinkedIn message conversations',
						action: 'Get LinkedIn conversations',
					},
					{
						name: 'Get Profile',
						value: 'getProfile',
						description: 'Get a LinkedIn user profile and Provider ID by username',
						action: 'Get a LinkedIn user profile',
					},
					{
						name: 'Send Connection Request',
						value: 'sendConnectionRequest',
						description: 'Send a LinkedIn connection request with or without a note',
						action: 'Send a LinkedIn connection request',
					},
					{
						name: 'Send InMail',
						value: 'sendInmail',
						description: 'Send an InMail to a LinkedIn user via Sales Navigator or Recruiter',
						action: 'Send a LinkedIn InMail',
					},
					{
						name: 'Send Message',
						value: 'sendMessage',
						description: 'Send a direct message to an existing LinkedIn connection',
						action: 'Send a LinkedIn message',
					},
					{
						name: 'Withdraw Connection Request',
						value: 'withdrawConnectionRequest',
						description: 'Withdraw a pending LinkedIn connection request by invitation ID',
						action: 'Withdraw a LinkedIn connection request',
					},
				],
				default: 'getProfile',
			},

			// ── Get Profile ──────────────────────────────────
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				default: '',
				description: 'Your connected LinkedIn account ID in Unipile. Use the List All Accounts operation to find this.',
				displayOptions: { show: { resource: ['linkedin'], operation: ['getProfile'] } },
			},
			{
				displayName: 'LinkedIn Username',
				name: 'identifier',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'e.g. john-doe',
				description: 'The LinkedIn username from the profile URL. Example: linkedin.com/in/john-doe → john-doe',
				displayOptions: { show: { resource: ['linkedin'], operation: ['getProfile'] } },
			},

			// ── Send Connection Request ───────────────────────
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				default: '',
				description: 'Your connected LinkedIn account ID in Unipile. Use the List All Accounts operation to find this.',
				displayOptions: { show: { resource: ['linkedin'], operation: ['sendConnectionRequest'] } },
			},
			{
				displayName: 'Provider ID',
				name: 'providerId',
				type: 'string',
				required: true,
				default: '',
				description: 'The LinkedIn recipient internal Provider ID. Use the Get Profile operation to retrieve this first.',
				displayOptions: { show: { resource: ['linkedin'], operation: ['sendConnectionRequest'] } },
			},
			{
				displayName: 'Add a Connection Note?',
				name: 'addNote',
				type: 'boolean',
				default: false,
				description: 'Whether to include a personalized note with the connection request',
				displayOptions: { show: { resource: ['linkedin'], operation: ['sendConnectionRequest'] } },
			},
			{
				displayName: 'Note',
				name: 'message',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				placeholder: 'Hi John, I would love to connect...',
				description: 'Personalized note to send with the connection request. Maximum 300 characters.',
				displayOptions: { show: { resource: ['linkedin'], operation: ['sendConnectionRequest'], addNote: [true] } },
			},

			// ── Send Message ─────────────────────────────────
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				default: '',
				description: 'Your connected LinkedIn account ID in Unipile. Use the List All Accounts operation to find this.',
				displayOptions: { show: { resource: ['linkedin'], operation: ['sendMessage'] } },
			},
			{
				displayName: 'Provider ID',
				name: 'providerId',
				type: 'string',
				required: true,
				default: '',
				description: 'The LinkedIn recipient internal Provider ID. Use the Get Profile operation to retrieve this first. Note: you can only message existing connections.',
				displayOptions: { show: { resource: ['linkedin'], operation: ['sendMessage'] } },
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				typeOptions: { rows: 4 },
				required: true,
				default: '',
				placeholder: 'Hi John, following up on our connection...',
				description: 'The message to send. You can only message existing LinkedIn connections.',
				displayOptions: { show: { resource: ['linkedin'], operation: ['sendMessage'] } },
			},

			// ── Send InMail ──────────────────────────────────
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				default: '',
				description: 'Your connected LinkedIn account ID in Unipile. Use the List All Accounts operation to find this.',
				displayOptions: { show: { resource: ['linkedin'], operation: ['sendInmail'] } },
			},
			{
				displayName: 'Provider ID',
				name: 'providerId',
				type: 'string',
				required: true,
				default: '',
				description: 'The LinkedIn recipient internal Provider ID. Use the Get Profile operation to retrieve this first.',
				displayOptions: { show: { resource: ['linkedin'], operation: ['sendInmail'] } },
			},
			{
				displayName: 'LinkedIn Plan',
				name: 'linkedinApi',
				type: 'options',
				required: true,
				options: [
					{ name: 'Sales Navigator', value: 'sales_navigator', description: 'Use this if your LinkedIn account has Sales Navigator' },
					{ name: 'Recruiter Classic', value: 'recruiter', description: 'Use this if your LinkedIn account has Recruiter Classic' },
					{ name: 'Classic / Premium', value: 'classic', description: 'Use this if your LinkedIn account has a Classic or Premium plan' },
				],
				default: 'sales_navigator',
				description: 'Select your LinkedIn plan type. InMail credits are consumed from your LinkedIn plan monthly allowance.',
				displayOptions: { show: { resource: ['linkedin'], operation: ['sendInmail'] } },
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				required: true,
				default: '',
				placeholder: 'Automating the repetitive work behind your business',
				description: 'The InMail subject line',
				displayOptions: { show: { resource: ['linkedin'], operation: ['sendInmail'] } },
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				typeOptions: { rows: 6 },
				required: true,
				default: '',
				placeholder: 'Hi John, I noticed you are leading Acme Corp...',
				description: 'The InMail message body',
				displayOptions: { show: { resource: ['linkedin'], operation: ['sendInmail'] } },
			},

			// ── Withdraw Connection Request ───────────────────
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				default: '',
				description: 'Your connected LinkedIn account ID in Unipile. Use the List All Accounts operation to find this.',
				displayOptions: { show: { resource: ['linkedin'], operation: ['withdrawConnectionRequest'] } },
			},
			{
				displayName: 'Invitation ID',
				name: 'invitationId',
				type: 'string',
				required: true,
				default: '',
				description: 'The invitation ID of the pending connection request to withdraw. This is returned when you send a connection request.',
				displayOptions: { show: { resource: ['linkedin'], operation: ['withdrawConnectionRequest'] } },
			},

			// ── Get Conversations ────────────────────────────
			{
				displayName: 'Account ID',
				name: 'accountId',
				type: 'string',
				required: true,
				default: '',
				description: 'Your connected LinkedIn account ID in Unipile. Use the List All Accounts operation to find this.',
				displayOptions: { show: { resource: ['linkedin'], operation: ['getConversations'] } },
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 20,
				description: 'Maximum number of conversations to return',
				displayOptions: { show: { resource: ['linkedin'], operation: ['getConversations'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const credentials = await this.getCredentials('unipileApi');
		const dsn = credentials.dsn as string;
		const baseUrl = `https://${dsn}/api/v1`;

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			try {

				if (resource === 'account' && operation === 'listAccounts') {
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this, 'unipileApi',
						{
							method: 'GET',
							url: `${baseUrl}/accounts`,
							headers: { 'accept': 'application/json' },
						},
					);
					const accounts = response.items || response;
					if (Array.isArray(accounts)) {
						for (const account of accounts) {
							returnData.push({ json: account });
						}
					} else {
						returnData.push({ json: response });
					}
				}

				if (resource === 'linkedin' && operation === 'getProfile') {
					const accountId = this.getNodeParameter('accountId', i) as string;
					const identifier = this.getNodeParameter('identifier', i) as string;
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this, 'unipileApi',
						{
							method: 'GET',
							url: `${baseUrl}/users/${identifier}`,
							qs: { account_id: accountId },
							headers: { 'accept': 'application/json' },
						},
					);
					returnData.push({ json: response });
				}

				if (resource === 'linkedin' && operation === 'sendConnectionRequest') {
					const accountId = this.getNodeParameter('accountId', i) as string;
					const providerId = this.getNodeParameter('providerId', i) as string;
					const addNote = this.getNodeParameter('addNote', i) as boolean;
					const body: Record<string, string> = {
						provider_id: providerId,
						account_id: accountId,
					};
					if (addNote) {
						const message = this.getNodeParameter('message', i) as string;
						if (message) body.message = message;
					}
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this, 'unipileApi',
						{
							method: 'POST',
							url: `${baseUrl}/users/invite`,
							headers: { 'accept': 'application/json', 'content-type': 'application/json' },
							body,
						},
					);
					returnData.push({ json: response });
				}

				if (resource === 'linkedin' && operation === 'sendMessage') {
					const accountId = this.getNodeParameter('accountId', i) as string;
					const providerId = this.getNodeParameter('providerId', i) as string;
					const message = this.getNodeParameter('message', i) as string;
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this, 'unipileApi',
						{
							method: 'POST',
							url: `${baseUrl}/chats`,
							headers: { 'accept': 'application/json', 'content-type': 'application/json' },
							body: {
								account_id: accountId,
								attendees_ids: providerId,
								text: message,
							},
						},
					);
					returnData.push({ json: response });
				}

				if (resource === 'linkedin' && operation === 'sendInmail') {
					const accountId = this.getNodeParameter('accountId', i) as string;
					const providerId = this.getNodeParameter('providerId', i) as string;
					const linkedinApi = this.getNodeParameter('linkedinApi', i) as string;
					const subject = this.getNodeParameter('subject', i) as string;
					const message = this.getNodeParameter('message', i) as string;
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this, 'unipileApi',
						{
							method: 'POST',
							url: `${baseUrl}/chats`,
							headers: { 'accept': 'application/json', 'content-type': 'application/json' },
							body: {
								account_id: accountId,
								attendees_ids: providerId,
								text: message,
								subject,
								linkedin: {
									api: linkedinApi,
									inmail: true,
								},
							},
						},
					);
					returnData.push({ json: response });
				}

				if (resource === 'linkedin' && operation === 'withdrawConnectionRequest') {
					const accountId = this.getNodeParameter('accountId', i) as string;
					const invitationId = this.getNodeParameter('invitationId', i) as string;
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this, 'unipileApi',
						{
							method: 'DELETE',
							url: `${baseUrl}/users/invite/sent/${invitationId}`,
							qs: { account_id: accountId },
							headers: { 'accept': 'application/json' },
						},
					);
					returnData.push({ json: response });
				}

				if (resource === 'linkedin' && operation === 'getConversations') {
					const accountId = this.getNodeParameter('accountId', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;
					const response = await this.helpers.httpRequestWithAuthentication.call(
						this, 'unipileApi',
						{
							method: 'GET',
							url: `${baseUrl}/chats`,
							qs: { account_id: accountId, limit },
							headers: { 'accept': 'application/json' },
						},
					);
					const chats = response.items || response;
					if (Array.isArray(chats)) {
						for (const chat of chats) {
							returnData.push({ json: chat });
						}
					} else {
						returnData.push({ json: response });
					}
				}

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message } });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}