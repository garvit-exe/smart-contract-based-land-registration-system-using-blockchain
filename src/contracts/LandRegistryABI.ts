
const LandRegistryABI = [
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
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "lender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PropertyMortgaged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "detailsHash",
        "type": "string"
      }
    ],
    "name": "PropertyRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "PropertyTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "validator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "PropertyVerified",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "previousValue",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newValue",
        "type": "uint256"
      }
    ],
    "name": "PropertyValuationUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "lender",
        "type": "address"
      }
    ],
    "name": "MortgageReleased",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "officialAddress",
        "type": "address"
      }
    ],
    "name": "addOfficial",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "validatorAddress",
        "type": "address"
      }
    ],
    "name": "addValidator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "lender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "createMortgage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      }
    ],
    "name": "getMortgageStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isMortgaged",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "lender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      }
    ],
    "name": "getPropertyDetails",
    "outputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "detailsHash",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isRegistered",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "mortgagedTo",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "mortgageAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastValuation",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isVerified",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      }
    ],
    "name": "getPropertyOwner",
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
    "inputs": [
      {
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      }
    ],
    "name": "getTransactionHistory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "propertyId",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "transactionType",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "value",
            "type": "uint256"
          }
        ],
        "internalType": "struct LandRegistry.Transaction[]",
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
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      }
    ],
    "name": "getVerificationStatus",
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
        "name": "",
        "type": "address"
      }
    ],
    "name": "isOfficial",
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
        "name": "",
        "type": "address"
      }
    ],
    "name": "isValidator",
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
    "inputs": [],
    "name": "owner",
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
    "inputs": [
      {
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      }
    ],
    "name": "releaseMortgage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "officialAddress",
        "type": "address"
      }
    ],
    "name": "removeOfficial",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "validatorAddress",
        "type": "address"
      }
    ],
    "name": "removeValidator",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "initialOwner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "location",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "detailsHash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "initialValuation",
        "type": "uint256"
      }
    ],
    "name": "registerProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "newValuation",
        "type": "uint256"
      }
    ],
    "name": "updateValuation",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "detailsHash",
        "type": "string"
      }
    ],
    "name": "verifyPropertyDetails",
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
        "internalType": "string",
        "name": "propertyId",
        "type": "string"
      }
    ],
    "name": "verifyProperty",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default LandRegistryABI;
