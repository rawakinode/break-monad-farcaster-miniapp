const abi = [
		{
			"inputs": [],
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "id",
					"type": "uint256"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "author",
					"type": "address"
				}
			],
			"name": "ArticleCreated",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "articleId",
					"type": "uint256"
				},
				{
					"indexed": true,
					"internalType": "address",
					"name": "from",
					"type": "address"
				},
				{
					"indexed": false,
					"internalType": "uint256",
					"name": "amount",
					"type": "uint256"
				}
			],
			"name": "ArticleTipped",
			"type": "event"
		},
		{
			"anonymous": false,
			"inputs": [
				{
					"indexed": true,
					"internalType": "uint256",
					"name": "id",
					"type": "uint256"
				}
			],
			"name": "ArticleUpdated",
			"type": "event"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "address_bind",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "admin",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "articleCounter",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "articleIds",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "articles",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "id_article",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "account_id",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "wallet_address",
					"type": "address"
				},
				{
					"internalType": "string",
					"name": "title",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "ipfs_url",
					"type": "string"
				},
				{
					"internalType": "uint256",
					"name": "tip_count",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "tip_earned",
					"type": "uint256"
				},
				{
					"internalType": "uint64",
					"name": "created_at",
					"type": "uint64"
				},
				{
					"internalType": "uint64",
					"name": "updated_at",
					"type": "uint64"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "fid",
					"type": "uint256"
				},
				{
					"internalType": "address",
					"name": "wallet",
					"type": "address"
				}
			],
			"name": "bindAccountAddress",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_accountId",
					"type": "uint256"
				},
				{
					"internalType": "string",
					"name": "_title",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_ipfsUrl",
					"type": "string"
				}
			],
			"name": "createArticle",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "getAllArticles",
			"outputs": [
				{
					"components": [
						{
							"internalType": "uint256",
							"name": "id_article",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "account_id",
							"type": "uint256"
						},
						{
							"internalType": "address",
							"name": "wallet_address",
							"type": "address"
						},
						{
							"internalType": "string",
							"name": "title",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "ipfs_url",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "tip_count",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "tip_earned",
							"type": "uint256"
						},
						{
							"internalType": "uint64",
							"name": "created_at",
							"type": "uint64"
						},
						{
							"internalType": "uint64",
							"name": "updated_at",
							"type": "uint64"
						}
					],
					"internalType": "struct BreakMonadV2.Article[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "fid",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "offset",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "limit",
					"type": "uint256"
				}
			],
			"name": "getArticlesByFid",
			"outputs": [
				{
					"components": [
						{
							"internalType": "uint256",
							"name": "id_article",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "account_id",
							"type": "uint256"
						},
						{
							"internalType": "address",
							"name": "wallet_address",
							"type": "address"
						},
						{
							"internalType": "string",
							"name": "title",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "ipfs_url",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "tip_count",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "tip_earned",
							"type": "uint256"
						},
						{
							"internalType": "uint64",
							"name": "created_at",
							"type": "uint64"
						},
						{
							"internalType": "uint64",
							"name": "updated_at",
							"type": "uint64"
						}
					],
					"internalType": "struct BreakMonadV2.Article[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "offset",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "limit",
					"type": "uint256"
				}
			],
			"name": "getNewestArticles",
			"outputs": [
				{
					"components": [
						{
							"internalType": "uint256",
							"name": "id_article",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "account_id",
							"type": "uint256"
						},
						{
							"internalType": "address",
							"name": "wallet_address",
							"type": "address"
						},
						{
							"internalType": "string",
							"name": "title",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "ipfs_url",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "tip_count",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "tip_earned",
							"type": "uint256"
						},
						{
							"internalType": "uint64",
							"name": "created_at",
							"type": "uint64"
						},
						{
							"internalType": "uint64",
							"name": "updated_at",
							"type": "uint64"
						}
					],
					"internalType": "struct BreakMonadV2.Article[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "offset",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "limit",
					"type": "uint256"
				}
			],
			"name": "getOldestArticles",
			"outputs": [
				{
					"components": [
						{
							"internalType": "uint256",
							"name": "id_article",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "account_id",
							"type": "uint256"
						},
						{
							"internalType": "address",
							"name": "wallet_address",
							"type": "address"
						},
						{
							"internalType": "string",
							"name": "title",
							"type": "string"
						},
						{
							"internalType": "string",
							"name": "ipfs_url",
							"type": "string"
						},
						{
							"internalType": "uint256",
							"name": "tip_count",
							"type": "uint256"
						},
						{
							"internalType": "uint256",
							"name": "tip_earned",
							"type": "uint256"
						},
						{
							"internalType": "uint64",
							"name": "created_at",
							"type": "uint64"
						},
						{
							"internalType": "uint64",
							"name": "updated_at",
							"type": "uint64"
						}
					],
					"internalType": "struct BreakMonadV2.Article[]",
					"name": "",
					"type": "tuple[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "fid",
					"type": "uint256"
				}
			],
			"name": "getWalletsByFID",
			"outputs": [
				{
					"internalType": "address[]",
					"name": "",
					"type": "address[]"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "wallet",
					"type": "address"
				}
			],
			"name": "isWalletBound",
			"outputs": [
				{
					"internalType": "bool",
					"name": "",
					"type": "bool"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "_newAdmin",
					"type": "address"
				}
			],
			"name": "setAdmin",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address payable",
					"name": "_withdrawal",
					"type": "address"
				}
			],
			"name": "setWithdrawalAddress",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_articleId",
					"type": "uint256"
				}
			],
			"name": "tipArticle",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "_articleId",
					"type": "uint256"
				},
				{
					"internalType": "uint256",
					"name": "_accountId",
					"type": "uint256"
				},
				{
					"internalType": "string",
					"name": "_newTitle",
					"type": "string"
				},
				{
					"internalType": "string",
					"name": "_newIpfsUrl",
					"type": "string"
				}
			],
			"name": "updateArticle",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		},
		{
			"inputs": [],
			"name": "withdrawal_address",
			"outputs": [
				{
					"internalType": "address payable",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		}
	];

export default abi;